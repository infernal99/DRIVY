import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getBattleReview,
  getBattleRound,
  getMyBattles,
  resolveBattleQuestions,
  submitBattleAnswer,
  type ActiveBattleSummary,
  type BattleHistoryEntry,
  type BattleReviewEntry,
  type BattleRoundState,
} from '../services/battlesService';
import { getQuestion } from '../services/questionService';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { LoadingScreen } from '../components/ui/Loading';
import { EmptyState } from '../components/ui/EmptyState';
import { ContentProvenanceNote } from '../components/ui/ContentProvenanceNote';
import { OptionRow, QuestionImage } from '../components/lesson/QuestionCard';
import type { Question } from '../types';

type Phase = 'loading' | 'playing' | 'reveal' | 'result' | 'review' | 'not-found';

const ROUND_SECONDS = 30;
const POLL_MS = 1300;

export function BattlePage() {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const numericId = battleId ? Number(battleId) : NaN;

  const [phase, setPhase] = useState<Phase>('loading');
  const [battle, setBattle] = useState<ActiveBattleSummary | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState<string>('');
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [mySelection, setMySelection] = useState<string | null>(null);
  const [myAnswered, setMyAnswered] = useState(false);
  const [opponentAnswered, setOpponentAnswered] = useState(false);
  const [revealFor, setRevealFor] = useState<BattleRoundState['lastRound']>(null);
  const [revealIsFinal, setRevealIsFinal] = useState(false);
  const [result, setResult] = useState<BattleHistoryEntry | null>(null);
  const [review, setReview] = useState<BattleReviewEntry[] | null>(null);

  // Refs mirror the state above so interval callbacks always see the latest
  // value without needing to be recreated (and re-poll from scratch) every
  // time one of them changes.
  const currentIndexRef = useRef(0);
  const questionStartedAtRef = useRef('');
  const mySelectionRef = useRef<string | null>(null);
  const myAnsweredRef = useRef(false);
  const timeoutFiredForRef = useRef<number | null>(null);
  const pendingNextRef = useRef<{ index: number; startedAt: string } | null>(null);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  useEffect(() => {
    questionStartedAtRef.current = questionStartedAt;
  }, [questionStartedAt]);
  useEffect(() => {
    mySelectionRef.current = mySelection;
  }, [mySelection]);
  useEffect(() => {
    myAnsweredRef.current = myAnswered;
  }, [myAnswered]);

  const finishToResult = useCallback(async () => {
    const data = await getMyBattles();
    const historyMatch = data.history.find((b) => b.battleId === numericId);
    setResult(historyMatch ?? null);
    setPhase(historyMatch ? 'result' : 'not-found');
  }, [numericId]);

  const applyRoundState = useCallback(
    (state: BattleRoundState) => {
      if (state.status === 'completed') {
        if (state.lastRound && state.lastRound.index === currentIndexRef.current && !pendingNextRef.current) {
          pendingNextRef.current = { index: -1, startedAt: '' }; // marker: "finish" is the pending action
          setRevealFor(state.lastRound);
          setRevealIsFinal(true);
          setPhase('reveal');
        } else if (phase !== 'reveal' && phase !== 'result') {
          finishToResult();
        }
        return;
      }

      if (state.currentQuestionIndex > currentIndexRef.current) {
        if (state.lastRound && !pendingNextRef.current) {
          pendingNextRef.current = { index: state.currentQuestionIndex, startedAt: state.questionStartedAt };
          setRevealFor(state.lastRound);
          setRevealIsFinal(false);
          setPhase('reveal');
        }
        return;
      }

      setOpponentAnswered(state.opponentAnsweredThisRound);
      setMyAnswered(state.myAnsweredThisRound);
    },
    [finishToResult, phase],
  );

  const submitRound = useCallback(
    async (optionId: string | null) => {
      const q = questions[currentIndexRef.current];
      if (!q) return;
      const correct = optionId !== null && optionId === q.correctOptionId;
      try {
        const state = await submitBattleAnswer(numericId, currentIndexRef.current, q.id, optionId, correct);
        applyRoundState(state);
      } catch {
        // Transient failure — the next poll tick will pick the round state back up.
      }
    },
    [numericId, questions, applyRoundState],
  );

  function handleSelect(optionId: string) {
    if (myAnsweredRef.current) return;
    setMySelection(optionId);
    setMyAnswered(true);
    submitRound(optionId);
  }

  function handleContinue() {
    const pending = pendingNextRef.current;
    pendingNextRef.current = null;
    setRevealFor(null);
    if (revealIsFinal || !pending) {
      finishToResult();
      return;
    }
    timeoutFiredForRef.current = null;
    setMySelection(null);
    setMyAnswered(false);
    setOpponentAnswered(false);
    setCurrentIndex(pending.index);
    setQuestionStartedAt(pending.startedAt);
    setPhase('playing');
  }

  const load = useCallback(async () => {
    const data = await getMyBattles();

    const activeMatch = data.active.find((b) => b.battleId === numericId);
    if (activeMatch) {
      const qs = resolveBattleQuestions(activeMatch.questionIds);
      setBattle(activeMatch);
      setQuestions(qs);
      setCurrentIndex(activeMatch.currentQuestionIndex);
      setQuestionStartedAt(activeMatch.questionStartedAt);
      setMySelection(null);
      setMyAnswered(false);
      setOpponentAnswered(false);

      try {
        const round = await getBattleRound(numericId);
        setCurrentIndex(round.currentQuestionIndex);
        setQuestionStartedAt(round.questionStartedAt);
        setMyAnswered(round.myAnsweredThisRound);
        setOpponentAnswered(round.opponentAnsweredThisRound);
      } catch {
        // Fall back to the getMyBattles snapshot above.
      }

      setPhase('playing');
      return;
    }

    const historyMatch = data.history.find((b) => b.battleId === numericId);
    if (historyMatch) {
      setResult(historyMatch);
      setPhase('result');
      return;
    }

    setPhase('not-found');
  }, [numericId]);

  useEffect(() => {
    if (Number.isNaN(numericId)) {
      setPhase('not-found');
      return;
    }
    load();
    // Runs once per battleId — `load` is stable for a given numericId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericId]);

  // Countdown + local timeout handling for the current round.
  useEffect(() => {
    if (phase !== 'playing' || !questionStartedAt) return;
    const started = new Date(questionStartedAt).getTime();
    const tick = () => {
      const left = Math.max(0, Math.ceil((started + ROUND_SECONDS * 1000 - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0 && timeoutFiredForRef.current !== currentIndexRef.current) {
        timeoutFiredForRef.current = currentIndexRef.current;
        submitRound(mySelectionRef.current);
      }
    };
    tick();
    const id = setInterval(tick, 300);
    return () => clearInterval(id);
  }, [phase, questionStartedAt, submitRound]);

  // Polls the round state so a round that resolves purely from the
  // opponent's side (they answered, or their own timeout forced mine) is
  // still noticed by this client.
  useEffect(() => {
    if (phase !== 'playing' || Number.isNaN(numericId)) return;
    const id = setInterval(async () => {
      try {
        const state = await getBattleRound(numericId);
        applyRoundState(state);
      } catch {
        // Transient — next tick retries.
      }
    }, POLL_MS);
    return () => clearInterval(id);
  }, [phase, numericId, applyRoundState]);

  async function openReview() {
    if (Number.isNaN(numericId)) return;
    const entries = await getBattleReview(numericId);
    setReview(entries);
    setPhase('review');
  }

  if (phase === 'loading') {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  if (phase === 'not-found') {
    return (
      <AppShell>
        <div style={{ padding: '20px 20px 4px' }}>
          <BackButton onClick={() => navigate('/friends')} />
        </div>
        <EmptyState icon="target" title="Duelo no encontrado" description="Puede que ya haya terminado o que el enlace no sea correcto." />
      </AppShell>
    );
  }

  if (phase === 'reveal') {
    const q = questions[revealFor?.index ?? currentIndex];
    const mine = revealFor?.myAnswer;
    const theirs = revealFor?.opponentAnswer;
    return (
      <AppShell>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 24px 20px' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--color-text)', textAlign: 'center', margin: '10px 0 20px' }}>
              {q?.question}
            </div>

            <RevealRow
              label="Tu respuesta"
              text={mine?.selectedOptionId ? q?.options.find((o) => o.id === mine.selectedOptionId)?.text ?? '—' : 'Sin responder'}
              correct={mine?.correct ?? false}
            />
            <div style={{ height: 10 }} />
            <RevealRow
              label={`Respuesta de ${battle?.displayName ?? 'tu rival'}`}
              text={theirs?.selectedOptionId ? q?.options.find((o) => o.id === theirs.selectedOptionId)?.text ?? '—' : 'Sin responder'}
              correct={theirs?.correct ?? false}
            />

            {!mine?.correct && q && (
              <div style={{ marginTop: 16, padding: 14, borderRadius: 14, background: 'var(--color-bg-screen)' }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-success)', marginBottom: 4 }}>
                  Correcta: {q.options.find((o) => o.id === q.correctOptionId)?.text}
                </div>
                {q.explanation && <p style={{ fontSize: 12.5, color: 'var(--color-text-muted-60)', lineHeight: 1.5, margin: 0 }}>{q.explanation}</p>}
              </div>
            )}
          </div>

          <Button onClick={handleContinue} style={{ marginTop: 16 }}>
            {revealIsFinal ? 'VER RESULTADO' : 'SIGUIENTE PREGUNTA'}
          </Button>
        </div>
      </AppShell>
    );
  }

  if (phase === 'result' && result) {
    const won = result.won;
    const tied = result.tied;
    return (
      <AppShell>
        <div
          className="anim-pop-in"
          style={{
            padding: '36px 24px 26px',
            textAlign: 'center',
            background: tied
              ? 'linear-gradient(135deg,#4b5566,#5b6472)'
              : won
                ? 'linear-gradient(135deg,#122B57,#1E4694 60%,#2F6FED)'
                : 'linear-gradient(135deg,#5b1f22,#7a2a2f)',
            color: '#fff',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Duelo contra {result.displayName}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, marginTop: 8 }}>
            {result.myCorrectCount} - {result.opponentCorrectCount}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, marginTop: 6 }}>
            {tied ? 'Empate' : won ? '¡Has ganado el duelo!' : 'Has perdido este duelo'}
          </div>
        </div>
        <div style={{ flex: 1, padding: 20 }}>
          <p style={{ fontSize: 13.5, color: 'var(--color-text-muted-60)', textAlign: 'center' }}>
            {won ? '+50 XP por ganar' : tied ? '+15 XP por el empate' : '+5 XP por participar'}
          </p>
        </div>
        <div style={{ padding: '16px 20px 26px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button variant="secondary" onClick={openReview}>
            REVISAR PREGUNTAS
          </Button>
          <Button onClick={() => navigate('/friends')}>VOLVER A AMIGOS</Button>
        </div>
      </AppShell>
    );
  }

  if (phase === 'review' && review && result) {
    return (
      <AppShell>
        <div style={{ padding: '18px 20px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackButton onClick={() => setPhase('result')} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--color-text)' }}>
            Revisión del duelo
          </span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {review.map((entry, i) => {
            const q = getQuestion(entry.questionId);
            if (!q) return null;
            return (
              <div key={entry.questionId} style={{ background: '#fff', borderRadius: 14, padding: 14, boxShadow: 'var(--shadow-card)' }}>
                <div style={{ fontSize: 11.5, color: 'var(--color-text-muted-45)', fontWeight: 700, marginBottom: 4 }}>PREGUNTA {i + 1}</div>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-text)', marginBottom: 8 }}>{q.question}</div>

                <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: entry.myCorrect ? 'var(--color-success)' : 'var(--color-error)' }}>
                  Tú: {entry.mySelectedOptionId ? q.options.find((o) => o.id === entry.mySelectedOptionId)?.text : 'Sin responder'}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    marginBottom: 6,
                    color: entry.opponentCorrect ? 'var(--color-success)' : 'var(--color-error)',
                  }}
                >
                  {result.displayName}: {entry.opponentSelectedOptionId ? q.options.find((o) => o.id === entry.opponentSelectedOptionId)?.text : 'Sin responder'}
                </div>

                {!entry.myCorrect && (
                  <div style={{ fontSize: 12.5, color: 'var(--color-success)', fontWeight: 600, marginBottom: 6 }}>
                    Correcta: {q.options.find((o) => o.id === q.correctOptionId)?.text}
                  </div>
                )}
                {q.explanation && <p style={{ fontSize: 12.5, color: 'var(--color-text-muted-60)', lineHeight: 1.5, margin: 0 }}>{q.explanation}</p>}
                <ContentProvenanceNote source={q.source} />
              </div>
            );
          })}
        </div>
      </AppShell>
    );
  }

  const question = questions[currentIndex];
  if (!question) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
        <div style={{ padding: '16px 20px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackButton onClick={() => (confirm('¿Salir del duelo? El contador no se detiene.') ? navigate('/friends') : null)} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted-45)' }}>
              Duelo vs {battle?.displayName} · Pregunta {currentIndex + 1} / {questions.length}
            </div>
            <div style={{ height: 6, background: 'var(--color-divider)', borderRadius: 999, marginTop: 4, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  background: 'var(--color-primary)',
                  borderRadius: 999,
                }}
              />
            </div>
          </div>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 13,
              color: secondsLeft <= 10 ? '#fff' : 'var(--color-text)',
              background: secondsLeft <= 10 ? 'var(--color-error)' : 'var(--color-bg-locked)',
            }}
          >
            {secondsLeft}
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
                state={mySelection === option.id ? 'selected' : 'idle'}
                disabled={myAnswered}
                onClick={() => handleSelect(option.id)}
              />
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--color-text-muted-50)', fontWeight: 600, paddingBottom: 20 }}>
          {myAnswered
            ? opponentAnswered
              ? 'Resolviendo…'
              : `Esperando a ${battle?.displayName ?? 'tu rival'}…`
            : opponentAnswered
              ? `${battle?.displayName ?? 'Tu rival'} ya ha respondido`
              : 'Elige una respuesta antes de que acabe el tiempo'}
        </div>
      </div>
    </AppShell>
  );
}

function RevealRow({ label, text, correct }: { label: string; text: string; correct: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 14px',
        borderRadius: 12,
        background: correct ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
      }}
    >
      <Icon name={correct ? 'check' : 'close'} size={16} color={correct ? 'var(--color-success)' : 'var(--color-error)'} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted-50)' }}>{label}</div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)' }}>{text}</div>
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      aria-label="Volver"
      style={{ width: 32, height: 32, padding: 0, borderRadius: 10, flex: 'none' }}
    >
      <Icon name="close" size={14} />
    </Button>
  );
}
