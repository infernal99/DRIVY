import type { Question } from '../../src/types';

export interface DedupeGroup {
  contentHash: string;
  keptId: string;
  droppedIds: string[];
}

export interface DedupeResult {
  unique: Question[];
  duplicateGroups: DedupeGroup[];
}

/**
 * Groups questions by `contentHash` (SHA-256 over normalized question+options
 * text — see src/data/questions/helpers.ts). When multiple sources produced
 * the same question, keeps one and records the rest as duplicates rather
 * than silently dropping the fact that other sources also had it (content
 * spec §8: "mantener una única pregunta y almacenar varias referencias de
 * fuente cuando sea apropiado" — the dropped ids remain in the report so a
 * human can go add a second source reference to the kept item if useful).
 */
export function dedupeQuestions(questions: Question[]): DedupeResult {
  const byHash = new Map<string, Question[]>();
  for (const q of questions) {
    const hash = q.contentHash ?? q.id; // no hash → treat as its own unique bucket
    const bucket = byHash.get(hash) ?? [];
    bucket.push(q);
    byHash.set(hash, bucket);
  }

  const unique: Question[] = [];
  const duplicateGroups: DedupeGroup[] = [];

  for (const [hash, bucket] of byHash) {
    unique.push(bucket[0]);
    if (bucket.length > 1) {
      duplicateGroups.push({
        contentHash: hash,
        keptId: bucket[0].id,
        droppedIds: bucket.slice(1).map((q) => q.id),
      });
    }
  }

  return { unique, duplicateGroups };
}
