/**
 * Orchestrates: load → normalize (staged imports) → validate → dedupe →
 * classify/consistency-check → write generated snapshot + report. This is
 * the "Question Database" step of the content spec's pipeline diagram.
 *
 * The app itself reads Question objects straight from src/data/questions at
 * runtime (see that folder's index.ts) — the JSON this writes to
 * content/questions/generated/ and content/metadata/ is a build artifact for
 * transparency/tooling (e.g. the admin dashboard), not something the React
 * app imports.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_QUESTIONS } from '../src/data/questions';
import { CATEGORIES } from '../src/data/categories';
import type { Question, QuestionSourceType } from '../src/types';
import { validateAll } from './lib/validate';
import { dedupeQuestions } from './lib/dedupe';
import { normalizeStagedImports } from './normalize-questions';
import { createLogger } from './lib/logger';
import { isMainEntry } from './lib/isMainEntry';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..');
const GENERATED_DIR = path.join(ROOT, 'content/questions/generated');
const METADATA_DIR = path.join(ROOT, 'content/metadata');
const HASHES_PATH = path.join(METADATA_DIR, 'content-hashes.json');
const REPORT_PATH = path.join(METADATA_DIR, 'build-report.json');

const log = createLogger('build-content');

export interface BuildReport {
  builtAt: string;
  totalQuestions: number;
  bySourceType: Record<QuestionSourceType, number>;
  byCategory: Record<string, number>;
  validation: { clean: number; warnings: number; errors: number };
  duplicateGroups: number;
  newQuestions: number;
  updatedQuestions: number;
  needsReview: number;
}

function loadPreviousHashes(): Record<string, string> {
  if (!existsSync(HASHES_PATH)) return {};
  try {
    return JSON.parse(readFileSync(HASHES_PATH, 'utf8'));
  } catch {
    return {};
  }
}

export function buildContent(): BuildReport {
  normalizeStagedImports();

  const validation = validateAll(ALL_QUESTIONS);
  const errors = validation.filter((r) => !r.ok);
  const warningsOnly = validation.filter((r) => r.ok && r.issues.length > 0);
  for (const r of errors) {
    log.error(`invalid question kept out of the build: ${r.questionId} — ${r.issues.map((i) => i.message).join('; ')}`);
  }

  const validQuestions = ALL_QUESTIONS.filter((q) => !errors.some((e) => e.questionId === q.id));
  const { unique, duplicateGroups } = dedupeQuestions(validQuestions);
  for (const group of duplicateGroups) {
    log.warn(`duplicate dropped from build: ${group.droppedIds.join(', ')} (kept ${group.keptId})`);
  }

  const previousHashes = loadPreviousHashes();
  let newQuestions = 0;
  let updatedQuestions = 0;
  const currentHashes: Record<string, string> = {};
  for (const q of unique) {
    currentHashes[q.id] = q.contentHash ?? '';
    const prevHash = previousHashes[q.id];
    if (prevHash === undefined) newQuestions += 1;
    else if (prevHash !== q.contentHash) updatedQuestions += 1;
  }

  // Write per-category generated snapshots.
  mkdirSync(GENERATED_DIR, { recursive: true });
  const byCategory: Record<string, Question[]> = {};
  for (const q of unique) {
    (byCategory[q.categoryId] ??= []).push(q);
  }
  for (const category of CATEGORIES) {
    writeFileSync(
      path.join(GENERATED_DIR, `${category.id}.json`),
      JSON.stringify(byCategory[category.id] ?? [], null, 2),
    );
  }

  const bySourceType: Record<QuestionSourceType, number> = { official: 0, derived: 0, practice: 0, needs_review: 0 };
  for (const q of unique) bySourceType[q.source.type] += 1;

  const report: BuildReport = {
    builtAt: new Date().toISOString(),
    totalQuestions: unique.length,
    bySourceType,
    byCategory: Object.fromEntries(CATEGORIES.map((c) => [c.id, (byCategory[c.id] ?? []).length])),
    validation: { clean: unique.length - warningsOnly.length, warnings: warningsOnly.length, errors: errors.length },
    duplicateGroups: duplicateGroups.length,
    newQuestions,
    updatedQuestions,
    needsReview: bySourceType.needs_review,
  };

  mkdirSync(METADATA_DIR, { recursive: true });
  writeFileSync(HASHES_PATH, JSON.stringify(currentHashes, null, 2));
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  log.info(`build complete: ${report.totalQuestions} questions, ${report.needsReview} needs_review, ${errors.length} rejected`);
  return report;
}

if (isMainEntry(import.meta.url)) {
  buildContent();
}
