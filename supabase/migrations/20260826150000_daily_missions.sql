-- DRIVY Phase D: daily missions.
--
-- user_daily_missions is written ONLY by fn_advance_daily_missions, called
-- from inside the existing action RPCs (fn_record_answer, fn_complete_lesson,
-- fn_submit_exam) as those record a real event — never by a client-callable
-- "mark mission complete" RPC. fn_advance_daily_missions itself is not
-- granted to `authenticated`, so it's only reachable from those trusted
-- call sites (a SECURITY DEFINER caller keeps running as its owner for the
-- duration of the call, so the missing grant doesn't block the internal call
-- — it just blocks a client from invoking it directly over PostgREST).

-- ---------------------------------------------------------------------------
-- Catalog. Unlike `achievements` (mirrored by hand into a TS array because it
-- doubles as client-side unlock-check logic), this is pure display data with
-- no logic attached, so it gets a plain read policy and the client just
-- queries it — one fewer place to keep in sync.
-- ---------------------------------------------------------------------------
create table public.daily_missions (
  id text primary key,
  description text not null,
  metric text not null check (
    metric in ('questions_answered', 'lessons_completed', 'mistakes_practiced', 'xp_earned')
  ),
  target_amount integer not null check (target_amount > 0)
);

alter table public.daily_missions enable row level security;

create policy "daily_missions_select_all"
  on public.daily_missions for select
  to authenticated
  using (true);

insert into public.daily_missions (id, description, metric, target_amount) values
  ('diario-preguntas', 'Responde 10 preguntas', 'questions_answered', 10),
  ('diario-leccion', 'Completa 1 lección', 'lessons_completed', 1),
  ('diario-errores', 'Repasa 5 preguntas falladas', 'mistakes_practiced', 5),
  ('diario-xp', 'Consigue 50 XP', 'xp_earned', 50);

-- ---------------------------------------------------------------------------
-- Per-user, per-day progress. The (user_id, mission_id, day) primary key is
-- the dedupe guard against double-crediting the same user/mission/day.
-- ---------------------------------------------------------------------------
create table public.user_daily_missions (
  user_id uuid not null references auth.users (id) on delete cascade,
  mission_id text not null references public.daily_missions (id) on delete cascade,
  day date not null,
  progress integer not null default 0 check (progress >= 0),
  completed_at timestamptz,
  primary key (user_id, mission_id, day)
);

alter table public.user_daily_missions enable row level security;

create index user_daily_missions_user_day_idx on public.user_daily_missions (user_id, day);

create policy "user_daily_missions_select_own"
  on public.user_daily_missions for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- fn_advance_daily_missions — internal helper (no grant to `authenticated`).
-- Credits `p_amount` of `p_metric` progress, for `p_today`, toward every
-- catalog mission with that metric, capping at each mission's target and
-- stamping completed_at the first time a mission crosses its target.
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
  v_rec record;
begin
  if v_uid is null or v_uid <> p_user_id then
    raise exception 'not authorized';
  end if;
  if p_amount <= 0 then
    return;
  end if;

  for v_rec in select id, target_amount from public.daily_missions where metric = p_metric
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
-- Deliberately no grant to `authenticated` — only callable from other
-- SECURITY DEFINER functions in this file, never directly by a client.

