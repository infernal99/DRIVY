import { useState } from 'react';
import { pickDailyChallenge } from '../services/questionService';
import { useProgressStore } from '../store/progressStore';
import { QuestionSession } from '../components/lesson/QuestionSession';
import { AppShell } from '../components/layout/AppShell';

export function DailyChallengePage() {
  const progress = useProgressStore((s) => s.progress);
  const [questions] = useState(() => pickDailyChallenge(progress, 5));
  return (
    <AppShell>
      <QuestionSession questions={questions} exitTo="/practice" completeLabel="VOLVER A PRACTICAR" />
    </AppShell>
  );
}
