import { useEffect, useState } from 'react';
import { usePremiumStore } from '../../store/premiumStore';
import { openBillingPortal, startCheckout } from '../../services/premiumService';
import { Icon } from '../ui/Icon';

const PREMIUM_FEATURES = [
  'Práctica y simulacros ilimitados',
  'Duelos ilimitados con tus amigos',
  '2 avatares exclusivos',
  'Insignia "Miembro Premium"',
];

function formatPrice(price: { amount: number | null; currency: string; interval: string }): string | null {
  if (price.amount == null) return null;
  const value = price.amount / 100;
  const formatted = value.toLocaleString('es-ES', { minimumFractionDigits: value % 1 === 0 ? 0 : 2 });
  const symbol = price.currency.toUpperCase() === 'EUR' ? '€' : ` ${price.currency.toUpperCase()}`;
  return `${formatted}${symbol}/mes`;
}

/**
 * The full pricing/features card — the only place that actually starts
 * checkout. Used inline in Settings, and inside a modal when someone taps
 * the small PremiumBanner elsewhere (that banner is an ad, not a buy
 * button: it opens this card first rather than jumping straight to Stripe).
 */
export function PremiumPricingCard() {
  const isPremium = usePremiumStore((s) => s.isPremium);
  const loading = usePremiumStore((s) => s.loading);
  const price = usePremiumStore((s) => s.price);
  const loadPrice = usePremiumStore((s) => s.loadPrice);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPremium) loadPrice();
  }, [isPremium, loadPrice]);

  async function handleClick() {
    setSubmitting(true);
    setError(null);
    try {
      if (isPremium) await openBillingPortal();
      else await startCheckout();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo abrir la página de pago. Inténtalo de nuevo.');
      setSubmitting(false);
    }
  }

  if (loading) return null;

  const priceLabel = price ? formatPrice(price) : null;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg,#18181b,#312e81 60%,#3f3f46)',
        borderRadius: 20,
        padding: 20,
        boxShadow: '0 10px 28px rgba(24,24,27,0.35)',
        color: '#fff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
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
          <Icon name="crown" size={18} color="#facc15" />
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>
          {isPremium ? 'DRIVY Premium activo' : 'DRIVY Premium'}
        </div>
      </div>

      {isPremium ? (
        <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.5, margin: '0 0 16px' }}>
          Tienes acceso ilimitado a práctica, duelos y avatares exclusivos.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, margin: '0 0 18px' }}>
          {PREMIUM_FEATURES.map((feature) => (
            <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, opacity: 0.92 }}>
              <Icon name="check" size={13} color="#facc15" />
              {feature}
            </div>
          ))}
        </div>
      )}

      {error && <p style={{ fontSize: 12.5, color: '#fca5a5', margin: '0 0 10px' }}>{error}</p>}

      <button
        type="button"
        onClick={handleClick}
        disabled={submitting}
        style={{
          width: '100%',
          padding: '13px 0',
          border: 'none',
          borderRadius: 12,
          background: '#facc15',
          color: '#18181b',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 14,
          cursor: submitting ? 'default' : 'pointer',
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? '…' : isPremium ? 'Gestionar suscripción' : priceLabel ? `Hazte Premium — ${priceLabel}` : 'Hazte Premium'}
      </button>
    </div>
  );
}
