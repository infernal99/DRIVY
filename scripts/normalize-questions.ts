/**
 * Normalizes whitespace/typography in staged import files (content/imports/
 * *staged/*.json) in place. Our own authored content in src/data/questions
 * doesn't need this step — it's written by hand in the shape we want.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLogger } from './lib/logger';
import { isMainEntry } from './lib/isMainEntry';

const here = path.dirname(fileURLToPath(import.meta.url));
const IMPORTS_DIR = path.resolve(here, '../content/imports');
const log = createLogger('normalize-questions');

function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/ /g, ' ') // non-breaking space
    .trim();
}

function normalizeValue(value: unknown): unknown {
  if (typeof value === 'string') return normalizeText(value);
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, normalizeValue(v)]));
  }
  return value;
}

function findStagedFiles(dir: string): string[] {
  let results: string[] = [];
  let entries: import('node:fs').Dirent[];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(findStagedFiles(full));
    else if (entry.name.endsWith('.json')) results.push(full);
  }
  return results;
}

export function normalizeStagedImports(): { filesNormalized: number } {
  const files = findStagedFiles(IMPORTS_DIR);
  for (const file of files) {
    const data = JSON.parse(readFileSync(file, 'utf8'));
    writeFileSync(file, JSON.stringify(normalizeValue(data), null, 2));
    log.info(`normalized ${path.relative(IMPORTS_DIR, file)}`);
  }
  return { filesNormalized: files.length };
}

if (isMainEntry(import.meta.url)) {
  const { filesNormalized } = normalizeStagedImports();
  log.info(`done — ${filesNormalized} staged file(s) normalized`);
}
