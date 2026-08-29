import { useState } from 'react';
import { PremiumPricingCard } from './PremiumPricingCard';
import { Icon } from '../ui/Icon';

/**
 * Compact upgrade ad reused across Home/Practicar/Amigos — anywhere a
 * free-tier user should be reminded Premium exists, not just in Settings.
 * This is an ad, not a buy button: tapping it expands into the full
 * PremiumPricingCard (features + live price) inside a modal; checkout
 * itself only ever starts from that card's own button, never directly
 * from here.
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
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded(true)}
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
          cursor: 'pointer',
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

      {expanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="DRIVY Premium"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--color-text-muted-55)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 200,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(false);
          }}
        >
          <div
            className="anim-pop-in"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 420, padding: '0 16px 28px' }}
          >
            <PremiumPricingCard />
          </div>
        </div>
      )}
    </>
  );
}
