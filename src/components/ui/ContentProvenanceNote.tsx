import type { QuestionSource } from '../../types';

// Copy per section 23/24 of the content spec: never claim official DGT
// authorship for content we wrote ourselves, and never bury the distinction.
const COPY: Record<QuestionSource['type'], string> = {
  official: 'Contenido oficial de la DGT.',
  derived: 'Elaborada por Roady a partir de normativa oficial de la DGT.',
  practice: 'Pregunta creada por Roady para practicar — no es contenido oficial.',
  needs_review: 'Procedencia pendiente de revisión — no se presenta como contenido oficial.',
};

export function ContentProvenanceNote({ source }: { source: QuestionSource }) {
  return (
    <p style={{ fontSize: 11, color: 'var(--color-text-muted-40)', marginTop: 18, textAlign: 'center' }}>
      {COPY[source.type]}
    </p>
  );
}
