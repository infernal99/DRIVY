// Core domain types for DRIVY. Keep this file free of UI/React concerns —
// components consume these types but never define them.
//
// Content provenance model (see docs/content-pipeline.md and
// CONTENT-LICENSES.md for the full rationale):
//   official      — verbatim content from a DGT source we have rights to reuse.
//   derived       — written by us, but grounded exclusively in cited official
//                   DGT normativa/material. Most of the current bank is this.
//   practice      — written by us for drilling, not tied to a specific cite.
//   needs_review  — provenance or license is unclear; never shown as DGT
//                   content and never auto-promoted to the other three.
// NEVER label content `official` unless the source itself is verifiably
// reusable — see the research notes in CONTENT-LICENSES.md before changing
// any question's sourceType to `official`.
export type QuestionSourceType = 'official' | 'derived' | 'practice' | 'needs_review';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuestionSource {
  type: QuestionSourceType;
  /** Human readable source name, e.g. "DGT — Manual del permiso B". */
  name: string;
  /** Absolute URL to the resource this content is grounded in, if any. */
  url?: string;
  /** GitHub (or similar) repository this was imported/staged from, if any. */
  repository?: string;
  /** SPDX id or plain-language license description, when known. */
  license?: string;
  /** Required credit line, if the license demands attribution. */
  attribution?: string;
  /** Has a human actually checked this source/content pair? */
  verified: boolean;
}

export interface QuestionImage {
  /** Remote URL the image was sourced from, if it's hosted externally. */
  url?: string;
  /** Path under /public once (and only once) reuse has been cleared. */
  localPath?: string;
  /** Key into the internal <TrafficSign> illustration registry (see
   *  components/ui/TrafficSign.tsx) for our own vector drawings — not a URL. */
  signKey?: string;
  alt: string;
  sourceUrl?: string;
  sourceType: QuestionSourceType;
  license?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  question: string;
  image?: QuestionImage;
  options: QuestionOption[];
  /** id of the correct option — stable across option shuffling, unlike an index. */
  correctOptionId: string;
  explanation?: string;
  /**
   * The explanation's own provenance. Defaults to the question's `source`
   * when omitted (in this bank, the same authoring pass writes both), but
   * can diverge — e.g. an official question with a DRIVY-authored (derived)
   * explanation, which must never be presented as an official explanation.
   */
  explanationSource?: QuestionSource;
  categoryId: string;
  subcategoryId: string;
  difficulty: Difficulty;
  source: QuestionSource;
  tags: string[];
  /** SHA-256 over normalized question+options text — see utils/sha256.ts. Used for deduplication. */
  contentHash?: string;
  createdAt: string;
  updatedAt: string;
  /** Last time a human confirmed this still matches the cited source. */
  lastVerifiedAt?: string;
  /** The 2025 DGT sign catalogue changed some signage — flag affected items. */
  signCatalogVersion?: '2015' | '2025';
}

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  icon: IconName;
  description: string;
  subcategories: Subcategory[];
}

export interface Lesson {
  id: string;
  categoryId: string;
  name: string;
  order: number;
  questionCount: number;
}

export type IconName =
  | 'sign' | 'rules' | 'road' | 'shield' | 'parking' | 'flag'
  | 'home' | 'book' | 'target' | 'chart' | 'user' | 'check'
  | 'lock' | 'flame' | 'settings' | 'help' | 'close' | 'chevronLeft'
  | 'chevronRight' | 'alcohol' | 'car' | 'pedestrian' | 'sources';

/**
 * Internal sign catalogue entry (section 10 of the content spec). `image`
 * intentionally holds a signKey into our own <TrafficSign> registry, not a
 * URL — we have no license to bundle the DGT's official pictogram artwork.
 * See src/data/signs.ts.
 */
export interface TrafficSign {
  id: string;
  /** Official DGT code from the Reglamento General de Circulación catalogue, e.g. "R-1". Omit rather than guess. */
  code?: string;
  name: string;
  category: string;
  image: string;
  source: {
    name: string;
    url: string;
    type: 'official' | 'derived';
  };
  /** ISO date this sign became part of the official catalogue, when known. */
  validFrom?: string;
  /** ISO date this sign was retired/superseded, if applicable. */
  validUntil?: string;
}

// ---------------------------------------------------------------------------
// User progress & attempts
// ---------------------------------------------------------------------------

export interface QuestionStat {
  questionId: string;
  timesSeen: number;
  timesCorrect: number;
  timesWrong: number;
  lastSeenAt: string | null;
  lastResult: 'correct' | 'wrong' | null;
  /** Simple priority weight used by the review algorithm; higher = sooner. */
  dueScore: number;
}

export interface CategoryStat {
  categoryId: string;
  answered: number;
  correct: number;
}

export interface ExamAnswer {
  questionId: string;
  selectedOptionId: string | null;
  correct: boolean;
}

export interface ExamResult {
  id: string;
  mode: 'simulacro' | 'examen-real';
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  answers: ExamAnswer[];
  correctCount: number;
  totalCount: number;
  passed: boolean;
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  check: (stats: UserStats) => boolean;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

export interface UserProgress {
  schemaVersion: number;
  userName: string;
  xp: number;
  streakCount: number;
  bestStreakEver: number;
  lastActivityDate: string | null; // yyyy-mm-dd
  currentCorrectStreak: number;
  bestCorrectStreak: number;
  questionStats: Record<string, QuestionStat>;
  categoryStats: Record<string, CategoryStat>;
  mistakeIds: string[];
  completedLessonIds: string[];
  unlockedCategoryIds: string[];
  achievements: UnlockedAchievement[];
  examResults: ExamResult[];
  createdAt: string;
}

export interface UserStats {
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracyPct: number;
  xp: number;
  level: number;
  streakCount: number;
  bestStreak: number;
  examsTaken: number;
  examsPassed: number;
  categoriesCompleted: number;
  totalCategories: number;
  perfectCategoryCount: number;
  longestCorrectStreak: number;
}

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  totalXpForCurrentLevel: number;
}
