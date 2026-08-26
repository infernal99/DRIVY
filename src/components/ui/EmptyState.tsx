import type { ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from '../../types';

export function EmptyState({
  icon = 'target',
  title,
  description,
  action,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        gap: 6,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--color-bg-locked)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
          color: 'var(--color-text-muted-40)',
        }}
      >
        <Icon name={icon} size={26} />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--color-text)' }}>
        {title}
      </div>
      {description && (
        <p style={{ fontSize: 13.5, color: 'var(--color-text-muted-50)', lineHeight: 1.5, maxWidth: 260 }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 10, width: '100%' }}>{action}</div>}
    </div>
  );
}
