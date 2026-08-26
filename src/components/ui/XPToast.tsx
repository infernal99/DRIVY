export function XPToast({ amount }: { amount: number }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 90,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'var(--color-xp-bg)',
        padding: '8px 16px',
        borderRadius: 999,
        boxShadow: '0 8px 20px rgba(148,106,0,0.2)',
        pointerEvents: 'none',
      }}
      className="anim-pop-in"
    >
      <div style={{ width: 11, height: 11, background: 'var(--color-xp)', transform: 'rotate(45deg)', borderRadius: 2 }} />
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-xp-text)' }}>+{amount} XP</span>
    </div>
  );
}
