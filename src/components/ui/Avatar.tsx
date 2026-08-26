/** Same initial-letter circle used on Home/Profile — DRIVY has no avatar upload feature, so this is the only avatar rendering there is. */
export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2.8,
        background: 'linear-gradient(135deg,#2F6FED,#5B8CF5)',
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
