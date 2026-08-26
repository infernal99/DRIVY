/**
 * Importer for github.com/alvarolozano/dgt-test-downloader.
 *
 * RESEARCH FINDINGS (see CONTENT_SOURCES['github-dgt-test-downloader'] in
 * src/data/sources.ts and CONTENT-LICENSES.md for the full writeup):
 *   - The tool works by reverse-engineering (its own README's word) the DGT's
 *     sede electrónica test tool. Its own README says it has been
 *     UNMAINTAINED since the DGT changed that site in May 2025.
 *   - Its CC BY-NC-SA 4.0 license covers the scraper CODE, not the DGT
 *     content it extracts — the DGT itself publishes no reuse license for
 *     that content.
 *
 * Consequently this script does NOT run the scraper or fetch anything from
 * the DGT on your behalf. What it DOES do: let an admin who has already
 * obtained a personal export (e.g. from manually using the DGT's own free
 * test tool for their own study) import it locally. Everything imported
 * this way is tagged `needs_review` and lands in
 * content/imports/dgt-test-downloader/staged/ — never merged into the app's
 * live content automatically.
 *
 * Expected input format (JSON array), one object per question:
 *   { "question": "...", "options": ["...", "...", "..."], "correctIndex": 0,
 *     "category"?: "...", "imageUrl"?: "..." }
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Question } from '../src/types';
import { createLogger } from './lib/logger';
import { computeContentHash } from '../src/data/questions/helpers';
import { isMainEntry } from './lib/isMainEntry';

const here = path.dirname(fileURLToPath(import.meta.url));
const STAGED_DIR = path.resolve(here, '../content/imports/dgt-test-downloader/staged');
const log = createLogger('import-dgt-test-downloader');

interface RawExportItem {
  question: string;
  options: string[];
  correctIndex: number;
  category?: string;
  imageUrl?: string;
}

const REPO_URL = 'https://github.com/alvarolozano/dgt-test-downloader';

export function importFromLocalExport(filePath: string): { imported: number; outputPath: string } {
  if (!existsSync(filePath)) {
    throw new Error(`No such file: ${filePath}. This importer never fetches from the network — see the file header.`);
  }

  const raw: RawExportItem[] = JSON.parse(readFileSync(filePath, 'utf8'));
  const now = new Date().toISOString();

  const staged: Question[] = raw.map((item, i) => {
    const id = `NEEDSREVIEW-DGTDL-${String(i + 1).padStart(5, '0')}`;
    const options = item.options.map((text, oi) => ({ id: `${id}-${oi}`, text }));
    return {
      id,
      question: item.question,
      options,
      correctOptionId: options[item.correctIndex]?.id ?? options[0].id,
      categoryId: item.category ?? 'sin-clasificar',
      subcategoryId: item.category ?? 'sin-clasificar',
      difficulty: 'medium',
      tags: ['import:dgt-test-downloader'],
      source: {
        type: 'needs_review',
        name: 'Importado localmente vía dgt-test-downloader (origen DGT sin licencia de reutilización confirmada)',
        repository: REPO_URL,
        license: 'CC BY-NC-SA 4.0 (cubre el script, no el contenido)',
        verified: false,
      },
      image: item.imageUrl ? { url: item.imageUrl, alt: '', sourceType: 'needs_review' } : undefined,
      contentHash: computeContentHash(item.question, item.options),
      createdAt: now,
      updatedAt: now,
    };
  });

  mkdirSync(STAGED_DIR, { recursive: true });
  const outputPath = path.join(STAGED_DIR, `import-${Date.now()}.json`);
  writeFileSync(outputPath, JSON.stringify(staged, null, 2));
  log.info(`staged ${staged.length} needs_review question(s) from ${filePath} → ${outputPath}`);
  log.warn('These are NOT merged into src/data/questions automatically. A human must review each one before promotion.');

  return { imported: staged.length, outputPath };
}

if (isMainEntry(import.meta.url)) {
  const inputPath = process.argv[2];
  if (!inputPath) {
    log.info('Usage: tsx scripts/import-dgt-test-downloader.ts <path-to-local-export.json>');
    log.info(`No network fetching is performed by design — see this file's header comment. Reference: ${REPO_URL}`);
    process.exit(0);
  }
  importFromLocalExport(inputPath);
}
