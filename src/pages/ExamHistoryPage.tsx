import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { getExamHistorySummary } from '../services/examService';
import { startPracticeSession } from '../services/premiumService';
import { PremiumUpsellModal } from '../components/premium/PremiumUpsellModal';
import { AppShell } from '../components/layout/AppShell';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { StatTile } from '../components/ui/StatTile';
import { Card } from '../components/ui/Card';
import { Pill } from '../components/ui/Pill';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import type { ExamResult } from '../types';

const RECENT_EVOLUTION_COUNT = 10;

function scorePct(result: ExamResult): number {
  return result.totalCount > 0 ? Math.round((result.correctCount / result.totalCount) * 100) : 0;
}

export function ExamHistoryPage() {
  const navigate = useNavigate();
  const progress = useProgressStore((s) => s.progress);
  const summary = getExamHistorySummary(progress);
  const recent = summary.attempts.slice(-RECENT_EVOLUTION_COUNT);
  const mostRecentFirst = [...summary.attempts].reverse();
  const [showUpsell, setShowUpsell] = useState(false);

  async function startSimulacro() {
    const allowed = await startPracticeSession('simulacro');
    if (allowed) navigate('/practice/exam/simulacro');
    else setShowUpsell(true);
  }

  return (
    <AppShell>
      <ScreenHeader title="Mis exámenes" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 20px 30px' }}>
        {summary.attempts.length === 0 ? (
          <EmptyState
            icon="flag"
            title="Tu primer simulacro te espera"
            description="Haz un simulacro o un examen real para empezar a ver aquí tu historial y tu evolución."
            action={<Button onClick={startSimulacro}>HACER UN SIMULACRO</Button>}
          />
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              <StatTile value={`${summary.bestScorePct}%`} label="Mejor nota" />
              <StatTile value={`${summary.averageScorePct}%`} label="Nota media" />
              <StatTile value={`${summary.passRate}%`} label="Aprobados" />
              <StatTile value={summary.attempts.length} label="Exámenes realizados" />
            </div>

            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)', marginBottom: 12 }}>
              Evolución
            </div>
            <Card style={{ padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 90 }}>
                {recent.map((attempt, i) => {
                  const pct = scorePct(attempt);
                  return (
                    <div
                      key={attempt.id ?? i}
                      title={`${pct}% · ${attempt.passed ? 'Apto' : 'No apto'}`}
                      style={{
                        flex: 1,
                        height: `${Math.max(6, pct)}%`,
                        borderRadius: 4,
                        background: attempt.passed ? 'var(--color-success)' : 'var(--color-error)',
                      }}
                    />
                  );
                })}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted-45)', marginTop: 8 }}>
                Últimos {recent.length} intento{recent.length === 1 ? '' : 's'}, de izquierda (más antiguo) a derecha (más reciente).
              </div>
            </Card>

            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)', marginBottom: 12 }}>
              Historial
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {mostRecentFirst.map((attempt, i) => (
                <Card key={attempt.id ?? i} style={{ padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-text)' }}>
                      {attempt.mode === 'examen-real' ? 'Examen real' : 'Simulacro'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted-50)', marginTop: 2 }}>
                      {new Date(attempt.finishedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--color-text)' }}>
                      {attempt.correctCount}/{attempt.totalCount}
                    </span>
                    <Pill
                      bg={attempt.passed ? 'var(--color-success-bg)' : 'var(--color-error-bg)'}
                      color={attempt.passed ? 'var(--color-success)' : 'var(--color-error)'}
                    >
                      {attempt.passed ? 'Apto' : 'No apto'}
                    </Pill>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {showUpsell && <PremiumUpsellModal onClose={() => setShowUpsell(false)} />}
    </AppShell>
  );
}
