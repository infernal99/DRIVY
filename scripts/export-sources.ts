/**
 * Regenerates content/sources/*.json and CONTENT-LICENSES.md from
 * src/data/sources.ts — that file is the single source of truth (see its
 * header comment); never hand-edit the generated files below.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTENT_SOURCES, type ContentSource } from '../src/data/sources';
import { createLogger } from './lib/logger';
import { isMainEntry } from './lib/isMainEntry';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..');
const log = createLogger('export-sources');

function statusHeading(status: ContentSource['reviewStatus']): string {
  return { cleared: 'CLEARED', needs_review: 'NEEDS_REVIEW', reference_only: 'REFERENCE_ONLY' }[status];
}

function renderSource(s: ContentSource): string {
  const lines = [
    `## ${s.name}`,
    '',
    `- **URL**: ${s.url}`,
    `- **Autor/organización**: ${s.owner}`,
    `- **Licencia**: ${s.license}`,
    `- **Tipo de contenido**: ${s.contentType}`,
    `- **Fecha de comprobación**: ${s.consultedAt}`,
    `- **STATUS**: ${statusHeading(s.reviewStatus)}`,
    `- **Qué podemos reutilizar**: ${s.canReuse.map((x) => `\n  - ${x}`).join('')}`,
    `- **Qué NO podemos reutilizar**: ${s.cannotReuse.map((x) => `\n  - ${x}`).join('')}`,
  ];
  if (s.attribution) lines.push(`- **Atribución requerida**: ${s.attribution}`);
  if (s.notes) lines.push(`- **Notas**: ${s.notes}`);
  return lines.join('\n');
}

export function exportSources() {
  // 1. content/sources/dgt-sources.json — machine-readable mirror.
  const sourcesDir = path.join(ROOT, 'content/sources');
  mkdirSync(sourcesDir, { recursive: true });
  writeFileSync(path.join(sourcesDir, 'dgt-sources.json'), JSON.stringify(CONTENT_SOURCES, null, 2));

  // 2. CONTENT-LICENSES.md — human-readable, grouped by review status.
  const byStatus = {
    cleared: CONTENT_SOURCES.filter((s) => s.reviewStatus === 'cleared'),
    needs_review: CONTENT_SOURCES.filter((s) => s.reviewStatus === 'needs_review'),
    reference_only: CONTENT_SOURCES.filter((s) => s.reviewStatus === 'reference_only'),
  };

  const md = `# CONTENT-LICENSES.md

> **Generated file — do not hand-edit.** Source of truth is
> \`src/data/sources.ts\`; regenerate with \`npm run content:sources\`
> (part of \`npm run content:update\`).

This documents, for every source Roady's content pipeline has looked at,
what we can and cannot reuse from it — per the content spec's rule: "no
asumir que 'público en internet' significa 'libre para reutilizar'".

## Fuentes base del contenido (CLEARED)

Contenido \`derived\` puede citar estas fuentes.

${byStatus.cleared.map(renderSource).join('\n\n')}

## Fuentes pendientes de revisión (NEEDS_REVIEW)

Nada de aquí se usa como base de contenido \`official\` ni \`derived\`. Ver
\`scripts/import-*.ts\` para cómo (no) se importan.

${byStatus.needs_review.map(renderSource).join('\n\n')}

## Fuentes de referencia únicamente (REFERENCE_ONLY)

Solo para detectar temas que podríamos estar pasando por alto (prioridad 4
del content spec) — nunca como fuente de contenido.

${byStatus.reference_only.map(renderSource).join('\n\n')}
`;

  writeFileSync(path.join(ROOT, 'CONTENT-LICENSES.md'), md);
  log.info(`wrote content/sources/dgt-sources.json and CONTENT-LICENSES.md (${CONTENT_SOURCES.length} sources)`);

  return { total: CONTENT_SOURCES.length };
}

if (isMainEntry(import.meta.url)) {
  exportSources();
}
