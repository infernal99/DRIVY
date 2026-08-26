-- DRIVY Phase A: two achievements missing from the original set —
-- an accuracy-threshold badge and a "flawless exam" badge — plus the
-- fn_check_achievements support to evaluate them server-side.
--
-- Widens achievements.metric's allowed values. The original CHECK was
-- declared inline (`metric text not null check (metric in (...))`), so its
-- name is whatever Postgres auto-assigned; rather than guess it, this looks
-- it up by inspecting pg_constraint and drops whatever it finds before
-- adding the new, wider constraint under a known name.
do $$
declare
  v_name text;
begin
  select conname into v_name
  from pg_constraint
  where conrelid = 'public.achievements'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%metric%';
  if v_name is not null then
    execute format('alter table public.achievements drop constraint %I', v_name);
  end if;
end $$;

alter table public.achievements
  add constraint achievements_metric_check
  check (
    metric in (
      'questions_answered', 'exams_passed', 'best_streak', 'perfect_category_count',
      'longest_correct_streak', 'accuracy_pct', 'perfect_exam_count'
    )
  );

insert into public.achievements (id, metric, threshold) values
  ('precision-90', 'accuracy_pct', 90),
  ('examen-perfecto', 'perfect_exam_count', 1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- fn_check_achievements — re-created to also evaluate accuracy_pct (gated on
-- a minimum sample size of 50 answered questions, mirroring the >=50 client
-- gate in src/data/achievements.ts, so early lucky streaks can't trivially
-- unlock it) and perfect_exam_count (a passed attempt with zero wrong
-- answers). Everything else is unchanged from the previous version.
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
  v_correct_answers bigint;
  v_accuracy_pct integer;
  v_exams_passed bigint;
  v_best_streak integer;
  v_longest_correct_streak integer;
  v_perfect_categories bigint;
  v_perfect_exams bigint;
  v_newly jsonb := '[]'::jsonb;
  v_rec record;
begin
  if v_uid is null or v_uid <> p_user_id then
    raise exception 'not authorized';
  end if;

  select coalesce(sum(times_seen), 0), coalesce(sum(times_correct), 0)
    into v_questions_answered, v_correct_answers
  from public.question_stats where user_id = v_uid;

  v_accuracy_pct := case
    when v_questions_answered > 0 then round((v_correct_answers::numeric / v_questions_answered) * 100)
    else 0
  end;

  select count(*) into v_exams_passed
  from public.exam_attempts where user_id = v_uid and passed;

  select count(*) into v_perfect_exams
  from public.exam_attempts where user_id = v_uid and passed and correct_count = total_count;

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
      (a.metric = 'longest_correct_streak' and coalesce(v_longest_correct_streak, 0) >= a.threshold) or
      (a.metric = 'accuracy_pct' and v_questions_answered >= 50 and v_accuracy_pct >= a.threshold) or
      (a.metric = 'perfect_exam_count' and v_perfect_exams >= a.threshold)
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
