/**
 * Fetcher for the two official DGT pages named in the content spec.
 *
 * IMPORTANT — read before "fixing" this to download questions in bulk:
 * both pages are interactive tools/informational pages, not a downloadable
 * question bank, and neither publishes a reuse license for their content
 * (see CONTENT_SOURCES in src/data/sources.ts, ids `dgt-sede-test-examenes`
 * and the exam-requirements page). This script therefore only checks
 * reachability and writes a report — it does not parse or store any
 * question content from these pages. If DGT ever publishes a licensed,
 * bulk-reusable question export, wire the parsing step in here and flip the
 * matching CONTENT_SOURCES entry to `cleared` first.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchWithPolicy } from './lib/fetchWithPolicy';
import { createLogger } from './lib/logger';

const here = path.dirname(fileURLToPath(import.meta.url));

const log = createLogger('import-dgt-tests');

const TARGETS = [
  {
    id: 'dgt-sede-test-examenes',
    url: 'https://sede.dgt.gob.es/es/permisos-de-conducir/test-de-examenes/',
  },
  {
    id: 'dgt-requisitos-examen',
    url: 'https://www.dgt.es/nuestros-servicios/permisos-de-conducir/obtener-un-nuevo-permiso-de-conducir/requisitos-preparacion-y-presentacion-a-examen/',
  },
];

export async function checkDgtSources() {
  const results: { id: string; url: string; reachable: boolean; status: number }[] = [];

  for (const target of TARGETS) {
    const res = await fetchWithPolicy(target.url);
    results.push({ id: target.id, url: target.url, reachable: res.ok, status: res.status });
    log.info(`${target.id}: reachable=${res.ok} status=${res.status}`);
  }

  const reportDir = path.resolve(here, '../content/sources');
  mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, 'dgt-tests.report.json');
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        results,
        questionsImported: 0,
        reason:
          'Both pages are interactive/informational, not a licensed bulk question export — see CONTENT_SOURCES in src/data/sources.ts. No content extracted.',
      },
      null,
      2,
    ),
  );
  log.info(`report written to ${reportPath}`);

  return { checked: results.length, imported: 0 };
}

import { isMainEntry } from './lib/isMainEntry';

if (isMainEntry(import.meta.url)) {
  checkDgtSources().catch((err) => {
    log.error(`unhandled error: ${(err as Error).stack}`);
    process.exitCode = 1;
  });
}
