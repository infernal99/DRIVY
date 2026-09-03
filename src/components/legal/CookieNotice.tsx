import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

const SEEN_KEY = 'drivy.cookieNoticeSeen.v1';

/**
 * Aviso informativo (no un banner de consentimiento): Roady no usa cookies ni
 * almacenamiento no esencial (ver src/pages/legal/CookiesPolicyPage.tsx), así
 * que no hay nada que "aceptar/rechazar" — solo informamos una vez, conforme
 * al deber de información del art. 22.2 LSSI-CE, y no volvemos a mostrarlo.
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(SEEN_KEY) === '1';
    } catch {
      // Si localStorage no está disponible, mejor no insistir en cada carga.
      seen = true;
    }
    if (seen) return;
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      // Best-effort — peor caso, vuelve a aparecer en la próxima visita.
    }
  }

  if (!visible) return null;

  return (
    <div
      className="anim-pop-in"
      style={{
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        zIndex: 200,
        maxWidth: 380,
        margin: '0 auto',
        background: 'var(--color-bg-card)',
        borderRadius: 16,
        boxShadow: 'var(--shadow-elevated)',
        padding: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            flex: 'none',
            background: 'var(--color-info-bg)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="shield" size={17} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, color: 'var(--color-text-muted-60)', lineHeight: 1.5 }}>
            Roady no usa cookies de rastreo. Solo guardamos en tu dispositivo lo estrictamente necesario para que la
            app funcione.{' '}
            <Link to="/cookies" style={{ fontWeight: 600 }} onClick={dismiss}>
              Saber más
            </Link>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Cerrar"
          style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: 'var(--color-text-muted-40)', flex: 'none' }}
        >
          <Icon name="close" size={14} />
        </button>
      </div>
    </div>
  );
}
