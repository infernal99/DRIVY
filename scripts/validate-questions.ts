/** Validates every question currently in src/data/questions against the content spec's §16 rules. */
import { ALL_QUESTIONS } from '../src/data/questions';
import { validateAll, formatValidationResult } from './lib/validate';
import { createLogger } from './lib/logger';
import { isMainEntry } from './lib/isMainEntry';

const log = createLogger('validate-questions');

export function runValidation() {
  const results = validateAll(ALL_QUESTIONS);
  const errors = results.filter((r) => !r.ok);
  const warningsOnly = results.filter((r) => r.ok && r.issues.length > 0);

  for (const r of results) {
    if (r.issues.length > 0) log.info(formatValidationResult(r));
  }

  log.info(
    `${results.length} question(s) checked — ${results.length - errors.length - warningsOnly.length} clean, ` +
      `${warningsOnly.length} with warnings, ${errors.length} with errors`,
  );

  return { total: results.length, errors, warningsOnly };
}

if (isMainEntry(import.meta.url)) {
  const { errors } = runValidation();
  process.exitCode = errors.length > 0 ? 1 : 0;
}
