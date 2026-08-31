import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { usePremiumStore } from '../store/premiumStore';
import { useLearnPath, useOverallProgressPct } from '../hooks/useLearnPath';
import { getLevelInfo } from '../utils/xp';
import { getReadinessScore, READINESS_TIER_COPY } from '../services/masteryService';
import { Icon } from '../components/ui/Icon';
import { ModulePath } from '../components/learn/ModulePath';
import { DailyMissionsCard } from '../components/missions/DailyMissionsCard';
import { DashboardHighlights } from '../components/home/DashboardHighlights';
import { PremiumBanner } from '../components/premium/PremiumBanner';
import { AppShell } from '../components/layout/AppShell';
import { BottomNav } from '../components/layout/BottomNav';
import { OnboardingTutorial } from '../components/onboarding/OnboardingTutorial';
import { useOnboarding } from '../hooks/useOnboarding';

export function HomePage() {
  const navigate = useNavigate();
  const { shouldShow: showOnboarding, complete: completeOnboarding } = useOnboarding();
  const progress = useProgressStore((s) => s.progress);
  const modules = useLearnPath();
  const pct = useOverallProgressPct();
  const readiness = getReadinessScore(progress);
  const { level } = getLevelInfo(progress.xp);
  const activeModule = modules.find((m) => m.status === 'active');
  const inProgressCount = modules.filter((m) => m.status !== 'locked').length;
  const isPremium = usePremiumStore((s) => s.isPremium);
  const premiumLoading = usePremiumStore((s) => s.loading);

  return (
    <AppShell nav={<BottomNav />}>
      <div style={{ padding: '18px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'var(--gradient-brand)',
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
          {isPremium && (
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: '#facc15',
                background: '#18181b',
                padding: '3px 8px',
                borderRadius: 6,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                marginLeft: 4,
              }}
            >
              <Icon name="crown" size={10} color="#facc15" />
              PREMIUM
            </span>
          )}
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
        {!premiumLoading && !isPremium && <PremiumBanner style={{ marginBottom: 12 }} />}

        <div
          style={{
            background: 'var(--gradient-hero)',
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
            background: 'var(--color-bg-card)',
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

        {progress.mistakeIds.length > 0 && (
          <button
            type="button"
            onClick={() => navigate('/practice/mistakes')}
            style={{
              marginTop: 10,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              background: 'var(--color-error-bg)',
              border: 'none',
              borderRadius: 14,
              padding: '12px 14px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="target" size={16} color="var(--color-error)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', textAlign: 'left' }}>
                Repaso inteligente: {progress.mistakeIds.length} {progress.mistakeIds.length === 1 ? 'pregunta' : 'preguntas'} pendientes
              </span>
            </div>
            <Icon name="chevronRight" size={13} color="var(--color-error)" />
          </button>
        )}

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

      {showOnboarding && <OnboardingTutorial onFinish={completeOnboarding} />}
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
        background: 'var(--color-bg-card)',
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
