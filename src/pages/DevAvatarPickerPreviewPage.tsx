import { useState } from 'react';
import { AvatarPickerModal } from '../components/profile/AvatarPickerModal';

/**
 * Solo para desarrollo — mismo patrón que /dev/mascot: previsualizar el
 * selector de avatares (jugador) sin necesitar login ni XP real.
 */
export function DevAvatarPickerPreviewPage() {
  const [selected, setSelected] = useState<string | null>('owl_professor');

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg-app)' }}>
      <AvatarPickerModal
        currentXp={200}
        isPremium={false}
        selectedAvatarId={selected}
        onClose={() => {}}
        onSelected={setSelected}
      />
    </div>
  );
}
