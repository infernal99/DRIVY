import { useDailyMissions } from '../../hooks/useDailyMissions';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { ProgressBar } from '../ui/ProgressBar';
import { Skeleton } from '../ui/Loading';
import type { DailyMissionMetric, DailyMissionProgress } from '../../services/missionsService';
import type { IconName } from '../../types';

const METRIC_ICON: Record<DailyMissionMetric, IconName> = {
  questions_answered: 'target',
  lessons_completed: 'book',
  mistakes_practiced: 'check',
  xp_earned: 'chart',
  exams_taken: 'flag',
  battles_played: 'users',
  battles_won: 'flame',
};

/**
 * Solo para /dev/home (sin sesión real, así que useDailyMissions siempre
 * devuelve []) — deja ver la tarjeta con contenido en vez de vacía al
 * iterar el diseño. Nunca se cuela en producción: además del guard
 * `import.meta.env.DEV`, solo se usa cuando el usuario NO está autenticado,
 * y con RequireAuth eso solo pasa en la ruta /dev/home.
 */
const SAMPLE_MISSIONS: DailyMissionProgress[] = [
  { id: 'demo-1', description: 'Repasa 5 preguntas falladas', metric: 'mistakes_practiced', targetAmount: 5, xpReward: 15, progress: 0, completed: false },
  { id: 'demo-2', description: 'Completa un simulacro de examen', metric: 'exams_taken', targetAmount: 1, xpReward: 40, progress: 0, completed: false },
  { id: 'demo-3', description: 'Completa 2 lecciones', metric: 'lessons_completed', targetAmount: 2, xpReward: 30, progress: 0, completed: false },
];

export function DailyMissionsCard() {
  const { missions: realMissions, loading } = useDailyMissions();
  const isAuthenticated = useAuthStore((s) => s.status === 'authenticated');
  const missions = realMissions.length === 0 && !isAuthenticated && import.meta.env.DEV ? SAMPLE_MISSIONS : realMissions;

  if (loading && missions.length === 0) {
    return (
      <div style={{ marginTop: 24 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--color-text)', marginBottom: 12 }}>
          Misiones de hoy
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Skeleton height={62} radius={14} />
          <Skeleton height={62} radius={14} />
        </div>
      </div>
    );
  }
  if (missions.length === 0) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--color-text)', marginBottom: 12 }}>
        Misiones de hoy
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {missions.map((mission) => (
          <Card
            key={mission.id}
            style={{
              position: 'relative',
              overflow: 'hidden',
              padding: 14,
              boxShadow: mission.completed ? '0 0 0 1.5px var(--color-success), var(--shadow-card)' : 'var(--shadow-card)',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                zIndex: 0,
                left: -26,
                top: -26,
                width: 96,
                height: 96,
                borderRadius: '50%',
                pointerEvents: 'none',
                background: mission.completed
                  ? 'radial-gradient(closest-side, rgba(34,197,94,0.18), transparent)'
                  : 'radial-gradient(closest-side, rgba(139,92,246,0.16), transparent)',
              }}
            />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div
                  className={mission.completed ? 'anim-pop-in' : undefined}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: mission.completed ? 'var(--gradient-success)' : 'var(--gradient-brand)',
                    boxShadow: mission.completed
                      ? '0 4px 10px rgba(34,197,94,0.4)'
                      : '0 4px 10px rgba(139,92,246,0.35)',
                  }}
                >
                  <Icon name={mission.completed ? 'check' : METRIC_ICON[mission.metric]} size={17} color="#fff" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text)' }}>{mission.description}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-xp-text)', marginTop: 1 }}>+{mission.xpReward} XP</div>
                </div>
              </div>
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: mission.completed ? 'var(--color-success)' : 'var(--color-text-muted-45)',
                  flex: 'none',
                }}
              >
                {mission.progress}/{mission.targetAmount}
              </span>
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <ProgressBar
                pct={(mission.progress / mission.targetAmount) * 100}
                color={mission.completed ? 'var(--color-success)' : 'var(--color-primary)'}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
