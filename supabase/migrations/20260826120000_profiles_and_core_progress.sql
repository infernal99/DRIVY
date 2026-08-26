-- DRIVY: profiles + core per-user progress tables.
--
-- Design notes (see docs/content-pipeline.md and src/services/storage.ts for
-- the client-side ProgressRepository this schema backs):
--   * question_stats/category_stats/completed_lessons/unlocked_categories are
--     normalized child tables of the client's UserProgress aggregate, keyed
--     by (user_id, ...) rather than JSON blobs, so they can be updated
--     row-at-a-time and indexed.
--   * mistake_ids is NOT stored separately: a "mistake" is just a question
--     whose question_stats.last_result = 'wrong', so it's derived, not
--     duplicated (see fn_record_answer for the write path).
--   * EVERY write path here is a SECURITY DEFINER function added in
--     20260826120200_functions_triggers.sql. These tables intentionally get
--     NO insert/update/delete RLS policy for `authenticated` — only SELECT —
--     so the only way to change a row is through a function that validates
--     and computes XP itself. Direct client writes are denied by RLS by
--     default (no matching policy = no access).

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  display_name text not null default 'Alex',
  avatar_url text,
  xp integer not null default 0,
  level integer not null default 1,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- No insert/update/delete policy: rows are created by fn_handle_new_user
-- (trigger on auth.users) and kept in sync by fn_sync_profile_from_progress.

create table public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  schema_version integer not null default 1,
  xp integer not null default 0,
  streak_count integer not null default 0,
  best_streak_ever integer not null default 0,
  last_activity_date date,
  current_correct_streak integer not null default 0,
  best_correct_streak integer not null default 0,
  completed_lesson_ids text[] not null default '{}',
  unlocked_category_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

create policy "user_progress_select_own"
  on public.user_progress for select
  to authenticated
  using ((select auth.uid()) = user_id);

create table public.question_stats (
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null,
  times_seen integer not null default 0,
  times_correct integer not null default 0,
  times_wrong integer not null default 0,
  last_seen_at timestamptz,
  last_result text check (last_result in ('correct', 'wrong')),
  due_score integer not null default 0,
  primary key (user_id, question_id)
);

alter table public.question_stats enable row level security;

create policy "question_stats_select_own"
  on public.question_stats for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Fast "my mistakes" lookup (question_stats where last_result = 'wrong').
create index question_stats_user_wrong_idx
  on public.question_stats (user_id)
  where last_result = 'wrong';

create table public.category_stats (
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id text not null,
  answered integer not null default 0,
  correct integer not null default 0,
  primary key (user_id, category_id)
);

alter table public.category_stats enable row level security;

create policy "category_stats_select_own"
  on public.category_stats for select
  to authenticated
  using ((select auth.uid()) = user_id);

create table public.completed_lessons (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.completed_lessons enable row level security;

create policy "completed_lessons_select_own"
  on public.completed_lessons for select
  to authenticated
  using ((select auth.uid()) = user_id);

create table public.unlocked_categories (
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, category_id)
);

alter table public.unlocked_categories enable row level security;

create policy "unlocked_categories_select_own"
  on public.unlocked_categories for select
  to authenticated
  using ((select auth.uid()) = user_id);
