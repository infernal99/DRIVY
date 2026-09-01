import { useEffect, useState } from 'react';
import type { Question } from '../../types';
import { explainMistake, type AiTutorResponse } from '../../services/aiTutorService';
import { Mascot, useMascot } from '../mascot';
import { Icon } from '../ui/Icon';

/**
 * Se abre al pulsar la burbuja "¿Quieres que te lo explique?" de
 * FeedbackScreen. Mismo patrón de diálogo que AchievementUnlockModal
 * (fondo atenuado + difuminado, tarjeta centrada, cierra con Escape o
 * tocando fuera) — z-index 200 igual que ese y que el tutorial de
 * onboarding, ningún otro overlay compite con él en la práctica.
 *
 * Reutiliza explainMistake() del mismo aiTutorService que ya usaba
 * AiTutorPanel — no se inventa una segunda redacción de la misma
 * explicación, es el mismo contenido en una presentación más cuidada.
 */
export function MistakeExplanationOverlay({
  question,
  selectedOptionId,
  onClose,
}: {
  question: Question;
  selectedOptionId: string | null;
  onClose: () => void;
}) {
  const [response, setResponse] = useState<AiTutorResponse | null>(null);
  const mascot = useMascot();
  const { react: reactMascot } = mascot;

  useEffect(() => {
    reactMascot('explaining');
    let cancelled = false;
    explainMistake(question, selectedOptionId).then((r) => {
      if (!cancelled) setResponse(r);
    });
    return () => {
      cancelled = true;
    };
  }, [question, selectedOptionId, reactMascot]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const correctOption = question.options.find((o) => o.id === question.correctOptionId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Explicación de la pregunta"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(5, 3, 12, 0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        className="anim-pop-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          background: 'var(--color-bg-card)',
          borderRadius: 24,
          padding: '20px 22px 24px',
          maxWidth: 320,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 34,
            height: 34,
            minWidth: 44,
            minHeight: 44,
            marginTop: -5,
            marginRight: -5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            borderRadius: '50%',
            color: 'var(--color-text-muted-45)',
            cursor: 'pointer',
          }}
        >
          <Icon name="close" size={16} color="currentColor" />
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
          <Mascot controller={mascot} size={76} />
        </div>

        {correctOption && (
          <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-error)', margin: '0 0 8px' }}>
            Respuesta correcta: {correctOption.text}
          </p>
        )}

        {response ? (
          <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.55, whiteSpace: 'pre-line', margin: 0 }}>
            {response.text}
          </p>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--color-text-muted-50)', margin: 0 }}>Pensando…</p>
        )}
      </div>
    </div>
  );
}
