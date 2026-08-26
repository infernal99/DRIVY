import { useLearnPath } from '../hooks/useLearnPath';
import { ModulePath } from '../components/learn/ModulePath';
import { AppShell } from '../components/layout/AppShell';
import { BottomNav } from '../components/layout/BottomNav';

export function LearnPage() {
  const modules = useLearnPath();

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
        <ModulePath modules={modules} />
      </div>
    </AppShell>
  );
}
