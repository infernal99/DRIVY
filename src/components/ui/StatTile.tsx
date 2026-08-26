import { Card } from './Card';

export function StatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <Card style={{ padding: 13 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: 'var(--color-text)' }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted-50)', fontWeight: 600, marginTop: 2 }}>{label}</div>
    </Card>
  );
}
