-- DRIVY: (1) daily mission rotation, (2) 1v1 friend battles.
--
-- ===========================================================================
-- PART 1 — Daily mission rotation
-- ===========================================================================
-- Widens the catalog with a few more variants per metric, then picks a
-- deterministic random subset of 3 per (user, day) instead of always
-- crediting all 4 — same idea as a seeded shuffle, computed identically on
-- read (fn_get_my_daily_missions) and on write (fn_advance_daily_missions)
-- so a client can never claim credit for a mission that wasn't actually
-- "assigned" to them today.

insert into public.daily_missions (id, description, metric, target_amount) values
  ('diario-preguntas-pocas', 'Responde 5 preguntas', 'questions_answered', 5),
  ('diario-preguntas-muchas', 'Responde 20 preguntas', 'questions_answered', 20),
  ('diario-leccion-doble', 'Completa 2 lecciones', 'lessons_completed', 2),
  ('diario-errores-pocos', 'Repasa 3 preguntas falladas', 'mistakes_practiced', 3),
  ('diario-errores-muchos', 'Repasa 8 preguntas falladas', 'mistakes_practiced', 8),
  ('diario-xp-poco', 'Consigue 30 XP', 'xp_earned', 30),
  ('diario-xp-mucho', 'Consigue 100 XP', 'xp_earned', 100)
on conflict (id) do nothing;

-- Deterministic per-(caller, day) shuffle over the whole catalog — always
-- uses auth.uid() (never a parameter) so it can't be used to peek at
-- someone else's assignment, and so it resolves correctly even when called
-- from inside another SECURITY DEFINER function (auth.uid() reads the
-- session's JWT claims, unaffected by role-switching).
create or replace function public.fn_todays_mission_ids(p_today date, p_count integer default 3)
returns text[]
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(array_agg(id order by seed), '{}'::text[])
  from (
    select id, hashtext(auth.uid()::text || p_today::text || id) as seed
    from public.daily_missions
    order by seed
    limit greatest(p_count, 1)
  ) s;
$$;

revoke all on function public.fn_todays_mission_ids(date, integer) from public;
grant execute on function public.fn_todays_mission_ids(date, integer) to authenticated;

-- The only read path the client needs: today's 3 assigned missions, with
-- this user's progress on each already joined in.
create or replace function public.fn_get_my_daily_missions(p_today date)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_ids text[];
  v_result jsonb;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  v_ids := public.fn_todays_mission_ids(p_today, 3);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', dm.id,
    'description', dm.description,
    'metric', dm.metric,
    'targetAmount', dm.target_amount,
    'progress', least(coalesce(udm.progress, 0), dm.target_amount),
    'completed', udm.completed_at is not null
  ) order by dm.id), '[]'::jsonb)
  into v_result
  from public.daily_missions dm
  left join public.user_daily_missions udm
    on udm.mission_id = dm.id and udm.user_id = v_uid and udm.day = p_today
  where dm.id = any(v_ids);

  return v_result;
end;
$$;

revoke all on function public.fn_get_my_daily_missions(date) from public;
grant execute on function public.fn_get_my_daily_missions(date) to authenticated;

