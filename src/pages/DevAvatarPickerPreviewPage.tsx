import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AvatarPickerModal } from '../components/profile/AvatarPickerModal';

/**
 * Solo para desarrollo — mismo patrón que /dev/mascot: previsualizar el
 * selector de avatares (jugador) sin necesitar login ni XP/premium real.
 * ?premium=1 en la URL simula una cuenta con suscripción activa.
 */
export function DevAvatarPickerPreviewPage() {
  const [params] = useSearchParams();
  const isPremium = params.get('premium') === '1';
  const [selected, setSelected] = useState<string | null>('owl_professor');

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg-app)' }}>
      <AvatarPickerModal
        currentXp={200}
        isPremium={isPremium}
        selectedAvatarId={selected}
        onClose={() => {}}
        onSelected={setSelected}
      />
    </div>
  );
}
