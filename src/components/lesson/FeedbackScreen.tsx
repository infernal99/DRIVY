import { useEffect } from 'react';
import type { Question } from '../../types';
import { explainMistake, explainQuestion } from '../../services/aiTutorService';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { AiTutorPanel } from '../ui/AiTutorPanel';
import { Mascot, useMascot } from '../mascot';

export function FeedbackScreen({
  question,
  correct,
  selectedOptionId,
  xpGained,
  onContinue,
  isLast,
}: {
  question: Question;
  correct: boolean;
  selectedOptionId: string | null;
  xpGained: number;
  onContinue: () => void;
  isLast: boolean;
}) {
  const mascot = useMascot();

  // Sin `key` por pregunta en el padre (QuestionSession), este componente
  // se ACTUALIZA en vez de remontarse entre preguntas — por eso el efecto
  // depende de question.id, si no solo reaccionaría una vez en toda la
  // lección. Reacción normal, no "big": un acierto de una pregunta suelta
  // no es un hito, así que sin confeti — eso se reserva para logros/rachas.
  const { react: reactMascot } = mascot;
  useEffect(() => {
    reactMascot(correct ? 'correct' : 'incorrect');
  }, [question.id, correct, reactMascot]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-card)' }} className="anim-fade-up">
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px 30px 0',
          textAlign: 'center',
          overflowY: 'auto',
        }}
      >
        <Mascot controller={mascot} size={72} />
        <div
          className="anim-pop-in"
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: correct ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 22,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: correct ? 'var(--color-success)' : 'var(--color-error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={correct ? 'check' : 'close'} size={correct ? 26 : 24} color="#fff" strokeWidth={3} />
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: 'var(--color-text)', marginBottom: 10 }}>
          {correct ? '¡Correcto!' : 'Incorrecto'}
        </div>
        {!correct && (
          <p style={{ fontSize: 14, color: 'var(--color-error)', fontWeight: 600, margin: '0 0 6px' }}>
            Respuesta correcta: {question.options.find((o) => o.id === question.correctOptionId)?.text}
          </p>
        )}
        <p style={{ fontSize: 14.5, color: 'var(--color-text-muted-60)', lineHeight: 1.55, maxWidth: 280, margin: '0 0 18px' }}>
          {question.explanation}
        </p>
        {!correct && (
          <p style={{ fontSize: 12, color: 'var(--color-text-muted-45)', margin: '0 0 14px' }}>
            Guardada en «Mis errores» para que puedas repasarla.
          </p>
        )}
        <AiTutorPanel
          key={question.id}
          fetchResponse={() => (correct ? explainQuestion(question) : explainMistake(question, selectedOptionId))}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--color-xp-bg)',
            padding: '8px 16px',
            borderRadius: 999,
          }}
        >
          <div style={{ width: 11, height: 11, background: 'var(--color-xp)', transform: 'rotate(45deg)', borderRadius: 2 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-xp-text)' }}>+{xpGained} XP</span>
        </div>
      </div>
      <div style={{ padding: '20px 24px 30px' }}>
        <Button variant={correct ? 'success' : 'primary'} onClick={onContinue}>
          {isLast ? 'VER RESULTADOS' : 'CONTINUAR'}
        </Button>
      </div>
    </div>
  );
}