-- fn_advance_daily_missions re-created to only credit missions actually
-- assigned to this user today — otherwise identical to the Phase D version.
create or replace function public.fn_advance_daily_missions(
  p_user_id uuid,
  p_metric text,
  p_today date,
  p_amount integer default 1
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_today_ids text[];
  v_rec record;
begin
  if v_uid is null or v_uid <> p_user_id then
    raise exception 'not authorized';
  end if;
  if p_amount <= 0 then
    return;
  end if;

  v_today_ids := public.fn_todays_mission_ids(p_today, 3);

  for v_rec in
    select id, target_amount from public.daily_missions
    where metric = p_metric and id = any(v_today_ids)
  loop
    insert into public.user_daily_missions (user_id, mission_id, day, progress, completed_at)
    values (
      v_uid, v_rec.id, p_today,
      least(p_amount, v_rec.target_amount),
      case when p_amount >= v_rec.target_amount then now() else null end
    )
    on conflict (user_id, mission_id, day) do update set
      progress = least(user_daily_missions.progress + p_amount, v_rec.target_amount),
      completed_at = coalesce(
        user_daily_missions.completed_at,
        case when user_daily_missions.progress + p_amount >= v_rec.target_amount then now() else null end
      );
  end loop;
end;
$$;

revoke all on function public.fn_advance_daily_missions(uuid, text, date, integer) from public;
-- Still deliberately no grant to `authenticated` — only reachable from the
-- other SECURITY DEFINER action RPCs, never directly by a client.

-- ===========================================================================
-- PART 2 — 1v1 friend battles
-- ===========================================================================
-- A battle is an async-but-shared duel, not a millisecond-synced live
-- session: both players get the exact same set of question ids (chosen
-- client-side at accept time — question CONTENT lives only in the static
-- TS bank, same documented trust boundary as fn_submit_exam already has for
-- regular exams) and can answer at their own pace while the battle is
-- open; whoever has more correct answers when both have submitted wins
-- (ties are possible and don't award a winner). XP flows through the same
-- xp_events ledger the friend leaderboard already reads, so a battle win
-- naturally counts toward weekly ranking with no leaderboard changes.
--
-- Only accepted friends can battle each other — enforced in
-- fn_send_battle_request, not just in the UI.

create table public.battles (
  id bigint generated always as identity primary key,
  challenger_id uuid not null references auth.users (id) on delete cascade,
  opponent_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'declined', 'cancelled', 'active', 'completed')),
  question_count integer not null check (question_count > 0 and question_count <= 30),
  question_ids text[],
  winner_id uuid references auth.users (id),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  completed_at timestamptz,
  check (challenger_id <> opponent_id)
);

alter table public.battles enable row level security;

create policy "battles_select_participant"
  on public.battles for select
  to authenticated
  using ((select auth.uid()) in (challenger_id, opponent_id));

create index battles_challenger_idx on public.battles (challenger_id, status);
create index battles_opponent_idx on public.battles (opponent_id, status);

-- At most one live (pending/active) battle per unordered pair at a time —
-- keeps things simple: finish or resolve your current duel with someone
-- before starting another.
create unique index battles_active_pair_idx
  on public.battles (least(challenger_id, opponent_id), greatest(challenger_id, opponent_id))
  where status in ('pending', 'active');

