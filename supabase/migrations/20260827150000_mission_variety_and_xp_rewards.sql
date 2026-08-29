-- Widens the daily mission catalog for more day-to-day variety (12 missions
-- now, still only 3 assigned per user per day via the existing deterministic
-- shuffle) and awards bonus XP the first time a mission is completed each
-- day, scaled to how hard that specific mission is.

alter table public.daily_missions
  add column xp_reward integer not null default 15 check (xp_reward > 0);

alter table public.xp_events drop constraint xp_events_reason_check;
alter table public.xp_events add constraint xp_events_reason_check
  check (reason in ('correct_answer', 'wrong_answer', 'lesson_complete', 'exam_passed', 'exam_failed', 'migration', 'mission_completed'));

alter table public.daily_missions drop constraint daily_missions_metric_check;
alter table public.daily_missions add constraint daily_missions_metric_check
  check (metric in (
    'questions_answered', 'lessons_completed', 'mistakes_practiced', 'xp_earned',
    'exams_taken', 'battles_played', 'battles_won'
  ));

update public.daily_missions set xp_reward = 15 where id = 'diario-preguntas-pocas';
update public.daily_missions set xp_reward = 40 where id = 'diario-preguntas-muchas';
update public.daily_missions set xp_reward = 30 where id = 'diario-leccion-doble';
update public.daily_missions set xp_reward = 15 where id = 'diario-errores-pocos';
update public.daily_missions set xp_reward = 35 where id = 'diario-errores-muchos';
update public.daily_missions set xp_reward = 10 where id = 'diario-xp-poco';
update public.daily_missions set xp_reward = 25 where id = 'diario-xp-mucho';

insert into public.daily_missions (id, description, metric, target_amount, xp_reward) values
  ('diario-preguntas-medias', 'Responde 12 preguntas', 'questions_answered', 12, 25),
  ('diario-leccion-triple', 'Completa 3 lecciones', 'lessons_completed', 3, 45),
  ('diario-examen', 'Completa un simulacro de examen', 'exams_taken', 1, 40),
  ('diario-duelo', 'Juega un duelo contra un amigo', 'battles_played', 1, 30),
  ('diario-duelo-victoria', 'Gana un duelo contra un amigo', 'battles_won', 1, 50)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- fn_todays_mission_ids — widened to take the target user explicitly instead
-- of reading auth.uid() internally. It has to: fn_advance_daily_missions now
-- credits an arbitrary p_user_id (the battle opponent, not just the caller),
-- and this shuffle must be computed for THAT user to stay in sync with what
-- fn_get_my_daily_missions shows them — using auth.uid() here would compute
-- the *caller's* shuffle and apply it to someone else's mission credit.
-- ---------------------------------------------------------------------------
drop function if exists public.fn_todays_mission_ids(date, integer);

create or replace function public.fn_todays_mission_ids(p_user_id uuid, p_today date, p_count integer default 3)
returns text[]
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(array_agg(id order by seed), '{}'::text[])
  from (
    select id, hashtext(p_user_id::text || p_today::text || id) as seed
    from public.daily_missions
    order by seed
    limit greatest(p_count, 1)
  ) s;
$$;

revoke all on function public.fn_todays_mission_ids(uuid, date, integer) from public;
-- Deliberately no grant to `authenticated` — only reachable from
-- fn_get_my_daily_missions/fn_advance_daily_missions, same as before.

