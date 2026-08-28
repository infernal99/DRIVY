import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { useAuthStore } from '../store/authStore';
import { computeStats } from '../services/progressService';
import { getLevelInfo } from '../utils/xp';
import { ACHIEVEMENTS } from '../data/achievements';
import { AppShell } from '../components/layout/AppShell';
import { BottomNav } from '../components/layout/BottomNav';
import { Icon } from '../components/ui/Icon';
import { Pill } from '../components/ui/Pill';
import { signOut } from '../services/authService';
import type { IconName } from '../types';

export function ProfilePage() {
  const navigate = useNavigate();
  const progress = useProgressStore((s) => s.progress);
  const authStatus = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const stats = computeStats(progress);
  const { level } = getLevelInfo(progress.xp);
  const unlockedIds = new Set(progress.achievements.map((a) => a.id));

  const links: { name: string; icon: IconName; to: string }[] = [
    { name: 'Amigos', icon: 'users', to: '/friends' },
    { name: 'Estadísticas', icon: 'chart', to: '/progress' },
    { name: 'Fuentes oficiales', icon: 'sources', to: '/sources' },
    { name: 'Configuración', icon: 'settings', to: '/settings' },
    { name: 'Ayuda', icon: 'help', to: '/help' },
  ];

  return (
    <AppShell nav={<BottomNav />}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#2F6FED,#5B8CF5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              color: '#fff',
              fontSize: 28,
              boxShadow: '0 8px 20px rgba(47,111,237,0.3)',
            }}
          >
            {progress.userName.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--color-text)', marginTop: 10 }}>
            {progress.userName}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Pill>Nivel {level}</Pill>
            <Pill bg="var(--color-xp-bg)" color="var(--color-xp-text)">
              {stats.xp.toLocaleString('es-ES')} XP
            </Pill>
            <Pill bg="var(--color-streak-bg)" color="var(--color-streak-text)">
              {stats.streakCount} días
            </Pill>
          </div>
          {authStatus === 'authenticated' && user?.email && (
            <div style={{ fontSize: 12, color: 'var(--color-text-muted-45)', marginTop: 8 }}>{user.email}</div>
          )}
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)', marginBottom: 12 }}>
          Logros
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
          {ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedIds.has(a.id);
            return (
              <div
                key={a.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  background: '#fff',
                  borderRadius: 14,
                  padding: '16px 10px',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-card)',
                  opacity: unlocked ? 1 : 0.45,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: unlocked ? 'var(--color-xp-bg)' : 'var(--color-bg-locked)',
                    color: unlocked ? 'var(--color-xp-text)' : 'var(--color-text-muted-40)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                  }}
                >
                  <Icon name={a.icon} size={20} />
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>{a.name}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
          {links.map((link, i) => (
            <button
              key={link.name}
              type="button"
              onClick={() => navigate(link.to)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                borderBottom: i < links.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                border: 'none',
                borderBottomStyle: 'solid',
                background: 'none',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--color-bg-screen)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text)' }}>
                <Icon name={link.icon} size={16} />
              </div>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{link.name}</span>
              <Icon name="chevronRight" size={13} color="rgba(16,25,46,0.3)" />
            </button>
          ))}
        </div>

        {authStatus === 'authenticated' && (
          <button
            type="button"
            onClick={() => signOut()}
            style={{
              width: '100%',
              marginTop: 16,
              padding: '14px 16px',
              border: 'none',
              borderRadius: 16,
              background: '#fff',
              boxShadow: 'var(--shadow-card)',
              color: 'var(--color-error)',
              fontWeight: 700,
              fontSize: 14,
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </AppShell>
  );
}
