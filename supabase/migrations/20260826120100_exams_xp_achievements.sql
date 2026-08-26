-- DRIVY: exam attempts/answers, the XP ledger, and achievements.
--
-- xp_events is an append-only audit ledger — it is never read back to
-- compute the user's current XP (user_progress.xp is authoritative for
-- that); it exists so "how did this account reach N XP" is always
-- reconstructable, and so XP grants are traceable to a specific
-- server-validated action instead of an opaque counter bump.

create table public.exam_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  mode text not null check (mode in ('simulacro', 'examen-real')),
  started_at timestamptz not null,
  finished_at timestamptz not null,
  duration_seconds integer not null check (duration_seconds >= 0 and duration_seconds <= 3600),
  correct_count integer not null check (correct_count >= 0),
  total_count integer not null check (total_count > 0 and total_count <= 30),
  passed boolean not null,
  created_at timestamptz not null default now()
);

alter table public.exam_attempts enable row level security;

create index exam_attempts_user_id_idx on public.exam_attempts (user_id);

create policy "exam_attempts_select_own"
  on public.exam_attempts for select
  to authenticated
  using ((select auth.uid()) = user_id);

create table public.exam_answers (
  id bigint generated always as identity primary key,
  exam_attempt_id bigint not null references public.exam_attempts (id) on delete cascade,
  question_id text not null,
  selected_option_id text,
  correct boolean not null
);

alter table public.exam_answers enable row level security;

create index exam_answers_exam_attempt_id_idx on public.exam_answers (exam_attempt_id);

create policy "exam_answers_select_own"
  on public.exam_answers for select
  to authenticated
  using (
    exists (
      select 1 from public.exam_attempts ea
      where ea.id = exam_answers.exam_attempt_id
        and ea.user_id = (select auth.uid())
    )
  );

create table public.xp_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  amount integer not null,
  reason text not null check (
    reason in ('correct_answer', 'wrong_answer', 'lesson_complete', 'exam_passed', 'exam_failed', 'migration')
  ),
  question_id text,
  exam_attempt_id bigint references public.exam_attempts (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.xp_events enable row level security;

create index xp_events_user_id_idx on public.xp_events (user_id);

create policy "xp_events_select_own"
  on public.xp_events for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Static achievement catalog — mirrors src/data/achievements.ts. Only used
-- server-side by fn_check_achievements (SECURITY DEFINER, bypasses RLS); the
-- app's UI keeps rendering name/description/icon from the TS copy, joining
-- only on `id`. Keep the two in sync by hand if achievements change.
create table public.achievements (
  id text primary key,
  metric text not null check (
    metric in ('questions_answered', 'exams_passed', 'best_streak', 'perfect_category_count', 'longest_correct_streak')
  ),
  threshold integer not null check (threshold > 0)
);

alter table public.achievements enable row level security;
-- No policies at all: not queried by client code (client uses the static
-- ACHIEVEMENTS array for display); only read by SECURITY DEFINER functions,
-- which run as the table owner and bypass RLS.

insert into public.achievements (id, metric, threshold) values
  ('primera-leccion', 'questions_answered', 1),
  ('preguntas-100', 'questions_answered', 100),
  ('preguntas-500', 'questions_answered', 500),
  ('preguntas-1000', 'questions_answered', 1000),
  ('racha-7', 'best_streak', 7),
  ('racha-30', 'best_streak', 30),
  ('examen-1', 'exams_passed', 1),
  ('examen-3', 'exams_passed', 3),
  ('examen-10', 'exams_passed', 10),
  ('categoria-perfecta', 'perfect_category_count', 1),
  ('racha-aciertos-10', 'longest_correct_streak', 10);

create table public.user_achievements (
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id text not null references public.achievements (id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

alter table public.user_achievements enable row level security;

create policy "user_achievements_select_own"
  on public.user_achievements for select
  to authenticated
  using ((select auth.uid()) = user_id);
