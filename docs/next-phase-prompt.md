# Roady — PHASE 2 PROMPT: gaps + improvements from the full-MVP spec

> Generated after auditing the current codebase against the "FULL MVP
> IMPLEMENTATION" prompt. This is a **pruned, re-scoped version** of that
> prompt: everything already fully working has been removed so you don't
> rebuild it; everything missing or partial is kept, with exact notes on
> what exists today and what's actually left to do. Read the "ALREADY
> IMPLEMENTED" section first so you don't duplicate work or regress it.

## Ground rules (unchanged from the original brief)

- Stack is Vite + React 19 + TypeScript + React Router + Zustand. **Do not
  migrate to Next.js.**
- Respect the existing architecture and Roady's existing visual design
  system (`src/styles/theme.css`, `src/components/ui/*`). Don't introduce a
  second design language.
- Consult current official Supabase docs before implementing anything new;
  no deprecated APIs.
- Never expose the Supabase service-role/secret key. Client code only ever
  uses the publishable/anon key (`src/lib/supabase.ts`).
- Every new user-owned table needs RLS, and every write path that awards XP,
  unlocks achievements, or changes another user-visible state needs a
  `SECURITY DEFINER` Postgres function that trusts only `auth.uid()` —
  never a client-supplied user id or amount. This is the pattern already
  used throughout `supabase/migrations/*.sql`; keep following it.
- New schema changes go in **new, incrementally-numbered migration files**
  under `supabase/migrations/` — never edit or re-run the four that already
  exist (`20260826120000`, `20260826120100`, `20260826120200`,
  `20260826130000`). Explain any destructive change before running it.
- Work in phases (see the order below). After each phase: `tsc -b`,
  `npm run build`, and a manual pass in the browser before moving on.
- Don't invent official DGT legislation/questions. Anything new authored
  content must go through the existing provenance model
  (`source.type: 'official' | 'derived' | 'practice' | 'needs_review'`,
  see `src/data/questions/helpers.ts` and `CONTENT-LICENSES.md`).

## ALREADY IMPLEMENTED — do not rebuild

Content system with full provenance (`src/data/questions/*`, `docs/content-pipeline.md`,
`CONTENT-LICENSES.md`), category/lesson learning path (`useLearnPath.ts`,
`ModulePath.tsx`), question engine with images/explanations/tags/source
(`QuestionSession.tsx`, `types/index.ts`), a real weighted adaptive-review
algorithm (`services/questionService.ts`), a full "Mis errores" flow
(`MistakeReviewPage.tsx`), the 30-question/3-option exam simulator with
timer + review screen (`ExamPage.tsx`, `services/examService.ts`), exam
attempts persisted to Supabase with RLS (`exam_attempts`/`exam_answers`),
XP/levels mirrored client+server (`utils/xp.ts` / `fn_level_for_xp`) with
server-side-only XP awarding, streaks gated on real activity, 11
achievements evaluated server-side only (`fn_check_achievements`), and the
full account system (mandatory login gate, register, forgot/reset password,
change password, delete account, guest→account progress migration).
None of this needs re-doing — extend it, don't replace it.

---

## PHASE A — Small, low-risk improvements to what already exists

1. **Adaptive algorithm doesn't use `difficulty` yet.** `priorityScore()` in
   `services/questionService.ts` weighs `dueScore`, last result, recency,
   and mastery — but never reads `question.difficulty`, even though the
   field exists on every `Question`. Add it as a factor (e.g. harder
   questions decay more slowly out of rotation, or get a small weight
   bump for a user who is otherwise doing well in that category).

2. **Streak day boundary is UTC, not the user's local calendar day.**
   `utils/date.ts#todayISO()` uses `new Date().toISOString()`, which is
   always UTC. For a user outside UTC, activity right around their local
   midnight can land on the "wrong" day and break a streak that felt
   continuous to them. Switch to computing the user's local
   `yyyy-mm-dd` (client-side) consistently everywhere a "today" is used —
   client (`progressService.ts`) and the server RPCs' `p_today` parameter
   both need to agree on the same definition.

