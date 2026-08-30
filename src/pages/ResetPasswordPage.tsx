import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthField } from '../components/auth/AuthField';
import { Button } from '../components/ui/Button';
import { updatePassword, MIN_PASSWORD_LENGTH } from '../services/authService';
import { useAuthStore } from '../store/authStore';

/**
 * Reached from the email link Supabase sends via resetPasswordForEmail
 * (redirectTo: `${origin}/reset-password`). The Supabase client has
 * `detectSessionInUrl: true` (see src/lib/supabase.ts), so it exchanges the
 * link's code for a session automatically on load and fires a
 * PASSWORD_RECOVERY auth event — by the time this renders, `status` below
 * reflects whether that succeeded.
 */
export function ResetPasswordPage() {
  const navigate = useNavigate();
  const status = useAuthStore((s) => s.status);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setFormError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    setSubmitting(true);
    const result = await updatePassword(password);
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error ?? 'No se pudo actualizar la contraseña.');
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <AuthLayout title="Contraseña actualizada" tagline="Ya puedes continuar usando Roady con normalidad.">
        <Button onClick={() => navigate('/')}>Ir a Roady</Button>
      </AuthLayout>
    );
  }

  if (status === 'loading') {
    return (
      <AuthLayout title="Restablecer contraseña" tagline="Comprobando tu enlace…">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted-60)' }}>Un momento…</p>
      </AuthLayout>
    );
  }

  if (status === 'guest') {
    return (
      <AuthLayout title="Enlace no válido" tagline="Este enlace de recuperación ha caducado o ya se usó.">
        <Button onClick={() => navigate('/forgot-password')}>Solicitar un enlace nuevo</Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Restablecer contraseña" tagline="Crea una nueva contraseña para tu cuenta.">
      <form onSubmit={handleSubmit} noValidate>
        {formError && (
          <div
            className="anim-shake"
            style={{
              background: 'var(--color-error-bg)',
              color: 'var(--color-error)',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            {formError}
          </div>
        )}

        <AuthField
          id="password"
          label="Nueva contraseña"
          type="password"
          autoComplete="new-password"
          placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AuthField
          id="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div style={{ marginTop: 8 }}>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Guardando…' : 'Guardar nueva contraseña'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
