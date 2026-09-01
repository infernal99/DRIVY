import { useState } from 'react';
import { ALL_QUESTIONS } from '../data/questions';
import { FeedbackScreen } from '../components/lesson/FeedbackScreen';

/**
 * Solo para desarrollo — mismo patrón que /dev/onboarding y /dev/mascot.
 * FeedbackScreen vive dentro de una lección real (LessonPage ->
 * QuestionSession), detrás de RequireAuth: sin esto no hay forma de
 * probar en el navegador el nuevo asomo de la mascota ni la superposición
 * de explicación sin una cuenta real y progreso real.
 */
export function DevFeedbackPreviewPage() {
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(false);
  const question = ALL_QUESTIONS[i % ALL_QUESTIONS.length];

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 8, padding: 8, background: '#000' }}>
        <button type="button" onClick={() => setCorrect((c) => !c)} style={{ padding: 8 }}>
          correct={String(correct)}
        </button>
        <button type="button" onClick={() => setI((n) => n + 1)} style={{ padding: 8 }}>
          siguiente pregunta (id={question.id})
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <FeedbackScreen
          question={question}
          correct={correct}
          selectedOptionId={question.options[0]?.id ?? null}
          xpGained={10}
          isLast={false}
          onContinue={() => setI((n) => n + 1)}
        />
      </div>
    </div>
  );
}
