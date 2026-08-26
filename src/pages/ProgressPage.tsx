import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { computeStats, getWeakPoints } from '../services/progressService';
import { AppShell } from '../components/layout/AppShell';
import { BottomNav } from '../components/layout/BottomNav';
import { StatTile } from '../components/ui/StatTile';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

const WEAK_POINT_COLORS = ['var(--color-error)', 'var(--color-streak)', 'var(--color-success)'];

export function ProgressPage() {
  const navigate = useNavigate();
  const progress = useProgressStore((s) => s.progress);
  const stats = computeStats(progress);
  const weakPoints = getWeakPoints(progress, 3);

  const statCards = [
    { label: 'Preguntas respondidas', value: stats.questionsAnswered.toLocaleString('es-ES') },
    { label: '% de aciertos', value: `${stats.accuracyPct}%` },
    { label: 'Mejor racha', value: `${stats.bestStreak} días` },
    { label: 'XP total', value: stats.xp.toLocaleString('es-ES') },
    { label: 'Exámenes realizados', value: stats.examsTaken },
    { label: 'Exámenes aprobados', value: stats.examsPassed },
  ];

  return (
    <AppShell nav={<BottomNav />}>
      <div style={{ padding: '20px 20px 4px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: 'var(--color-text)' }}>
          Progreso
        </span>
      </div>
      <div style={{ padding: '14px 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {statCards.map((s) => (
            <StatTile key={s.label} value={s.value} label={s.label} />
          ))}
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)', marginBottom: 12 }}>
          Tus puntos débiles
        </div>

        {weakPoints.length === 0 ? (
          <EmptyState
            icon="chart"
            title="Todavía no hay suficientes datos"
            description="Responde algunas preguntas en cada categoría para ver aquí tus puntos débiles."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {weakPoints.map((w, i) => (
              <div key={w.categoryId}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                  <span>{w.name}</span>
                  <span>{w.accuracyPct}%</span>
                </div>
                <ProgressBar pct={w.accuracyPct} color={WEAK_POINT_COLORS[i % WEAK_POINT_COLORS.length]} />
              </div>
            ))}
          </div>
        )}

        <Button onClick={() => navigate('/practice/mistakes')}>PRACTICAR ERRORES</Button>
      </div>
    </AppShell>
  );
}
