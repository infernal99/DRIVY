/**
 * `npm run content:update` — the single entry point for refreshing Roady's
 * content. Runs: check sources (best-effort) → export source docs → build
 * (normalize/validate/dedupe/classify) → print a human summary.
 *
 * Per content spec §29: if a source can't be reached, we log it and move on
 * with whatever sources are available — we never fail the whole pipeline
 * over one unreachable page.
 */
import { checkDgtSources } from './import-dgt-tests';
import { exportSources } from './export-sources';
import { buildContent } from './build-content';
import { createLogger } from './lib/logger';
import { isMainEntry } from './lib/isMainEntry';

const log = createLogger('content-update');

export async function runContentUpdate() {
  console.log('\nRoady CONTENT UPDATE\n');

  let sourcesChecked = 0;
  try {
    const result = await checkDgtSources();
    sourcesChecked = result.checked;
  } catch (err) {
    log.error(`source check failed, continuing anyway: ${(err as Error).message}`);
  }

  exportSources();
  const report = buildContent();

  console.log(`Sources checked: ${sourcesChecked}`);
  console.log('');
  console.log(`Total questions: ${report.totalQuestions}`);
  console.log(`  Official:      ${report.bySourceType.official}`);
  console.log(`  Derived:       ${report.bySourceType.derived}`);
  console.log(`  Practice:      ${report.bySourceType.practice}`);
  console.log(`  Needs review:  ${report.bySourceType.needs_review}`);
  console.log('');
  console.log(`New questions: ${report.newQuestions}`);
  console.log(`Updated questions: ${report.updatedQuestions}`);
  console.log(`Duplicate groups collapsed: ${report.duplicateGroups}`);
  console.log(`Validation: ${report.validation.clean} clean, ${report.validation.warnings} with warnings, ${report.validation.errors} rejected`);
  console.log('');
  console.log('Build completed.');
  console.log(`Report written to content/metadata/build-report.json`);

  return report;
}

if (isMainEntry(import.meta.url)) {
  runContentUpdate().catch((err) => {
    log.error(`content:update failed: ${(err as Error).stack}`);
    process.exitCode = 1;
  });
}
