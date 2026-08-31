import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { useAuthStore } from '../store/authStore';
import { promptInstall, useInstallPromptStore } from '../store/installPromptStore';
import { usePremiumStore } from '../store/premiumStore';
import { computeStats } from '../services/progressService';
import { getMyAvatarId } from '../services/avatarService';
import { getLevelInfo } from '../utils/xp';
import { ACHIEVEMENTS } from '../data/achievements';
import { AppShell } from '../components/layout/AppShell';
import { BottomNav } from '../components/layout/BottomNav';
import { Icon } from '../components/ui/Icon';
import { Pill } from '../components/ui/Pill';
import { Avatar } from '../components/ui/Avatar';
import { AvatarPickerModal } from '../components/profile/AvatarPickerModal';
import { OnboardingFlag, type FlagCode } from '../components/onboarding/OnboardingFlag';
import { signOut } from '../services/authService';
import { useOnboardingProfile } from '../hooks/useOnboardingProfile';
import { LICENSE_CATEGORIES } from '../data/licenseCategories';
import { ONBOARDING_COUNTRIES } from '../data/onboardingCountries';
import type { IconName } from '../types';

export function ProfilePage() {
  const navigate = useNavigate();
  const progress = useProgressStore((s) => s.progress);
  const authStatus = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const stats = computeStats(progress);
  const { level } = getLevelInfo(progress.xp);
  const unlockedIds = new Set(progress.achievements.map((a) => a.id));

  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const isPremium = usePremiumStore((s) => s.isPremium);

  // Solo se pinta si respondió al onboarding: los usuarios que ya existían
  // antes de esta funcionalidad no tienen nada guardado bajo esta clave.
  const { profile: onboardingProfile } = useOnboardingProfile();
  const onboardingLicense = LICENSE_CATEGORIES.find((c) => c.id === onboardingProfile.licenseCategoryId);
  const onboardingCountry = ONBOARDING_COUNTRIES.find((c) => c.id === onboardingProfile.countryId);

  useEffect(() => {
    if (authStatus !== 'authenticated') return;
    getMyAvatarId()
      .then(setAvatarId)
      .catch(() => setAvatarId(null));
  }, [authStatus]);

  const deferredInstallEvent = useInstallPromptStore((s) => s.deferredEvent);
  const appInstalled = useInstallPromptStore((s) => s.installed);
  const isIOS = useInstallPromptStore((s) => s.isIOS);
  const canInstall = !appInstalled && (!!deferredInstallEvent || isIOS);
  const [showIOSInstallSteps, setShowIOSInstallSteps] = useState(false);

  function handleInstallClick() {
    if (isIOS) {
      setShowIOSInstallSteps((v) => !v);
      return;
    }
    promptInstall();
  }

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
          <button
            type="button"
            onClick={() => authStatus === 'authenticated' && setShowAvatarPicker(true)}
            aria-label="Cambiar avatar"
            style={{ position: 'relative', background: 'none', border: 'none', padding: 0, cursor: authStatus === 'authenticated' ? 'pointer' : 'default' }}
          >
            <div style={{ borderRadius: '50%', boxShadow: 'var(--shadow-btn-primary)' }}>
              <Avatar name={progress.userName} size={76} avatarId={avatarId} />
            </div>
            {authStatus === 'authenticated' && (
              <div
                style={{
                  position: 'absolute',
                  right: -2,
                  bottom: -2,
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  border: '2px solid var(--color-bg-screen)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="settings" size={12} color="#fff" />
              </div>
            )}
          </button>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--color-text)', marginTop: 10 }}>
            {progress.userName}
          </div>
          {onboardingLicense && onboardingCountry && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 4,
                fontSize: 12.5,
                color: 'var(--color-text-muted-55)',
              }}
            >
              <OnboardingFlag code={onboardingCountry.code as FlagCode} size={16} />
              Preparando el carné {onboardingLicense.code} ({onboardingLicense.name.toLowerCase()}) en {onboardingCountry.name}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {isPremium && (
              <Pill bg="#18181b" color="#facc15">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Icon name="crown" size={11} color="#facc15" />
                  PREMIUM
                </span>
              </Pill>
            )}
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
                  background: 'var(--color-bg-card)',
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: 'var(--color-bg-card)', borderRadius: 16, boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
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
                borderBottom: i < links.length - 1 || canInstall ? '1px solid var(--color-border-subtle)' : 'none',
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
              <Icon name="chevronRight" size={13} color="var(--color-text-muted-30)" />
            </button>
          ))}

          {canInstall && (
            <button
              type="button"
              onClick={handleInstallClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                border: 'none',
                background: 'none',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--color-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <Icon name="download" size={16} />
              </div>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>Instalar aplicación</span>
              <Icon name="chevronRight" size={13} color="var(--color-text-muted-30)" />
            </button>
          )}
        </div>

        {showIOSInstallSteps && (
          <p style={{ fontSize: 12, color: 'var(--color-text-muted-60)', lineHeight: 1.5, margin: '10px 4px 0' }}>
            Toca el icono <strong>Compartir</strong> de Safari (el cuadrado con la flecha hacia arriba) y luego <strong>«Añadir a pantalla de inicio»</strong>.
          </p>
        )}

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
              background: 'var(--color-bg-card)',
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

      {showAvatarPicker && (
        <AvatarPickerModal
          currentXp={progress.xp}
          isPremium={isPremium}
          selectedAvatarId={avatarId}
          onClose={() => setShowAvatarPicker(false)}
          onSelected={setAvatarId}
        />
      )}
    </AppShell>
  );
}
