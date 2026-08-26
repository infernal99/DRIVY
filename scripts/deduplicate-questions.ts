/** Reports duplicate content within src/data/questions (a sanity check — our own bank should never collide). */
import { ALL_QUESTIONS } from '../src/data/questions';
import { dedupeQuestions } from './lib/dedupe';
import { createLogger } from './lib/logger';
import { isMainEntry } from './lib/isMainEntry';

const log = createLogger('deduplicate-questions');

export function runDedupe() {
  const { unique, duplicateGroups } = dedupeQuestions(ALL_QUESTIONS);

  for (const group of duplicateGroups) {
    log.warn(`duplicate content: kept ${group.keptId}, dropped ${group.droppedIds.join(', ')} (hash ${group.contentHash.slice(0, 12)}…)`);
  }

  log.info(`${ALL_QUESTIONS.length} question(s) checked — ${unique.length} unique, ${duplicateGroups.length} duplicate group(s)`);

  return { total: ALL_QUESTIONS.length, unique: unique.length, duplicateGroups };
}

if (isMainEntry(import.meta.url)) {
  runDedupe();
}
