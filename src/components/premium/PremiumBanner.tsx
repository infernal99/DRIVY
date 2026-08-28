import { useState } from 'react';
import { startCheckout } from '../../services/premiumService';
import { Icon } from '../ui/Icon';

/**
 * Compact upgrade banner reused across Home/Practicar/Amigos — anywhere a
 * free-tier user should be reminded Premium exists, not just in Settings.
 * Starts checkout directly on tap, no navigation required.
 */
export function PremiumBanner({
  title = 'Hazte Premium',
  subtitle = 'Práctica y duelos ilimitados, avatares exclusivos',
  style,
}: {
  title?: string;
  subtitle?: string;
  style?: React.CSSProperties;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleClick() {
    setSubmitting(true);
    try {
      await startCheckout();
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={submitting}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'linear-gradient(135deg,#18181b,#312e81 60%,#3f3f46)',
        border: 'none',
        borderRadius: 16,
        padding: '14px 16px',
        boxShadow: '0 8px 20px rgba(24,24,27,0.3)',
        cursor: submitting ? 'default' : 'pointer',
        textAlign: 'left',
        ...style,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'rgba(250,204,21,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
        }}
      >
        <Icon name="crown" size={17} color="#facc15" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13.5, color: '#fff' }}>{title}</div>
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.75)', marginTop: 1 }}>{subtitle}</div>
      </div>
      <Icon name="chevronRight" size={14} color="#facc15" />
    </button>
  );
}
