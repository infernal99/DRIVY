import type { Difficulty, Question, QuestionSourceType, UserProgress } from '../types';
import {
  ALL_QUESTIONS,
  getQuestionById,
  getQuestionsByCategory as getQuestionsByCategoryData,
  getQuestionsBySubcategory as getQuestionsBySubcategoryData,
} from '../data/questions';
import { shuffle, shuffleQuestionOptions } from '../utils/shuffle';
import { daysSince, todayISO } from '../utils/date';

// This is the ONLY module the UI should import question content through.
// Pages/components must not import from '../data/questions' directly (see
// docs/content-pipeline.md) — that keeps the selection algorithm, exam
// generation, and any future backend swap invisible to components.

/** Small nudge toward harder questions — new ones surface slightly sooner. */
const DIFFICULTY_INTRO_BONUS: Record<Difficulty, number> = { easy: 0, medium: 4, hard: 9 };

/**
 * Once a question is "mastered" its score gets discounted so it fades out of
 * rotation — but a smaller discount for harder questions means they decay
 * out more slowly than easy ones, so they keep coming back for reinforcement
 * a bit longer even after being answered correctly a few times.
 */
const DIFFICULTY_MASTERY_DISCOUNT: Record<Difficulty, number> = { easy: 25, medium: 20, hard: 12 };

/**
 * Lightweight priority-review algorithm (not full SM-2, but the same spirit):
 * questions get a higher score — and therefore show up sooner — when they've
 * been failed, when they've gone a long time unseen, or when they've never
 * been attempted. Mastered questions (several correct answers, no recent
 * miss) fade out of rotation without disappearing completely. Difficulty
 * factors in on both ends: harder questions get a small priority bump and
 * decay out of rotation more slowly once mastered.
 */
function priorityScore(progress: UserProgress, question: Question): number {
  const stat = progress.questionStats[question.id];
  if (!stat) return 100 + DIFFICULTY_INTRO_BONUS[question.difficulty]; // never seen — high priority to introduce it

  let score = stat.dueScore * 8;

  if (stat.lastResult === 'wrong') score += 40;

  if (stat.lastSeenAt) {
    const days = daysSince(stat.lastSeenAt.slice(0, 10), todayISO());
    score += Math.min(days * 2, 30);
  }

  score += DIFFICULTY_INTRO_BONUS[question.difficulty];

  const mastered = stat.timesCorrect >= 3 && stat.lastResult === 'correct';
  if (mastered) score -= DIFFICULTY_MASTERY_DISCOUNT[question.difficulty];

  return Math.max(score, 1);
}

function weightedSample(progress: UserProgress, pool: Question[], count: number): Question[] {
  const withWeights = pool.map((question) => ({ question, weight: priorityScore(progress, question) }));
  const picked: Question[] = [];
  const remaining = [...withWeights];

  while (picked.length < count && remaining.length > 0) {
    const totalWeight = remaining.reduce((sum, w) => sum + w.weight, 0);
    let roll = Math.random() * totalWeight;
    let idx = 0;
    for (; idx < remaining.length; idx += 1) {
      roll -= remaining[idx].weight;
      if (roll <= 0) break;
    }
    const chosen = remaining.splice(Math.min(idx, remaining.length - 1), 1)[0];
    picked.push(shuffleQuestionOptions(chosen.question));
  }

  return picked;
}

// ---------------------------------------------------------------------------
// Direct lookups (re-exported so components never reach into data/questions)
// ---------------------------------------------------------------------------

export { getQuestionById as getQuestion };

export interface QuestionFilter {
  categoryId?: string;
  subcategoryId?: string;
  sourceType?: QuestionSourceType;
  tag?: string;
}

/** Generic filtered lookup — the `getQuestions()` from the content spec's API. */
export function getQuestions(filter: QuestionFilter = {}): Question[] {
  return ALL_QUESTIONS.filter((q) => {
    if (filter.categoryId && q.categoryId !== filter.categoryId) return false;
    if (filter.subcategoryId && q.subcategoryId !== filter.subcategoryId) return false;
    if (filter.sourceType && q.source.type !== filter.sourceType) return false;
    if (filter.tag && !q.tags.includes(filter.tag)) return false;
    return true;
  });
}

export function getQuestionsByCategory(categoryId: string): Question[] {
  return getQuestionsByCategoryData(categoryId);
}

export function getQuestionsBySubcategory(subcategoryId: string): Question[] {
  return getQuestionsBySubcategoryData(subcategoryId);
}

export function getRandomQuestion(): Question | undefined {
  return shuffle(ALL_QUESTIONS)[0];
}

/** Full-text search over question/option text and tags, optionally scoped by filter. */
export function searchQuestions(query: string, filter: QuestionFilter = {}): Question[] {
  const needle = query.trim().toLowerCase();
  const pool = getQuestions(filter);
  if (!needle) return pool;
  return pool.filter((q) => {
    const haystack = [q.question, ...q.options.map((o) => o.text), ...q.tags, q.id].join(' ').toLowerCase();
    return haystack.includes(needle);
  });
}

// ---------------------------------------------------------------------------
// Selection modes (random / practice / review / exam / category)
// ---------------------------------------------------------------------------

/** Picks the next `count` questions for a lesson/category practice session. */
export function pickQuestionsForCategory(progress: UserProgress, categoryId: string, count: number): Question[] {
  return weightedSample(progress, getQuestionsByCategoryData(categoryId), count);
}

/** Picks questions for a single lesson (one subcategory). Uses the whole pool — lessons are short. */
export function pickQuestionsForSubcategory(progress: UserProgress, subcategoryId: string, count: number): Question[] {
  return weightedSample(progress, getQuestionsBySubcategoryData(subcategoryId), count);
}

/** Picks `count` questions across the whole bank, prioritizing weak spots — the "practice" mode. */
export function pickQuestionsAdaptive(progress: UserProgress, count: number): Question[] {
  return weightedSample(progress, ALL_QUESTIONS, count);
}

/**
 * Same weighted selection as `pickQuestionsAdaptive`, but over a caller-given
 * pool instead of the whole bank — lets exam generation (see examService.ts)
 * reuse the adaptive algorithm when an exam is scoped to specific categories.
 */
export function pickQuestionsAdaptiveFrom(progress: UserProgress, pool: Question[], count: number): Question[] {
  return weightedSample(progress, pool, count);
}

/** "review" mode — only questions currently in the user's mistake list. */
export function pickMistakeReview(progress: UserProgress, count?: number): Question[] {
  const pool = ALL_QUESTIONS.filter((q) => progress.mistakeIds.includes(q.id));
  const shuffled = shuffle(pool).map(shuffleQuestionOptions);
  return count ? shuffled.slice(0, count) : shuffled;
}

/** Alias matching the content spec's `getQuestionsToReview` / `getWrongQuestions` naming. */
export const getQuestionsToReview = pickMistakeReview;
export const getWrongQuestions = pickMistakeReview;

/** A short daily challenge — adaptive, small, meant to be finished quickly. */
export function pickDailyChallenge(progress: UserProgress, count = 5): Question[] {
  return pickQuestionsAdaptive(progress, count);
}

/** "random" mode — no weighting at all. */
export function pickRandomReview(count = 10): Question[] {
  return shuffle(ALL_QUESTIONS).slice(0, count).map(shuffleQuestionOptions);
}
