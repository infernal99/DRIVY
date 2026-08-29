import { useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Icon';

export function PremiumUpsellModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Límite diario alcanzado"
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
        onClose();
      }}
    >
      <div
        className="anim-pop-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-card)',
          borderRadius: '24px 24px 0 0',
          padding: '24px 20px 28px',
          width: '100%',
          maxWidth: 420,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#18181b,#3f3f46)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
          }}
        >
          <Icon name="crown" size={24} color="#facc15" />
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--color-text)', marginBottom: 6 }}>
          Límite diario alcanzado
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted-60)', margin: '0 0 20px', lineHeight: 1.5 }}>
          Has usado todo tu acceso gratuito de hoy. Hazte Premium para práctica y duelos ilimitados, avatares exclusivos y más.
        </p>
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/settings');
          }}
          style={{
            width: '100%',
            padding: '14px 0',
            border: 'none',
            borderRadius: 12,
            background: 'var(--color-primary)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            marginBottom: 10,
          }}
        >
          Hazte Premium
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px 0',
            border: 'none',
            background: 'none',
            color: 'var(--color-text-muted-60)',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Ahora no
        </button>
      </div>
    </div>
  );
}
