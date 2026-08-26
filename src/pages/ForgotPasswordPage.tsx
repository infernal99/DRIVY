import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthField } from '../components/auth/AuthField';
import { Button } from '../components/ui/Button';
import { sendPasswordReset } from '../services/authService';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!email.trim()) {
      setFormError('Introduce tu email.');
      return;
    }

    setSubmitting(true);
    const result = await sendPasswordReset(email.trim());
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error ?? 'No se pudo enviar el email.');
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <AuthLayout title="Revisa tu email" tagline="Te hemos enviado instrucciones para recuperar tu contraseña.">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted-60)', lineHeight: 1.6 }}>
          Si existe una cuenta con <strong style={{ color: 'var(--color-text)' }}>{email}</strong>, recibirás un
          enlace para restablecer tu contraseña en unos minutos.
        </p>
        <div style={{ marginTop: 20 }}>
          <Link to="/login">
            <Button variant="secondary">Volver a iniciar sesión</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Recuperar contraseña" tagline="Te enviaremos un enlace para crear una nueva.">
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

        <div style={{ marginTop: 8 }}>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Enviando…' : 'Enviar enlace'}
          </Button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--color-text-muted-60)', marginTop: 18 }}>
          <Link to="/login" style={{ fontWeight: 600 }}>
            Volver a iniciar sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
