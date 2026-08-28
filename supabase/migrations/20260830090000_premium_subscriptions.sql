-- Premium subscription support: dev-bypass flag, Stripe-backed subscription
-- status, and daily free-tier counters for práctica (Simulacro/Examen
-- real/Aleatorias/Reto diario) and duelos. Lessons/temario ("el camino")
-- stay free and are untouched by this migration.

-- ---------------------------------------------------------------------------
-- Dev bypass: never touched by the app itself. Set manually via SQL for
-- specific accounts (e.g. the two developer accounts) so they always have
-- full access without a live Stripe subscription.
-- ---------------------------------------------------------------------------
alter table public.profiles add column premium_override boolean not null default false;

-- ---------------------------------------------------------------------------
-- subscriptions — one row per user, written only by the Stripe webhook
-- (service-role client bypasses RLS; there is deliberately no insert/update
-- policy for `authenticated`, only select-own).
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'none' check (status in ('none', 'active', 'trialing', 'past_due', 'canceled')),
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own"
  on public.subscriptions for select
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- practice_sessions — a single shared daily counter for all 4 práctica
-- modes (Simulacro/Examen real/Aleatorias/Reto diario). Exam attempts
-- already have `exam_attempts`, but random/daily practice never recorded
-- anything server-side, so this is the missing piece needed to gate all
-- four uniformly under one limit.
-- ---------------------------------------------------------------------------
create table public.practice_sessions (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('simulacro', 'examen_real', 'random', 'daily')),
  created_at timestamptz not null default now()
);

create index practice_sessions_user_day_idx on public.practice_sessions (user_id, created_at);

alter table public.practice_sessions enable row level security;

create policy "practice_sessions_select_own"
  on public.practice_sessions for select
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- fn_free_tier_limits — single source of truth for the two free-tier caps.
-- Change the numbers here only; every gate below reads from this function.
-- ---------------------------------------------------------------------------
create or replace function public.fn_free_tier_limits()
returns table (practice_limit integer, duel_limit integer)
language sql
immutable
set search_path = ''
as $$
  select 3, 2;
$$;

revoke all on function public.fn_free_tier_limits() from public;

