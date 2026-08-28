import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { useAuthStore } from '../store/authStore';
import { computeStats } from '../services/progressService';
import { getAllCategoryMastery, getReadinessScore, MASTERY_TIER_COPY, READINESS_DISCLAIMER, READINESS_TIER_COPY } from '../services/masteryService';
import { getCategoryById } from '../data/categories';
import { getMyBattles, type BattleStats } from '../services/battlesService';
import { AppShell } from '../components/layout/AppShell';
import { BottomNav } from '../components/layout/BottomNav';
import { StatTile } from '../components/ui/StatTile';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Card, CardButton } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { Pill } from '../components/ui/Pill';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

const WEAK_CATEGORIES_LIMIT = 3;
/** Same "practiced enough to judge" gate progress.getWeakPoints used to use. */
const MIN_ANSWERED_TO_RANK = 3;

export function ProgressPage() {
  const navigate = useNavigate();
  const progress = useProgressStore((s) => s.progress);
  const authStatus = useAuthStore((s) => s.status);
  const stats = computeStats(progress);

  const [battleStats, setBattleStats] = useState<BattleStats | null>(null);
  useEffect(() => {
    if (authStatus !== 'authenticated') return;
    getMyBattles()
      .then((data) => setBattleStats(data.stats))
      .catch(() => setBattleStats(null));
  }, [authStatus]);
  const readiness = getReadinessScore(progress);
  const categoryMastery = getAllCategoryMastery(progress);
  const weakestCategories = categoryMastery
    .filter((c) => (progress.categoryStats[c.categoryId]?.answered ?? 0) >= MIN_ANSWERED_TO_RANK)
    .sort((a, b) => a.score - b.score)
    .slice(0, WEAK_CATEGORIES_LIMIT);

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
        <Card style={{ padding: 18, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'var(--color-info-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon name="shield" size={18} color="var(--color-primary)" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)' }}>
              ¿Estás preparado?
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--color-text)' }}>
              {readiness.score}
            </span>
            <Pill bg="var(--color-bg-locked)" color={READINESS_TIER_COPY[readiness.tier].color}>
              {READINESS_TIER_COPY[readiness.tier].label}
            </Pill>
          </div>
          <ProgressBar pct={readiness.score} color={READINESS_TIER_COPY[readiness.tier].color} />
          <p style={{ fontSize: 11.5, color: 'var(--color-text-muted-45)', lineHeight: 1.5, margin: '10px 0 0' }}>
            {READINESS_DISCLAIMER}
          </p>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          {statCards.map((s) => (
            <StatTile key={s.label} value={s.value} label={s.label} />
          ))}
        </div>

        {battleStats && battleStats.battlesPlayed > 0 && (
          <>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)', marginBottom: 12 }}>
              Duelos
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
              <StatTile value={`${battleStats.winRatePct}%`} label="Victorias" />
              <StatTile value={`${battleStats.accuracyPct}%`} label="Acierto en duelos" />
              <StatTile value={battleStats.battlesPlayed} label="Jugados" />
            </div>
          </>
        )}

        <CardButton
          onClick={() => navigate('/exams')}
          style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 10, width: '100%', marginBottom: 20 }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <Icon name="flag" size={16} color="var(--color-primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-text)' }}>Mis exámenes</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-text-muted-50)', marginTop: 1 }}>Historial, mejor nota y evolución</div>
          </div>
          <Icon name="chevronRight" size={14} color="var(--color-text-muted-30)" />
        </CardButton>

        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)', marginBottom: 12 }}>
          Tus puntos débiles
        </div>

        {weakestCategories.length === 0 ? (
          <EmptyState
            icon="chart"
            title="Todavía no hay suficientes datos"
            description="Responde algunas preguntas en cada categoría para ver aquí tus puntos débiles."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {weakestCategories.map((c) => (
              <div key={c.categoryId}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                  <span>{getCategoryById(c.categoryId)?.name ?? c.categoryId}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Pill bg="var(--color-bg-locked)" color={MASTERY_TIER_COPY[c.tier].color}>
                      {MASTERY_TIER_COPY[c.tier].label}
                    </Pill>
                    {c.score}%
                  </span>
                </div>
                <ProgressBar pct={c.score} color={MASTERY_TIER_COPY[c.tier].color} />
              </div>
            ))}
          </div>
        )}

        <Button onClick={() => navigate('/practice/mistakes')}>PRACTICAR ERRORES</Button>
      </div>
    </AppShell>
  );
}
