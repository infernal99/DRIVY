-- DRIVY: server-validated mutation functions + auto-provisioning triggers.
--
-- Every function that WRITES user progress is `security definer` so it can
-- bypass the deliberately-restrictive (SELECT-only) RLS policies from the
-- previous two migrations, but each one starts by reading auth.uid() itself
-- and uses that (never a client-supplied user id) for every write — so
-- bypassing RLS never means bypassing "only your own rows". `set search_path
-- = ''` plus fully-schema-qualified names on every one of them closes the
-- search_path-hijack hole that SECURITY DEFINER functions are otherwise
-- vulnerable to. EXECUTE is revoked from PUBLIC/anon and granted only to
-- authenticated, so a signed-out client can't call any of them.
--
-- XP amounts are fixed constants mirrored from src/utils/xp.ts (XP_REWARDS)
-- and src/services/progressService.ts (streak logic) — never accepted as a
-- parameter from the client. See the migration guide in the implementation
-- summary for why exam *correctness* is still trusted from the client this
-- phase (question content, including correctOptionId, is static/local only
-- — see "QUESTIONS" section of the brief this schema was built from).

-- ---------------------------------------------------------------------------
-- Level formula (mirrors src/utils/xp.ts exactly).
-- ---------------------------------------------------------------------------
create or replace function public.fn_level_for_xp(p_xp integer)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_level integer := 1;
  v_remaining integer := greatest(p_xp, 0);
  v_required integer;
  v_guard integer := 0;
begin
  loop
    v_required := round(150 * power(1.12, v_level - 1));
    exit when v_remaining < v_required or v_guard > 1000;
    v_remaining := v_remaining - v_required;
    v_level := v_level + 1;
    v_guard := v_guard + 1;
  end loop;
  return v_level;
end;
$$;

-- ---------------------------------------------------------------------------
-- Auto-provisioning: profile + progress row + first unlocked category on
-- signup. Trigger functions return `trigger`, which PostgREST never exposes
-- as a callable RPC, so this is not reachable over the API regardless of
-- grants — but it's kept search_path-hardened anyway for consistency.
-- ---------------------------------------------------------------------------
create or replace function public.fn_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)));

  insert into public.user_progress (user_id, unlocked_category_ids)
  values (new.id, array['senales']);

  insert into public.unlocked_categories (user_id, category_id)
  values (new.id, 'senales');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.fn_handle_new_user();

-- Keep profiles.xp/level/streak in sync with user_progress whenever it
-- changes, so ProfilePage (and any future leaderboard) can read `profiles`
-- alone without joining user_progress.
create or replace function public.fn_sync_profile_from_progress()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set xp = new.xp,
      level = public.fn_level_for_xp(new.xp),
      current_streak = new.streak_count,
      longest_streak = new.best_streak_ever,
      updated_at = now()
  where user_id = new.user_id;
  return new;
end;
$$;

drop trigger if exists trg_sync_profile_from_progress on public.user_progress;
create trigger trg_sync_profile_from_progress
  after insert or update of xp, streak_count, best_streak_ever on public.user_progress
  for each row execute function public.fn_sync_profile_from_progress();

