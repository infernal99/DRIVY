import type { Difficulty, UserProgress } from '../types';
import { CATEGORIES } from '../data/categories';
import { getQuestionsByCategory } from './questionService';
import { daysSince, todayISO } from '../utils/date';

// This is the ONLY module that computes mastery/readiness scores — pages
// (ProgressPage, CategoryPage, HomePage) read from it rather than
// re-deriving accuracy math themselves, so the definition of "how good are
// you at this category" and "are you ready for the exam" stays in one place.

// ---------------------------------------------------------------------------
// Shared 0-100 tiers. Both a category's mastery score and the overall
// readiness score are plain 0-100 numbers mapped onto the same four bands,
// so they read consistently wherever they're shown.
// ---------------------------------------------------------------------------

const TIER_NEEDS_PRACTICE_MAX = 39;
const TIER_IN_PROGRESS_MAX = 69;
const TIER_GOOD_MAX = 89;
// 90-100 falls through to 'mastered'.

export type TierId = 'needs-practice' | 'in-progress' | 'good' | 'mastered';

export function tierForScore(score: number): TierId {
  if (score <= TIER_NEEDS_PRACTICE_MAX) return 'needs-practice';
  if (score <= TIER_IN_PROGRESS_MAX) return 'in-progress';
  if (score <= TIER_GOOD_MAX) return 'good';
  return 'mastered';
}

export const MASTERY_TIER_COPY: Record<TierId, { label: string; color: string }> = {
  'needs-practice': { label: 'Necesitas practicar', color: 'var(--color-error)' },
  'in-progress': { label: 'En progreso', color: 'var(--color-streak)' },
  good: { label: 'Buen nivel', color: 'var(--color-primary)' },
  mastered: { label: 'Dominado', color: 'var(--color-success)' },
};

export const READINESS_TIER_COPY: Record<TierId, { label: string; color: string }> = {
  'needs-practice': { label: 'No preparado todavía', color: 'var(--color-error)' },
  'in-progress': { label: 'En camino', color: 'var(--color-streak)' },
  good: { label: 'Casi preparado', color: 'var(--color-primary)' },
  mastered: { label: 'Preparado', color: 'var(--color-success)' },
};

/** Always shown next to the readiness score — this is an estimate, not a guarantee. */
export const READINESS_DISCLAIMER =
  'Estimación interna de DRIVY basada en tu actividad. No es una predicción oficial ni garantiza aprobar el examen real de la DGT.';

// ---------------------------------------------------------------------------
// Category mastery: accuracy + coverage (repetition) + recency + difficulty
// + consistency, each 0-100, combined with fixed weights.
// ---------------------------------------------------------------------------

const WEIGHT_ACCURACY = 0.45;
const WEIGHT_COVERAGE = 0.2;
const WEIGHT_RECENCY = 0.15;
const WEIGHT_DIFFICULTY = 0.1;
const WEIGHT_CONSISTENCY = 0.1;

/** Days of inactivity in a category after which its recency component bottoms out at 0. */
const RECENCY_FULL_DECAY_DAYS = 30;

/** Harder questions count for more when scoring how well a user handles a category's difficulty mix. */
const DIFFICULTY_WEIGHTS: Record<Difficulty, number> = { easy: 1, medium: 1.5, hard: 2 };

/** A question counts as "stable" once it's been answered correctly at least twice and wasn't just missed. */
const STABLE_MIN_TIMES_CORRECT = 2;

export interface CategoryMastery {
  categoryId: string;
  score: number;
  tier: TierId;
}