create table public.battle_participants (
  battle_id bigint not null references public.battles (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  correct_count integer not null default 0,
  total_answered integer not null default 0,
  finished_at timestamptz,
  primary key (battle_id, user_id)
);

alter table public.battle_participants enable row level security;

create policy "battle_participants_select_participant"
  on public.battle_participants for select
  to authenticated
  using (
    exists (
      select 1 from public.battles b
      where b.id = battle_participants.battle_id
        and (select auth.uid()) in (b.challenger_id, b.opponent_id)
    )
  );

create table public.battle_answers (
  id bigint generated always as identity primary key,
  battle_id bigint not null references public.battles (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null,
  selected_option_id text,
  correct boolean not null,
  answered_at timestamptz not null default now(),
  unique (battle_id, user_id, question_id)
);

alter table public.battle_answers enable row level security;

create policy "battle_answers_select_participant"
  on public.battle_answers for select
  to authenticated
  using (
    exists (
      select 1 from public.battles b
      where b.id = battle_answers.battle_id
        and (select auth.uid()) in (b.challenger_id, b.opponent_id)
    )
  );

create table public.user_battle_stats (
  user_id uuid primary key references auth.users (id) on delete cascade,
  battles_played integer not null default 0,
  battles_won integer not null default 0,
  total_questions_answered integer not null default 0,
  total_questions_correct integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.user_battle_stats enable row level security;

create policy "user_battle_stats_select_own"
  on public.user_battle_stats for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- fn_send_battle_request — only between accepted friends; only one
-- live battle per pair (enforced by the unique index above, which turns a
-- second attempt into a clean constraint-violation error rather than a
-- silent duplicate).
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
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if v_uid = p_friend_user_id then
    raise exception 'cannot battle yourself';
  end if;
  if p_question_count < 1 or p_question_count > 30 then
    raise exception 'invalid question count';
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

  insert into public.battles (challenger_id, opponent_id, question_count)
  values (v_uid, p_friend_user_id, p_question_count)
  returning id into v_battle_id;

  return jsonb_build_object('battleId', v_battle_id);
end;
$$;

revoke all on function public.fn_send_battle_request(uuid, integer) from public;
grant execute on function public.fn_send_battle_request(uuid, integer) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_respond_battle_request — only the opponent, only while pending.
-- Declining/cancelling just closes the row; accepting needs the client to
-- supply the shared question_ids in the same call (see the file header for
-- why question selection happens client-side), validated for count/shape
-- only — content/correctness of those ids is the same trust boundary
-- fn_submit_exam already has.
-- ---------------------------------------------------------------------------
create or replace function public.fn_respond_battle_request(p_battle_id bigint, p_accept boolean, p_question_ids text[] default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_battle record;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select * into v_battle from public.battles where id = p_battle_id and opponent_id = v_uid and status = 'pending';
  if not found then
    raise exception 'battle not found or not actionable';
  end if;

  if not p_accept then
    update public.battles set status = 'declined', responded_at = now() where id = p_battle_id;
    return jsonb_build_object('status', 'declined');
  end if;

  if p_question_ids is null or array_length(p_question_ids, 1) <> v_battle.question_count then
    raise exception 'question_ids must match question_count';
  end if;

  update public.battles
  set status = 'active', responded_at = now(), question_ids = p_question_ids
  where id = p_battle_id;

  insert into public.battle_participants (battle_id, user_id)
  values (p_battle_id, v_battle.challenger_id), (p_battle_id, v_battle.opponent_id);

  return jsonb_build_object('status', 'active');
end;
$$;

revoke all on function public.fn_respond_battle_request(bigint, boolean, text[]) from public;
grant execute on function public.fn_respond_battle_request(bigint, boolean, text[]) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_cancel_battle_request — the challenger withdraws their own still-
-- pending invite.
-- ---------------------------------------------------------------------------
create or replace function public.fn_cancel_battle_request(p_battle_id bigint)
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

  update public.battles set status = 'cancelled', responded_at = now()
  where id = p_battle_id and challenger_id = v_uid and status = 'pending';

  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    raise exception 'battle not found or not cancelable';
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.fn_cancel_battle_request(bigint) from public;
grant execute on function public.fn_cancel_battle_request(bigint) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_submit_battle_answers — records this participant's answers (idempotent
-- per question via the battle_answers unique constraint — resubmitting the
-- same question is silently ignored, not double-counted) and marks them
-- finished. XP for the battle is only awarded once BOTH participants have
-- finished, at which point the winner (strictly more correct answers; a tie
-- awards no winner) is resolved and battle_stats/xp_events are updated for
-- both players in one go.
-- ---------------------------------------------------------------------------
create or replace function public.fn_submit_battle_answers(p_battle_id bigint, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_battle record;
  v_answer jsonb;
  v_correct_count integer := 0;
  v_total integer;
  v_other_participant record;
  v_me_participant record;
  v_winner uuid;
  v_my_xp integer;
  v_other_xp integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select * into v_battle from public.battles where id = p_battle_id and status = 'active';
  if not found or v_uid not in (v_battle.challenger_id, v_battle.opponent_id) then
    raise exception 'battle not found or not active';
  end if;

  if exists (select 1 from public.battle_participants where battle_id = p_battle_id and user_id = v_uid and finished_at is not null) then
    raise exception 'already submitted';
  end if;

  v_total := jsonb_array_length(p_answers);
  if v_total is null or v_total <> v_battle.question_count then
    raise exception 'answers must cover every battle question exactly once';
  end if;

  for v_answer in select * from jsonb_array_elements(p_answers)
  loop
    insert into public.battle_answers (battle_id, user_id, question_id, selected_option_id, correct)
    values (p_battle_id, v_uid, v_answer ->> 'questionId', v_answer ->> 'selectedOptionId', (v_answer ->> 'correct')::boolean)
    on conflict (battle_id, user_id, question_id) do nothing;

    if (v_answer ->> 'correct')::boolean then
      v_correct_count := v_correct_count + 1;
    end if;
  end loop;

  update public.battle_participants
  set correct_count = v_correct_count, total_answered = v_total, finished_at = now()
  where battle_id = p_battle_id and user_id = v_uid
  returning * into v_me_participant;

  select * into v_other_participant
  from public.battle_participants
  where battle_id = p_battle_id and user_id <> v_uid;

  if v_other_participant.finished_at is null then
    -- Waiting on the other player — nothing more to resolve yet.
    return jsonb_build_object('waitingForOpponent', true, 'correctCount', v_correct_count, 'totalCount', v_total);
  end if;

  if v_me_participant.correct_count > v_other_participant.correct_count then
    v_winner := v_uid;
  elsif v_other_participant.correct_count > v_me_participant.correct_count then
    v_winner := v_other_participant.user_id;
  else
    v_winner := null;
  end if;

  update public.battles set status = 'completed', completed_at = now(), winner_id = v_winner where id = p_battle_id;

  v_my_xp := case when v_winner = v_uid then 50 when v_winner is null then 15 else 5 end;
  v_other_xp := case when v_winner = v_other_participant.user_id then 50 when v_winner is null then 15 else 5 end;

  insert into public.user_battle_stats (user_id, battles_played, battles_won, total_questions_answered, total_questions_correct)
  values (v_uid, 1, case when v_winner = v_uid then 1 else 0 end, v_me_participant.total_answered, v_me_participant.correct_count)
  on conflict (user_id) do update set
    battles_played = user_battle_stats.battles_played + 1,
    battles_won = user_battle_stats.battles_won + case when v_winner = v_uid then 1 else 0 end,
    total_questions_answered = user_battle_stats.total_questions_answered + v_me_participant.total_answered,
    total_questions_correct = user_battle_stats.total_questions_correct + v_me_participant.correct_count,
    updated_at = now();

  insert into public.user_battle_stats (user_id, battles_played, battles_won, total_questions_answered, total_questions_correct)
  values (v_other_participant.user_id, 1, case when v_winner = v_other_participant.user_id then 1 else 0 end, v_other_participant.total_answered, v_other_participant.correct_count)
  on conflict (user_id) do update set
    battles_played = user_battle_stats.battles_played + 1,
    battles_won = user_battle_stats.battles_won + case when v_winner = v_other_participant.user_id then 1 else 0 end,
    total_questions_answered = user_battle_stats.total_questions_answered + v_other_participant.total_answered,
    total_questions_correct = user_battle_stats.total_questions_correct + v_other_participant.correct_count,
    updated_at = now();

  update public.user_progress set xp = xp + v_my_xp, updated_at = now() where user_id = v_uid;
  update public.user_progress set xp = xp + v_other_xp, updated_at = now() where user_id = v_other_participant.user_id;

  insert into public.xp_events (user_id, amount, reason) values (v_uid, v_my_xp, case when v_winner = v_uid then 'exam_passed' else 'exam_failed' end);
  insert into public.xp_events (user_id, amount, reason) values (v_other_participant.user_id, v_other_xp, case when v_winner = v_other_participant.user_id then 'exam_passed' else 'exam_failed' end);

  perform public.fn_check_achievements(v_uid);

  return jsonb_build_object(
    'waitingForOpponent', false,
    'correctCount', v_correct_count,
    'totalCount', v_total,
    'opponentCorrectCount', v_other_participant.correct_count,
    'winnerId', v_winner
  );
end;
$$;

revoke all on function public.fn_submit_battle_answers(bigint, jsonb) from public;
grant execute on function public.fn_submit_battle_answers(bigint, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_get_my_battles — everything the battles UI needs in one round trip:
-- incoming/outgoing pending invites, the currently active battle (if any —
-- the unique index above guarantees at most one live battle per pair, but a
-- user could have one live battle per *different* friend), recent
-- completed history, and this user's own aggregate stats.
-- ---------------------------------------------------------------------------
create or replace function public.fn_get_my_battles()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_incoming jsonb;
  v_outgoing jsonb;
  v_active jsonb;
  v_history jsonb;
  v_stats record;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'battleId', b.id, 'friendUserId', p.user_id, 'displayName', p.display_name,
    'avatarUrl', p.avatar_url, 'questionCount', b.question_count, 'createdAt', b.created_at
  ) order by b.created_at desc), '[]'::jsonb)
  into v_incoming
  from public.battles b join public.profiles p on p.user_id = b.challenger_id
  where b.status = 'pending' and b.opponent_id = v_uid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'battleId', b.id, 'friendUserId', p.user_id, 'displayName', p.display_name,
    'avatarUrl', p.avatar_url, 'questionCount', b.question_count, 'createdAt', b.created_at
  ) order by b.created_at desc), '[]'::jsonb)
  into v_outgoing
  from public.battles b join public.profiles p on p.user_id = b.opponent_id
  where b.status = 'pending' and b.challenger_id = v_uid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'battleId', b.id, 'friendUserId', p.user_id, 'displayName', p.display_name,
    'avatarUrl', p.avatar_url, 'questionCount', b.question_count, 'questionIds', b.question_ids,
    'amIChallenger', b.challenger_id = v_uid,
    'iHaveFinished', exists(select 1 from public.battle_participants bp where bp.battle_id = b.id and bp.user_id = v_uid and bp.finished_at is not null),
    'opponentHasFinished', exists(select 1 from public.battle_participants bp where bp.battle_id = b.id and bp.user_id <> v_uid and bp.finished_at is not null)
  ) order by b.created_at desc), '[]'::jsonb)
  into v_active
  from public.battles b
  join public.profiles p on p.user_id = case when b.challenger_id = v_uid then b.opponent_id else b.challenger_id end
  where b.status = 'active' and (b.challenger_id = v_uid or b.opponent_id = v_uid);

  select coalesce(jsonb_agg(jsonb_build_object(
    'battleId', b.id, 'friendUserId', p.user_id, 'displayName', p.display_name,
    'avatarUrl', p.avatar_url, 'myCorrectCount', me.correct_count, 'opponentCorrectCount', opp.correct_count,
    'totalCount', b.question_count, 'won', b.winner_id = v_uid, 'tied', b.winner_id is null, 'completedAt', b.completed_at
  ) order by b.completed_at desc), '[]'::jsonb)
  into v_history
  from public.battles b
  join public.battle_participants me on me.battle_id = b.id and me.user_id = v_uid
  join public.battle_participants opp on opp.battle_id = b.id and opp.user_id <> v_uid
  join public.profiles p on p.user_id = opp.user_id
  where b.status = 'completed' and (b.challenger_id = v_uid or b.opponent_id = v_uid)
  order by b.completed_at desc
  limit 20;

  select battles_played, battles_won, total_questions_answered, total_questions_correct
  into v_stats
  from public.user_battle_stats where user_id = v_uid;

  return jsonb_build_object(
    'incoming', v_incoming,
    'outgoing', v_outgoing,
    'active', v_active,
    'history', v_history,
    'stats', jsonb_build_object(
      'battlesPlayed', coalesce(v_stats.battles_played, 0),
      'battlesWon', coalesce(v_stats.battles_won, 0),
      'winRatePct', case when coalesce(v_stats.battles_played, 0) = 0 then 0 else round(v_stats.battles_won::numeric / v_stats.battles_played * 100) end,
      'accuracyPct', case when coalesce(v_stats.total_questions_answered, 0) = 0 then 0 else round(v_stats.total_questions_correct::numeric / v_stats.total_questions_answered * 100) end
    )
  );
