import { useEffect } from 'react';
import type { UnlockedAchievement } from '../../types';
import { getAchievementById } from '../../data/achievements';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';

export function AchievementUnlockModal({
  achievements,
  onClose,
}: {
  achievements: UnlockedAchievement[];
  onClose: () => void;
}) {
  const first = achievements[0];
  const def = first ? getAchievementById(first.id) : undefined;

  useEffect(() => {
    if (!def) onClose();
  }, [def, onClose]);

  if (!def) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Logro desbloqueado"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--color-text-muted-55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        className="anim-pop-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-card)',
          borderRadius: 24,
          padding: '32px 24px 24px',
          maxWidth: 320,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: 'var(--color-xp-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-xp-text)',
          }}
        >
          <Icon name={def.icon} size={38} />
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-xp-text)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
          Logro desbloqueado
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--color-text)', margin: '6px 0 8px' }}>
          {def.name}
        </div>
        <p style={{ fontSize: 13.5, color: 'var(--color-text-muted-60)', lineHeight: 1.5, margin: '0 0 20px' }}>
          {def.description}
        </p>
        <Button onClick={onClose}>GENIAL</Button>
      </div>
    </div>
  );
}
