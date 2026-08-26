import { useDailyMissions } from '../../hooks/useDailyMissions';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { ProgressBar } from '../ui/ProgressBar';
import { Skeleton } from '../ui/Loading';
import type { DailyMissionMetric } from '../../services/missionsService';
import type { IconName } from '../../types';

const METRIC_ICON: Record<DailyMissionMetric, IconName> = {
  questions_answered: 'target',
  lessons_completed: 'book',
  mistakes_practiced: 'check',
  xp_earned: 'chart',
};

export function DailyMissionsCard() {
  const { missions, loading } = useDailyMissions();

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
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--color-text)', marginBottom: 12 }}>
        Misiones de hoy
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {missions.map((mission) => (
          <Card key={mission.id} style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div
                  className={mission.completed ? 'anim-pop-in' : undefined}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: mission.completed ? 'var(--color-success-bg)' : 'var(--color-info-bg)',
                    color: mission.completed ? 'var(--color-success)' : 'var(--color-primary)',
                  }}
                >
                  <Icon name={mission.completed ? 'check' : METRIC_ICON[mission.metric]} size={15} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{mission.description}</span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: mission.completed ? 'var(--color-success)' : 'var(--color-text-muted-45)',
                  flex: 'none',
                }}
              >
                {mission.progress}/{mission.targetAmount}
              </span>
            </div>
            <ProgressBar
              pct={(mission.progress / mission.targetAmount) * 100}
              color={mission.completed ? 'var(--color-success)' : 'var(--color-primary)'}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
