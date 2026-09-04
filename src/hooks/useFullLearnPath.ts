import { useMemo } from 'react';
import { CATEGORIES } from '../data/categories';
import { getLessonsForCategory } from '../data/lessons';
import { useProgressStore } from '../store/progressStore';
import type { Category, Lesson } from '../types';

export type FullPathLessonStatus = 'done' | 'active' | 'locked';

export interface FullPathLesson {
  lesson: Lesson;
  category: Category;
  status: FullPathLessonStatus;
  /** True for the first lesson of its category — HomePage uses this to insert a unit banner. */
  isFirstOfCategory: boolean;
  /** True for the last lesson of its category — HomePage uses this to insert the "Simulacro" exam node. */
  isLastOfCategory: boolean;
}

/**
 * Flattens every lesson of every category into ONE sequential list — the
 * whole course as a single long path, Duolingo-style, instead of one
 * category "swapped out" for the next when you finish it. Unlock is purely
 * sequential across the whole course: a lesson is reachable only once the
 * one right before it (regardless of category) is done. This subsumes the
 * old per-category `unlockedCategoryIds` gate for path-rendering purposes —
 * that flag still exists in progress data for other features, but the path
 * itself now derives everything live from `completedLessonIds`.
 */
export function useFullLearnPath(): FullPathLesson[] {
  const completedLessonIds = useProgressStore((s) => s.progress.completedLessonIds);

  return useMemo(() => {
    let previousDone = true;
    const result: FullPathLesson[] = [];
    for (const category of CATEGORIES) {
      const lessons = getLessonsForCategory(category.id);
      lessons.forEach((lesson, i) => {
        const done = completedLessonIds.includes(lesson.id);
        const unlocked = previousDone;
        const status: FullPathLessonStatus = done ? 'done' : unlocked ? 'active' : 'locked';
        result.push({
          lesson,
          category,
          status,
          isFirstOfCategory: i === 0,
          isLastOfCategory: i === lessons.length - 1,
        });
        previousDone = done;
      });
    }
    return result;
  }, [completedLessonIds]);
}
