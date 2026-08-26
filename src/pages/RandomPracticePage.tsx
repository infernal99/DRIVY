import { useState } from 'react';
import { pickRandomReview } from '../services/questionService';
import { QuestionSession } from '../components/lesson/QuestionSession';
import { AppShell } from '../components/layout/AppShell';

export function RandomPracticePage() {
  const [questions] = useState(() => pickRandomReview(10));
  return (
    <AppShell>
      <QuestionSession questions={questions} exitTo="/practice" />
    </AppShell>
  );
}
