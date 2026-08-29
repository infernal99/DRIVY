import { useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import type { ModuleInfo } from '../../hooks/useLearnPath';

const OFFSETS = [0, 30, -30, 30, -30, 0];

export function ModulePath({ modules }: { modules: ModuleInfo[] }) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 18 }}>
      {modules.map((m, i) => {
        const offset = OFFSETS[i % OFFSETS.length];
        const hasNext = i < modules.length - 1;
        const clickable = m.status !== 'locked';
        return (
          <div key={m.category.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              type="button"
              disabled={!clickable}
              onClick={() => navigate(`/learn/${m.category.id}`)}
              aria-label={`${m.category.name} — ${
                m.status === 'locked' ? 'bloqueado' : m.status === 'done' ? 'completado' : 'en curso'
              }`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginLeft: offset,
                background: 'none',
                border: 'none',
                cursor: clickable ? 'pointer' : 'default',
                padding: 0,
              }}
            >
              <ModuleNode status={m.status} icon={m.category.icon} />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: m.status === 'active' ? 600 : 500,
                  fontSize: 13.5,
                  color: m.status === 'locked' ? 'var(--color-text-muted-40)' : 'var(--color-text)',
                  width: 150,
                  textAlign: 'left',
                }}
              >
                {m.category.name}
                {m.status === 'active' && m.totalLessons > 0 && (
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted-45)', marginTop: 2 }}>
                    {m.completedLessons}/{m.totalLessons} lecciones
                  </div>
                )}
              </span>
            </button>
            {hasNext && (
              <div
                style={{
                  width: 3,
                  height: 26,
                  background:
                    'repeating-linear-gradient(to bottom, #D5DAE5 0 6px, transparent 6px 12px)',
                  margin: '2px 0',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ModuleNode({ status, icon }: { status: ModuleInfo['status']; icon: ModuleInfo['category']['icon'] }) {
  if (status === 'locked') {
    return (
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'var(--color-bg-locked)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 2px 4px rgba(11,30,61,0.08)',
        }}
      >
        <Icon name="lock" size={20} color="rgba(16,25,46,0.3)" />
      </div>
    );
  }
  if (status === 'active') {
    return (
      <div
        style={{
          width: 66,
          height: 66,
          borderRadius: '50%',
          background: 'var(--gradient-brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-node-active)',
          border: '4px solid #fff',
        }}
      >
        <Icon name={icon} size={26} color="#fff" />
      </div>
    );
  }
  return (
    <div
      style={{
        width: 58,
        height: 58,
        borderRadius: '50%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-card)',
        border: '3px solid var(--color-xp)',
      }}
    >
      <Icon name={icon} size={22} color="var(--color-xp)" />
    </div>
  );
}
