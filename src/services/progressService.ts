import type {
  CategoryStat,
  ExamResult,
  Question,
  QuestionStat,
  UnlockedAchievement,
  UserProgress,
  UserStats,
} from '../types';
import { CATEGORIES } from '../data/categories';
import { ACHIEVEMENTS } from '../data/achievements';
import { getLevelInfo, XP_REWARDS } from '../utils/xp';
import { isConsecutiveDay, todayISO } from '../utils/date';

const SCHEMA_VERSION = 1;

export function createInitialProgress(userName = 'Alex'): UserProgress {
  return {
    schemaVersion: SCHEMA_VERSION,
    userName,
    xp: 0,
    streakCount: 0,
    bestStreakEver: 0,
    lastActivityDate: null,
    currentCorrectStreak: 0,
    bestCorrectStreak: 0,
    questionStats: {},
    categoryStats: {},
    mistakeIds: [],
    completedLessonIds: [],
    unlockedCategoryIds: [CATEGORIES[0]?.id].filter(Boolean) as string[],
    achievements: [],
    examResults: [],
    createdAt: new Date().toISOString(),
  };
}

/** Migrates progress loaded from storage forward if the schema changed. */
export function migrateProgress(progress: UserProgress): UserProgress {
  if (progress.schemaVersion === SCHEMA_VERSION) return progress;
  // No migrations defined yet — future schema bumps add steps here.
  return { ...progress, schemaVersion: SCHEMA_VERSION };
}

function touchStreak(progress: UserProgress): Pick<UserProgress, 'streakCount' | 'bestStreakEver' | 'lastActivityDate'> {
  const today = todayISO();
  if (progress.lastActivityDate === today) {
    return { streakCount: progress.streakCount, bestStreakEver: progress.bestStreakEver, lastActivityDate: today };
  }
  const continued = progress.lastActivityDate ? isConsecutiveDay(progress.lastActivityDate, today) : false;
  const streakCount = continued ? progress.streakCount + 1 : 1;
  return {
    streakCount,
    bestStreakEver: Math.max(progress.bestStreakEver, streakCount),
    lastActivityDate: today,
  };
}

export interface AnswerResult {
  progress: UserProgress;
  xpGained: number;
  newlyUnlockedAchievements: UnlockedAchievement[];
}

/**
 * Pure per-question bookkeeping shared by lessons/practice and exams: updates
 * the question's stat record, its category's stat record, and the mistake
 * list. Deliberately does not touch xp/streak — callers decide how (and
 * whether) to award XP for the surrounding activity.
 */
function applyQuestionOutcome(
  progress: UserProgress,
  question: Question,
  correct: boolean,
): Pick<UserProgress, 'questionStats' | 'categoryStats' | 'mistakeIds' | 'currentCorrectStreak' | 'bestCorrectStreak'> {
  const now = new Date().toISOString();
  const prevStat: QuestionStat = progress.questionStats[question.id] ?? {
    questionId: question.id,
    timesSeen: 0,
    timesCorrect: 0,
    timesWrong: 0,
    lastSeenAt: null,
    lastResult: null,
    dueScore: 0,
  };

  const nextStat: QuestionStat = {
    ...prevStat,
    timesSeen: prevStat.timesSeen + 1,
    timesCorrect: prevStat.timesCorrect + (correct ? 1 : 0),
    timesWrong: prevStat.timesWrong + (correct ? 0 : 1),
    lastSeenAt: now,
    lastResult: correct ? 'correct' : 'wrong',
    dueScore: correct ? Math.max(0, prevStat.dueScore - 2) : prevStat.dueScore + 3,
  };

  const prevCatStat: CategoryStat = progress.categoryStats[question.categoryId] ?? {
    categoryId: question.categoryId,
    answered: 0,
    correct: 0,
  };
  const nextCatStat: CategoryStat = {
    ...prevCatStat,
    answered: prevCatStat.answered + 1,
    correct: prevCatStat.correct + (correct ? 1 : 0),
  };

  const mistakeIds = correct
    ? progress.mistakeIds.filter((id) => id !== question.id)
    : progress.mistakeIds.includes(question.id)
      ? progress.mistakeIds
      : [...progress.mistakeIds, question.id];

  const currentCorrectStreak = correct ? progress.currentCorrectStreak + 1 : 0;

  return {
    questionStats: { ...progress.questionStats, [question.id]: nextStat },
    categoryStats: { ...progress.categoryStats, [question.categoryId]: nextCatStat },
    mistakeIds,
    currentCorrectStreak,
    bestCorrectStreak: Math.max(progress.bestCorrectStreak, currentCorrectStreak),
  };
}

/** Records the outcome of answering one question and returns updated progress. */
export function recordAnswer(progress: UserProgress, question: Question, correct: boolean): AnswerResult {
  const outcome = applyQuestionOutcome(progress, question, correct);
  const xpGained = correct ? XP_REWARDS.correctAnswer : XP_REWARDS.wrongAnswer;
  const streakInfo = touchStreak(progress);

  const updated: UserProgress = {
    ...progress,
    xp: progress.xp + xpGained,
    ...streakInfo,
    ...outcome,
  };

  const stats = computeStats(updated);
  const { progress: withAchievements, newlyUnlocked } = applyAchievements(updated, stats);

  return { progress: withAchievements, xpGained, newlyUnlockedAchievements: newlyUnlocked };
}

