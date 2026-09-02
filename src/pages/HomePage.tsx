import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { usePremiumStore } from '../store/premiumStore';
import { useLearnPath, useOverallProgressPct } from '../hooks/useLearnPath';
import { useCategoryLessons } from '../hooks/useCategoryLessons';
import { getLessonsForCategory } from '../data/lessons';
import { getLevelInfo } from '../utils/xp';
import { getReadinessScore, READINESS_TIER_COPY } from '../services/masteryService';
import { Icon } from '../components/ui/Icon';
import type { IconName } from '../types';
import { LearnPath, type PathNode } from '../components/learn/LearnPath';
import { PathIcon, lessonVisual } from '../components/learn/pathVisuals';
import { DailyMissionsCard } from '../components/missions/DailyMissionsCard';
import { DashboardHighlights } from '../components/home/DashboardHighlights';
import { PremiumBanner } from '../components/premium/PremiumBanner';
import { AppShell } from '../components/layout/AppShell';
import { BottomNav } from '../components/layout/BottomNav';
import { OnboardingTutorial } from '../components/onboarding/OnboardingTutorial';
import { useOnboarding } from '../hooks/useOnboarding';
import { useMyAvatarId } from '../hooks/useMyAvatarId';
import { Avatar } from '../components/ui/Avatar';

