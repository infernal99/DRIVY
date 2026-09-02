import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  abandonBattle,
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
import { playAnswerFeedback } from '../services/feedbackEffects';
import { useProgressStore } from '../store/progressStore';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Avatar } from '../components/ui/Avatar';
import { LoadingScreen } from '../components/ui/Loading';
import { EmptyState } from '../components/ui/EmptyState';
import { ContentProvenanceNote } from '../components/ui/ContentProvenanceNote';
import { AiTutorPanel } from '../components/ui/AiTutorPanel';
import { explainMistake } from '../services/aiTutorService';
import { useShareResult } from '../components/ui/ShareResultButton';
import { Mascot } from '../components/mascot/Mascot';
import { useMascot } from '../components/mascot/useMascot';
import { OptionRow, QuestionImage } from '../components/lesson/QuestionCard';
import type { Question } from '../types';

type Phase = 'loading' | 'playing' | 'reveal' | 'result' | 'abandoned' | 'review' | 'not-found';

const ROUND_SECONDS = 30;
const REVEAL_SECONDS = 10;
const POLL_MS = 1300;

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function BattlePage() {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const numericId = battleId ? Number(battleId) : NaN;
  const userName = useProgressStore((s) => s.progress.userName);

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
  const [revealSecondsLeft, setRevealSecondsLeft] = useState(REVEAL_SECONDS);
  const [result, setResult] = useState<BattleHistoryEntry | null>(null);
  const [review, setReview] = useState<BattleReviewEntry[] | null>(null);
  const [abandonedByMe, setAbandonedByMe] = useState(false);
  const [reviewReturnPhase, setReviewReturnPhase] = useState<'result' | 'abandoned'>('result');
  const [durationSec, setDurationSec] = useState<number | null>(null);

  // Solo se puede medir cuando el duelo se juega en esta misma sesión —
  // si se aterriza directo en el resultado (recarga, o desde el historial)
  // no hay hora de inicio real que usar, y no la inventamos.
  const battleStartRef = useRef<number | null>(null);

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
    if (revealFor) playAnswerFeedback(revealFor.myAnswer.correct);
  }, [revealFor]);

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
    if (battleStartRef.current) {
      setDurationSec(Math.round((Date.now() - battleStartRef.current) / 1000));
    }
    if (!historyMatch) {
      setPhase('not-found');
    } else {
      setPhase(historyMatch.status === 'abandoned' ? 'abandoned' : 'result');
    }
  }, [numericId]);

  const applyRoundState = useCallback(
    (state: BattleRoundState) => {
      if (state.status === 'abandoned') {
        setAbandonedByMe(false);
        setPhase('abandoned');
        return;
      }

      if (state.status === 'completed') {
        if (!pendingNextRef.current) {
          pendingNextRef.current = { index: -1, startedAt: '' }; // marker: "finish" is the pending action
          setRevealFor(state.lastRound);
          setRevealIsFinal(true);
          setPhase('reveal');
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
    [],
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

  const handleContinue = useCallback(() => {
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
  }, [revealIsFinal, finishToResult]);

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

      if (battleStartRef.current === null) battleStartRef.current = Date.now();
      setPhase('playing');
      return;
    }

    const historyMatch = data.history.find((b) => b.battleId === numericId);
    if (historyMatch) {
      setResult(historyMatch);
      setPhase(historyMatch.status === 'abandoned' ? 'abandoned' : 'result');
      return;
    }

    setPhase('not-found');
  }, [numericId]);

  async function handleAbandon() {
    if (!confirm('¿Salir del duelo? Terminará para los dos y no contará para las estadísticas de ninguno.')) return;
    try {
      await abandonBattle(numericId);
    } catch {
      // Best effort — even if the call fails, leave locally; the battle
      // will still show as active for the opponent until it times out.
    }
    setAbandonedByMe(true);
    setPhase('abandoned');
  }

  async function openReview() {
    if (Number.isNaN(numericId)) return;
    setReviewReturnPhase(phase === 'abandoned' ? 'abandoned' : 'result');
    const entries = await getBattleReview(numericId);
    setReview(entries);
    setPhase('review');
  }

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

  // The reveal screen always lasts exactly 10s and then auto-advances —
  // fixed, local, and identical for both players, so neither can race ahead
  // of the other into the next question (or the result screen).
  useEffect(() => {
    if (phase !== 'reveal') return;
    let fired = false;
    setRevealSecondsLeft(REVEAL_SECONDS);
    const start = Date.now();
    const tick = () => {
      const left = Math.max(0, REVEAL_SECONDS - Math.floor((Date.now() - start) / 1000));
      setRevealSecondsLeft(left);
      if (left === 0 && !fired) {
        fired = true;
        handleContinue();
      }
    };
    const id = setInterval(tick, 300);
    return () => clearInterval(id);
  }, [phase, handleContinue]);

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

          <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--color-text-muted-50)', fontWeight: 600, marginTop: 16 }}>
            {revealIsFinal ? 'Viendo el resultado' : 'Siguiente pregunta'} en {revealSecondsLeft}s…
          </div>
        </div>
      </AppShell>
    );
  }

  if (phase === 'result' && result) {
    return (
      <BattleResultScreen
        result={result}
        durationSec={durationSec}
        userName={userName}
        onBack={() => navigate('/friends')}
        onReview={openReview}
      />
    );
  }

  if (phase === 'abandoned') {
    return (
      <AppShell>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '30px 30px 0', textAlign: 'center' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--color-bg-locked)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <Icon name="close" size={30} color="var(--color-text-muted-45)" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--color-text)', marginBottom: 8 }}>
            {abandonedByMe ? 'Has salido del duelo' : `${battle?.displayName ?? result?.displayName ?? 'Tu rival'} ha salido del duelo`}
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--color-text-muted-60)', marginBottom: 24 }}>
            No cuenta como victoria ni afecta a las estadísticas de ninguno de los dos.
          </p>
          <div style={{ width: '100%', maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button variant="secondary" onClick={openReview}>
              REVISAR PREGUNTAS
            </Button>
            <Button onClick={() => navigate('/friends')}>VOLVER A AMIGOS</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (phase === 'review' && review) {
    return (
      <AppShell>
        <div style={{ padding: '18px 20px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackButton onClick={() => setPhase(reviewReturnPhase)} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--color-text)' }}>
            Revisión del duelo
          </span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {review.map((entry, i) => {
            const q = getQuestion(entry.questionId);
            if (!q) return null;
            return (
              <div key={entry.questionId} style={{ background: 'var(--color-bg-card)', borderRadius: 14, padding: 14, boxShadow: 'var(--shadow-card)' }}>
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
                  {result?.displayName ?? battle?.displayName ?? 'Tu rival'}: {entry.opponentSelectedOptionId ? q.options.find((o) => o.id === entry.opponentSelectedOptionId)?.text : 'Sin responder'}
                </div>

                {!entry.myCorrect && (
                  <div style={{ fontSize: 12.5, color: 'var(--color-success)', fontWeight: 600, marginBottom: 6 }}>
                    Correcta: {q.options.find((o) => o.id === q.correctOptionId)?.text}
                  </div>
                )}
                {q.explanation && <p style={{ fontSize: 12.5, color: 'var(--color-text-muted-60)', lineHeight: 1.5, margin: '0 0 8px' }}>{q.explanation}</p>}
                {!entry.myCorrect && <AiTutorPanel key={q.id} fetchResponse={() => explainMistake(q, entry.mySelectedOptionId)} />}
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
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-card)' }}>
        <div style={{ padding: '16px 20px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackButton onClick={handleAbandon} />
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

/** Insignia hexagonal de XP — no hay un icono así en el set compartido, y es demasiado pequeño/específico para justificar añadirlo ahí. */
function XpHexIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 1.5 21.5 7v10L12 22.5 2.5 17V7z"
        fill="var(--color-primary)"
        stroke="var(--color-primary-light)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M9 8h2.2l1.3 3.6L13.8 8H16l-2.7 4 2.7 4h-2.2l-1.4-3.7L11 16H8.8l2.7-4L9 8z" fill="#fff" />
    </svg>
  );
}

function StatColumn({ icon, iconColor, value, label }: { icon: 'target' | 'clock' | 'chart'; iconColor: string; value: string; label: string }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <Icon name={icon} size={22} color={iconColor} />
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#fff', marginTop: 8 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted-60)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function ResultActionRow({ icon, text, onClick, disabled }: { icon: 'share' | 'sources'; text: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        height: 47,
        padding: '0 20px',
        borderRadius: 13,
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'var(--color-bg-card)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <Icon name={icon} size={17} color="#fff" />
      <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{text}</span>
    </button>
  );
}

export function BattleResultScreen({
  result,
  durationSec,
  userName,
  onBack,
  onReview,
}: {
  result: BattleHistoryEntry;
  durationSec: number | null;
  userName: string;
  onBack: () => void;
  onReview: () => void;
}) {
  const { won, tied } = result;
  const mascot = useMascot({ idleSleepAfterMs: null });
  const { busy: sharing, note: shareNote, handleClick: handleShare } = useShareResult({
    title: tied ? 'Empate en el duelo' : won ? '¡Has ganado el duelo!' : 'Has perdido este duelo',
    scoreLine: `${result.myCorrectCount}-${result.opponentCorrectCount}`,
    subtitle: `Duelo vs ${result.displayName}`,
    userName,
    positive: won || tied,
  });

  useEffect(() => {
    if (won) mascot.react('achievement', { intensity: 'big' });
    else if (tied) mascot.react('thinking');
    else mascot.react('incorrect');
    // Solo al montar — no queremos relanzar la animación en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myColor = won ? 'var(--color-success)' : tied ? '#fff' : 'var(--color-error)';
  const theirColor = won ? 'var(--color-error)' : tied ? '#fff' : 'var(--color-success)';
  const myGlow = won ? 'rgba(78,203,132,0.35)' : tied ? 'rgba(167,139,250,0.3)' : 'rgba(255,107,111,0.3)';
  const theirGlow = won ? 'rgba(255,107,111,0.3)' : tied ? 'rgba(167,139,250,0.3)' : 'rgba(78,203,132,0.35)';
  const statusText = tied ? 'Empate en este duelo 🤝' : won ? '¡Has ganado este duelo! 🎉' : 'Has perdido este duelo 😔';
  const xpText = won ? '+50 XP por ganar' : tied ? '+15 XP por el empate' : '+5 XP por participar';
  const accuracyPct = result.totalCount > 0 ? Math.round((result.myCorrectCount / result.totalCount) * 100) : 0;

  return (
    <AppShell>
      <div className="anim-pop-in" style={{ padding: '18px 20px 24px' }}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            border: 'none',
            background: 'var(--color-bg-locked)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flex: 'none',
          }}
        >
          <Icon name="chevronLeft" size={20} color="#fff" />
        </button>

        <div>
          <div style={{ textAlign: 'center', marginTop: 22 }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--color-text-muted-60)',
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                background: 'rgba(255,255,255,0.05)',
                padding: '6px 16px',
                borderRadius: 999,
              }}
            >
              Duelo contra {result.displayName}
            </span>
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 4,
                width: 92,
                height: 92,
                borderRadius: '50%',
                background: `radial-gradient(closest-side, ${myGlow}, transparent)`,
                filter: 'blur(6px)',
              }}
            />
            <div style={{ position: 'absolute', left: -8, transform: 'translateY(6px)' }}>
              <Mascot controller={mascot} size={76} bubblePosition="top" />
            </div>

            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 54,
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
              }}
            >
              <span style={{ color: myColor }}>{result.myCorrectCount}</span>
              <span style={{ color: '#fff', fontSize: 32, opacity: 0.6 }}>-</span>
              <span style={{ color: theirColor }}>{result.opponentCorrectCount}</span>
            </div>

            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                right: 4,
                width: 92,
                height: 92,
                borderRadius: '50%',
                background: `radial-gradient(closest-side, ${theirGlow}, transparent)`,
                filter: 'blur(6px)',
              }}
            />
            <div style={{ position: 'absolute', right: -8 }}>
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 0 3px ${theirGlow}, 0 0 22px 4px ${theirGlow}`,
                }}
              >
                <Avatar name={result.displayName} size={60} avatarId={result.avatarUrl} />
              </div>
            </div>
          </div>

          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', textAlign: 'center', marginTop: 18 }}>{statusText}</div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 }}>
            <XpHexIcon size={15} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-primary-light)' }}>{xpText}</span>
          </div>

          <div
            style={{
              marginTop: 26,
              background: 'var(--color-bg-card)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '18px 16px',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                fontSize: 11.5,
                fontWeight: 700,
                color: 'var(--color-text-muted-60)',
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                marginBottom: 16,
              }}
            >
              Tu rendimiento
            </div>
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              <StatColumn icon="target" iconColor="var(--color-error)" value={`${result.myCorrectCount}/${result.totalCount}`} label="Aciertos" />
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '2px 0' }} />
              <StatColumn icon="clock" iconColor="var(--color-xp)" value={durationSec != null ? formatDuration(durationSec) : '—:—'} label="Tiempo" />
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '2px 0' }} />
              <StatColumn icon="chart" iconColor="var(--color-success)" value={`${accuracyPct}%`} label="Precisión" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
          <ResultActionRow icon="share" text={sharing ? 'Generando…' : 'Compartir resultado'} onClick={handleShare} disabled={sharing} />
          {shareNote && <p style={{ fontSize: 11.5, color: 'var(--color-text-muted-60)', textAlign: 'center', margin: 0 }}>{shareNote}</p>}
          <ResultActionRow icon="sources" text="Revisar preguntas" onClick={onReview} />

          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              height: 62,
              padding: '0 16px',
              marginTop: 2,
              borderRadius: 14,
              border: 'none',
              background: 'var(--gradient-brand)',
              boxShadow: 'var(--shadow-btn-primary)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: 'rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon name="users" size={18} color="#fff" />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Volver a amigos</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 1 }}>Elegir nuevo rival</div>
            </div>
            <Icon name="chevronRight" size={18} color="#fff" />
          </button>
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
