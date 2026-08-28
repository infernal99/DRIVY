import { useState } from 'react';
import { AVATAR_CATALOG } from '../../data/avatars';
import { setMyAvatar } from '../../services/avatarService';
import { AvatarIcon } from '../ui/AvatarIcon';
import { Icon } from '../ui/Icon';

export function AvatarPickerModal({
  currentXp,
  isPremium,
  selectedAvatarId,
  onClose,
  onSelected,
}: {
  currentXp: number;
  isPremium: boolean;
  selectedAvatarId: string | null;
  onClose: () => void;
  onSelected: (avatarId: string) => void;
}) {
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handlePick(id: string, unlocked: boolean) {
    if (!unlocked || saving) return;
    setSaving(id);
    setError(null);
    setMyAvatar(id)
      .then(() => {
        onSelected(id);
        onClose();
      })
      .catch(() => setError('No se pudo actualizar el avatar. Inténtalo de nuevo.'))
      .finally(() => setSaving(null));
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Elegir avatar"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--color-text-muted-55)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 200,
      }}
      onClick={onClose}
    >
      <div
        className="anim-pop-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-card)',
          borderRadius: '24px 24px 0 0',
          padding: '20px 20px 28px',
          width: '100%',
          maxWidth: 420,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--color-text)', marginBottom: 4, textAlign: 'center' }}>
          Elige tu avatar
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--color-text-muted-60)', textAlign: 'center', margin: '0 0 18px' }}>
          Se desbloquean ganando XP.
        </p>
        {error && <p style={{ fontSize: 12.5, color: 'var(--color-error)', textAlign: 'center', margin: '0 0 10px' }}>{error}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {AVATAR_CATALOG.map((entry) => {
            const unlocked = currentXp >= entry.xpRequired && (!entry.requiresPremium || isPremium);
            const isSelected = selectedAvatarId === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => handlePick(entry.id, unlocked)}
                disabled={!unlocked || saving === entry.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  background: 'none',
                  border: isSelected ? '2px solid var(--color-primary)' : '2px solid transparent',
                  borderRadius: 16,
                  padding: 8,
                  cursor: unlocked ? 'pointer' : 'default',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{ opacity: unlocked ? 1 : 0.4, filter: unlocked ? 'none' : 'grayscale(0.5)' }}>
                    <AvatarIcon avatarId={entry.id} size={56} />
                  </div>
                  {!unlocked && (
                    <div
                      style={{
                        position: 'absolute',
                        right: -3,
                        bottom: -3,
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'var(--color-text)',
                        border: '2px solid var(--color-bg-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-card)',
                      }}
                    >
                      <Icon name="lock" size={11} color="var(--color-bg-card)" />
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text)', textAlign: 'center' }}>{entry.name}</span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: unlocked ? 'var(--color-success)' : 'var(--color-text-muted-45)',
                  }}
                >
                  {unlocked
                    ? isSelected
                      ? 'Seleccionado'
                      : 'Disponible'
                    : entry.requiresPremium && currentXp >= entry.xpRequired
                      ? 'Premium'
                      : `${entry.xpRequired} XP`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