export function HomePage() {
  const navigate = useNavigate();
  const { shouldShow: showOnboarding, complete: completeOnboarding } = useOnboarding();
  const progress = useProgressStore((s) => s.progress);
  const modules = useLearnPath();
  const pct = useOverallProgressPct();
  const readiness = getReadinessScore(progress);
  const { level } = getLevelInfo(progress.xp);
  // Si ya no queda ningún tema "activo" (todo completado), seguimos mostrando
  // el camino del último tema en vez de un mensaje muerto — todas sus
  // lecciones salen en verde/"done" y siguen siendo clicables para repasar.
  const activeModule = modules.find((m) => m.status === 'active') ?? modules[modules.length - 1];
  const activeCategory = activeModule?.category;
  const lessonNodes = useCategoryLessons(activeCategory?.id);
  const isPremium = usePremiumStore((s) => s.isPremium);
  const premiumLoading = usePremiumStore((s) => s.loading);
  const avatarId = useMyAvatarId();

  const pathNodes: PathNode[] = useMemo(() => {
    if (!activeCategory) return [];

    const nodes: PathNode[] = lessonNodes.map(({ lesson, status }) => {
      const subId = lesson.id.split('::')[1];
      const visual = lessonVisual(subId, activeCategory);
      return {
        id: lesson.id,
        label: lesson.name,
        meta: status !== 'locked' ? `${lesson.questionCount} preguntas` : undefined,
        icon: visual.icon,
        glow: visual.glow,
        kind: 'lesson',
        status,
        onClick:
          status === 'locked' ? undefined : () => navigate(`/learn/${activeCategory.id}/lesson/${subId}`),
      };
    });

    // Hito intermedio: reto del día, siempre disponible, a mitad de camino.
    if (nodes.length > 4) {
      nodes.splice(3, 0, {
        id: 'checkpoint',
        label: 'Reto del día',
        icon: 'bolt',
        kind: 'checkpoint',
        status: 'active',
        glow: 'rgba(250,204,21,0.5)',
        onClick: () => navigate('/practice/daily'),
      });
    }

    // Cofre de recompensa a mitad-final, puramente celebratorio.
    if (nodes.length > 8) {
      nodes.splice(7, 0, {
        id: 'reward',
        label: '¡Recompensa!',
        icon: 'chest',
        kind: 'reward',
        status: 'active',
        glow: 'rgba(250,204,21,0.5)',
        onClick: () => navigate('/progress'),
      });
    }

    // Remate del tema: simulacro de examen.
    nodes.push({
      id: 'exam',
      label: 'Simulacro',
      icon: 'flag',
      kind: 'exam',
      status: 'active',
      glow: 'rgba(139,92,246,0.55)',
      onClick: () => navigate('/practice/exam/simulacro'),
    });

    // Adelanto en gris del siguiente tema, para que el camino siga bajando.
    const nextModule = modules[modules.indexOf(activeModule!) + 1];
    if (nextModule) {
      getLessonsForCategory(nextModule.category.id)
        .slice(0, 2)
        .forEach((lesson) => {
          const subId = lesson.id.split('::')[1];
          nodes.push({
            id: `teaser-${lesson.id}`,
            label: lesson.name,
            icon: lessonVisual(subId, nextModule.category).icon,
            kind: 'teaser',
            status: 'locked',
          });
        });
    }

    return nodes;
  }, [activeCategory, lessonNodes, modules, activeModule, navigate]);

  return (
    <AppShell nav={<BottomNav />}>
      <div style={{ padding: '18px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ borderRadius: '50%', boxShadow: '0 4px 12px rgba(139,92,246,0.4)' }}>
            <Avatar name={progress.userName} size={46} avatarId={avatarId} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, color: 'var(--color-text)' }}>
              {progress.userName}
            </div>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 700,
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
          <HeaderChip bg="var(--color-streak-bg)">
            <Icon name="flame" size={16} color="var(--color-streak)" />
            <span style={{ color: 'var(--color-streak-text)' }}>{progress.streakCount}</span>
          </HeaderChip>
          <HeaderChip bg="var(--color-xp-bg)">
            <div style={{ width: 12, height: 12, background: 'var(--color-xp)', transform: 'rotate(45deg)', borderRadius: 3 }} />
            <span style={{ color: 'var(--color-xp-text)' }}>{progress.xp}</span>
          </HeaderChip>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        {/* Atmósfera de fondo muy sutil — nada de wallpaper, solo un par de resplandores. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: '50%',
              width: 420,
              height: 420,
              transform: 'translateX(-50%)',
              background: 'radial-gradient(closest-side, rgba(139,92,246,0.16), transparent)',
              filter: 'blur(10px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 520,
              left: '20%',
              width: 260,
              height: 260,
              background: 'radial-gradient(closest-side, rgba(250,204,21,0.1), transparent)',
              filter: 'blur(10px)',
            }}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 1, padding: '4px 20px 100px' }}>
          <GradientBanner decorativeIcon="shield">
            <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 0.6 }}>
              Tu progreso hacia el examen
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, marginTop: 4 }}>{pct}%</div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4, maxWidth: 220, lineHeight: 1.4, fontWeight: 600 }}>
              Estás cada vez más cerca de estar preparado
            </div>
            <div style={{ height: 8, width: '100%', background: 'rgba(255,255,255,0.22)', borderRadius: 999, marginTop: 14, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: '#fff', borderRadius: 999, transition: 'width .4s ease' }} />
            </div>
          </GradientBanner>

          <div style={{ marginTop: 22, width: '86%', marginLeft: 'auto', marginRight: 'auto' }}>
            <UnitCard activeModule={activeModule} modules={modules} navigate={navigate} />
          </div>

          <LearnPath nodes={pathNodes} />

          <div
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: '1px solid var(--color-divider)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {!premiumLoading && !isPremium && <PremiumBanner />}

            <InsightRow
              icon="shield"
              accent={READINESS_TIER_COPY[readiness.tier].color}
              title="¿Estás preparado?"
              subtitle={READINESS_TIER_COPY[readiness.tier].label}
              badge={String(readiness.score)}
              onClick={() => navigate('/progress')}
            />

            {progress.mistakeIds.length > 0 && (
              <InsightRow
                icon="target"
                accent="var(--color-error)"
                title="Repaso inteligente"
                subtitle={`${progress.mistakeIds.length} ${progress.mistakeIds.length === 1 ? 'pregunta pendiente' : 'preguntas pendientes'}`}
                badge={String(progress.mistakeIds.length)}
                onClick={() => navigate('/practice/mistakes')}
              />
            )}
          </div>

          <DailyMissionsCard />
          <DashboardHighlights progress={progress} />
        </div>
      </div>

      {showOnboarding && <OnboardingTutorial onFinish={completeOnboarding} />}
    </AppShell>
  );
}

function UnitCard({
  activeModule,
  modules,
  navigate,
}: {
  activeModule: ReturnType<typeof useLearnPath>[number] | undefined;
  modules: ReturnType<typeof useLearnPath>;
  navigate: (path: string) => void;
}) {
  const unitPct = activeModule && activeModule.totalLessons > 0 ? Math.round((activeModule.completedLessons / activeModule.totalLessons) * 100) : 0;

  return (
    <GradientBanner
      decorativeIcon="signTriangle"
      variant="success"
      compact
      action={
        activeModule && (
          <button
            type="button"
            onClick={() => navigate(`/learn/${activeModule.category.id}`)}
            aria-label="Ver todo el tema"
            style={{
              flexShrink: 0,
              width: 34,
              height: 34,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.22)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 3px 8px rgba(0,0,0,0.15)',
            }}
          >
            <Icon name="chevronRight" size={16} color="#fff" />
          </button>
        )
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 10.5, fontWeight: 800, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 0.6 }}>
          {activeModule ? `Tema ${modules.indexOf(activeModule) + 1}` : 'Tu camino'}
        </span>
        {activeModule && (
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 800,
              background: 'rgba(255,255,255,0.28)',
              padding: '2px 7px',
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Icon name={activeModule.status === 'done' ? 'crown' : 'check'} size={9} color="#fff" strokeWidth={3} />
            {activeModule.status === 'done' ? 'COMPLETADO · REPASA' : 'PUEDES EMPEZAR'}
          </span>
        )}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 16.5,
          marginTop: 3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {activeModule ? activeModule.category.name : '¡Ya te lo sabes todo!'}
      </div>
      {activeModule && activeModule.totalLessons > 0 && (
        <>
          <div style={{ fontSize: 11.5, opacity: 0.9, marginTop: 3, fontWeight: 700 }}>
            {activeModule.completedLessons}/{activeModule.totalLessons} lecciones
          </div>
          <div style={{ height: 5, width: '100%', maxWidth: 190, background: 'rgba(255,255,255,0.22)', borderRadius: 999, marginTop: 5, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${unitPct}%`, background: '#fff', borderRadius: 999, transition: 'width .4s ease' }} />
          </div>
        </>
      )}
    </GradientBanner>
  );
}

/**
 * Tarjeta 3D con degradado de marca — mismo lenguaje visual que los nodos
 * del camino (capa de extrusión + textura + icono decorativo), reutilizada
 * por la tarjeta de progreso (morada, grande) y la de unidad (verde,
 * compacta, "puedes empezar") para que compartan un único diseño.
 */
function GradientBanner({
  children,
  decorativeIcon,
  action,
  variant = 'brand',
  compact = false,
}: {
  children: React.ReactNode;
  decorativeIcon: Parameters<typeof PathIcon>[0]['name'];
  action?: React.ReactNode;
  variant?: 'brand' | 'success';
  compact?: boolean;
}) {
  const gradient = variant === 'success' ? 'var(--gradient-success)' : 'var(--gradient-brand)';
  const glowShadow = variant === 'success' ? 'rgba(34,197,94,0.35)' : 'rgba(139,92,246,0.38)';

  return (
    <div style={{ position: 'relative' }}>
      {/* Borde/extrusión 3D inferior — mismo truco que los nodos del camino. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: compact ? 16 : 20,
          background: gradient,
          filter: 'brightness(0.62) saturate(1.1)',
          transform: `translateY(${compact ? 5 : 7}px)`,
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: gradient,
          borderRadius: compact ? 16 : 20,
          padding: compact ? '12px 14px' : '16px 18px',
          color: '#fff',
          overflow: 'hidden',
          boxShadow: `0 ${compact ? 10 : 14}px ${compact ? 22 : 30}px ${glowShadow}`,
        }}
      >
        {/* Textura sutil + icono decorativo detrás del contenido */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(120deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 26px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: compact ? 34 : 44,
            top: '50%',
            transform: 'translateY(-50%) rotate(-8deg)',
            opacity: 0.18,
          }}
        >
          <PathIcon name={decorativeIcon} size={compact ? 52 : 72} />
        </div>

        <div style={{ position: 'relative', minWidth: 0, flex: 1 }}>{children}</div>

        {action && <div style={{ position: 'relative' }}>{action}</div>}
      </div>
    </div>
  );
}

/**
 * Fila táctil con insignia circular en degradado + halo de color a juego —
 * mismo lenguaje que las insignias de misiones/resumen, para las acciones
 * "¿Estás preparado?" y "Repaso inteligente" que antes eran una fila plana.
 */
function InsightRow({
  icon,
  accent,
  title,
  subtitle,
  badge,
  onClick,
}: {
  icon: IconName;
  accent: string;
  title: string;
  subtitle: string;
  badge: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        background: 'var(--color-bg-card)',
        border: 'none',
        borderRadius: 16,
        padding: '12px 14px',
        boxShadow: 'var(--shadow-card)',
        cursor: 'pointer',
        overflow: 'hidden',
        textAlign: 'left',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: -30,
          top: '50%',
          width: 100,
          height: 100,
          transform: 'translateY(-50%)',
          borderRadius: '50%',
          background: `radial-gradient(closest-side, color-mix(in srgb, ${accent} 18%, transparent), transparent)`,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: accent,
            boxShadow: `0 4px 10px color-mix(in srgb, ${accent} 55%, transparent)`,
          }}
        >
          <Icon name={icon} size={18} color="#fff" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text)' }}>{title}</div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: accent, marginTop: 1 }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: accent,
            background: `color-mix(in srgb, ${accent} 16%, transparent)`,
            padding: '4px 10px',
            borderRadius: 999,
          }}
        >
          {badge}
        </span>
        <Icon name="chevronRight" size={14} color={accent} />
      </div>
    </button>
  );
}

function HeaderChip({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        background: bg,
        padding: '7px 12px',
        borderRadius: 999,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06), 0 2px 6px rgba(0,0,0,0.15)',
        fontSize: 13.5,
        fontWeight: 800,
      }}
    >
      {children}
    </div>
  );
}