export function getCategoryMastery(progress: UserProgress, categoryId: string): CategoryMastery {
  const questions = getQuestionsByCategory(categoryId);
  const catStat = progress.categoryStats[categoryId];

  if (!catStat || catStat.answered === 0 || questions.length === 0) {
    return { categoryId, score: 0, tier: tierForScore(0) };
  }

  const accuracyScore = (catStat.correct / catStat.answered) * 100;

  let attemptedCount = 0;
  let mostRecentSeenAt: string | null = null;
  let stableCount = 0;
  let weightedTotal = 0;
  let weightedCorrect = 0;

  for (const question of questions) {
    const stat = progress.questionStats[question.id];
    if (!stat || stat.timesSeen === 0) continue;
    attemptedCount += 1;

    if (stat.lastSeenAt && (!mostRecentSeenAt || stat.lastSeenAt > mostRecentSeenAt)) {
      mostRecentSeenAt = stat.lastSeenAt;
    }

    const weight = DIFFICULTY_WEIGHTS[question.difficulty];
    weightedTotal += weight;
    if (stat.lastResult === 'correct') weightedCorrect += weight;

    if (stat.timesCorrect >= STABLE_MIN_TIMES_CORRECT && stat.lastResult === 'correct') stableCount += 1;
  }

  const coverageScore = Math.min(1, attemptedCount / questions.length) * 100;

  const recencyScore = mostRecentSeenAt
    ? Math.max(0, 100 - (daysSince(mostRecentSeenAt.slice(0, 10), todayISO()) * 100) / RECENCY_FULL_DECAY_DAYS)
    : 0;

  const difficultyScore = weightedTotal > 0 ? (weightedCorrect / weightedTotal) * 100 : 0;

  const consistencyScore = attemptedCount > 0 ? (stableCount / attemptedCount) * 100 : 0;

  const raw =
    accuracyScore * WEIGHT_ACCURACY +
    coverageScore * WEIGHT_COVERAGE +
    recencyScore * WEIGHT_RECENCY +
    difficultyScore * WEIGHT_DIFFICULTY +
    consistencyScore * WEIGHT_CONSISTENCY;

  const score = Math.round(Math.max(0, Math.min(100, raw)));
  return { categoryId, score, tier: tierForScore(score) };
}

export function getAllCategoryMastery(progress: UserProgress): CategoryMastery[] {
  return CATEGORIES.map((category) => getCategoryMastery(progress, category.id));
}

// ---------------------------------------------------------------------------
// Readiness ("¿Estoy preparado?"): category mastery + recent accuracy +
// recent exam results + outstanding mistakes, each 0-100, combined with
// fixed weights. Deliberately punishes categories that were never attempted
// (their mastery score is 0) — being "ready" means broad coverage, not one
// strong category.
// ---------------------------------------------------------------------------

const READINESS_WEIGHT_CATEGORY_MASTERY = 0.35;
const READINESS_WEIGHT_RECENT_ACCURACY = 0.25;
const READINESS_WEIGHT_EXAM_RESULTS = 0.25;
const READINESS_WEIGHT_MISTAKES = 0.15;

/** "Recent" activity window for the recent-accuracy component. */
const RECENT_ACTIVITY_WINDOW_DAYS = 14;

/** How many of the most recent exam attempts feed the exam-results component. */
const RECENT_EXAM_COUNT = 3;

export interface ReadinessResult {
  score: number;
  tier: TierId;
}

export function getReadinessScore(progress: UserProgress): ReadinessResult {
  const categoryScores = getAllCategoryMastery(progress);
  const categoryMasteryAvg = categoryScores.length
    ? categoryScores.reduce((sum, c) => sum + c.score, 0) / categoryScores.length
    : 0;

  const allStats = Object.values(progress.questionStats);
  const today = todayISO();
  const recentStats = allStats.filter(
    (stat) => stat.lastSeenAt && daysSince(stat.lastSeenAt.slice(0, 10), today) <= RECENT_ACTIVITY_WINDOW_DAYS,
  );
  // Falls back to all-time stats when there's no recent activity, so a lapsed
  // user still gets a (stale, but non-zero) accuracy read instead of a 0.
  const recentPool = recentStats.length > 0 ? recentStats : allStats;
  const recentAccuracy =
    recentPool.length > 0
      ? (recentPool.filter((stat) => stat.lastResult === 'correct').length / recentPool.length) * 100
      : 0;

  const recentExams = progress.examResults.slice(-RECENT_EXAM_COUNT);
  const examComponent =
    recentExams.length > 0
      ? recentExams.reduce((sum, exam) => sum + (exam.totalCount > 0 ? (exam.correctCount / exam.totalCount) * 100 : 0), 0) /
        recentExams.length
      : 0;

  const attemptedDistinct = allStats.length;
  const mistakeRatio = attemptedDistinct > 0 ? Math.min(1, progress.mistakeIds.length / attemptedDistinct) : 0;
  const mistakeComponent = (1 - mistakeRatio) * 100;

  const raw =
    categoryMasteryAvg * READINESS_WEIGHT_CATEGORY_MASTERY +
    recentAccuracy * READINESS_WEIGHT_RECENT_ACCURACY +
    examComponent * READINESS_WEIGHT_EXAM_RESULTS +
    mistakeComponent * READINESS_WEIGHT_MISTAKES;

  const score = Math.round(Math.max(0, Math.min(100, raw)));
  return { score, tier: tierForScore(score) };
}