export interface RecordExamResultOutput {
  progress: UserProgress;
  xpGained: number;
  newlyUnlockedAchievements: UnlockedAchievement[];
}

/**
 * Appends an exam result, folds every answered question into the same
 * per-question/category stats and mistake list that lessons use (so exam
 * attempts count toward accuracy, weak points and "Mis errores" too), awards
 * the exam XP bonus, and re-checks achievements.
 */
export function recordExamResult(progress: UserProgress, result: ExamResult, questions: Question[]): RecordExamResultOutput {
  const questionById = new Map(questions.map((q) => [q.id, q]));

  let rolling = progress;
  for (const answer of result.answers) {
    const question = questionById.get(answer.questionId);
    if (!question) continue;
    const outcome = applyQuestionOutcome(rolling, question, answer.correct);
    rolling = { ...rolling, ...outcome };
  }

  const xpGained = result.passed ? XP_REWARDS.examPassed : XP_REWARDS.examFailed;
  const streakInfo = touchStreak(progress);

  const updated: UserProgress = {
    ...rolling,
    xp: progress.xp + xpGained,
    ...streakInfo,
    examResults: [...progress.examResults, result],
  };

  const stats = computeStats(updated);
  const { progress: withAchievements, newlyUnlocked } = applyAchievements(updated, stats);

  return { progress: withAchievements, xpGained, newlyUnlockedAchievements: newlyUnlocked };
}

export function completeLesson(progress: UserProgress, lessonId: string): UserProgress {
  if (progress.completedLessonIds.includes(lessonId)) return progress;
  return {
    ...progress,
    xp: progress.xp + XP_REWARDS.lessonComplete,
    completedLessonIds: [...progress.completedLessonIds, lessonId],
  };
}

export function unlockCategory(progress: UserProgress, categoryId: string): UserProgress {
  if (progress.unlockedCategoryIds.includes(categoryId)) return progress;
  return { ...progress, unlockedCategoryIds: [...progress.unlockedCategoryIds, categoryId] };
}

function applyAchievements(
  progress: UserProgress,
  stats: UserStats,
): { progress: UserProgress; newlyUnlocked: UnlockedAchievement[] } {
  const unlockedIds = new Set(progress.achievements.map((a) => a.id));
  const newlyUnlocked: UnlockedAchievement[] = [];

  for (const def of ACHIEVEMENTS) {
    if (unlockedIds.has(def.id)) continue;
    if (def.check(stats)) {
      newlyUnlocked.push({ id: def.id, unlockedAt: new Date().toISOString() });
    }
  }

  if (newlyUnlocked.length === 0) return { progress, newlyUnlocked };

  return {
    progress: { ...progress, achievements: [...progress.achievements, ...newlyUnlocked] },
    newlyUnlocked,
  };
}

export function computeStats(progress: UserProgress): UserStats {
  const questionsAnswered = Object.values(progress.questionStats).reduce((sum, s) => sum + s.timesSeen, 0);
  const correctAnswers = Object.values(progress.questionStats).reduce((sum, s) => sum + s.timesCorrect, 0);
  const wrongAnswers = Object.values(progress.questionStats).reduce((sum, s) => sum + s.timesWrong, 0);
  const accuracyPct = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
  const { level } = getLevelInfo(progress.xp);

  const examsTaken = progress.examResults.length;
  const examsPassed = progress.examResults.filter((r) => r.passed).length;

  const perfectCategoryCount = Object.values(progress.categoryStats).filter(
    (c) => c.answered >= 5 && c.correct === c.answered,
  ).length;

  return {
    questionsAnswered,
    correctAnswers,
    wrongAnswers,
    accuracyPct,
    xp: progress.xp,
    level,
    streakCount: progress.streakCount,
    bestStreak: progress.bestStreakEver,
    examsTaken,
    examsPassed,
    categoriesCompleted: Object.values(progress.categoryStats).filter((c) => c.answered >= 10).length,
    totalCategories: CATEGORIES.length,
    perfectCategoryCount,
    longestCorrectStreak: progress.bestCorrectStreak,
  };
}

export interface WeakPoint {
  categoryId: string;
  name: string;
  accuracyPct: number;
}

/** Categories with the lowest accuracy among those the user has actually practiced. */
export function getWeakPoints(progress: UserProgress, limit = 3): WeakPoint[] {
  return Object.values(progress.categoryStats)
    .filter((c) => c.answered >= 3)
    .map((c) => ({
      categoryId: c.categoryId,
      name: CATEGORIES.find((cat) => cat.id === c.categoryId)?.name ?? c.categoryId,
      accuracyPct: Math.round((c.correct / c.answered) * 100),
    }))
    .sort((a, b) => a.accuracyPct - b.accuracyPct)
    .slice(0, limit);
}
