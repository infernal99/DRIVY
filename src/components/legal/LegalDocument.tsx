import type { ReactNode } from 'react';
import { AppShell } from '../layout/AppShell';
import { ScreenHeader } from '../layout/ScreenHeader';
import { LEGAL_LAST_UPDATED } from '../../data/legalInfo';

/**
 * Chrome compartido de las 4 páginas legales (/privacidad, /cookies,
 * /aviso-legal, /terminos). Viven fuera de RequireAuth, así que deben
 * funcionar igual con sesión iniciada o no — ScreenHeader ya resuelve
 * "volver" con navigate(-1) en ambos casos.
 */
export function LegalDocument({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <AppShell>
      <ScreenHeader title={title} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 30px' }}>
        <div style={{ fontSize: 11.5, color: 'var(--color-text-muted-45)', margin: '0 0 16px' }}>
          Última actualización: {LEGAL_LAST_UPDATED}
        </div>
        {intro && (
          <p style={{ fontSize: 13, color: 'var(--color-text-muted-60)', lineHeight: 1.55, margin: '0 0 20px' }}>{intro}</p>
        )}
        {children}
      </div>
    </AppShell>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 22 }}>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 14.5,
          color: 'var(--color-text)',
          margin: '0 0 10px',
        }}
      >
        {heading}
      </h2>
      <div style={{ fontSize: 13, color: 'var(--color-text-muted-60)', lineHeight: 1.6 }}>{children}</div>
    </section>
  );
}

export function LegalParagraph({ children }: { children: ReactNode }) {
  return <p style={{ margin: '0 0 10px' }}>{children}</p>;
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul style={{ margin: '0 0 10px', paddingLeft: 20 }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 6 }}>
          {item}
        </li>
      ))}
    </ul>
  );
}
