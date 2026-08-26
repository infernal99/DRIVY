import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Question } from '../../types';
import { useProgressStore } from '../../store/progressStore';
import { OptionRow, QuestionImage } from './QuestionCard';
import { FeedbackScreen } from './FeedbackScreen';
import { LessonCompleteScreen } from './LessonCompleteScreen';
import { AchievementUnlockModal } from '../achievements/AchievementUnlockModal';
import { Icon } from '../ui/Icon';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { ContentProvenanceNote } from '../ui/ContentProvenanceNote';

export interface QuestionSessionProps {
  questions: Question[];
  /**
   * Route to leave to (close button, or after finishing). Always navigated
   * to with `replace: true` — a push would leave this session's route in
   * history, so the header back-chevron on the destination page (which
   * calls navigate(-1)) would land back on the session instead of wherever
   * the user actually came from.
   */
  exitTo: string;
  lessonId?: string;
  nextLessonName?: string;
  completeLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onSessionComplete?: (result: { correct: number; total: number; xpGained: number }) => void;
}

export function QuestionSession({
  questions,
  exitTo,
  lessonId,
  nextLessonName,
  completeLabel,
  emptyTitle = 'No hay preguntas disponibles',
  emptyDescription = 'Vuelve más tarde o prueba otra sección.',
  onSessionComplete,
}: QuestionSessionProps) {
  const navigate = useNavigate();
  const answerQuestion = useProgressStore((s) => s.answerQuestion);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const streakCount = useProgressStore((s) => s.progress.streakCount);
  const lastUnlocked = useProgressStore((s) => s.lastUnlockedAchievements);
  const clearAchievementQueue = useProgressStore((s) => s.clearAchievementQueue);

  const [index, setIndex] = useState(0);
  const [step, setStep] = useState<'question' | 'feedback' | 'done'>('question');
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastSelectedOptionId, setLastSelectedOptionId] = useState<string | null>(null);
  const [lastXp, setLastXp] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);

  if (questions.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
        <SessionHeader onClose={() => navigate(exitTo, { replace: true })} progressPct={0} counter="" />
        <EmptyState title={emptyTitle} description={emptyDescription} icon="target" />
      </div>
    );
  }

  const question = questions[index];
  const isLast = index === questions.length - 1;

  function handleSelect(optionId: string) {
    const correct = answerQuestion(question, optionId);
    const xp = correct ? 10 : 2;
    setLastCorrect(correct);
    setLastSelectedOptionId(optionId);
    setLastXp(xp);
    setSessionXp((v) => v + xp);
    if (correct) setSessionCorrect((v) => v + 1);
    setStep('feedback');
  }

  function handleFeedbackContinue() {
    if (isLast) {
      if (lessonId) completeLesson(lessonId);
      onSessionComplete?.({ correct: sessionCorrect, total: questions.length, xpGained: sessionXp });
      setStep('done');
    } else {
      setIndex((i) => i + 1);
      setStep('question');
    }
  }

  if (step === 'done') {
    return (
      <>
        <LessonCompleteScreen
          xpGained={sessionXp}
          streak={streakCount}
          correct={sessionCorrect}
          total={questions.length}
          nextLessonName={nextLessonName}
          continueLabel={completeLabel}
          onContinue={() => navigate(exitTo, { replace: true })}
        />
        {lastUnlocked.length > 0 && (
          <AchievementUnlockModal achievements={lastUnlocked} onClose={clearAchievementQueue} />
        )}
      </>
    );
  }

  if (step === 'feedback') {
    return (
      <FeedbackScreen
        question={question}
        correct={lastCorrect}
        selectedOptionId={lastSelectedOptionId}
        xpGained={lastXp}
        isLast={isLast}
        onContinue={handleFeedbackContinue}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      <SessionHeader
        onClose={() => navigate(exitTo, { replace: true })}
        progressPct={(index / questions.length) * 100}
        counter={`${index + 1} / ${questions.length}`}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 24px 20px', overflowY: 'auto' }}>
        <div
          key={question.id}
          className="anim-fade-up"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--color-text)', textAlign: 'center', margin: '10px 0 20px' }}
        >
          {question.question}
        </div>
        <QuestionImage question={question} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          {question.options.map((option) => (
            <OptionRow key={option.id} text={option.text} state="idle" disabled={false} onClick={() => handleSelect(option.id)} />
          ))}
        </div>
        <ContentProvenanceNote source={question.source} />
      </div>
    </div>
  );
}

function SessionHeader({ onClose, progressPct, counter }: { onClose: () => void; progressPct: number; counter: string }) {
  return (
    <div style={{ padding: '16px 20px 10px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <Button
        variant="secondary"
        onClick={onClose}
        aria-label="Salir de la lección"
        style={{ width: 32, height: 32, padding: 0, borderRadius: 10, flex: 'none' }}
      >
        <Icon name="close" size={14} />
      </Button>
      <div style={{ flex: 1, height: 8, background: 'var(--color-divider)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--color-primary)', borderRadius: 999, transition: 'width .3s ease' }} />
      </div>
      {counter && (
        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-text-muted-45)', whiteSpace: 'nowrap' }}>{counter}</span>
      )}
    </div>
  );
}
