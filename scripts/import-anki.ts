/**
 * Importer for github.com/donmerendolo/anki-carnet-conducir.
 *
 * RESEARCH FINDINGS (see CONTENT_SOURCES['github-anki-carnet-conducir'] in
 * src/data/sources.ts and CONTENT-LICENSES.md):
 *   - The repo declares GPL-3.0 for its code, but documents no separate
 *     license for the deck content (questions/answers) or the images, which
 *     are hosted externally via an ad-hoc link.
 *   - No attribution or chain of custody is given for where the ~2,890
 *     questions actually originate.
 * That means we have no basis to treat this content as reusable, official,
 * or even reliably `derived` — everything from here is `needs_review` by
 * construction and is never auto-merged into the app.
 *
 * This script does not fetch the deck or its images itself. `.apkg` files
 * are a zipped SQLite database; rather than pull in a SQLite/zip dependency
 * for a source we don't intend to bulk-import anyway, this importer expects
 * an admin to have exported the deck to plain text first (Anki → File →
 * Export → "Notes in Plain Text (.txt)", tab-separated: front, back, and
 * optionally a category column) and points it at that file.
 *
 * Expected input format: tab-separated values, one row per card:
 *   front<TAB>back<TAB>category(optional)
 * `front` is treated as the question; `back` as the explanation/answer text
 * (free text — there's no structured options/correctIndex in this deck
 * format, so these are staged as open notes for manual review, not as
 * ready-made multiple-choice questions).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLogger } from './lib/logger';
import { sha256Hex } from '../src/utils/sha256';
import { isMainEntry } from './lib/isMainEntry';

const here = path.dirname(fileURLToPath(import.meta.url));
const STAGED_DIR = path.resolve(here, '../content/imports/anki-carnet-conducir/staged');
const log = createLogger('import-anki');

const REPO_URL = 'https://github.com/donmerendolo/anki-carnet-conducir';

export interface StagedNote {
  id: string;
  front: string;
  back: string;
  category?: string;
  source: {
    type: 'needs_review';
    name: string;
    repository: string;
    license: string;
    verified: false;
  };
  contentHash: string;
  createdAt: string;
}

export function importFromPlainTextExport(filePath: string): { imported: number; outputPath: string } {
  if (!existsSync(filePath)) {
    throw new Error(`No such file: ${filePath}. This importer never fetches the deck automatically — see the file header.`);
  }

  const now = new Date().toISOString();
  const lines = readFileSync(filePath, 'utf8').split('\n').filter((l) => l.trim().length > 0);

  const staged: StagedNote[] = lines.map((line, i) => {
    const [front = '', back = '', category] = line.split('\t');
    return {
      id: `NEEDSREVIEW-ANKI-${String(i + 1).padStart(5, '0')}`,
      front: front.trim(),
      back: back.trim(),
      category,
      source: {
        type: 'needs_review',
        name: 'Importado localmente desde anki-carnet-conducir (procedencia del contenido no documentada)',
        repository: REPO_URL,
        license: 'unknown (GPL-3.0 declarada solo para el código)',
        verified: false,
      },
      contentHash: sha256Hex(`${front.trim().toLowerCase()}|${back.trim().toLowerCase()}`),
      createdAt: now,
    };
  });

  mkdirSync(STAGED_DIR, { recursive: true });
  const outputPath = path.join(STAGED_DIR, `import-${Date.now()}.json`);
  writeFileSync(outputPath, JSON.stringify(staged, null, 2));
  log.info(`staged ${staged.length} needs_review note(s) from ${filePath} → ${outputPath}`);
  log.warn(
    'These are open front/back notes, not multiple-choice questions, and are NOT merged into src/data/questions automatically. ' +
      'A human must rewrite each one as a proper Question (with our own distractor options) and re-verify against an official DGT source before it could ever be `derived` — never `official`.',
  );

  return { imported: staged.length, outputPath };
}

if (isMainEntry(import.meta.url)) {
  const inputPath = process.argv[2];
  if (!inputPath) {
    log.info('Usage: tsx scripts/import-anki.ts <path-to-anki-plaintext-export.txt>');
    log.info(`No network fetching is performed by design — see this file's header comment. Reference: ${REPO_URL}`);
    process.exit(0);
  }
  importFromPlainTextExport(inputPath);
}
