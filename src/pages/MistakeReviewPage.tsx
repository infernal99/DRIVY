import { useState } from 'react';
import { pickMistakeReview } from '../services/questionService';
import { useProgressStore } from '../store/progressStore';
import { QuestionSession } from '../components/lesson/QuestionSession';
import { AppShell } from '../components/layout/AppShell';

export function MistakeReviewPage() {
  const progress = useProgressStore((s) => s.progress);
  const [questions] = useState(() => pickMistakeReview(progress, 20));
  return (
    <AppShell>
      <QuestionSession
        questions={questions}
        exitTo="/practice"
        completeLabel="VOLVER A PRACTICAR"
        emptyTitle="No tienes errores pendientes"
        emptyDescription="Cuando falles una pregunta aparecerá aquí para que puedas repasarla."
      />
    </AppShell>
  );
}