-- ---------------------------------------------------------------------------
-- fn_advance_daily_missions — the `v_uid <> p_user_id` self-only check is
-- dropped: this function has never been granted to `authenticated` (only
-- reachable from other SECURITY DEFINER call sites), so it was always
-- defense-in-depth rather than the actual access boundary. Removing it lets
-- a battle's completion credit BOTH participants' battles_played/battles_won
-- missions, not just whichever of the two happened to submit the answer that
-- resolved it — fn_check_achievements's self-check stays as-is since that
-- one *is* directly grantable to clients.
--
-- Also now awards xp_reward the moment a mission's progress first reaches
-- its target (never re-awarded on subsequent calls the same day), by
-- comparing completed_at before and after crediting this call's progress.
-- ---------------------------------------------------------------------------
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
  v_was_completed boolean;
  v_now_completed boolean;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if p_amount <= 0 then
    return;
  end if;

  v_today_ids := public.fn_todays_mission_ids(p_user_id, p_today, 3);

  for v_rec in
    select id, target_amount, xp_reward from public.daily_missions
    where metric = p_metric and id = any(v_today_ids)
  loop
    select completed_at is not null into v_was_completed
    from public.user_daily_missions
    where user_id = p_user_id and mission_id = v_rec.id and day = p_today;
    v_was_completed := coalesce(v_was_completed, false);

    insert into public.user_daily_missions (user_id, mission_id, day, progress, completed_at)
    values (
      p_user_id, v_rec.id, p_today,
      least(p_amount, v_rec.target_amount),
      case when p_amount >= v_rec.target_amount then now() else null end
    )
    on conflict (user_id, mission_id, day) do update set
      progress = least(user_daily_missions.progress + p_amount, v_rec.target_amount),
      completed_at = coalesce(
        user_daily_missions.completed_at,
        case when user_daily_missions.progress + p_amount >= v_rec.target_amount then now() else null end
      );

    if not v_was_completed then
      select completed_at is not null into v_now_completed
      from public.user_daily_missions
      where user_id = p_user_id and mission_id = v_rec.id and day = p_today;

      if v_now_completed then
        update public.user_progress set xp = xp + v_rec.xp_reward, updated_at = now() where user_id = p_user_id;
        insert into public.xp_events (user_id, amount, reason) values (p_user_id, v_rec.xp_reward, 'mission_completed');
      end if;
    end if;
  end loop;
end;
$$;

-- fn_get_my_daily_missions — now also returns each mission's xp_reward.
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

  v_ids := public.fn_todays_mission_ids(v_uid, p_today, 3);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', dm.id,
    'description', dm.description,
    'metric', dm.metric,
    'targetAmount', dm.target_amount,
    'xpReward', dm.xp_reward,
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

