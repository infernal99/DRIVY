import type { Difficulty, Question, QuestionSource, QuestionSourceType, VerificationStatus } from '../../types';
import { sha256Hex } from '../../utils/sha256';
import { getSignById } from '../signs';

// Default provenance for this file's authored content: written by us,
// grounded in a cited official DGT page. That's the `derived` category in
// our taxonomy (see types/index.ts) — never `official` (we have no verbatim
// DGT exam bank to redistribute) and more specific than generic `practice`
// (every question here cites a real DGT source, see each file's SRC const).
const DEFAULT_SOURCE_TYPE: QuestionSourceType = 'derived';
const DEFAULT_SOURCE_NAME = 'Roady (elaborado a partir de fuentes oficiales DGT)';
// DGT's informational pages are public but publish no explicit reuse
// license (see src/data/sources.ts) — documenting that plainly here beats
// leaving `license` empty, which the validator would otherwise (correctly,
// but noisily) flag on every single question as "needs review".
const DEFAULT_LICENSE = 'unknown (contenido institucional público; sin licencia de reutilización explícita)';
const AUTHORED_AT = '2026-08-25';

interface QuestionInput {
  /**
   * Stable, human-assigned id (e.g. "SEN-PEL-01"). Never reuse or reassign an
   * id once shipped — user progress (mistakes, stats) is keyed by it.
   */
  id: string;
  categoryId: string;
  subcategoryId: string;
  question: string;
  /** Index into `options` of the correct answer — authoring convenience only; converted to correctOptionId. */
  options: [string, string, string] | [string, string];
  correctAnswer: number;
  explanation: string;
  difficulty?: Difficulty;
  tags?: string[];
  /** `sign:<key>` to use one of our own TrafficSign illustrations, or a real image path/URL once cleared for reuse. */
  image?: string;
  imageAlt?: string;
  sourceUrl?: string;
  source?: string;
  sourceType?: QuestionSourceType;
  license?: string;
  signCatalogVersion?: '2015' | '2025';
  /** Article-level citation once a specific BOE article has actually been located and read. */
  legalReference?: string;
  /**
   * Content-audit status (see VerificationStatus in types/index.ts). Defaults
   * to 'needs_review' — deliberately NOT inherited from `source.verified`,
   * which every question gets set to `true` automatically unless its
   * sourceType is `needs_review` (see below) and is not a real per-question
   * human audit signal. Only set this explicitly once a human has actually
   * checked this specific question against a primary source.
   */
  verificationStatus?: VerificationStatus;
  /**
   * Date a human/audit actually re-checked this question against a primary
   * source (ISO yyyy-mm-dd). Defaults to the file's original authoring date
   * — set this explicitly when auditing an existing question so it's
   * distinguishable from "never re-checked since it was written".
   */
  lastVerifiedAt?: string;
}

function normalizeForHash(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^\w\s]/g, '') // strip punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

/** Content fingerprint used for cross-source deduplication — see scripts/lib/dedupe.ts. */
export function computeContentHash(question: string, optionTexts: string[]): string {
  const normalized = [normalizeForHash(question), ...optionTexts.map(normalizeForHash).sort()].join('|');
  return sha256Hex(normalized);
}

/** Builds a fully-formed Question from a stable, explicit id. */
export function q(input: QuestionInput): Question {
  const id = input.id;
  const options = input.options.map((text, i) => ({ id: `${id}-${i}`, text }));
  const correctOptionId = options[input.correctAnswer]?.id;
  if (!correctOptionId) {
    throw new Error(`Roady content: question ${id} has correctAnswer index out of range`);
  }

  const source: QuestionSource = {
    type: input.sourceType ?? DEFAULT_SOURCE_TYPE,
    name: input.source ?? DEFAULT_SOURCE_NAME,
    url: input.sourceUrl,
    license: input.license ?? DEFAULT_LICENSE,
    verified: (input.sourceType ?? DEFAULT_SOURCE_TYPE) !== 'needs_review',
    legalReference: input.legalReference,
  };

  const isSign = input.image?.startsWith('sign:') ?? false;
  const isDiagram = input.image?.startsWith('diagram:') ?? false;
  const signKey = isSign ? input.image!.slice('sign:'.length) : undefined;
  const diagramKey = isDiagram ? input.image!.slice('diagram:'.length) : undefined;
  const fallbackAlt = signKey
    ? `Señal: ${getSignById(signKey)?.name ?? signKey}`
    : diagramKey
      ? `Diagrama: ${diagramKey.replace(/-/g, ' ')}`
      : '';

  const image = input.image
    ? {
        signKey,
        diagramKey,
        url: isSign || isDiagram ? undefined : input.image,
        alt: input.imageAlt ?? fallbackAlt,
        sourceUrl: input.sourceUrl,
        imageType: isSign ? ('traffic_sign' as const) : isDiagram ? ('diagram' as const) : undefined,
        sourceType: isSign || isDiagram ? ('derived' as const) : (input.sourceType ?? DEFAULT_SOURCE_TYPE),
      }
    : undefined;

  return {
    id,
    question: input.question,
    image,
    options,
    correctOptionId,
    explanation: input.explanation,
    categoryId: input.categoryId,
    subcategoryId: input.subcategoryId,
    difficulty: input.difficulty ?? 'medium',
    source,
    tags: input.tags ?? [],
    contentHash: computeContentHash(input.question, input.options),
    createdAt: AUTHORED_AT,
    updatedAt: AUTHORED_AT,
    lastVerifiedAt: input.lastVerifiedAt ?? AUTHORED_AT,
    signCatalogVersion: input.signCatalogVersion,
    verificationStatus: input.verificationStatus ?? 'needs_review',
  };
}
