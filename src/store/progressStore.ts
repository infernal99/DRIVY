import { create } from 'zustand';
import type { ExamResult, Question, UnlockedAchievement, UserProgress, UserStats } from '../types';
import { progressRepository } from '../services/storage';
import { CATEGORIES } from '../data/categories';
import { getLessonsForCategory } from '../data/lessons';
import {
  completeLesson as completeLessonService,
  computeStats,
  createInitialProgress,
  getWeakPoints,
  migrateProgress,
  recordAnswer as recordAnswerService,
  recordExamResult as recordExamResultService,
  unlockCategory as unlockCategoryService,
  type WeakPoint,
} from '../services/progressService';

function categoryFullyDone(categoryId: string, completedLessonIds: string[]): boolean {
  const lessons = getLessonsForCategory(categoryId);
  return lessons.length > 0 && lessons.every((l) => completedLessonIds.includes(l.id));
}

export interface LastAnswerFeedback {
  question: Question;
  correct: boolean;
  xpGained: number;
}

interface ProgressState {
  progress: UserProgress;
  lastAnswerFeedback: LastAnswerFeedback | null;
  lastUnlockedAchievements: UnlockedAchievement[];
  lastExamResult: ExamResult | null;
  stats: () => UserStats;
  weakPoints: (limit?: number) => WeakPoint[];
  answerQuestion: (question: Question, selectedOptionId: string | null) => boolean;
  completeLesson: (lessonId: string) => void;
  unlockCategory: (categoryId: string) => void;
  submitExam: (result: ExamResult, questions: Question[]) => void;
  clearAnswerFeedback: () => void;
  clearAchievementQueue: () => void;
  resetProgress: () => void;
}

function loadInitial(): UserProgress {
  const stored = progressRepository.load();
  if (!stored) return createInitialProgress();
  return migrateProgress(stored);
}

function persist(progress: UserProgress) {
  progressRepository.save(progress);
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: loadInitial(),
  lastAnswerFeedback: null,
  lastUnlockedAchievements: [],
  lastExamResult: null,

  stats: () => computeStats(get().progress),
  weakPoints: (limit) => getWeakPoints(get().progress, limit),

  answerQuestion: (question, selectedOptionId) => {
    const correct = selectedOptionId === question.correctOptionId;
    const { progress, xpGained, newlyUnlockedAchievements } = recordAnswerService(get().progress, question, correct);
    persist(progress);
    set({
      progress,
      lastAnswerFeedback: { question, correct, xpGained },
      lastUnlockedAchievements: newlyUnlockedAchievements,
    });
    return correct;
  },

  completeLesson: (lessonId) => {
    let progress = completeLessonService(get().progress, lessonId);
    const [categoryId] = lessonId.split('::');
    const categoryIndex = CATEGORIES.findIndex((c) => c.id === categoryId);
    const nextCategory = CATEGORIES[categoryIndex + 1];
    if (nextCategory && categoryFullyDone(categoryId, progress.completedLessonIds)) {
      progress = unlockCategoryService(progress, nextCategory.id);
    }
    persist(progress);
    set({ progress });
  },

  unlockCategory: (categoryId) => {
    const progress = unlockCategoryService(get().progress, categoryId);
    persist(progress);
    set({ progress });
  },

  submitExam: (result, questions) => {
    const { progress, newlyUnlockedAchievements } = recordExamResultService(get().progress, result, questions);
    persist(progress);
    set({ progress, lastExamResult: result, lastUnlockedAchievements: newlyUnlockedAchievements });
  },

  clearAnswerFeedback: () => set({ lastAnswerFeedback: null }),
  clearAchievementQueue: () => set({ lastUnlockedAchievements: [] }),

  resetProgress: () => {
    const fresh = createInitialProgress();
    progressRepository.clear();
    persist(fresh);
    set({ progress: fresh, lastAnswerFeedback: null, lastUnlockedAchievements: [], lastExamResult: null });
  },
}));
