import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthField } from '../components/auth/AuthField';
import { Button } from '../components/ui/Button';
import { signUpWithEmail, MIN_PASSWORD_LENGTH } from '../services/authService';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkYourEmail, setCheckYourEmail] = useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(false);

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = 'Introduce tu nombre.';
    if (!EMAIL_RE.test(email.trim())) errors.email = 'Introduce un email válido.';
    if (password.length < MIN_PASSWORD_LENGTH) errors.password = `Debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    if (confirmPassword !== password) errors.confirmPassword = 'Las contraseñas no coinciden.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    if (!acceptedLegal) {
      setFormError('Debes aceptar la política de privacidad y los términos y condiciones para crear una cuenta.');
      return;
    }

    setSubmitting(true);
    const result = await signUpWithEmail(name.trim(), email.trim(), password);
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error ?? 'No se pudo crear la cuenta.');
      return;
    }
    if (result.needsEmailConfirmation) {
      setCheckYourEmail(true);
      return;
    }
    navigate('/');
  }

  if (checkYourEmail) {
    return (
      <AuthLayout title="Revisa tu email" tagline="Confirma tu cuenta para empezar a sincronizar tu progreso.">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted-60)', lineHeight: 1.6 }}>
          Te hemos enviado un enlace de confirmación a <strong style={{ color: 'var(--color-text)' }}>{email}</strong>.
          Ábrelo para activar tu cuenta y poder iniciar sesión.
        </p>
        <div style={{ marginTop: 20 }}>
          <Button variant="secondary" onClick={() => navigate('/login')}>
            Ir a iniciar sesión
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Crear cuenta" tagline="Guarda tu progreso, tu XP y tu racha para siempre.">
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
          id="name"
          label="Nombre"
          type="text"
          autoComplete="name"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
        />
        <AuthField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />
        <AuthField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />
        <AuthField
          id="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
        />

        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            marginTop: 18,
            fontSize: 12.5,
            color: 'var(--color-text-muted-60)',
            lineHeight: 1.5,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={acceptedLegal}
            onChange={(e) => setAcceptedLegal(e.target.checked)}
            style={{ width: 16, height: 16, marginTop: 1, flex: 'none', accentColor: 'var(--color-primary)' }}
          />
          <span>
            He leído y acepto la{' '}
            <Link to="/privacidad" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
              Política de privacidad
            </Link>{' '}
            y los{' '}
            <Link to="/terminos" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
              Términos y condiciones
            </Link>
            . Debes tener al menos 14 años para crear una cuenta por ti mismo.
          </span>
        </label>

        <div style={{ marginTop: 20 }}>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
          </Button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--color-text-muted-60)', marginTop: 18 }}>
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Iniciar sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