3. **Achievement set doesn't fully match the spec's examples.** Current
   set (`src/data/achievements.ts` + the `achievements` table) has no
   "90% de precisión" style accuracy-threshold achievement. Add one (and
   any other obviously-missing milestone) using the existing
   `metric`/`threshold` pattern — no schema change needed, just new rows +
   a matching client-side entry for display.

4. **"Preguntas aleatorias" is genuinely random, not adaptive** — confirm
   that's intentional (a deliberate "just quiz me, no weighting" mode) or
   fold it into the adaptive pool. Don't change silently either way —
   whichever it is, make the copy on `PracticePage.tsx` explicit about it.

## PHASE B — Mastery score + "¿Estoy preparado?"

Neither exists today. `ProgressPage.tsx` only shows raw per-category
accuracy (`getWeakPoints`), not a proper mastery score.

1. Build a **mastery score (0–100) per category**, computed from accuracy
   + repetition + recency + difficulty + consistency (not just "% of
   questions attempted"). Put the calculation in one reusable service
   (e.g. `services/masteryService.ts`) — both `ProgressPage` and the
   category detail screen (`CategoryPage.tsx`) should read from it, not
   duplicate the math.
2. Map the score to the four tiers from the spec (0–39 Necesitas
   practicar / 40–69 En progreso / 70–89 Buen nivel / 90–100 Dominado),
   with the thresholds as named constants (not magic numbers) so they're
   easy to tune later.
3. Build **"¿Estoy preparado?"**: a readiness score combining recent
   accuracy, category mastery, recent exam results/consistency, and mistake
   count, mapped to the four bands in the original spec (§13). Make the
   copy explicit that this is a Roady-internal estimate, not a guarantee of
   passing the real exam. Surface it somewhere visible (Home dashboard
   and/or Progress page).

## PHASE C — Configurable exam + real exam history

1. `EXAM_CONFIG` in `services/examService.ts` is currently hardcoded
   (30 questions / 30 min / max 3 errors). Keep those as the default
   "Simulacro"/"Examen real" presets (they correctly mirror the real DGT
   format — don't lose that), but make question count, time limit, pass
   threshold, and category scope parameters `generateExam()` accepts,
   so a future "custom exam" mode is just a different set of arguments,
   not a rewrite.
2. Build **"Mis exámenes"**: a real attempt-history screen — list of past
   attempts (date, score, pass/fail), best score, average score, pass
   rate, and a simple evolution view. The data already exists in
   `exam_attempts`/`exam_answers` with RLS in place; this is a read + UI
   task, not a schema task. `ProgressPage.tsx` currently only shows
   aggregate counts (`examsTaken`/`examsPassed`) — this is the natural
   place to link out from, or its own route (e.g. `/exams`).

## PHASE D — Daily missions

Doesn't exist. The current "Reto diario" (`DailyChallengePage.tsx`) is
just an adaptive 5-question practice session, not a mission-tracking
system.

1. New tables (new migration file): `daily_missions` (catalog: id,
   description, target metric, target amount) and `user_daily_missions`
   (user_id, mission_id, day, progress, completed_at) — RLS: owner-only,
   written only via a `SECURITY DEFINER` function that increments progress
   from real events (answering questions, completing a lesson, practicing
   mistakes, reaching an XP threshold that day), never from a client-sent
   "mark complete."
2. Missions reset daily; guard against creating duplicate rows for the
   same user/day (unique constraint on `(user_id, mission_id, day)`).
3. Surface today's missions on the Home dashboard and/or a dedicated
   section, with progress bars, wired to the completion animations already
   used elsewhere in the app.

## PHASE E — Friends system (the largest missing piece)

Nothing here exists yet: no `friendships` table, no `friend_code`, no
`/friends` route, no search, no friend profile, no leaderboard, no privacy
settings. This is the bulk of §19–24 of the original brief. Key
constraints carried over from that brief, restated because they're easy to
get wrong:

- **No global leaderboard, ever.** Ranking is friends-only (current user +
  accepted friends).
- **Never expose the Supabase `auth.users` UUID as a public identifier.**
  Generate a short public `friend_code` (e.g. `Roady-8K4P2`) at profile
  creation time (extend `fn_handle_new_user`, the trigger that already
  creates the `profiles` row on signup) — unique, human-readable, safe to
  display, distinct from any internal id.
- **Never expose email addresses through search or a friend's profile.**

Suggested breakdown:

1. **Schema** (new migration): add `friend_code` (unique, generated) to
   `profiles`; add `friendships` (requester_id, addressee_id, status:
   pending/accepted/rejected/blocked, timestamps) with RLS so a row is only
   visible/writable by its two participants, and functions
   (`fn_send_friend_request`, `fn_respond_friend_request`,
   `fn_remove_friend`) that enforce valid state transitions server-side
   (e.g. can't accept a request that isn't addressed to you, can't
   friend-request yourself, no duplicate pending requests both directions).
2. **Search**: a function or view that lets a user search by display name
   or friend_code and returns only what's safe to show publicly (respecting
   the privacy settings from point 5) — paginated, indexed, not a
   `select *` over `profiles`.
3. **`/friends` page**: search bar (name or Roady ID), pending
   incoming/outgoing requests, accepted friends list, remove-friend action.
   Add it to navigation.
4. **Friend profile view**: display name, avatar, level, XP, streak,
   achievements, exam stats, category progress summary — explicitly never
   email, internal ids, per-question history, or exam answers.
5. **Privacy settings**: `profile_visibility` / `search_visibility` on
   `profiles` (sensible default — visible unless the user opts out),
   enforced in the search query and the friend-profile RLS/function, not
   just hidden in the UI.
6. **Weekly friends leaderboard**: rank current user + accepted friends by
   weekly XP. Design the schema so historical weekly rankings *can* be
   kept (e.g. a `weekly_friend_rankings` snapshot table or a
   week-bucketed query over `xp_events`, which already exists and is
   already an append-only ledger) rather than overwriting/deleting when the
   week rolls over.

## PHASE F — Dashboard, navigation, polish

1. Once B/C/D/E exist, extend the Home dashboard to surface: today's
   mission progress, readiness score, weak category, a recent exam result,
   and a small friends-leaderboard preview — without overloading the
   screen (the spec explicitly says prioritize "what should I do now",
   not show everything at once).
2. Consider adding explicit nav entries for Examen/Errores/Amigos (today
   they're reachable one level deeper, under Practicar/Perfil) — evaluate
   against `BottomNav.tsx`'s existing 5-item layout rather than blindly
   adding tabs.
3. Add loading skeletons and empty states for every new screen (friends
   list, exam history, missions) following the existing
   `components/ui/EmptyState.tsx` / `Loading.tsx` patterns — e.g. "Busca a
   tus amigos y empezad a competir", "Tu primer simulacro te espera".

## PHASE G — Image storage architecture

Currently all "images" are hand-drawn SVG (`components/ui/TrafficSign.tsx`)
generated in code — there is no Supabase Storage usage and no image
metadata table. Even without real official imagery to upload yet, prepare
the structure: Storage buckets for question images / traffic-sign images /
educational illustrations / user avatars, with a metadata pattern (already
partially modeled in `QuestionImage` in `types/index.ts` —
`url`/`localPath`/`sourceUrl`/`sourceType`/`license`) extended to reference
Storage paths instead of raw binaries in Postgres. This is scaffolding, not
a content-import task.

## PHASE H — AI tutor abstraction (mock only — no API key, no provider)

Create `services/aiTutorService.ts` with a clean interface (e.g.
`explainQuestion(question)`, `explainMistake(question, selectedOption)`,
`askWhy(question, prompt)`) backed by a placeholder/mock implementation
that returns canned or template-based text. No OpenAI/Anthropic/Gemini
integration, no API key anywhere in the repo. The rest of the app should
depend on this interface, not a concrete provider, so wiring in a real
model later is a one-file change.

---

## After each phase, report back with

Files created / files modified / migrations created / RLS policies added /
what was tested (`tsc -b`, `npm run build`, manual browser pass) / any
manual Supabase dashboard step still required / limitations or follow-ups.