end;
$$;

revoke all on function public.fn_get_my_battles() from public;
grant execute on function public.fn_get_my_battles() to authenticated;

-- ---------------------------------------------------------------------------
-- fn_get_friend_battle_stats — the win-rate/accuracy pair for a friend's
-- profile (fn_get_friend_profile already gates on an accepted friendship +
-- profile_visibility; this mirrors that same check rather than relaxing it).
-- ---------------------------------------------------------------------------
create or replace function public.fn_get_friend_battle_stats(p_friend_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_is_friend boolean;
  v_stats record;
begin
  if v_uid is null then
    raise exception 'not authenticated';
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

  select battles_played, battles_won, total_questions_answered, total_questions_correct
  into v_stats
  from public.user_battle_stats where user_id = p_friend_user_id;

  return jsonb_build_object(
    'battlesPlayed', coalesce(v_stats.battles_played, 0),
    'battlesWon', coalesce(v_stats.battles_won, 0),
    'winRatePct', case when coalesce(v_stats.battles_played, 0) = 0 then 0 else round(v_stats.battles_won::numeric / v_stats.battles_played * 100) end,
    'accuracyPct', case when coalesce(v_stats.total_questions_answered, 0) = 0 then 0 else round(v_stats.total_questions_correct::numeric / v_stats.total_questions_answered * 100) end
  );
end;
$$;

revoke all on function public.fn_get_friend_battle_stats(uuid) from public;
grant execute on function public.fn_get_friend_battle_stats(uuid) to authenticated;
