export function ProgressBar({
  pct,
  color = 'var(--color-primary)',
  trackColor = 'var(--color-bg-locked)',
  height = 8,
  animated = true,
}: {
  pct: number;
  color?: string;
  trackColor?: string;
  height?: number;
  animated?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        height,
        background: trackColor,
        borderRadius: 999,
        overflow: 'hidden',
      }}
    >
      <div
        className={animated ? 'anim-fade-up' : undefined}
        style={{
          height: '100%',
          width: `${clamped}%`,
          background: color,
          borderRadius: 999,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  );
}
