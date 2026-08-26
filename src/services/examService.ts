import type { ExamAnswer, ExamResult, Question, UserProgress } from '../types';
import { ALL_QUESTIONS } from '../data/questions';
import { shuffle, shuffleQuestionOptions } from '../utils/shuffle';
import { pickQuestionsAdaptive } from './questionService';

/**
 * Mirrors the DGT theoretical exam format for permiso B: 30 questions, 3
 * options each, 30 minutes, pass with at most 3 errors (>= 27/30 correct).
 * See src/data/sources.ts for where this format is documented.
 */
export const EXAM_CONFIG = {
  questionCount: 30,
  durationSeconds: 30 * 60,
  maxErrorsToPass: 3,
} as const;

/**
 * Generates a new exam, favoring weak/overdue questions but staying random
 * enough to avoid repeating the previous exam's set. Fulfils the
 * "getExamQuestions" role from the content spec's questionService API —
 * kept here (not in questionService.ts) purely to avoid a circular import,
 * since this module already depends on questionService for weighted picks.
 */
export function generateExam(progress: UserProgress): Question[] {
  const lastExam = progress.examResults[progress.examResults.length - 1];
  const lastQuestionIds = new Set(lastExam?.answers.map((a) => a.questionId) ?? []);

  const pool = ALL_QUESTIONS.filter((q) => !lastQuestionIds.has(q.id));
  const usablePool = pool.length >= EXAM_CONFIG.questionCount ? pool : ALL_QUESTIONS;

  const adaptive = pickQuestionsAdaptive(progress, Math.ceil(EXAM_CONFIG.questionCount * 0.6));
  const adaptiveIds = new Set(adaptive.map((q) => q.id));
  const fillerPool = usablePool.filter((q) => !adaptiveIds.has(q.id));
  const filler = shuffle(fillerPool)
    .slice(0, EXAM_CONFIG.questionCount - adaptive.length)
    .map(shuffleQuestionOptions);

  return shuffle([...adaptive, ...filler]).slice(0, EXAM_CONFIG.questionCount);
}

export function gradeExam(
  mode: ExamResult['mode'],
  questions: Question[],
  selectedOptionIds: (string | null)[],
  startedAt: string,
  durationSeconds: number,
): ExamResult {
  const answers: ExamAnswer[] = questions.map((question, i) => ({
    questionId: question.id,
    selectedOptionId: selectedOptionIds[i] ?? null,
    correct: selectedOptionIds[i] === question.correctOptionId,
  }));

  const correctCount = answers.filter((a) => a.correct).length;
  const totalCount = questions.length;
  const passed = totalCount - correctCount <= EXAM_CONFIG.maxErrorsToPass;

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
