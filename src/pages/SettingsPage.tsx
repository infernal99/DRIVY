import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { useAuthStore } from '../store/authStore';
import { changePassword, deleteOwnAccount, MIN_PASSWORD_LENGTH } from '../services/authService';
import { getMyFriendships, updatePrivacySettings } from '../services/friendsService';
import {
  disablePushNotifications,
  enablePushNotifications,
  getNotificationPermission,
  hasActivePushSubscription,
  isPushSupported,
} from '../services/pushService';
import { useThemeStore, type ThemePreference } from '../store/themeStore';
import { useFeedbackSettingsStore } from '../store/feedbackSettingsStore';
import { PremiumPricingCard } from '../components/premium/PremiumPricingCard';
import { AppShell } from '../components/layout/AppShell';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { AuthField } from '../components/auth/AuthField';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Toggle } from '../components/ui/Toggle';

export function SettingsPage() {
  const navigate = useNavigate();
  const userName = useProgressStore((s) => s.progress.userName);
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const authStatus = useAuthStore((s) => s.status);
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <AppShell>
      <ScreenHeader title="Configuración" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 30px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {authStatus === 'authenticated' && <PremiumPricingCard />}
        <AppearanceCard />
        <FeedbackFxCard />

        <Card style={{ padding: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)', marginBottom: 4 }}>Nombre</div>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted-60)', margin: 0 }}>{userName}</p>
        </Card>

        <Card style={{ padding: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)', marginBottom: 4 }}>
            {authStatus === 'authenticated' ? 'Datos guardados en tu cuenta' : 'Datos guardados localmente'}
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--color-text-muted-60)', lineHeight: 1.5, margin: 0 }}>
            {authStatus === 'authenticated'
              ? 'Tu progreso se sincroniza con tu cuenta y estará disponible si inicias sesión en otro dispositivo.'
              : 'Tu progreso se guarda en este dispositivo (localStorage), no en un servidor.'}
          </p>
        </Card>

        {authStatus === 'authenticated' && (
          <>
            <NotificationsCard />
            <PrivacyCard />
            <ChangePasswordCard />
            <DeleteAccountCard />
          </>
        )}

        <Card style={{ padding: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-error)', marginBottom: 8 }}>Reiniciar progreso</div>
          <p style={{ fontSize: 12.5, color: 'var(--color-text-muted-60)', lineHeight: 1.5, margin: '0 0 12px' }}>
            Borra XP, racha, logros, estadísticas y errores guardados{authStatus === 'authenticated' ? ', en este dispositivo y en tu cuenta' : ''}. Esta acción no se puede deshacer.
          </p>
          {confirmingReset ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" onClick={() => setConfirmingReset(false)} style={{ flex: 1 }}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  resetProgress();
                  setConfirmingReset(false);
                  navigate('/');
                }}
                style={{ flex: 1 }}
              >
                Confirmar
              </Button>
            </div>
          ) : (
            <Button variant="danger" onClick={() => setConfirmingReset(true)}>
              Reiniciar progreso
            </Button>
          )}
        </Card>
      </div>
    </AppShell>
  );
}

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
];

function AppearanceCard() {
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);

  return (
    <Card style={{ padding: 16 }}>
      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)', marginBottom: 10 }}>Apariencia</div>
      <div style={{ display: 'flex', gap: 6, background: 'var(--color-bg-screen)', borderRadius: 12, padding: 4 }}>
        {THEME_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setPreference(opt.value)}
            style={{
              flex: 1,
              padding: '8px 0',
              border: 'none',
              borderRadius: 9,
              background: preference === opt.value ? 'var(--color-bg-card)' : 'transparent',
              color: preference === opt.value ? 'var(--color-primary)' : 'var(--color-text-muted-60)',
              boxShadow: preference === opt.value ? 'var(--shadow-card)' : 'none',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </Card>
  );
}

function FeedbackFxCard() {
  const enabled = useFeedbackSettingsStore((s) => s.enabled);
  const setEnabled = useFeedbackSettingsStore((s) => s.setEnabled);

  return (
    <Card style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>Sonidos y vibración</div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted-60)', margin: '2px 0 0' }}>
            Un aviso corto al acertar o fallar una pregunta.
          </p>
        </div>
        <Toggle checked={enabled} onChange={setEnabled} />
      </div>
    </Card>
  );
}

function NotificationsCard() {
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supported = isPushSupported();
  const permission = getNotificationPermission();

  useEffect(() => {
    if (!supported) {
      setLoading(false);
      return;
    }
    hasActivePushSubscription()
      .then(setEnabled)
      .finally(() => setLoading(false));
    // Runs once on mount — `supported` doesn't change during a session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggle(next: boolean) {
    setSaving(true);
    setError(null);
    const ok = next ? await enablePushNotifications() : await (disablePushNotifications().then(() => true));
    setSaving(false);
    if (!ok) {
      setError(
        permission === 'denied'
          ? 'Has bloqueado las notificaciones para DRIVY. Actívalas desde los ajustes de tu navegador.'
          : 'No se pudieron activar las notificaciones.',
      );
      return;
    }
    setEnabled(next);
  }

  if (loading) return null;

  return (
    <Card style={{ padding: 16 }}>
      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)', marginBottom: 4 }}>Notificaciones</div>
      {error && <p style={{ fontSize: 12.5, color: 'var(--color-error)', margin: '4px 0 8px' }}>{error}</p>}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>Solicitudes y duelos</div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted-60)', margin: '2px 0 0' }}>
            Te avisamos cuando alguien te envía una solicitud de amistad, un duelo, o acepta el tuyo.
          </p>
        </div>
        <Toggle checked={enabled} disabled={saving || !supported} onChange={toggle} />
      </div>
      {!supported && (
        <p style={{ fontSize: 12, color: 'var(--color-text-muted-45)', margin: '4px 0 0' }}>
          Tu navegador no soporta notificaciones push.
        </p>
      )}
    </Card>
  );
}

