import { useMemo } from 'react';
import { CATEGORIES } from '../data/categories';
import { getLessonsForCategory } from '../data/lessons';
import { useProgressStore } from '../store/progressStore';
import type { Category } from '../types';

export type ModuleStatus = 'locked' | 'active' | 'done';

export interface ModuleInfo {
  category: Category;
  status: ModuleStatus;
  completedLessons: number;
  totalLessons: number;
  pctComplete: number;
}

export function isCategoryDone(categoryId: string, completedLessonIds: string[]): boolean {
  const lessons = getLessonsForCategory(categoryId);
  return lessons.length > 0 && lessons.every((l) => completedLessonIds.includes(l.id));
}

/** Computes the lock/active/done status for every category in the learning path. */
export function useLearnPath(): ModuleInfo[] {
  const progress = useProgressStore((s) => s.progress);

  return useMemo(() => {
    let previousDone = true;
    return CATEGORIES.map((category): ModuleInfo => {
      const lessons = getLessonsForCategory(category.id);
      const completedLessons = lessons.filter((l) => progress.completedLessonIds.includes(l.id)).length;
      const done = lessons.length > 0 && completedLessons === lessons.length;
      const explicitlyUnlocked = progress.unlockedCategoryIds.includes(category.id);
      const unlocked = explicitlyUnlocked || previousDone;
      const status: ModuleStatus = done ? 'done' : unlocked ? 'active' : 'locked';
      previousDone = done;
      return {
        category,
        status,
        completedLessons,
        totalLessons: lessons.length,
        pctComplete: lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0,
      };
    });
  }, [progress.completedLessonIds, progress.unlockedCategoryIds]);
}

export function useOverallProgressPct(): number {
  const modules = useLearnPath();
  if (modules.length === 0) return 0;
  const total = modules.reduce((sum, m) => sum + m.pctComplete, 0);
  return Math.round(total / modules.length);
}
