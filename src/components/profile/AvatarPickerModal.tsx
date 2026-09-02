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
          Elige tu personaje — algunos se desbloquean ganando XP.
        </p>
        {error && <p style={{ fontSize: 12.5, color: 'var(--color-error)', textAlign: 'center', margin: '0 0 10px' }}>{error}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
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
                  gap: 8,
                  background: 'none',
                  border: 'none',
                  padding: 4,
                  cursor: unlocked ? 'pointer' : 'default',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                    transition: 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  {isSelected && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: -10,
                        borderRadius: '50%',
                        background: 'var(--gradient-brand)',
                        opacity: 0.55,
                        filter: 'blur(10px)',
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '50%',
                      padding: 3,
                      background: isSelected ? 'var(--gradient-brand)' : 'var(--color-bg-screen)',
                      boxShadow: isSelected
                        ? '0 6px 18px rgba(139,92,246,0.55)'
                        : '0 3px 10px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.05)',
                    }}
                  >
                    <div style={{ opacity: unlocked ? 1 : 0.4, filter: unlocked ? 'none' : 'grayscale(0.6) brightness(0.7)' }}>
                      <AvatarIcon avatarId={entry.id} size={68} />
                    </div>
                  </div>
                  {!unlocked && (
                    <div
                      style={{
                        position: 'absolute',
                        right: -2,
                        bottom: -2,
                        width: 24,
                        height: 24,
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
                    color: isSelected ? 'var(--color-primary)' : unlocked ? 'var(--color-success)' : 'var(--color-text-muted-45)',
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
