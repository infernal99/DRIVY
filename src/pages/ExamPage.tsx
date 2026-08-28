import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ExamResult, Question } from '../types';
import { useProgressStore } from '../store/progressStore';
import { EXAM_CONFIG, gradeExam, generateExam } from '../services/examService';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { OptionRow } from '../components/lesson/QuestionCard';
import { QuestionImage } from '../components/lesson/QuestionCard';
import { AchievementUnlockModal } from '../components/achievements/AchievementUnlockModal';
import { ContentProvenanceNote } from '../components/ui/ContentProvenanceNote';
import { AiTutorPanel } from '../components/ui/AiTutorPanel';
import { ShareResultButton } from '../components/ui/ShareResultButton';
import { explainMistake } from '../services/aiTutorService';

type Phase = 'exam' | 'review' | 'result';

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function ExamPage() {
  const { mode = 'simulacro' } = useParams();
  const navigate = useNavigate();
  const progress = useProgressStore((s) => s.progress);
  const submitExam = useProgressStore((s) => s.submitExam);
  const lastUnlocked = useProgressStore((s) => s.lastUnlockedAchievements);
  const clearAchievementQueue = useProgressStore((s) => s.clearAchievementQueue);

  const isRealistic = mode === 'real';
  const examMode: ExamResult['mode'] = isRealistic ? 'examen-real' : 'simulacro';
  const title = isRealistic ? 'Examen real' : 'Simulacro de examen';

  const [questions] = useState<Question[]>(() => generateExam(progress));
  const [answers, setAnswers] = useState<(string | null)[]>(() => new Array(questions.length).fill(null));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('exam');
  const [secondsLeft, setSecondsLeft] = useState(EXAM_CONFIG.durationSeconds);
  const [result, setResult] = useState<ExamResult | null>(null);
  const startedAt = useRef(new Date().toISOString());
  const submittedRef = useRef(false);

  const answeredCount = useMemo(() => answers.filter((a) => a !== null).length, [answers]);

  useEffect(() => {
    if (phase !== 'exam') return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (secondsLeft === 0 && phase === 'exam' && !submittedRef.current) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, phase]);

  function handleSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const durationSeconds = EXAM_CONFIG.durationSeconds - secondsLeft;
    const graded = gradeExam(examMode, questions, answers, startedAt.current, durationSeconds);
    submitExam(graded, questions);
    setResult(graded);
    setPhase('result');
  }

  if (questions.length === 0) {
    return (
      <AppShell>
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted-50)' }}>
          No hay preguntas suficientes para generar un examen todavía.
        </div>
      </AppShell>
    );
  }

  if (phase === 'result' && result) {
    return (
      <AppShell>
        <ExamResultView
          title={title}
          result={result}
          questions={questions}
          userName={progress.userName}
          onExit={() => navigate('/practice', { replace: true })}
        />
        {lastUnlocked.length > 0 && <AchievementUnlockModal achievements={lastUnlocked} onClose={clearAchievementQueue} />}
      </AppShell>
    );
  }

  if (phase === 'review') {
    return (
      <AppShell>
        <ExamReviewView
          title={title}
          questions={questions}
          answers={answers}
          onJump={(i) => {
            setIndex(i);
            setPhase('exam');
          }}
          onSubmit={handleSubmit}
          onBack={() => setPhase('exam')}
        />
      </AppShell>
    );
  }

  const safeIndex = Math.min(index, questions.length - 1);
  const question = questions[safeIndex];
  const isLast = safeIndex === questions.length - 1;

  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-card)' }}>
        <div style={{ padding: '16px 20px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            variant="secondary"
            onClick={() => {
              if (confirm('¿Salir del examen? Se perderá el progreso de este intento.')) navigate('/practice', { replace: true });
            }}
            aria-label="Salir del examen"
            style={{ width: 32, height: 32, padding: 0, borderRadius: 10, flex: 'none' }}
          >
            <Icon name="close" size={14} />
          </Button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted-45)' }}>
              Pregunta {safeIndex + 1} / {questions.length}
            </div>
            <div style={{ height: 6, background: 'var(--color-divider)', borderRadius: 999, marginTop: 4, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${((safeIndex + 1) / questions.length) * 100}%`,
                  background: 'var(--color-primary)',
                  borderRadius: 999,
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 700,
              fontSize: 13,
              color: secondsLeft < 60 ? 'var(--color-error)' : 'var(--color-text)',
              background: secondsLeft < 60 ? 'var(--color-error-bg)' : 'var(--color-bg-locked)',
              padding: '6px 10px',
              borderRadius: 999,
            }}
            aria-live="polite"
          >
            {formatTime(secondsLeft)}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            key={question.id}
            className="anim-fade-up"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--color-text)', textAlign: 'center', margin: '6px 0 18px' }}
          >
            {question.question}
          </div>
          <QuestionImage question={question} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            {question.options.map((option) => (
              <OptionRow
                key={option.id}
                text={option.text}
                state={answers[safeIndex] === option.id ? 'selected' : 'idle'}
                disabled={false}
                onClick={() => {
                  const next = [...answers];
                  next[safeIndex] = option.id;
                  setAnswers(next);
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ padding: '12px 20px 24px', display: 'flex', gap: 10, background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-topbar)' }}>
          <Button variant="secondary" disabled={safeIndex === 0} onClick={() => setIndex((i) => Math.max(i - 1, 0))} style={{ flex: 1 }}>
            Anterior
          </Button>
          {isLast ? (
            <Button onClick={() => setPhase('review')} style={{ flex: 1 }}>
              Revisar y terminar
            </Button>
          ) : (
            <Button onClick={() => setIndex((i) => Math.min(i + 1, questions.length - 1))} style={{ flex: 1 }}>
              Siguiente
            </Button>
          )}
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-text-muted-40)', paddingBottom: 10 }}>
          {answeredCount} / {questions.length} respondidas
        </div>
      </div>
    </AppShell>
  );
}

function ExamReviewView({
  title,
  questions,
  answers,
  onJump,
  onSubmit,
  onBack,
}: {
  title: string;
  questions: Question[];
  answers: (string | null)[];
  onJump: (i: number) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const unanswered = answers.filter((a) => a === null).length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-card)' }}>
      <div style={{ padding: '18px 20px 10px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--color-text)' }}>
          Revisar antes de enviar
        </span>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted-50)', marginTop: 6 }}>
          {title} · {unanswered > 0 ? `${unanswered} preguntas sin responder` : 'Has respondido todas las preguntas'}
        </p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              onClick={() => onJump(i)}
              style={{
                aspectRatio: '1',
                borderRadius: 10,
                border: 'none',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                background: answers[i] !== null ? 'var(--color-info-bg)' : 'var(--color-bg-locked)',
                color: answers[i] !== null ? 'var(--color-primary)' : 'var(--color-text-muted-45)',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: '16px 20px 26px', display: 'flex', gap: 10, background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-topbar)' }}>
        <Button variant="secondary" onClick={onBack} style={{ flex: 1 }}>
          Seguir respondiendo
        </Button>
        <Button onClick={onSubmit} style={{ flex: 1 }}>
          Enviar examen
        </Button>
      </div>
    </div>
  );
}

function ExamResultView({
  title,
  result,
  questions,
  userName,
  onExit,
}: {
  title: string;
  result: ExamResult;
  questions: Question[];
  userName: string;
  onExit: () => void;
}) {
  const wrongAnswers = result.answers
    .map((a, i) => ({ answer: a, question: questions[i] }))
    .filter((x) => !x.answer.correct);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-screen)' }}>
      <div
        className="anim-pop-in"
        style={{
          padding: '36px 24px 26px',
          textAlign: 'center',
          background: result.passed ? 'linear-gradient(135deg,#122B57,#1E4694 60%,#2F6FED)' : 'linear-gradient(135deg,#5b1f22,#7a2a2f)',
          color: '#fff',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, marginTop: 8 }}>
          {result.correctCount} / {result.totalCount}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, marginTop: 6 }}>
          {result.passed ? '¡Apto! Has aprobado el simulacro' : 'No apto — sigue practicando'}
        </div>
        <div style={{ fontSize: 12.5, opacity: 0.8, marginTop: 6 }}>
          Máximo {EXAM_CONFIG.maxErrorsToPass} fallos para aprobar · {result.totalCount - result.correctCount} fallos cometidos
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 20px' }}>
        {wrongAnswers.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted-50)', fontSize: 14 }}>
            ¡Pleno de aciertos! No has fallado ninguna pregunta.
          </p>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)', marginBottom: 12 }}>
              Repasa tus fallos
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {wrongAnswers.map(({ answer, question }) => (
                <div key={question.id} style={{ background: 'var(--color-bg-card)', borderRadius: 14, padding: 14, boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-text)', marginBottom: 6 }}>{question.question}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--color-error)', fontWeight: 600, marginBottom: 4 }}>
                    Tu respuesta:{' '}
                    {answer.selectedOptionId !== null
                      ? question.options.find((o) => o.id === answer.selectedOptionId)?.text
                      : 'Sin responder'}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--color-success)', fontWeight: 600, marginBottom: 6 }}>
                    Correcta: {question.options.find((o) => o.id === question.correctOptionId)?.text}
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--color-text-muted-60)', lineHeight: 1.5, margin: '0 0 8px' }}>{question.explanation}</p>
                  <AiTutorPanel key={question.id} fetchResponse={() => explainMistake(question, answer.selectedOptionId)} />
                  <ContentProvenanceNote source={question.source} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div style={{ padding: '16px 20px 26px', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-topbar)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <ShareResultButton
          data={{
            title: result.passed ? '¡Apto! Simulacro superado' : 'No apto — a seguir practicando',
            scoreLine: `${result.correctCount}/${result.totalCount}`,
            subtitle: title,
            userName,
            positive: result.passed,
          }}
        />
        <Button onClick={onExit}>VOLVER A PRACTICAR</Button>
      </div>
    </div>
  );
}
