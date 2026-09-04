// Core domain types for Roady. Keep this file free of UI/React concerns —
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

/**
 * Content-audit status (2026-09 content quality initiative — see
 * docs/content-pipeline.md). Distinct from `QuestionSourceType`, which
 * describes WHERE content came from; this describes WHETHER a human has
 * actually checked it against a primary source (DGT/BOE) and found it
 * currently accurate:
 *   official                 — verbatim DGT exam content we have rights to.
 *   verified                 — a human checked this question/sign against a
 *                               primary source and confirmed it's accurate.
 *   needs_review              — not yet checked, or checked and unclear.
 *                               This is the honest default for anything not
 *                               explicitly verified — never infer "verified"
 *                               from the mere presence of a sourceUrl.
 *   outdated                  — was accurate once; the underlying norm changed.
 *   invalid                   — wrong, ambiguous, or otherwise unusable.
 *   original_based_on_official — our own wording, but grounded in and
 *                               checked against a cited official norm.
 * Optional and additive: existing content without this field is simply
 * unaudited, not incorrect — never backfill it with a guess.
 */
export type VerificationStatus =
  | 'official'
  | 'verified'
  | 'needs_review'
  | 'outdated'
  | 'invalid'
  | 'original_based_on_official';

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
  /**
   * Article-level citation, e.g. "Reglamento General de Circulación (RD
   * 1428/2003), Art. 21". More specific than `url` (which may just point at
   * a general DGT informational page) — set this once a specific BOE
   * article has actually been located and read, not guessed.
   */
  legalReference?: string;
}

/**
 * What kind of image this is, for display/labeling purposes — e.g. so the UI
 * (or a future admin tool) can show "ilustración educativa" instead of
 * silently presenting a Roady-made drawing as if it were DGT artwork.
 *   none                   — no image.
 *   official               — verbatim DGT/official artwork we have rights to.
 *   traffic_sign           — one of our own <TrafficSign> SVG drawings.
 *   educational_illustration — a Roady-made illustration of a traffic
 *                             situation (not a real photo, not official art).
 *   diagram                — a schematic (lane layout, priority diagram, etc).
 * Optional/additive: infer nothing from its absence — check `signKey`/`url`
 * directly for existing content that predates this field.
 */
export type ImageType = 'none' | 'official' | 'traffic_sign' | 'educational_illustration' | 'diagram';

export interface QuestionImage {
  /** Remote URL the image was sourced from, if it's hosted externally. */
  url?: string;
  /** Path under /public once (and only once) reuse has been cleared. */
  localPath?: string;
  /** Key into the internal <TrafficSign> illustration registry (see
   *  components/ui/TrafficSign.tsx) for our own vector drawings — not a URL. */
  signKey?: string;
  /** Key into the <SituationDiagram> registry (see
   *  components/ui/SituationDiagram.tsx) for an original educational
   *  diagram — road markings, traffic-light states, officer hand signals.
   *  Distinct from `signKey`: these aren't catalogued signs with a code. */
  diagramKey?: string;
  /** See `ImageType`. Optional — omitted on content that predates this field. */
  imageType?: ImageType;
  /**
   * Path within the `question-images` Supabase Storage bucket (see
   * src/services/storageService.ts) — not used by any content yet. An
   * alternative to `url`/`localPath` for once real uploaded imagery exists;
   * resolve it with `getPublicImageUrl('question-images', storagePath)`.
   */
  storagePath?: string;
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
   * can diverge — e.g. an official question with a Roady-authored (derived)
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
  /** See `VerificationStatus`. Absent means "not yet audited" — treat the
   *  same as `needs_review` for display purposes, never as "verified". */
  verificationStatus?: VerificationStatus;
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
  | 'chevronRight' | 'alcohol' | 'car' | 'pedestrian' | 'sources' | 'users'
  | 'download' | 'crown'
  | 'mail' | 'eye' | 'eyeOff' | 'arrowRight' | 'bolt'
  | 'motorcycle' | 'truck' | 'bus' | 'clock' | 'share';

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
  /** See `VerificationStatus`. Absent means "not yet audited". */
  verificationStatus?: VerificationStatus;
  /** Article-level citation once a specific BOE article has been located. */
  legalReference?: string;
  /** Last time a human confirmed this sign's code/name/meaning against a primary source. */
  lastVerifiedAt?: string;
  /** False for a sign retired/superseded by the 2025 catalogue update — defaults to true when absent. */
  active?: boolean;
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
  perfectExamCount: number;
}

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  totalXpForCurrentLevel: number;
}
