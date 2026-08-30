import { CONTENT_SOURCES, type ContentSource, type SourceReviewStatus } from '../data/sources';
import { AppShell } from '../components/layout/AppShell';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { Card } from '../components/ui/Card';
import { Pill } from '../components/ui/Pill';

const STATUS_LABEL: Record<SourceReviewStatus, string> = {
  cleared: 'Base de contenido oficial',
  needs_review: 'Pendiente de revisión legal',
  reference_only: 'Solo referencia',
};

const STATUS_COLOR: Record<SourceReviewStatus, { bg: string; color: string }> = {
  cleared: { bg: 'var(--color-success-bg)', color: 'var(--color-success)' },
  needs_review: { bg: 'var(--color-error-bg)', color: 'var(--color-error)' },
  reference_only: { bg: 'var(--color-bg-locked)', color: 'var(--color-text-muted-50)' },
};

export function SourcesPage() {
  const cleared = CONTENT_SOURCES.filter((s) => s.reviewStatus === 'cleared');
  const other = CONTENT_SOURCES.filter((s) => s.reviewStatus !== 'cleared');

  return (
    <AppShell>
      <ScreenHeader title="Fuentes oficiales" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 30px' }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted-60)', lineHeight: 1.55, margin: '0 0 8px' }}>
          Roady no es una aplicación oficial de la DGT ni garantiza exámenes oficiales. Practica el teórico del permiso
          B con contenido basado en fuentes oficiales de la DGT: cada pregunta indica su procedencia exacta.
        </p>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted-60)', lineHeight: 1.55, margin: '0 0 18px' }}>
          Ninguna pregunta se presenta como pregunta oficial de examen salvo que su fuente lo permita explícitamente
          (ver <strong>tipo</strong> en cada pregunta: oficial, elaborada o práctica).
        </p>

        <SectionTitle>Fuentes que fundamentan el contenido</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
          {cleared.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>

        <SectionTitle>Fuentes de referencia (no usadas como base directa)</SectionTitle>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted-50)', lineHeight: 1.5, margin: '0 0 12px' }}>
          Las analizamos para no perdernos temas o cambios normativos, pero no copiamos su contenido: su licencia o
          procedencia no está lo bastante clara para reutilizarlo.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {other.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)', margin: '4px 0 12px' }}>
      {children}
    </div>
  );
}

function SourceCard({ source }: { source: ContentSource }) {
  const statusColor = STATUS_COLOR[source.reviewStatus];
  return (
    <Card style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>{source.name}</div>
        <Pill bg={statusColor.bg} color={statusColor.color}>
          {STATUS_LABEL[source.reviewStatus]}
        </Pill>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--color-text-muted-60)', lineHeight: 1.5, margin: '0 0 8px' }}>
        {source.description}
      </p>
      <div style={{ fontSize: 11.5, color: 'var(--color-text-muted-50)', marginBottom: 8, lineHeight: 1.6 }}>
        <div>
          <strong>Tipo:</strong> {source.contentType}
        </div>
        <div>
          <strong>Licencia:</strong> {source.license}
        </div>
      </div>
      <a href={source.url} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, fontWeight: 600, wordBreak: 'break-all' }}>
        Ver fuente →
      </a>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted-40)', marginTop: 6 }}>
        Última comprobación: {new Date(source.consultedAt).toLocaleDateString('es-ES')}
      </div>
    </Card>
  );
}
