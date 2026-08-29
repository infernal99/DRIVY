/** Same initial-letter circle used on Home/Profile — Roady has no avatar upload feature, so this is the only avatar rendering there is. */
export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2.8,
        background: 'var(--gradient-brand)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        color: '#fff',
        fontSize: size * 0.4,
        flex: 'none',
      }}
    >
      {name.charAt(0).toUpperCase() || '?'}
    </div>
  );
}