-- ---------------------------------------------------------------------------
-- Achievement evaluation, shared by every mutation RPC below. Re-derives the
-- same UserStats fields src/services/progressService.ts#computeStats does,
-- straight from the tables (never trusts a client-sent stats snapshot).
-- ---------------------------------------------------------------------------
create or replace function public.fn_check_achievements(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_questions_answered bigint;
  v_exams_passed bigint;
  v_best_streak integer;
  v_longest_correct_streak integer;
  v_perfect_categories bigint;
  v_newly jsonb := '[]'::jsonb;
  v_rec record;
begin
  if v_uid is null or v_uid <> p_user_id then
    raise exception 'not authorized';
  end if;

  select coalesce(sum(times_seen), 0) into v_questions_answered
  from public.question_stats where user_id = v_uid;

  select count(*) into v_exams_passed
  from public.exam_attempts where user_id = v_uid and passed;

  select best_streak_ever, best_correct_streak into v_best_streak, v_longest_correct_streak
  from public.user_progress where user_id = v_uid;

  select count(*) into v_perfect_categories
  from public.category_stats where user_id = v_uid and answered >= 5 and correct = answered;

  for v_rec in
    select a.id from public.achievements a
    where not exists (
      select 1 from public.user_achievements ua
      where ua.user_id = v_uid and ua.achievement_id = a.id
    )
    and (
      (a.metric = 'questions_answered' and v_questions_answered >= a.threshold) or
      (a.metric = 'exams_passed' and v_exams_passed >= a.threshold) or
      (a.metric = 'best_streak' and coalesce(v_best_streak, 0) >= a.threshold) or
      (a.metric = 'perfect_category_count' and v_perfect_categories >= a.threshold) or
      (a.metric = 'longest_correct_streak' and coalesce(v_longest_correct_streak, 0) >= a.threshold)
    )
  loop
    insert into public.user_achievements (user_id, achievement_id) values (v_uid, v_rec.id);
    v_newly := v_newly || jsonb_build_object('id', v_rec.id, 'unlockedAt', now());
  end loop;

  return v_newly;
end;
$$;

revoke all on function public.fn_check_achievements(uuid) from public;
grant execute on function public.fn_check_achievements(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_record_answer — the answer-a-question path (lessons/practice/daily).
-- p_today is the caller's local yyyy-mm-dd (streaks are a calendar-day, not
-- UTC, concept) but is clamped to within 1 day of the server clock so it
-- can't be used to fabricate an arbitrarily long streak.
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
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if p_today < (now() at time zone 'utc')::date - 1 or p_today > (now() at time zone 'utc')::date + 1 then
    raise exception 'invalid date';
  end if;

  v_xp_delta := case when p_correct then 10 else 2 end;

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

  return jsonb_build_object(
    'xpGained', v_xp_delta,
    'newlyUnlockedAchievements', public.fn_check_achievements(v_uid)
  );
end;
$$;

revoke all on function public.fn_record_answer(text, text, boolean, date) from public;
grant execute on function public.fn_record_answer(text, text, boolean, date) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_complete_lesson — idempotent: only awards XP the first time a lesson id
-- is marked complete for this user.
-- ---------------------------------------------------------------------------
create or replace function public.fn_complete_lesson(p_lesson_id text)
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

  insert into public.completed_lessons (user_id, lesson_id)
  values (v_uid, p_lesson_id)
  on conflict (user_id, lesson_id) do nothing;
  get diagnostics v_rows = row_count;

  if v_rows > 0 then
    update public.user_progress set xp = xp + 30, updated_at = now() where user_id = v_uid;
    insert into public.xp_events (user_id, amount, reason) values (v_uid, 30, 'lesson_complete');
  end if;

  return jsonb_build_object('awarded', v_rows > 0);
end;
$$;

revoke all on function public.fn_complete_lesson(text) from public;
grant execute on function public.fn_complete_lesson(text) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_unlock_category — no XP involved, just idempotent bookkeeping.
-- ---------------------------------------------------------------------------
create or replace function public.fn_unlock_category(p_category_id text)
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

  insert into public.unlocked_categories (user_id, category_id)
  values (v_uid, p_category_id)
  on conflict (user_id, category_id) do nothing;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.fn_unlock_category(text) from public;
grant execute on function public.fn_unlock_category(text) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_submit_exam — records an exam attempt + its per-question answers.
-- p_answers: jsonb array of {questionId, selectedOptionId, correct, categoryId}.
--
-- KNOWN LIMITATION (documented, not silently accepted): `correct` per answer
-- is trusted from the client, because correctOptionId lives only in the
-- static TS question bank (src/data/questions), not in this database, per
-- this phase's explicit scope ("keep the existing static question content").
-- What IS enforced server-side: total/correct counts must be internally
-- consistent, total_count is capped at 30, duration is capped at 3600s, and
-- the XP awarded is a fixed constant chosen from the *computed* `passed`
-- flag — never a client-supplied XP number. Closing the remaining gap
-- requires moving question content (or at least correct answers) into the
-- database, planned for a later phase.
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
-- fn_migrate_guest_progress — one-time import of a device's local (guest)
-- progress into the newly-created account. Gated on the account having NO
-- existing activity yet, so it can never be called twice to double XP.
--
-- KNOWN LIMITATION (documented): this trusts the *shape* of pre-signup local
-- progress (a user could have hand-edited localStorage before signing up).
-- XP is recomputed from imported per-question correct/wrong counts rather
-- than accepted directly, and every counter is clamped to a generous but
-- finite bound — but a determined user could still inflate their own
-- imported counts. This is an accepted, disclosed limitation of "import my
-- local progress once"; it does not affect any XP earned after signup,
-- which always goes through fn_record_answer/fn_submit_exam/fn_complete_lesson.
-- ---------------------------------------------------------------------------
create or replace function public.fn_migrate_guest_progress(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_has_activity boolean;
  v_key text;
  v_val jsonb;
  v_lesson text;
  v_category text;
  v_exam jsonb;
  v_answer jsonb;
  v_exam_id bigint;
  v_total_count integer;
  v_correct_count integer;
  v_passed boolean;
  v_computed_xp integer := 0;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select
    exists(select 1 from public.question_stats where user_id = v_uid)
    or exists(select 1 from public.exam_attempts where user_id = v_uid)
    or coalesce((select xp from public.user_progress where user_id = v_uid), 0) > 0
  into v_has_activity;

  if v_has_activity then
    return jsonb_build_object('migrated', false, 'reason', 'already_has_progress');
  end if;

  for v_key, v_val in select * from jsonb_each(coalesce(p_payload -> 'questionStats', '{}'::jsonb))
  loop
    insert into public.question_stats
      (user_id, question_id, times_seen, times_correct, times_wrong, last_seen_at, last_result, due_score)
    values (
      v_uid,
      v_key,
      least(greatest(coalesce((v_val ->> 'timesSeen')::integer, 0), 0), 100000),
      least(greatest(coalesce((v_val ->> 'timesCorrect')::integer, 0), 0), 100000),
      least(greatest(coalesce((v_val ->> 'timesWrong')::integer, 0), 0), 100000),
      coalesce((v_val ->> 'lastSeenAt')::timestamptz, now()),
      nullif(v_val ->> 'lastResult', ''),
      least(greatest(coalesce((v_val ->> 'dueScore')::integer, 0), 0), 1000)
    )
    on conflict (user_id, question_id) do nothing;

    v_computed_xp := v_computed_xp
      + least(greatest(coalesce((v_val ->> 'timesCorrect')::integer, 0), 0), 100000) * 10
      + least(greatest(coalesce((v_val ->> 'timesWrong')::integer, 0), 0), 100000) * 2;
  end loop;

  for v_key, v_val in select * from jsonb_each(coalesce(p_payload -> 'categoryStats', '{}'::jsonb))
  loop
    insert into public.category_stats (user_id, category_id, answered, correct)
    values (
      v_uid,
      v_key,
      least(greatest(coalesce((v_val ->> 'answered')::integer, 0), 0), 100000),
      least(greatest(coalesce((v_val ->> 'correct')::integer, 0), 0), 100000)
    )
    on conflict (user_id, category_id) do nothing;
  end loop;

  for v_lesson in select * from jsonb_array_elements_text(coalesce(p_payload -> 'completedLessonIds', '[]'::jsonb))
  loop
    insert into public.completed_lessons (user_id, lesson_id) values (v_uid, v_lesson)
    on conflict (user_id, lesson_id) do nothing;
  end loop;
  v_computed_xp := v_computed_xp + (select count(*) from public.completed_lessons where user_id = v_uid) * 30;

  for v_category in select * from jsonb_array_elements_text(coalesce(p_payload -> 'unlockedCategoryIds', '[]'::jsonb))
  loop
    insert into public.unlocked_categories (user_id, category_id) values (v_uid, v_category)
    on conflict (user_id, category_id) do nothing;
  end loop;
  insert into public.unlocked_categories (user_id, category_id) values (v_uid, 'senales')
    on conflict (user_id, category_id) do nothing;

  for v_exam in select * from jsonb_array_elements(coalesce(p_payload -> 'examResults', '[]'::jsonb))
  loop
    v_total_count := coalesce(jsonb_array_length(v_exam -> 'answers'), 0);
    if v_total_count between 1 and 30 then
      select count(*) into v_correct_count
      from jsonb_array_elements(v_exam -> 'answers') a
      where (a ->> 'correct')::boolean is true;

      v_passed := (v_total_count - v_correct_count) <= 3;

      insert into public.exam_attempts
        (user_id, mode, started_at, finished_at, duration_seconds, correct_count, total_count, passed)
      values (
        v_uid,
        case when v_exam ->> 'mode' in ('simulacro', 'examen-real') then v_exam ->> 'mode' else 'simulacro' end,
        coalesce((v_exam ->> 'startedAt')::timestamptz, now()),
        coalesce((v_exam ->> 'finishedAt')::timestamptz, now()),
        least(greatest(coalesce((v_exam ->> 'durationSeconds')::integer, 0), 0), 3600),
        v_correct_count,
        v_total_count,
        v_passed
      )
      returning id into v_exam_id;

      for v_answer in select * from jsonb_array_elements(v_exam -> 'answers')
      loop
        insert into public.exam_answers (exam_attempt_id, question_id, selected_option_id, correct)
        values (v_exam_id, v_answer ->> 'questionId', v_answer ->> 'selectedOptionId', (v_answer ->> 'correct')::boolean);
      end loop;

      v_computed_xp := v_computed_xp + case when v_passed then 100 else 20 end;
    end if;
  end loop;

  update public.user_progress set
    xp = v_computed_xp,
    streak_count = least(greatest(coalesce((p_payload ->> 'streakCount')::integer, 0), 0), 3650),
    best_streak_ever = least(greatest(coalesce((p_payload ->> 'bestStreakEver')::integer, 0), 0), 3650),
    current_correct_streak = least(greatest(coalesce((p_payload ->> 'currentCorrectStreak')::integer, 0), 0), 100000),
    best_correct_streak = least(greatest(coalesce((p_payload ->> 'bestCorrectStreak')::integer, 0), 0), 100000),
    last_activity_date = coalesce(nullif(p_payload ->> 'lastActivityDate', '')::date, current_date),
    updated_at = now()
  where user_id = v_uid;

  if coalesce(length(trim(p_payload ->> 'userName')), 0) > 0 then
    update public.profiles set display_name = left(trim(p_payload ->> 'userName'), 60) where user_id = v_uid;
  end if;

  insert into public.xp_events (user_id, amount, reason) values (v_uid, v_computed_xp, 'migration');

  perform public.fn_check_achievements(v_uid);

  return jsonb_build_object('migrated', true, 'xp', v_computed_xp);
end;
$$;

revoke all on function public.fn_migrate_guest_progress(jsonb) from public;
grant execute on function public.fn_migrate_guest_progress(jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_reset_progress — server-side equivalent of SettingsPage's "Reiniciar
-- progreso". Wipes everything derived, resets the aggregate row, re-seeds
-- the first category as unlocked (mirrors createInitialProgress()).
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
