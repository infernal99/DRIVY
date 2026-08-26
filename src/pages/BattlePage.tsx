import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getMyBattles,
  resolveBattleQuestions,
  submitBattleAnswers,
  type ActiveBattleSummary,
  type BattleHistoryEntry,
} from '../services/battlesService';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { LoadingScreen } from '../components/ui/Loading';
import { EmptyState } from '../components/ui/EmptyState';
import { OptionRow, QuestionImage } from '../components/lesson/QuestionCard';
import type { Question } from '../types';

type Phase = 'loading' | 'playing' | 'waiting' | 'result' | 'not-found';

const POLL_MS = 4000;

export function BattlePage() {
  const { battleId } = useParams();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('loading');
  const [battle, setBattle] = useState<ActiveBattleSummary | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [waitingScore, setWaitingScore] = useState<{ correct: number; total: number } | null>(null);
  const [result, setResult] = useState<BattleHistoryEntry | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const numericId = battleId ? Number(battleId) : NaN;

  const load = useCallback(async () => {
    const data = await getMyBattles();

    const activeMatch = data.active.find((b) => b.battleId === numericId);
    if (activeMatch) {
      if (activeMatch.iHaveFinished) {
        setPhase('waiting');
        setBattle(activeMatch);
      } else {
        const qs = resolveBattleQuestions(activeMatch.questionIds);
        setBattle(activeMatch);
        setQuestions(qs);
        setAnswers(new Array(qs.length).fill(null));
        setPhase('playing');
      }
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
  }, [numericId, load]);

  useEffect(() => {
    if (phase !== 'waiting') {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    pollRef.current = setInterval(load, POLL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [phase, load]);

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    const payload = questions.map((q, i) => ({
      questionId: q.id,
      selectedOptionId: answers[i],
      correct: answers[i] === q.correctOptionId,
    }));
    const correctCount = payload.filter((a) => a.correct).length;

    try {
      const res = await submitBattleAnswers(numericId, payload);
      if (res.waitingForOpponent) {
        setWaitingScore({ correct: correctCount, total: questions.length });
        setPhase('waiting');
      } else {
        await load();
      }
    } finally {
      setSubmitting(false);
    }
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

  if (phase === 'waiting') {
    return (
      <AppShell>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '30px 30px 0', textAlign: 'center' }}>
          <div
            className="anim-pop-in"
            style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
          >
            <Icon name="target" size={34} color="var(--color-primary)" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--color-text)', marginBottom: 10 }}>
            Esperando a {battle?.displayName ?? 'tu rival'}…
          </div>
          {waitingScore && (
            <p style={{ fontSize: 14.5, color: 'var(--color-text-muted-60)', margin: '0 0 8px' }}>
              Tú has acertado {waitingScore.correct} de {waitingScore.total}.
            </p>
          )}
          <p style={{ fontSize: 13, color: 'var(--color-text-muted-45)' }}>
            En cuanto termine, veréis aquí quién ha ganado el duelo.
          </p>
          <div style={{ marginTop: 24, width: '100%', maxWidth: 260 }}>
            <Button variant="secondary" onClick={() => navigate('/friends')}>
              Volver a Amigos
            </Button>
          </div>
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
        <div style={{ padding: '16px 20px 26px' }}>
          <Button onClick={() => navigate('/friends')}>VOLVER A AMIGOS</Button>
        </div>
      </AppShell>
    );
  }

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
        <div style={{ padding: '16px 20px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackButton onClick={() => (confirm('¿Salir del duelo? Podrás continuar más tarde.') ? navigate('/friends') : null)} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted-45)' }}>
              Duelo vs {battle?.displayName} · Pregunta {index + 1} / {questions.length}
            </div>
            <div style={{ height: 6, background: 'var(--color-divider)', borderRadius: 999, marginTop: 4, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${((index + 1) / questions.length) * 100}%`,
                  background: 'var(--color-primary)',
                  borderRadius: 999,
                }}
              />
            </div>
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
                state={answers[index] === option.id ? 'selected' : 'idle'}
                disabled={false}
                onClick={() => {
                  const next = [...answers];
                  next[index] = option.id;
                  setAnswers(next);
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ padding: '12px 20px 24px', display: 'flex', gap: 10, background: '#fff', boxShadow: 'var(--shadow-topbar)' }}>
          <Button variant="secondary" disabled={index === 0} onClick={() => setIndex((i) => Math.max(i - 1, 0))} style={{ flex: 1 }}>
            Anterior
          </Button>
          {isLast ? (
            <Button onClick={handleSubmit} disabled={submitting} style={{ flex: 1 }}>
              {submitting ? 'Enviando…' : 'Enviar duelo'}
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
