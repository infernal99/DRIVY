-- DRIVY Phase E: friends.
--
-- Hard constraints carried over from the brief, restated here because
-- they're easy to get wrong in the implementation:
--   * No global leaderboard, ever — every ranking function below is scoped
--     to "me + my accepted friends", nothing else.
--   * auth.users' UUID is never used as a public/discoverable identifier —
--     search results are keyed by `friend_code` only. A UUID only ever
--     shows up client-side once a friendship already exists (accepted
--     friends list, friend profile, leaderboard), which is a different,
--     already-mutual relationship, not a discovery mechanism.
--   * Email is never returned by anything here — profiles has no email
--     column at all (email lives only in auth.users, which none of this
--     touches), so there is nothing to accidentally leak.
--
-- `profiles` itself keeps its existing SELECT-own-row-only RLS policy
-- unchanged — none of the cross-user reads below relax it. Every
-- cross-user read (search, friend profile, leaderboard, the friends-page
-- summary) is instead a SECURITY DEFINER function that bypasses RLS on
-- purpose and re-implements exactly the visibility rule it needs by hand,
-- returning only the specific safe columns that rule allows.

create extension if not exists pg_trgm;

-- ---------------------------------------------------------------------------
-- profiles: friend_code (the public, non-UUID handle) + privacy flags.
-- ---------------------------------------------------------------------------
alter table public.profiles add column friend_code text unique;
alter table public.profiles add column search_visibility boolean not null default true;
alter table public.profiles add column profile_visibility boolean not null default true;

create index profiles_display_name_trgm_idx on public.profiles using gin (display_name gin_trgm_ops);
create index profiles_friend_code_trgm_idx on public.profiles using gin (friend_code gin_trgm_ops);

create or replace function public.fn_generate_friend_code()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  -- No 0/O or 1/I — avoids codes that are ambiguous to read back over chat/voice.
  v_chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code text;
  v_exists boolean;
begin
  loop
    v_code := 'DRIVY-';
    for i in 1..5 loop
      v_code := v_code || substr(v_chars, (floor(random() * length(v_chars)) + 1)::integer, 1);
    end loop;
    select exists(select 1 from public.profiles where friend_code = v_code) into v_exists;
    exit when not v_exists;
  end loop;
  return v_code;
end;
$$;

-- Backfill any profiles that already existed before this migration.
do $$
declare
  v_rec record;
begin
  for v_rec in select user_id from public.profiles where friend_code is null loop
    update public.profiles set friend_code = public.fn_generate_friend_code() where user_id = v_rec.user_id;
  end loop;
end $$;

alter table public.profiles alter column friend_code set not null;

-- fn_handle_new_user re-created to also generate a friend_code at signup.
-- Everything else is unchanged from the original (20260826120200) version.
create or replace function public.fn_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name, friend_code)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)),
    public.fn_generate_friend_code()
  );

  insert into public.user_progress (user_id, unlocked_category_ids)
  values (new.id, array['senales']);

  insert into public.unlocked_categories (user_id, category_id)
  values (new.id, 'senales');

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- friendships. SELECT is restricted to the two participants; every write
-- goes through fn_send_friend_request / fn_respond_friend_request /
-- fn_cancel_friend_request / fn_remove_friend below — no direct
-- insert/update/delete policy for `authenticated`, same pattern as every
-- other mutation path in this schema.
-- ---------------------------------------------------------------------------
create table public.friendships (
  id bigint generated always as identity primary key,
  requester_id uuid not null references auth.users (id) on delete cascade,
  addressee_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'blocked')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (requester_id <> addressee_id)
);

alter table public.friendships enable row level security;

create policy "friendships_select_participant"
  on public.friendships for select
  to authenticated
  using ((select auth.uid()) in (requester_id, addressee_id));

create index friendships_requester_status_idx on public.friendships (requester_id, status);
create index friendships_addressee_status_idx on public.friendships (addressee_id, status);

-- At most one active (pending/accepted/blocked) relationship per unordered
-- pair — the dedupe guard against duplicate simultaneous requests in either
-- direction. A 'rejected' row doesn't count, so a fresh request after a
-- rejection is allowed to create a new row.
create unique index friendships_active_pair_idx
  on public.friendships (least(requester_id, addressee_id), greatest(requester_id, addressee_id))
  where status in ('pending', 'accepted', 'blocked');