-- ---------------------------------------------------------------------------
-- fn_record_answer — re-created to also advance daily missions:
--   questions_answered +1, xp_earned +v_xp_delta always; mistakes_practiced
--   +1 when this question's PREVIOUS last_result was 'wrong' (i.e. the user
--   is re-attempting something they'd got wrong before — a real, derived
--   signal, not a client-asserted "this was a mistake review" flag).
-- Everything else is unchanged from the previous version.
-- ---------------------------------------------------------------------------
create or replace function public.fn_record_answer(
  p_question_id text,
  p_category_id text,
  p_correct boolean,
  p_today date
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_xp_delta integer;
  v_next_streak integer;
  v_prev_last_result text;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if p_today < (now() at time zone 'utc')::date - 1 or p_today > (now() at time zone 'utc')::date + 1 then
    raise exception 'invalid date';
  end if;

  v_xp_delta := case when p_correct then 10 else 2 end;

  select last_result into v_prev_last_result
  from public.question_stats where user_id = v_uid and question_id = p_question_id;

  insert into public.question_stats as qs
    (user_id, question_id, times_seen, times_correct, times_wrong, last_seen_at, last_result, due_score)
  values (
    v_uid, p_question_id, 1,
    case when p_correct then 1 else 0 end,
    case when p_correct then 0 else 1 end,
    now(),
    case when p_correct then 'correct' else 'wrong' end,
    case when p_correct then 0 else 3 end
  )
  on conflict (user_id, question_id) do update set
    times_seen = qs.times_seen + 1,
    times_correct = qs.times_correct + case when p_correct then 1 else 0 end,
    times_wrong = qs.times_wrong + case when p_correct then 0 else 1 end,
    last_seen_at = now(),
    last_result = case when p_correct then 'correct' else 'wrong' end,
    due_score = case when p_correct then greatest(0, qs.due_score - 2) else qs.due_score + 3 end;

  insert into public.category_stats as cs (user_id, category_id, answered, correct)
  values (v_uid, p_category_id, 1, case when p_correct then 1 else 0 end)
  on conflict (user_id, category_id) do update set
    answered = cs.answered + 1,
    correct = cs.correct + case when p_correct then 1 else 0 end;

  select case
    when up.last_activity_date = p_today then up.streak_count
    when up.last_activity_date = p_today - 1 then up.streak_count + 1
    else 1
  end into v_next_streak
  from public.user_progress up where up.user_id = v_uid;

  update public.user_progress up set
    xp = up.xp + v_xp_delta,
    current_correct_streak = case when p_correct then up.current_correct_streak + 1 else 0 end,
    best_correct_streak = greatest(up.best_correct_streak, case when p_correct then up.current_correct_streak + 1 else 0 end),
    streak_count = v_next_streak,
    best_streak_ever = greatest(up.best_streak_ever, v_next_streak),
    last_activity_date = p_today,
    updated_at = now()
  where up.user_id = v_uid;

  insert into public.xp_events (user_id, amount, reason, question_id)
  values (v_uid, v_xp_delta, case when p_correct then 'correct_answer' else 'wrong_answer' end, p_question_id);

  perform public.fn_advance_daily_missions(v_uid, 'questions_answered', p_today, 1);
  perform public.fn_advance_daily_missions(v_uid, 'xp_earned', p_today, v_xp_delta);
  if v_prev_last_result = 'wrong' then
    perform public.fn_advance_daily_missions(v_uid, 'mistakes_practiced', p_today, 1);
  end if;

  return jsonb_build_object(
    'xpGained', v_xp_delta,
    'newlyUnlockedAchievements', public.fn_check_achievements(v_uid)
  );
end;
$$;

revoke all on function public.fn_record_answer(text, text, boolean, date) from public;
grant execute on function public.fn_record_answer(text, text, boolean, date) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_complete_lesson — signature widened to take p_today (needed to advance
-- daily missions on the caller's local day, matching every other action
-- RPC). The old (text)-only overload is dropped rather than left stranded.
-- ---------------------------------------------------------------------------
drop function if exists public.fn_complete_lesson(text);

create or replace function public.fn_complete_lesson(p_lesson_id text, p_today date)
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
  if p_today < (now() at time zone 'utc')::date - 1 or p_today > (now() at time zone 'utc')::date + 1 then
    raise exception 'invalid date';
  end if;

  insert into public.completed_lessons (user_id, lesson_id)
  values (v_uid, p_lesson_id)
  on conflict (user_id, lesson_id) do nothing;
  get diagnostics v_rows = row_count;

  if v_rows > 0 then
    update public.user_progress set xp = xp + 30, updated_at = now() where user_id = v_uid;
    insert into public.xp_events (user_id, amount, reason) values (v_uid, 30, 'lesson_complete');
    perform public.fn_advance_daily_missions(v_uid, 'lessons_completed', p_today, 1);
    perform public.fn_advance_daily_missions(v_uid, 'xp_earned', p_today, 30);
  end if;

  return jsonb_build_object('awarded', v_rows > 0);
end;
$$;

revoke all on function public.fn_complete_lesson(text, date) from public;
grant execute on function public.fn_complete_lesson(text, date) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_submit_exam — re-created to also advance daily missions per answered
-- question (questions_answered, mistakes_practiced on the same "was this
-- previously wrong" signal as fn_record_answer) and xp_earned for the flat
-- pass/fail bonus. Everything else is unchanged from the previous version.
-- ---------------------------------------------------------------------------
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

revoke all on function public.fn_submit_exam(text, timestamptz, timestamptz, integer, jsonb, date) from public;
grant execute on function public.fn_submit_exam(text, timestamptz, timestamptz, integer, jsonb, date) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_reset_progress — re-created to also clear mission progress, so
-- "Reiniciar progreso" is actually complete.
-- ---------------------------------------------------------------------------
create or replace function public.fn_reset_progress()
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

  delete from public.question_stats where user_id = v_uid;
  delete from public.category_stats where user_id = v_uid;
  delete from public.completed_lessons where user_id = v_uid;
  delete from public.unlocked_categories where user_id = v_uid;
  delete from public.exam_attempts where user_id = v_uid;
  delete from public.user_achievements where user_id = v_uid;
  delete from public.xp_events where user_id = v_uid;
  delete from public.user_daily_missions where user_id = v_uid;

  insert into public.unlocked_categories (user_id, category_id) values (v_uid, 'senales');

  update public.user_progress set
    xp = 0,
    streak_count = 0,
    best_streak_ever = 0,
    last_activity_date = null,
    current_correct_streak = 0,
    best_correct_streak = 0,
    updated_at = now()
  where user_id = v_uid;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.fn_reset_progress() from public;
grant execute on function public.fn_reset_progress() to authenticated;
