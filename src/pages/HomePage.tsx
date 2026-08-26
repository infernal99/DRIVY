import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { useLearnPath, useOverallProgressPct } from '../hooks/useLearnPath';
import { getLevelInfo } from '../utils/xp';
import { getReadinessScore, READINESS_TIER_COPY } from '../services/masteryService';
import { Icon } from '../components/ui/Icon';
import { ModulePath } from '../components/learn/ModulePath';
import { DailyMissionsCard } from '../components/missions/DailyMissionsCard';
import { DashboardHighlights } from '../components/home/DashboardHighlights';
import { AppShell } from '../components/layout/AppShell';
import { BottomNav } from '../components/layout/BottomNav';

export function HomePage() {
  const navigate = useNavigate();
  const progress = useProgressStore((s) => s.progress);
  const modules = useLearnPath();
  const pct = useOverallProgressPct();
  const readiness = getReadinessScore(progress);
  const { level } = getLevelInfo(progress.xp);
  const activeModule = modules.find((m) => m.status === 'active');
  const inProgressCount = modules.filter((m) => m.status !== 'locked').length;

  return (
    <AppShell nav={<BottomNav />}>
      <div style={{ padding: '18px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'linear-gradient(135deg,#2F6FED,#5B8CF5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              color: '#fff',
              fontSize: 17,
            }}
          >
            {progress.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)' }}>
              {progress.userName}
            </div>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: 'var(--color-primary)',
                background: 'var(--color-info-bg)',
                padding: '2px 8px',
                borderRadius: 999,
                display: 'inline-block',
                marginTop: 2,
              }}
            >
              Nivel {level}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <HeaderChip>
            <Icon name="flame" size={14} color="var(--color-streak)" />
            <span>{progress.streakCount}</span>
          </HeaderChip>
          <HeaderChip>
            <div style={{ width: 10, height: 10, background: 'var(--color-xp)', transform: 'rotate(45deg)', borderRadius: 2 }} />
            <span>{progress.xp}</span>
          </HeaderChip>
        </div>
      </div>

      <div style={{ padding: '4px 20px 100px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg,#122B57,#1E4694 60%,#2F6FED)',
            borderRadius: 22,
            padding: 22,
            color: '#fff',
            boxShadow: 'var(--shadow-hero)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ fontSize: 12.5, fontWeight: 600, opacity: 0.75, textTransform: 'uppercase', letterSpacing: 0.4 }}>
            Tu progreso hacia el examen
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 44, marginTop: 6 }}>{pct}%</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4, maxWidth: 220, lineHeight: 1.4 }}>
            Estás cada vez más cerca de estar preparado
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.18)', borderRadius: 999, marginTop: 14, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--color-xp)', borderRadius: 999, transition: 'width .4s ease' }} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/progress')}
          style={{
            marginTop: 12,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fff',
            border: 'none',
            borderRadius: 14,
            padding: '12px 14px',
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="shield" size={16} color={READINESS_TIER_COPY[readiness.tier].color} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>¿Estás preparado?</span>
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: READINESS_TIER_COPY[readiness.tier].color }}>
            {readiness.score} · {READINESS_TIER_COPY[readiness.tier].label}
          </span>
        </button>

        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--color-text)' }}>
            Tu camino
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted-45)' }}>
            {inProgressCount} / {modules.length} en curso
          </span>
        </div>

        <ModulePath modules={modules} />

        {activeModule && (
          <button
            type="button"
            onClick={() => navigate(`/learn/${activeModule.category.id}`)}
            style={{
              marginTop: 24,
              width: '100%',
              padding: 16,
              border: 'none',
              borderRadius: 16,
              background: 'var(--color-primary)',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: 0.3,
              boxShadow: 'var(--shadow-btn-primary)',
            }}
          >
            CONTINUAR APRENDIENDO
          </button>
        )}

        <DailyMissionsCard />
        <DashboardHighlights progress={progress} />
      </div>
    </AppShell>
  );
}

function HeaderChip({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        background: '#fff',
        padding: '6px 10px',
        borderRadius: 999,
        boxShadow: 'var(--shadow-card)',
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--color-text)',
      }}
    >
      {children}
    </div>
  );
}
