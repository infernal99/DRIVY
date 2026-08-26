import type { Question, QuestionSourceType } from '../types';
import { ALL_QUESTIONS } from '../data/questions';
import { CATEGORIES } from '../data/categories';

// Backs the dev-only admin content dashboard (pages/AdminContentPage.tsx).
// Deliberately separate from services/storage.ts / progressStore: this is
// content-curation metadata, not user progress, and has no bearing on what
// a learner's app state looks like.

export interface ContentStats {
  total: number;
  bySourceType: Record<QuestionSourceType, number>;
  byCategory: { categoryId: string; categoryName: string; count: number }[];
  withImages: number;
  needsReviewCount: number;
  duplicateGroups: number;
}

export function getContentStats(): ContentStats {
  const bySourceType: Record<QuestionSourceType, number> = { official: 0, derived: 0, practice: 0, needs_review: 0 };
  let withImages = 0;

  for (const q of ALL_QUESTIONS) {
    bySourceType[q.source.type] += 1;
    if (q.image) withImages += 1;
  }

  const byCategory = CATEGORIES.map((c) => ({
    categoryId: c.id,
    categoryName: c.name,
    count: ALL_QUESTIONS.filter((q) => q.categoryId === c.id).length,
  }));

  return {
    total: ALL_QUESTIONS.length,
    bySourceType,
    byCategory,
    withImages,
    needsReviewCount: bySourceType.needs_review,
    duplicateGroups: findDuplicateGroups().length,
  };
}

export interface DuplicateGroup {
  contentHash: string;
  questionIds: string[];
}

/** Same grouping logic as scripts/lib/dedupe.ts, kept local so the browser bundle doesn't reach outside src/. */
export function findDuplicateGroups(): DuplicateGroup[] {
  const byHash = new Map<string, string[]>();
  for (const q of ALL_QUESTIONS) {
    if (!q.contentHash) continue;
    const bucket = byHash.get(q.contentHash) ?? [];
    bucket.push(q.id);
    byHash.set(q.contentHash, bucket);
  }
  return [...byHash.entries()].filter(([, ids]) => ids.length > 1).map(([contentHash, questionIds]) => ({ contentHash, questionIds }));
}

export interface ContentFilter {
  query?: string;
  categoryId?: string;
  sourceType?: QuestionSourceType | 'all';
}

export function filterContent(filter: ContentFilter): Question[] {
  const needle = filter.query?.trim().toLowerCase();
  return ALL_QUESTIONS.filter((q) => {
    if (filter.categoryId && filter.categoryId !== 'all' && q.categoryId !== filter.categoryId) return false;
    if (filter.sourceType && filter.sourceType !== 'all' && q.source.type !== filter.sourceType) return false;
    if (needle) {
      const haystack = [q.id, q.question, ...q.options.map((o) => o.text), ...q.tags].join(' ').toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

// --- Local-only admin review annotations (not part of user progress) -------

export type AdminReviewState = 'reviewed' | 'needs_review';

interface AdminReviewRecord {
  state: AdminReviewState;
  note?: string;
  reviewedAt: string;
}

const STORAGE_KEY = 'drivy.admin.review.v1';

function loadReviewLog(): Record<string, AdminReviewRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveReviewLog(log: Record<string, AdminReviewRecord>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch {
    // best-effort — this is curation convenience, not user data.
  }
}

export function getReviewState(questionId: string): AdminReviewRecord | undefined {
  return loadReviewLog()[questionId];
}

export function setReviewState(questionId: string, state: AdminReviewState, note?: string) {
  const log = loadReviewLog();
  log[questionId] = { state, note, reviewedAt: new Date().toISOString() };
  saveReviewLog(log);
}

export function clearReviewState(questionId: string) {
  const log = loadReviewLog();
  delete log[questionId];
  saveReviewLog(log);
}
