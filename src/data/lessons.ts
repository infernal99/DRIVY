import type { Lesson } from '../types';
import { CATEGORIES } from './categories';
import { getQuestionsBySubcategory } from './questions';

export function lessonId(categoryId: string, subcategoryId: string): string {
  return `${categoryId}::${subcategoryId}`;
}

/** One lesson per subcategory — the smallest unit of the learning path. */
export function getLessonsForCategory(categoryId: string): Lesson[] {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return [];
  return category.subcategories.map((sub, index) => ({
    id: lessonId(categoryId, sub.id),
    categoryId,
    name: sub.name,
    order: index,
    questionCount: Math.min(10, getQuestionsBySubcategory(sub.id).length || 1),
  }));
}

export const ALL_LESSONS: Lesson[] = CATEGORIES.flatMap((c) => getLessonsForCategory(c.id));
