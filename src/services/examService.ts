import type { ExamAnswer, ExamResult, Question, UserProgress } from '../types';
import { ALL_QUESTIONS } from '../data/questions';
import { shuffle, shuffleQuestionOptions } from '../utils/shuffle';
import { pickQuestionsAdaptiveFrom } from './questionService';

export interface ExamOptions {
  questionCount: number;
  durationSeconds: number;
  maxErrorsToPass: number;
  /** Restricts the question pool to these categories. Omit/empty = whole bank. */
  categoryIds?: string[];
}

/**
 * Mirrors the DGT theoretical exam format for permiso B: 30 questions, 3
 * options each, 30 minutes, pass with at most 3 errors (>= 27/30 correct).
 * See src/data/sources.ts for where this format is documented. Both the
 * "Simulacro" and "Examen real" modes use this same shape today — `mode`
 * only changes the copy/labeling, not the format — but every function below
 * takes an `ExamOptions` (defaulting to this), so a future custom-exam mode
 * (different question count/time/pass bar/category scope) is just a
 * different options object, not a rewrite of generation or grading.
 */
export const EXAM_CONFIG: ExamOptions = {
  questionCount: 30,
  durationSeconds: 30 * 60,
  maxErrorsToPass: 3,
};

/**
 * Generates a new exam, favoring weak/overdue questions but staying random
 * enough to avoid repeating the previous exam's set. Fulfils the
 * "getExamQuestions" role from the content spec's questionService API —
 * kept here (not in questionService.ts) purely to avoid a circular import,
 * since this module already depends on questionService for weighted picks.
 */
export function generateExam(progress: UserProgress, options: ExamOptions = EXAM_CONFIG): Question[] {
  const pool =
    options.categoryIds && options.categoryIds.length > 0
      ? ALL_QUESTIONS.filter((q) => options.categoryIds!.includes(q.categoryId))
      : ALL_QUESTIONS;

  if (pool.length === 0) return [];

  const lastExam = progress.examResults[progress.examResults.length - 1];
  const lastQuestionIds = new Set(lastExam?.answers.map((a) => a.questionId) ?? []);

  const avoidRepeatPool = pool.filter((q) => !lastQuestionIds.has(q.id));
  const usablePool = avoidRepeatPool.length >= options.questionCount ? avoidRepeatPool : pool;

  const adaptive = pickQuestionsAdaptiveFrom(progress, pool, Math.ceil(options.questionCount * 0.6));
  const adaptiveIds = new Set(adaptive.map((q) => q.id));
  const fillerPool = usablePool.filter((q) => !adaptiveIds.has(q.id));
  const filler = shuffle(fillerPool)
    .slice(0, options.questionCount - adaptive.length)
    .map(shuffleQuestionOptions);

  return shuffle([...adaptive, ...filler]).slice(0, options.questionCount);
}

export function gradeExam(
  mode: ExamResult['mode'],
  questions: Question[],
  selectedOptionIds: (string | null)[],
  startedAt: string,
  durationSeconds: number,
  maxErrorsToPass: number = EXAM_CONFIG.maxErrorsToPass,
): ExamResult {
  const answers: ExamAnswer[] = questions.map((question, i) => ({
    questionId: question.id,
    selectedOptionId: selectedOptionIds[i] ?? null,
    correct: selectedOptionIds[i] === question.correctOptionId,
  }));

  const correctCount = answers.filter((a) => a.correct).length;
  const totalCount = questions.length;
  const passed = totalCount - correctCount <= maxErrorsToPass;

  return {
    id: `exam-${Date.now()}`,
    mode,
    startedAt,
    finishedAt: new Date().toISOString(),
    durationSeconds,
    answers,
    correctCount,
    totalCount,
    passed,
  };
}

// ---------------------------------------------------------------------------
// Exam history — "Mis exámenes" reads this rather than re-deriving the same
// aggregates from progress.examResults itself.
// ---------------------------------------------------------------------------

export interface ExamHistorySummary {
  /** Chronological, oldest first — same order as progress.examResults. */
  attempts: ExamResult[];
  bestScorePct: number;
  averageScorePct: number;
  /** 0-100. */
  passRate: number;
}

function scorePct(result: ExamResult): number {
  return result.totalCount > 0 ? (result.correctCount / result.totalCount) * 100 : 0;
}

export function getExamHistorySummary(progress: UserProgress): ExamHistorySummary {
  const attempts = progress.examResults;
  if (attempts.length === 0) {
    return { attempts, bestScorePct: 0, averageScorePct: 0, passRate: 0 };
  }

  const scores = attempts.map(scorePct);
  const bestScorePct = Math.round(Math.max(...scores));
  const averageScorePct = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
  const passRate = Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100);

  return { attempts, bestScorePct, averageScorePct, passRate };
}
