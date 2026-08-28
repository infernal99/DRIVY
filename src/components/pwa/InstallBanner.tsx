import { useEffect, useState } from 'react';
import { promptInstall, useInstallPromptStore } from '../../store/installPromptStore';
import { Icon } from '../ui/Icon';

const DISMISSED_KEY = 'drivy.installBannerDismissedAt.v1';
const DISMISS_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;

function wasRecentlyDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < DISMISS_COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markDismissed() {
  try {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  } catch {
    // Best-effort — worst case the banner reappears next visit.
  }
}

/** Mounted once in App.tsx — a one-time-per-cooldown nudge to install the app, on top of the always-available row in Profile. */
export function InstallBanner() {
  const deferredEvent = useInstallPromptStore((s) => s.deferredEvent);
  const installed = useInstallPromptStore((s) => s.installed);
  const isIOS = useInstallPromptStore((s) => s.isIOS);
  const [dismissed, setDismissed] = useState(true);
  const [showIOSSteps, setShowIOSSteps] = useState(false);

  const available = !installed && (!!deferredEvent || isIOS);

  useEffect(() => {
    if (!available) return;
    if (wasRecentlyDismissed()) return;
    const timer = setTimeout(() => setDismissed(false), 1200);
    return () => clearTimeout(timer);
  }, [available]);

  if (!available || dismissed) return null;

  function dismiss() {
    markDismissed();
    setDismissed(true);
  }

  async function handleInstall() {
    if (isIOS) {
      setShowIOSSteps(true);
      return;
    }
    await promptInstall();
    dismiss();
  }

  return (
    <div
      className="anim-pop-in"
      style={{
        position: 'fixed',
        top: 12,
        left: 12,
        right: 12,
        zIndex: 200,
        maxWidth: 380,
        margin: '0 auto',
        background: 'var(--color-bg-card)',
        borderRadius: 16,
        boxShadow: 'var(--shadow-elevated)',
        padding: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
          <Icon name="download" size={17} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text)' }}>Instala DRIVY</div>
          <div style={{ fontSize: 11.5, color: 'var(--color-text-muted-60)', marginTop: 1 }}>Úsala como una app, incluso sin conexión.</div>
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

      {showIOSSteps ? (
        <p style={{ fontSize: 12, color: 'var(--color-text-muted-60)', lineHeight: 1.5, margin: '10px 0 0' }}>
          Toca el icono <strong>Compartir</strong> de Safari y luego <strong>«Añadir a pantalla de inicio»</strong>.
        </p>
      ) : (
        <button
          type="button"
          onClick={handleInstall}
          style={{
            width: '100%',
            marginTop: 10,
            padding: '9px 0',
            border: 'none',
            borderRadius: 10,
            background: 'var(--color-primary)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Instalar
        </button>
      )}
    </div>
  );
}
