import { useMemo } from 'react';
import { getLessonsForCategory } from '../data/lessons';
import { useProgressStore } from '../store/progressStore';
import type { Lesson } from '../types';

export type LessonNodeStatus = 'done' | 'active' | 'locked';

export interface LessonNode {
  lesson: Lesson;
  status: LessonNodeStatus;
}

/** Same sequential-unlock rule CategoryPage already uses for its list — reused here so the two never drift apart. */
export function useCategoryLessons(categoryId: string | undefined): LessonNode[] {
  const completedLessonIds = useProgressStore((s) => s.progress.completedLessonIds);

  return useMemo(() => {
    if (!categoryId) return [];
    const lessons = getLessonsForCategory(categoryId);
    let previousDone = true;
    return lessons.map((lesson): LessonNode => {
      const done = completedLessonIds.includes(lesson.id);
      const unlocked = previousDone;
      const status: LessonNodeStatus = done ? 'done' : unlocked ? 'active' : 'locked';
      previousDone = done;
      return { lesson, status };
    });
  }, [categoryId, completedLessonIds]);
}
