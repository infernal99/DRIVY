import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { AppShell } from '../components/layout/AppShell';
import { BottomNav } from '../components/layout/BottomNav';
import { Icon } from '../components/ui/Icon';
import { CardButton } from '../components/ui/Card';
import { EXAM_CONFIG } from '../services/examService';
import { startPracticeSession, type PracticeKind } from '../services/premiumService';
import { PremiumUpsellModal } from '../components/premium/PremiumUpsellModal';

export function PracticePage() {
  const navigate = useNavigate();
  const mistakeCount = useProgressStore((s) => s.progress.mistakeIds.length);
  const [showUpsell, setShowUpsell] = useState(false);
  const [starting, setStarting] = useState(false);

  async function tryStartPractice(kind: PracticeKind, to: string) {
    if (starting) return;
    setStarting(true);
    try {
      const allowed = await startPracticeSession(kind);
      if (allowed) navigate(to);
      else setShowUpsell(true);
    } finally {
      setStarting(false);
    }
  }

  return (
    <AppShell nav={<BottomNav />}>
      <div style={{ padding: '20px 20px 4px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: 'var(--color-text)' }}>
          Practicar
        </span>
      </div>
      <div style={{ padding: '14px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          type="button"
          onClick={() => tryStartPractice('simulacro', '/practice/exam/simulacro')}
          style={{
            background: 'linear-gradient(135deg,#122B57,#1E4694 60%,#2F6FED)',
            borderRadius: 18,
            padding: 18,
            color: '#fff',
            boxShadow: '0 8px 20px rgba(11,30,61,0.2)',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>Simulacro de examen</div>
          <div style={{ fontSize: 12.5, opacity: 0.8, marginTop: 4 }}>
            {EXAM_CONFIG.questionCount} preguntas · {EXAM_CONFIG.durationSeconds / 60} minutos
          </div>
          <div
            style={{
              display: 'inline-block',
              marginTop: 12,
              padding: '9px 16px',
              background: 'var(--color-xp)',
              color: 'var(--color-text)',
              borderRadius: 10,
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 12.5,
              letterSpacing: 0.3,
              whiteSpace: 'nowrap',
            }}
          >
            COMENZAR SIMULACRO
          </div>
        </button>

        <PracticeRow
          icon="target"
          iconColor="var(--color-error)"
          iconBg="var(--color-error-bg)"
          title="Repasar errores"
          subtitle={mistakeCount > 0 ? `${mistakeCount} preguntas falladas` : 'Sin errores pendientes — ¡bien hecho!'}
          onClick={() => navigate('/practice/mistakes')}
        />
        <PracticeRow
          icon="book"
          iconColor="var(--color-primary)"
          iconBg="var(--color-info-bg)"
          title="Preguntas aleatorias"
          subtitle="10 preguntas al azar de todo el temario, sin repaso adaptativo"
          onClick={() => tryStartPractice('random', '/practice/random')}
        />
        <PracticeRow
          icon="flame"
          iconColor="var(--color-streak)"
          iconBg="var(--color-streak-bg)"
          title="Reto diario"
          subtitle="5 preguntas para mantener tu racha"
          onClick={() => tryStartPractice('daily', '/practice/daily')}
        />
        <PracticeRow
          icon="flag"
          iconColor="var(--color-text)"
          iconBg="var(--color-bg-locked)"
          title="Examen real"
          subtitle="Simulación cronometrada del examen oficial"
          onClick={() => tryStartPractice('examen_real', '/practice/exam/real')}
        />
      </div>

      {showUpsell && <PremiumUpsellModal onClose={() => setShowUpsell(false)} />}
    </AppShell>
  );
}

function PracticeRow({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  onClick,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <CardButton onClick={onClick} style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <Icon name={icon} size={20} color={iconColor} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--color-text)' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted-50)', marginTop: 1 }}>{subtitle}</div>
      </div>
      <Icon name="chevronRight" size={14} color="var(--color-text-muted-30)" />
    </CardButton>
  );
}
