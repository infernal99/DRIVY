import { useNavigate } from 'react-router-dom';
import { useLearnPath } from '../hooks/useLearnPath';
import { LearnPath, type PathNode } from '../components/learn/LearnPath';
import { lessonVisual } from '../components/learn/pathVisuals';
import { AppShell } from '../components/layout/AppShell';
import { BottomNav } from '../components/layout/BottomNav';

export function LearnPage() {
  const navigate = useNavigate();
  const modules = useLearnPath();

  const nodes: PathNode[] = modules.map((m) => {
    const visual = lessonVisual('', m.category);
    return {
      id: m.category.id,
      label: m.category.name,
      meta: m.status === 'active' && m.totalLessons > 0 ? `${m.completedLessons}/${m.totalLessons} lecciones` : undefined,
      icon: visual.icon,
      glow: visual.glow,
      kind: 'lesson',
      status: m.status,
      onClick: m.status === 'locked' ? undefined : () => navigate(`/learn/${m.category.id}`),
    };
  });

  return (
    <AppShell nav={<BottomNav />}>
      <div style={{ padding: '20px 20px 4px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: 'var(--color-text)' }}>
          Aprender
        </span>
      </div>
      <div style={{ padding: '10px 20px 20px' }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted-50)', margin: '0 0 18px', lineHeight: 1.5 }}>
          Sigue el camino y desbloquea cada módulo del temario.
        </p>
        <LearnPath nodes={nodes} />
      </div>
    </AppShell>
  );
}