function PrivacyCard() {
  const [loading, setLoading] = useState(true);
  const [searchVisibility, setSearchVisibility] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyFriendships()
      .then((data) => {
        setSearchVisibility(data.searchVisibility);
        setProfileVisibility(data.profileVisibility);
      })
      .catch(() => setError('No se pudo cargar tu configuración de privacidad.'))
      .finally(() => setLoading(false));
  }, []);

  function save(nextSearch: boolean, nextProfile: boolean) {
    setSearchVisibility(nextSearch);
    setProfileVisibility(nextProfile);
    setSaving(true);
    setError(null);
    updatePrivacySettings(nextSearch, nextProfile)
      .catch(() => setError('No se pudo guardar el cambio.'))
      .finally(() => setSaving(false));
  }

  if (loading) return null;

  return (
    <Card style={{ padding: 16 }}>
      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)', marginBottom: 4 }}>Privacidad y amigos</div>
      {error && <p style={{ fontSize: 12.5, color: 'var(--color-error)', margin: '4px 0 8px' }}>{error}</p>}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>Aparecer en la búsqueda</div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted-60)', margin: '2px 0 0' }}>
            Otras personas podrán encontrarte por nombre. Tu código de amigo siempre funciona, aunque lo desactives.
          </p>
        </div>
        <Toggle checked={searchVisibility} disabled={saving} onChange={(next) => save(next, profileVisibility)} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>Compartir tu perfil con amigos</div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted-60)', margin: '2px 0 0' }}>
            Tus amigos podrán ver tu nivel, XP, racha, logros y estadísticas de exámenes.
          </p>
        </div>
        <Toggle checked={profileVisibility} disabled={saving} onChange={(next) => save(searchVisibility, next)} />
      </div>
    </Card>
  );
}

function ChangePasswordCard() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError('Introduce tu contraseña actual.');
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }

    setSubmitting(true);
    const result = await changePassword(currentPassword, newPassword);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? 'No se pudo cambiar la contraseña.');
      return;
    }
    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  }

  return (
    <Card style={{ padding: 16 }}>
      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)', marginBottom: 4 }}>Cambiar contraseña</div>
      {!open ? (
        <>
          <p style={{ fontSize: 12.5, color: 'var(--color-text-muted-60)', lineHeight: 1.5, margin: '0 0 12px' }}>
            Te pediremos tu contraseña actual antes de cambiarla.
          </p>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Cambiar contraseña
          </Button>
        </>
      ) : success ? (
        <>
          <p style={{ fontSize: 13, color: 'var(--color-success)', fontWeight: 600, margin: '8px 0 12px' }}>
            Contraseña actualizada correctamente.
          </p>
          <Button variant="secondary" onClick={reset}>
            Cerrar
          </Button>
        </>
      ) : (
        <form onSubmit={handleSubmit} noValidate style={{ marginTop: 8 }}>
          {error && (
            <div
              className="anim-shake"
              style={{
                background: 'var(--color-error-bg)',
                color: 'var(--color-error)',
                borderRadius: 12,
                padding: '10px 14px',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              {error}
            </div>
          )}
          <AuthField
            id="currentPassword"
            label="Contraseña actual"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <AuthField
            id="newPassword"
            label="Nueva contraseña"
            type="password"
            autoComplete="new-password"
            placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <AuthField
            id="confirmNewPassword"
            label="Confirmar nueva contraseña"
            type="password"
            autoComplete="new-password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Button type="button" variant="secondary" onClick={reset} style={{ flex: 1 }} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Guardando…' : 'Guardar'}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}

function DeleteAccountCard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setError(null);
    if (!password) {
      setError('Introduce tu contraseña para confirmar.');
      return;
    }
    setDeleting(true);
    const result = await deleteOwnAccount(password);
    setDeleting(false);

    if (!result.ok) {
      setError(result.error ?? 'No se pudo eliminar la cuenta.');
      return;
    }
    navigate('/login', { replace: true });
  }

  return (
    <Card style={{ padding: 16 }}>
      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-error)', marginBottom: 8 }}>Eliminar cuenta</div>
      <p style={{ fontSize: 12.5, color: 'var(--color-text-muted-60)', lineHeight: 1.5, margin: '0 0 12px' }}>
        Borra tu cuenta y todo tu progreso de forma permanente. Esta acción no se puede deshacer.
      </p>
      {!open ? (
        <Button variant="danger" onClick={() => setOpen(true)}>
          Eliminar cuenta
        </Button>
      ) : (
        <div>
          {error && (
            <div
              className="anim-shake"
              style={{
                background: 'var(--color-error-bg)',
                color: 'var(--color-error)',
                borderRadius: 12,
                padding: '10px 14px',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              {error}
            </div>
          )}
          <AuthField
            id="deletePassword"
            label="Confirma tu contraseña"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Button
              variant="secondary"
              onClick={() => {
                setOpen(false);
                setPassword('');
                setError(null);
              }}
              style={{ flex: 1 }}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} style={{ flex: 1 }} disabled={deleting}>
              {deleting ? 'Eliminando…' : 'Eliminar definitivamente'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