-- fn_submit_exam — now also advances the 'exams_taken' mission (once per
-- submitted exam, not once per question — unlike questions_answered/
-- mistakes_practiced which are already credited per-answer above).
create or replace function public.fn_submit_exam(
  p_mode text,
  p_started_at timestamptz,
  p_finished_at timestamptz,
  p_duration_seconds integer,
  p_answers jsonb,
  p_today date
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_exam_id bigint;
  v_total integer;
  v_correct integer;
  v_passed boolean;
  v_xp_delta integer;
  v_answer jsonb;
  v_next_streak integer;
  v_prev_last_result text;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if p_mode not in ('simulacro', 'examen-real') then
    raise exception 'invalid mode';
  end if;
  if p_duration_seconds < 0 or p_duration_seconds > 3600 then
    raise exception 'invalid duration';
  end if;
  if p_today < (now() at time zone 'utc')::date - 1 or p_today > (now() at time zone 'utc')::date + 1 then
    raise exception 'invalid date';
  end if;

  v_total := jsonb_array_length(p_answers);
  if v_total is null or v_total < 1 or v_total > 30 then
    raise exception 'invalid answer count';
  end if;

  select count(*) into v_correct
  from jsonb_array_elements(p_answers) elem
  where (elem ->> 'correct')::boolean is true;

  v_passed := (v_total - v_correct) <= 3;

  insert into public.exam_attempts
    (user_id, mode, started_at, finished_at, duration_seconds, correct_count, total_count, passed)
  values (v_uid, p_mode, p_started_at, p_finished_at, p_duration_seconds, v_correct, v_total, v_passed)
  returning id into v_exam_id;

  for v_answer in select * from jsonb_array_elements(p_answers)
  loop
    insert into public.exam_answers (exam_attempt_id, question_id, selected_option_id, correct)
    values (v_exam_id, v_answer ->> 'questionId', v_answer ->> 'selectedOptionId', (v_answer ->> 'correct')::boolean);

    select last_result into v_prev_last_result
    from public.question_stats where user_id = v_uid and question_id = (v_answer ->> 'questionId');

    insert into public.question_stats as qs
      (user_id, question_id, times_seen, times_correct, times_wrong, last_seen_at, last_result, due_score)
    values (
      v_uid, v_answer ->> 'questionId', 1,
      case when (v_answer ->> 'correct')::boolean then 1 else 0 end,
      case when (v_answer ->> 'correct')::boolean then 0 else 1 end,
      now(),
      case when (v_answer ->> 'correct')::boolean then 'correct' else 'wrong' end,
      case when (v_answer ->> 'correct')::boolean then 0 else 3 end
    )
    on conflict (user_id, question_id) do update set
      times_seen = qs.times_seen + 1,
      times_correct = qs.times_correct + case when (v_answer ->> 'correct')::boolean then 1 else 0 end,
      times_wrong = qs.times_wrong + case when (v_answer ->> 'correct')::boolean then 0 else 1 end,
      last_seen_at = now(),
      last_result = case when (v_answer ->> 'correct')::boolean then 'correct' else 'wrong' end,
      due_score = case when (v_answer ->> 'correct')::boolean then greatest(0, qs.due_score - 2) else qs.due_score + 3 end;

    if v_answer ? 'categoryId' then
      insert into public.category_stats as cs (user_id, category_id, answered, correct)
      values (v_uid, v_answer ->> 'categoryId', 1, case when (v_answer ->> 'correct')::boolean then 1 else 0 end)
      on conflict (user_id, category_id) do update set
        answered = cs.answered + 1,
        correct = cs.correct + case when (v_answer ->> 'correct')::boolean then 1 else 0 end;
    end if;

    perform public.fn_advance_daily_missions(v_uid, 'questions_answered', p_today, 1);
    if v_prev_last_result = 'wrong' then
      perform public.fn_advance_daily_missions(v_uid, 'mistakes_practiced', p_today, 1);
    end if;
  end loop;

  v_xp_delta := case when v_passed then 100 else 20 end;

  select case
    when up.last_activity_date = p_today then up.streak_count
    when up.last_activity_date = p_today - 1 then up.streak_count + 1
    else 1
  end into v_next_streak
  from public.user_progress up where up.user_id = v_uid;

  update public.user_progress up set
    xp = up.xp + v_xp_delta,
    streak_count = v_next_streak,
    best_streak_ever = greatest(up.best_streak_ever, v_next_streak),
    last_activity_date = p_today,
    updated_at = now()
  where up.user_id = v_uid;

  insert into public.xp_events (user_id, amount, reason, exam_attempt_id)
  values (v_uid, v_xp_delta, case when v_passed then 'exam_passed' else 'exam_failed' end, v_exam_id);

  perform public.fn_advance_daily_missions(v_uid, 'xp_earned', p_today, v_xp_delta);
  perform public.fn_advance_daily_missions(v_uid, 'exams_taken', p_today, 1);

  return jsonb_build_object(
    'examId', v_exam_id,
    'correctCount', v_correct,
    'totalCount', v_total,
    'passed', v_passed,
    'xpGained', v_xp_delta,
    'newlyUnlockedAchievements', public.fn_check_achievements(v_uid)
  );
end;
$$;

-- fn_submit_battle_answer — now also credits 'battles_played' for both
-- participants, and 'battles_won' for the winner, when the duel completes.
-- Uses the server's own UTC date rather than a client-supplied p_today —
-- unlike answering a practice question, a battle round only ever resolves
-- "right now", so there's no legitimate cross-midnight backdating case to
-- account for here.
create or replace function public.fn_submit_battle_answer(
  p_battle_id bigint,
  p_question_index integer,
  p_question_id text,
  p_selected_option_id text,
  p_correct boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_battle record;
  v_other_id uuid;
  v_deadline timestamptz;
  v_me_row public.battle_answers;
  v_other_row public.battle_answers;
  v_me_participant public.battle_participants;
  v_other_participant public.battle_participants;
  v_winner uuid;
  v_my_xp integer;
  v_other_xp integer;
  v_today date := (now() at time zone 'utc')::date;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select * into v_battle from public.battles where id = p_battle_id and status = 'active';
  if not found or v_uid not in (v_battle.challenger_id, v_battle.opponent_id) then
    raise exception 'battle not found or not active';
  end if;

  if p_question_index <> v_battle.current_question_index then
    return public.fn_get_battle_round(p_battle_id);
  end if;

  v_other_id := case when v_uid = v_battle.challenger_id then v_battle.opponent_id else v_battle.challenger_id end;
  v_deadline := v_battle.question_started_at + interval '30 seconds';

  insert into public.battle_answers (battle_id, user_id, question_index, question_id, selected_option_id, correct)
  values (p_battle_id, v_uid, p_question_index, p_question_id, p_selected_option_id, coalesce(p_correct, false))
  on conflict (battle_id, user_id, question_index) where question_index is not null do nothing;

  if now() >= v_deadline then
    insert into public.battle_answers (battle_id, user_id, question_index, question_id, selected_option_id, correct)
    select p_battle_id, v_other_id, p_question_index, p_question_id, null, false
    where not exists (
      select 1 from public.battle_answers
      where battle_id = p_battle_id and user_id = v_other_id and question_index = p_question_index
    );
  end if;

  select * into v_me_row from public.battle_answers where battle_id = p_battle_id and user_id = v_uid and question_index = p_question_index;
  select * into v_other_row from public.battle_answers where battle_id = p_battle_id and user_id = v_other_id and question_index = p_question_index;

  if v_me_row.id is null or v_other_row.id is null then
    return public.fn_get_battle_round(p_battle_id);
  end if;

  update public.battle_participants
  set correct_count = correct_count + case when v_me_row.correct then 1 else 0 end, total_answered = total_answered + 1
  where battle_id = p_battle_id and user_id = v_uid;

  update public.battle_participants
  set correct_count = correct_count + case when v_other_row.correct then 1 else 0 end, total_answered = total_answered + 1
  where battle_id = p_battle_id and user_id = v_other_id;

  if p_question_index + 1 >= v_battle.question_count then
    select * into v_me_participant from public.battle_participants where battle_id = p_battle_id and user_id = v_uid;
    select * into v_other_participant from public.battle_participants where battle_id = p_battle_id and user_id = v_other_id;

    if v_me_participant.correct_count > v_other_participant.correct_count then
      v_winner := v_uid;
    elsif v_other_participant.correct_count > v_me_participant.correct_count then
      v_winner := v_other_id;
    else
      v_winner := null;
    end if;

    update public.battles
    set status = 'completed', completed_at = now(), winner_id = v_winner, current_question_index = p_question_index + 1
    where id = p_battle_id;

    v_my_xp := case when v_winner = v_uid then 50 when v_winner is null then 15 else 5 end;
    v_other_xp := case when v_winner = v_other_id then 50 when v_winner is null then 15 else 5 end;

    insert into public.user_battle_stats (user_id, battles_played, battles_won, total_questions_answered, total_questions_correct)
    values (v_uid, 1, case when v_winner = v_uid then 1 else 0 end, v_me_participant.total_answered, v_me_participant.correct_count)
    on conflict (user_id) do update set
      battles_played = user_battle_stats.battles_played + 1,
      battles_won = user_battle_stats.battles_won + case when v_winner = v_uid then 1 else 0 end,
      total_questions_answered = user_battle_stats.total_questions_answered + v_me_participant.total_answered,
      total_questions_correct = user_battle_stats.total_questions_correct + v_me_participant.correct_count,
      updated_at = now();

    insert into public.user_battle_stats (user_id, battles_played, battles_won, total_questions_answered, total_questions_correct)
    values (v_other_id, 1, case when v_winner = v_other_id then 1 else 0 end, v_other_participant.total_answered, v_other_participant.correct_count)
    on conflict (user_id) do update set
      battles_played = user_battle_stats.battles_played + 1,
      battles_won = user_battle_stats.battles_won + case when v_winner = v_other_id then 1 else 0 end,
      total_questions_answered = user_battle_stats.total_questions_answered + v_other_participant.total_answered,
      total_questions_correct = user_battle_stats.total_questions_correct + v_other_participant.correct_count,
      updated_at = now();

    update public.user_progress set xp = xp + v_my_xp, updated_at = now() where user_id = v_uid;
    update public.user_progress set xp = xp + v_other_xp, updated_at = now() where user_id = v_other_id;

    insert into public.xp_events (user_id, amount, reason) values (v_uid, v_my_xp, case when v_winner = v_uid then 'exam_passed' else 'exam_failed' end);
    insert into public.xp_events (user_id, amount, reason) values (v_other_id, v_other_xp, case when v_winner = v_other_id then 'exam_passed' else 'exam_failed' end);

    -- Only the caller's own achievements — fn_check_achievements enforces
    -- auth.uid() = p_user_id and would abort this whole transaction otherwise.
    perform public.fn_check_achievements(v_uid);

    perform public.fn_advance_daily_missions(v_uid, 'battles_played', v_today, 1);
    perform public.fn_advance_daily_missions(v_other_id, 'battles_played', v_today, 1);
    if v_winner = v_uid then
      perform public.fn_advance_daily_missions(v_uid, 'battles_won', v_today, 1);
    elsif v_winner = v_other_id then
      perform public.fn_advance_daily_missions(v_other_id, 'battles_won', v_today, 1);
    end if;
  else
    update public.battles set current_question_index = p_question_index + 1, question_started_at = now() where id = p_battle_id;
  end if;

  return public.fn_get_battle_round(p_battle_id);
end;
$$;
