import type { ReactNode } from 'react';

export function Pill({
  children,
  bg = 'var(--color-info-bg)',
  color = 'var(--color-primary)',
}: {
  children: ReactNode;
  bg?: string;
  color?: string;
}) {
  return (
    <span
      style={{
        fontSize: 11.5,
        fontWeight: 600,
        color,
        background: bg,
        padding: '3px 10px',
        borderRadius: 999,
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