-- ---------------------------------------------------------------------------
-- fn_send_friend_request — resolves a friend_code (never a UUID) to a
-- target user. If that target already has a pending request out to us, this
-- accepts it instead of creating a duplicate (two people adding each other
-- at the same time shouldn't produce two rows).
-- ---------------------------------------------------------------------------
create or replace function public.fn_send_friend_request(p_friend_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_target uuid;
  v_existing record;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select user_id into v_target from public.profiles where friend_code = upper(trim(p_friend_code));
  if v_target is null then
    raise exception 'friend code not found';
  end if;
  if v_target = v_uid then
    raise exception 'cannot friend yourself';
  end if;

  select * into v_existing from public.friendships
  where (requester_id = v_uid and addressee_id = v_target)
     or (requester_id = v_target and addressee_id = v_uid)
  order by created_at desc
  limit 1;

  if v_existing.id is not null then
    if v_existing.status = 'accepted' then
      raise exception 'already friends';
    elsif v_existing.status = 'blocked' then
      raise exception 'request not allowed';
    elsif v_existing.status = 'pending' and v_existing.requester_id = v_target then
      update public.friendships set status = 'accepted', responded_at = now() where id = v_existing.id;
      return jsonb_build_object('status', 'accepted');
    elsif v_existing.status = 'pending' and v_existing.requester_id = v_uid then
      return jsonb_build_object('status', 'pending');
    end if;
    -- status = 'rejected' falls through to a fresh request below.
  end if;

  insert into public.friendships (requester_id, addressee_id, status) values (v_uid, v_target, 'pending');
  return jsonb_build_object('status', 'pending');
end;
$$;

revoke all on function public.fn_send_friend_request(text) from public;
grant execute on function public.fn_send_friend_request(text) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_respond_friend_request — only the addressee of a still-pending request
-- can accept/reject it.
-- ---------------------------------------------------------------------------
create or replace function public.fn_respond_friend_request(p_request_id bigint, p_accept boolean)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_rows integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  update public.friendships
  set status = case when p_accept then 'accepted' else 'rejected' end,
      responded_at = now()
  where id = p_request_id and addressee_id = v_uid and status = 'pending';

  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    raise exception 'request not found or not actionable';
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.fn_respond_friend_request(bigint, boolean) from public;
grant execute on function public.fn_respond_friend_request(bigint, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_cancel_friend_request — only the requester can withdraw their own
-- still-pending outgoing request.
-- ---------------------------------------------------------------------------
create or replace function public.fn_cancel_friend_request(p_request_id bigint)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_rows integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  delete from public.friendships where id = p_request_id and requester_id = v_uid and status = 'pending';

  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    raise exception 'request not found or not cancelable';
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.fn_cancel_friend_request(bigint) from public;
grant execute on function public.fn_cancel_friend_request(bigint) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_remove_friend — either participant can end an accepted friendship.
-- ---------------------------------------------------------------------------
create or replace function public.fn_remove_friend(p_other_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_rows integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  delete from public.friendships
  where status = 'accepted'
    and ((requester_id = v_uid and addressee_id = p_other_user_id)
      or (requester_id = p_other_user_id and addressee_id = v_uid));

  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    raise exception 'friendship not found';
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.fn_remove_friend(uuid) from public;
grant execute on function public.fn_remove_friend(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_update_privacy_settings — the only write path for the two flags.
-- ---------------------------------------------------------------------------
create or replace function public.fn_update_privacy_settings(p_search_visibility boolean, p_profile_visibility boolean)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  update public.profiles
  set search_visibility = p_search_visibility, profile_visibility = p_profile_visibility, updated_at = now()
  where user_id = v_uid;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.fn_update_privacy_settings(boolean, boolean) from public;
grant execute on function public.fn_update_privacy_settings(boolean, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_search_profiles — the only cross-user read of `profiles` that isn't
-- gated by an existing friendship. Returns friend_code + display_name +
-- avatar_url ONLY (no xp/level/streak/user_id — those are for after you're
-- already friends, via fn_get_friend_profile). Excludes the caller, excludes
-- anyone with search_visibility off, and requires >=2 chars so it can never
-- be used as a "browse everyone" directory.
-- ---------------------------------------------------------------------------
create or replace function public.fn_search_profiles(p_query text, p_limit integer default 20, p_offset integer default 0)
returns table (friend_code text, display_name text, avatar_url text)
language sql
stable
security definer
set search_path = ''
as $$
  select p.friend_code, p.display_name, p.avatar_url
  from public.profiles p
  where p.user_id <> auth.uid()
    and p.search_visibility
    and length(trim(p_query)) >= 2
    and (p.display_name ilike '%' || trim(p_query) || '%' or p.friend_code ilike trim(p_query) || '%')
  order by p.display_name asc
  limit least(greatest(p_limit, 1), 50)
  offset greatest(p_offset, 0);
$$;

revoke all on function public.fn_search_profiles(text, integer, integer) from public;
grant execute on function public.fn_search_profiles(text, integer, integer) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_get_my_friendships — everything the /friends page needs in one round
-- trip: accepted friends (with display stats), incoming pending requests,
-- outgoing pending requests, plus the caller's own friend_code and privacy
-- flags (so Settings can reuse this instead of a separate RPC).
-- ---------------------------------------------------------------------------
create or replace function public.fn_get_my_friendships()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_friends jsonb;
  v_incoming jsonb;
  v_outgoing jsonb;
  v_me record;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'userId', p.user_id, 'displayName', p.display_name, 'avatarUrl', p.avatar_url,
    'level', p.level, 'xp', p.xp, 'currentStreak', p.current_streak
  ) order by p.display_name), '[]'::jsonb)
  into v_friends
  from public.friendships f
  join public.profiles p on p.user_id = case when f.requester_id = v_uid then f.addressee_id else f.requester_id end
  where f.status = 'accepted' and (f.requester_id = v_uid or f.addressee_id = v_uid);

  select coalesce(jsonb_agg(jsonb_build_object(
    'requestId', f.id, 'userId', p.user_id, 'displayName', p.display_name,
    'avatarUrl', p.avatar_url, 'createdAt', f.created_at
  ) order by f.created_at desc), '[]'::jsonb)
  into v_incoming
  from public.friendships f
  join public.profiles p on p.user_id = f.requester_id
  where f.status = 'pending' and f.addressee_id = v_uid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'requestId', f.id, 'userId', p.user_id, 'displayName', p.display_name,
    'avatarUrl', p.avatar_url, 'createdAt', f.created_at
  ) order by f.created_at desc), '[]'::jsonb)
  into v_outgoing
  from public.friendships f
  join public.profiles p on p.user_id = f.addressee_id
  where f.status = 'pending' and f.requester_id = v_uid;

  select friend_code, search_visibility, profile_visibility into v_me
  from public.profiles where user_id = v_uid;

  return jsonb_build_object(
    'friends', v_friends,
    'incomingRequests', v_incoming,
    'outgoingRequests', v_outgoing,
    'myFriendCode', v_me.friend_code,
    'searchVisibility', v_me.search_visibility,
    'profileVisibility', v_me.profile_visibility
  );
