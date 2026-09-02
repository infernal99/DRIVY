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

/**
 * Computes the lock/active/done status for every category in the learning
 * path. Unlock is decided ONLY from the persisted `unlockedCategoryIds`
 * flag — never by live-recomputing whether the previous category is
 * "currently" fully done. That flag is set once, permanently, the moment a
 * category is actually completed (see progressStore's `completeLesson`),
 * so it reflects the content the user cleared at the time. Recomputing it
 * live against the *current* lesson list used to re-lock every category
 * downstream of the first one that gained a new lesson after a user had
 * already finished it — e.g. adding a subcategory to "señales" retroactively
 * un-completed it, which flipped every later category back to "locked" for
 * anyone who hadn't separately been granted an explicit unlock row.
 */
export function useLearnPath(): ModuleInfo[] {
  const progress = useProgressStore((s) => s.progress);

  return useMemo(() => {
    return CATEGORIES.map((category): ModuleInfo => {
      const lessons = getLessonsForCategory(category.id);
      const completedLessons = lessons.filter((l) => progress.completedLessonIds.includes(l.id)).length;
      const done = lessons.length > 0 && completedLessons === lessons.length;
      const unlocked = progress.unlockedCategoryIds.includes(category.id);
      const status: ModuleStatus = done ? 'done' : unlocked ? 'active' : 'locked';
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