-- ---------------------------------------------------------------------------
-- fn_is_premium — not granted to authenticated; only callable from within
-- other security definer functions in this file (same pattern already used
-- by fn_advance_daily_missions).
-- ---------------------------------------------------------------------------
create or replace function public.fn_is_premium(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_override boolean;
  v_status text;
  v_period_end timestamptz;
begin
  select premium_override into v_override from public.profiles where user_id = p_user_id;
  if coalesce(v_override, false) then
    return true;
  end if;

  select status, current_period_end into v_status, v_period_end
  from public.subscriptions where user_id = p_user_id;

  return v_status in ('active', 'trialing') and (v_period_end is null or v_period_end > now());
end;
$$;

revoke all on function public.fn_is_premium(uuid) from public;

-- ---------------------------------------------------------------------------
-- fn_get_my_premium_status — read-only status + today's usage, for the
-- client to show live "2/3 usadas hoy" state and disable buttons proactively.
-- ---------------------------------------------------------------------------
create or replace function public.fn_get_my_premium_status()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_is_premium boolean;
  v_practice_limit integer;
  v_duel_limit integer;
  v_practice_today integer;
  v_battles_today integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  v_is_premium := public.fn_is_premium(v_uid);
  select practice_limit, duel_limit into v_practice_limit, v_duel_limit from public.fn_free_tier_limits();

  select count(*) into v_practice_today
  from public.practice_sessions
  where user_id = v_uid and created_at::date = current_date;

  select count(*) into v_battles_today
  from public.battles
  where challenger_id = v_uid and created_at::date = current_date;

  return jsonb_build_object(
    'isPremium', v_is_premium,
    'practiceToday', v_practice_today,
    'practiceLimit', case when v_is_premium then null else v_practice_limit end,
    'battlesToday', v_battles_today,
    'battlesLimit', case when v_is_premium then null else v_duel_limit end
  );
end;
$$;

revoke all on function public.fn_get_my_premium_status() from public;
grant execute on function public.fn_get_my_premium_status() to authenticated;

-- ---------------------------------------------------------------------------
-- fn_start_practice_session — the authoritative gate for Simulacro/Examen
-- real/Aleatorias/Reto diario, called right before navigating into any of
-- the four practice routes. Returns {allowed:false} rather than raising —
-- hitting your daily limit is an expected outcome, not an error.
-- ---------------------------------------------------------------------------
create or replace function public.fn_start_practice_session(p_kind text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_is_premium boolean;
  v_practice_limit integer;
  v_practice_today integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if p_kind not in ('simulacro', 'examen_real', 'random', 'daily') then
    raise exception 'invalid practice kind';
  end if;

  v_is_premium := public.fn_is_premium(v_uid);

  if not v_is_premium then
    select practice_limit into v_practice_limit from public.fn_free_tier_limits();

    select count(*) into v_practice_today
    from public.practice_sessions
    where user_id = v_uid and created_at::date = current_date;

    if v_practice_today >= v_practice_limit then
      return jsonb_build_object('allowed', false);
    end if;
  end if;

  insert into public.practice_sessions (user_id, kind) values (v_uid, p_kind);

  return jsonb_build_object('allowed', true);
end;
$$;

revoke all on function public.fn_start_practice_session(text) from public;
grant execute on function public.fn_start_practice_session(text) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_send_battle_request — re-created to add the same daily-limit style
-- check inline (sending a duel request is already one atomic call, so no
-- separate "start" RPC is needed here the way practice sessions needed one).
-- Body otherwise unchanged from 20260827090000_mission_rotation_and_battles.sql.
-- ---------------------------------------------------------------------------
create or replace function public.fn_send_battle_request(p_friend_user_id uuid, p_question_count integer default 10)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_is_friend boolean;
  v_battle_id bigint;
  v_is_premium boolean;
  v_duel_limit integer;
  v_battles_today integer;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if v_uid = p_friend_user_id then raise exception 'cannot battle yourself'; end if;
  if p_question_count < 1 or p_question_count > 30 then raise exception 'invalid question count'; end if;

  select exists(
    select 1 from public.friendships
    where status = 'accepted'
      and ((requester_id = v_uid and addressee_id = p_friend_user_id)
        or (requester_id = p_friend_user_id and addressee_id = v_uid))
  ) into v_is_friend;

  if not v_is_friend then raise exception 'not friends with this user'; end if;

  v_is_premium := public.fn_is_premium(v_uid);

  if not v_is_premium then
    select duel_limit into v_duel_limit from public.fn_free_tier_limits();

    select count(*) into v_battles_today
    from public.battles
    where challenger_id = v_uid and created_at::date = current_date;

    if v_battles_today >= v_duel_limit then
      raise exception 'daily duel limit reached';
    end if;
  end if;

  insert into public.battles (challenger_id, opponent_id, question_count)
  values (v_uid, p_friend_user_id, p_question_count)
  returning id into v_battle_id;

  return jsonb_build_object('battleId', v_battle_id);
end;
$$;

-- ---------------------------------------------------------------------------
-- Premium-exclusive avatars.
-- ---------------------------------------------------------------------------
alter table public.avatars add column requires_premium boolean not null default false;

insert into public.avatars (id, xp_required, requires_premium) values
  ('vip', 0, true),
  ('cometa', 0, true);

create or replace function public.fn_set_my_avatar(p_avatar_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_required integer;
  v_requires_premium boolean;
  v_xp integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select xp_required, requires_premium into v_required, v_requires_premium
  from public.avatars where id = p_avatar_id;
  if v_required is null then
    raise exception 'unknown avatar';
  end if;

  select xp into v_xp from public.user_progress where user_id = v_uid;
  if coalesce(v_xp, 0) < v_required then
    raise exception 'avatar not unlocked yet';
  end if;

  if v_requires_premium and not public.fn_is_premium(v_uid) then
    raise exception 'premium required';
  end if;

  update public.profiles set avatar_url = p_avatar_id, updated_at = now() where user_id = v_uid;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.fn_set_my_avatar(text) from public;
grant execute on function public.fn_set_my_avatar(text) to authenticated;
