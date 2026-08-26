import type { Question } from '../../src/types';

export interface ValidationIssue {
  level: 'error' | 'warning';
  code: string;
  message: string;
}

export interface ValidationResult {
  questionId: string;
  ok: boolean;
  issues: ValidationIssue[];
}

/**
 * Content spec §16. A question with any `error`-level issue must not enter
 * `official`/`derived` content; `warning`-level issues (e.g. an unclear
 * license) should downgrade it to `needs_review` rather than block it
 * outright, since not every warning is fatal.
 */
export function validateQuestion(q: Question): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!q.question || q.question.trim().length === 0) {
    issues.push({ level: 'error', code: 'empty_question', message: 'Missing question text' });
  }

  if (!q.options || q.options.length < 2) {
    issues.push({ level: 'error', code: 'too_few_options', message: 'Fewer than 2 options' });
  }

  const optionTexts = (q.options ?? []).map((o) => o.text.trim().toLowerCase());
  const uniqueOptionTexts = new Set(optionTexts);
  if (uniqueOptionTexts.size !== optionTexts.length) {
    issues.push({ level: 'error', code: 'duplicate_options', message: 'Duplicate option text' });
  }
  if (optionTexts.some((t) => t.length === 0)) {
    issues.push({ level: 'error', code: 'empty_option', message: 'An option has empty text' });
  }

  if (!q.correctOptionId || !q.options?.some((o) => o.id === q.correctOptionId)) {
    issues.push({ level: 'error', code: 'missing_correct_answer', message: 'correctOptionId is missing or does not match any option' });
  }

  if (!q.source) {
    issues.push({ level: 'error', code: 'missing_source', message: 'Missing source' });
  } else {
    if (q.source.type !== 'practice' && !q.source.url) {
      issues.push({ level: 'error', code: 'missing_source_url', message: `sourceType "${q.source.type}" requires a source URL` });
    }
    if ((q.source.type === 'official' || q.source.type === 'derived') && !q.source.license) {
      issues.push({ level: 'warning', code: 'license_needs_review', message: `sourceType "${q.source.type}" has no documented license` });
    }
    if (q.source.type === 'official' && !q.source.verified) {
      issues.push({ level: 'error', code: 'unverified_official', message: 'Marked official but not verified — must be needs_review instead' });
    }
  }

  if (q.image) {
    const hasProvenance = Boolean(q.image.signKey || q.image.sourceUrl || q.image.license);
    if (!hasProvenance) {
      issues.push({ level: 'error', code: 'image_missing_provenance', message: 'Image has no signKey, sourceUrl, or license' });
    }
    if (!q.image.alt) {
      issues.push({ level: 'warning', code: 'image_missing_alt', message: 'Image has no alt text (accessibility)' });
    }
  }

  if (!q.categoryId || !q.subcategoryId) {
    issues.push({ level: 'error', code: 'missing_category', message: 'Missing category/subcategory' });
  }

  const ok = !issues.some((i) => i.level === 'error');
  return { questionId: q.id, ok, issues };
}

export function validateAll(questions: Question[]): ValidationResult[] {
  return questions.map(validateQuestion);
}

export function formatValidationResult(result: ValidationResult): string {
  if (result.issues.length === 0) return `✅ ${result.questionId}`;
  const lines = result.issues.map((i) => `${i.level === 'error' ? '❌' : '⚠️'} ${result.questionId}: ${i.message}`);
  return lines.join('\n');
}