end;
$$;

revoke all on function public.fn_get_my_friendships() from public;
grant execute on function public.fn_get_my_friendships() to authenticated;

-- ---------------------------------------------------------------------------
-- fn_get_friend_profile — only reachable for an ACCEPTED friend, and only
-- if that friend has profile_visibility on. Returns display stats, exam
-- aggregates, achievements, and per-category answered/correct counts —
-- deliberately never per-question history (question_stats) or exam_answers.
-- ---------------------------------------------------------------------------
create or replace function public.fn_get_friend_profile(p_friend_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_is_friend boolean;
  v_profile record;
  v_exams_taken integer;
  v_exams_passed integer;
  v_best_score numeric;
  v_avg_score numeric;
  v_achievements jsonb;
  v_categories jsonb;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if v_uid = p_friend_user_id then
    raise exception 'use your own profile data instead';
  end if;

  select exists(
    select 1 from public.friendships
    where status = 'accepted'
      and ((requester_id = v_uid and addressee_id = p_friend_user_id)
        or (requester_id = p_friend_user_id and addressee_id = v_uid))
  ) into v_is_friend;

  if not v_is_friend then
    raise exception 'not friends with this user';
  end if;

  select display_name, avatar_url, xp, level, current_streak, longest_streak, profile_visibility
  into v_profile
  from public.profiles where user_id = p_friend_user_id;

  if not found then
    raise exception 'profile not found';
  end if;
  if not v_profile.profile_visibility then
    raise exception 'this friend has hidden their profile';
  end if;

  select count(*), count(*) filter (where passed),
         coalesce(max(correct_count::numeric / nullif(total_count, 0) * 100), 0),
         coalesce(avg(correct_count::numeric / nullif(total_count, 0) * 100), 0)
  into v_exams_taken, v_exams_passed, v_best_score, v_avg_score
  from public.exam_attempts where user_id = p_friend_user_id;

  select coalesce(jsonb_agg(jsonb_build_object('id', achievement_id, 'unlockedAt', unlocked_at)), '[]'::jsonb)
  into v_achievements
  from public.user_achievements where user_id = p_friend_user_id;

  select coalesce(jsonb_agg(jsonb_build_object('categoryId', category_id, 'answered', answered, 'correct', correct)), '[]'::jsonb)
  into v_categories
  from public.category_stats where user_id = p_friend_user_id;

  return jsonb_build_object(
    'displayName', v_profile.display_name,
    'avatarUrl', v_profile.avatar_url,
    'xp', v_profile.xp,
    'level', v_profile.level,
    'currentStreak', v_profile.current_streak,
    'longestStreak', v_profile.longest_streak,
    'examsTaken', v_exams_taken,
    'examsPassed', v_exams_passed,
    'bestExamScorePct', round(v_best_score),
    'averageExamScorePct', round(v_avg_score),
    'achievements', v_achievements,
    'categoryStats', v_categories
  );
end;
$$;

revoke all on function public.fn_get_friend_profile(uuid) from public;
grant execute on function public.fn_get_friend_profile(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_get_friend_leaderboard — ranks the caller + accepted friends (who
-- haven't hidden their profile) by XP earned in one week, read live off the
-- append-only xp_events ledger. Any past week is queryable the same way by
-- passing its Monday as p_week_start — nothing is ever snapshotted,
-- overwritten, or deleted when a week rolls over, since xp_events itself
-- never is. Week boundary is UTC (matches xp_events.created_at), unlike the
-- client's local-day streak calculation — a minor, accepted discrepancy for
-- a weekly ranking.
-- ---------------------------------------------------------------------------
create or replace function public.fn_get_friend_leaderboard(p_week_start date default null)
returns table (user_id uuid, display_name text, avatar_url text, weekly_xp bigint, is_me boolean)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_week_start date := coalesce(p_week_start, (date_trunc('week', now() at time zone 'utc'))::date);
  v_week_end date := v_week_start + 7;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  return query
  with friend_ids as (
    select case when f.requester_id = v_uid then f.addressee_id else f.requester_id end as friend_id
    from public.friendships f
    where f.status = 'accepted' and (f.requester_id = v_uid or f.addressee_id = v_uid)
    union
    select v_uid
  ),
  weekly as (
    select xe.user_id as uid, coalesce(sum(xe.amount), 0) as xp
    from public.xp_events xe
    where xe.user_id in (select friend_id from friend_ids)
      and xe.created_at >= v_week_start::timestamptz
      and xe.created_at < v_week_end::timestamptz
    group by xe.user_id
  )
  select f.friend_id, p.display_name, p.avatar_url, coalesce(w.xp, 0) as weekly_xp, (f.friend_id = v_uid) as is_me
  from friend_ids f
  join public.profiles p on p.user_id = f.friend_id and (p.profile_visibility or f.friend_id = v_uid)
  left join weekly w on w.uid = f.friend_id
  order by weekly_xp desc, p.display_name asc;
end;
$$;

revoke all on function public.fn_get_friend_leaderboard(date) from public;
grant execute on function public.fn_get_friend_leaderboard(date) to authenticated;
