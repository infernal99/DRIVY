import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthField } from '../components/auth/AuthField';
import { Button } from '../components/ui/Button';
import { signInWithEmail } from '../services/authService';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError('Introduce tu email y contraseña.');
      return;
    }

    setSubmitting(true);
    const result = await signInWithEmail(email.trim(), password);
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error ?? 'No se pudo iniciar sesión.');
      return;
    }
    navigate('/');
  }

  return (
    <AuthLayout title="Iniciar sesión" tagline="Continúa tu preparación donde la dejaste.">
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
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          placeholder="Tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div style={{ textAlign: 'right', marginTop: -6, marginBottom: 20 }}>
          <Link to="/forgot-password" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-muted-55)' }}>
            ¿Has olvidado tu contraseña?
          </Link>
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Iniciar sesión'}
        </Button>

        <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--color-text-muted-60)', marginTop: 18 }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Crear cuenta
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
