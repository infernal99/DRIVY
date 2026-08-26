export function Skeleton({ height = 16, width = '100%', radius = 8 }: { height?: number; width?: string | number; radius?: number }) {
  return (
    <div
      style={{
        height,
        width,
        borderRadius: radius,
        background: 'linear-gradient(90deg, #E4E8F1 25%, #EEF1F7 37%, #E4E8F1 63%)',
        backgroundSize: '400% 100%',
        animation: 'shimmer 1.4s ease infinite',
      }}
    />
  );
}

export function LoadingScreen() {
  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Skeleton height={120} radius={22} />
      <Skeleton height={20} width="60%" />
      <Skeleton height={70} radius={16} />
      <Skeleton height={70} radius={16} />
      <Skeleton height={70} radius={16} />
    </div>
  );
}
