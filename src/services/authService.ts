import { supabase } from '../lib/supabase';

/**
 * Enforced client-side for signup/change-password forms. Stricter than
 * Supabase's own project-level minimum (commonly 6) — that's a deliberate
 * floor we control from the UI without needing dashboard access; the
 * project's Auth settings are still the real enforcement point and are
 * worth raising to match (Dashboard → Authentication → Policies).
 */
export const MIN_PASSWORD_LENGTH = 8;

/**
 * Translates Supabase Auth errors (and the occasional non-error edge case,
 * like the "duplicate signup" one below) into friendly Spanish copy. Never
 * surface `error.message` from Supabase directly in the UI — see the brief
 * this was built from ("Do not expose raw Supabase error messages").
 */
export function translateAuthError(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'Email o contraseña incorrectos.';
  }
  if (message.includes('email not confirmed')) {
    return 'Confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.';
  }
  if (message.includes('user already registered') || message.includes('already registered')) {
    return 'Ya existe una cuenta con este email. Inicia sesión en su lugar.';
  }
  if (message.includes('password should be at least') || message.includes('password is too short')) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (message.includes('rate limit')) {
    return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.';
  }
  if (message.includes('failed to fetch') || message.includes('network')) {
    return 'No se pudo conectar. Comprueba tu conexión a internet.';
  }
  if (message.includes('same password') || message.includes('different from the old')) {
    return 'La nueva contraseña debe ser distinta de la actual.';
  }
  if (message.includes('token has expired') || message.includes('invalid or expired')) {
    return 'El enlace ha caducado. Solicita uno nuevo.';
  }
  return 'Ha ocurrido un error. Inténtalo de nuevo en unos instantes.';
}

export interface AuthResult {
  ok: boolean;
  error?: string;
}

export interface SignUpResult extends AuthResult {
  /** True when Supabase requires email confirmation before a session exists. */
  needsEmailConfirmation?: boolean;
}

export async function signUpWithEmail(name: string, email: string, password: string): Promise<SignUpResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) return { ok: false, error: translateAuthError(error) };

    // With email-confirmation enabled, Supabase intentionally returns a
    // success response with no identities (rather than an error) when the
    // email is already registered, to avoid leaking which emails exist.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      return { ok: false, error: 'Ya existe una cuenta con este email. Inicia sesión en su lugar.' };
    }
    return { ok: true, needsEmailConfirmation: !data.session };
  } catch (err) {
    return { ok: false, error: translateAuthError(err) };
  }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: translateAuthError(error) };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: translateAuthError(err) };
  }
}

export async function signOut(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { ok: false, error: translateAuthError(error) };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: translateAuthError(err) };
  }
}

export async function sendPasswordReset(email: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    // Supabase does not error for unknown emails either (same anti-enumeration
    // reasoning as signUp) — a real error here means something else broke.
    if (error) return { ok: false, error: translateAuthError(error) };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: translateAuthError(err) };
  }
}

export async function updatePassword(newPassword: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false, error: translateAuthError(error) };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: translateAuthError(err) };
  }
}

/**
 * Re-proves the current session belongs to whoever is sitting at the
 * keyboard right now, by re-running a real sign-in with the password they
 * type. Required immediately before any irreversible or sensitive
 * account action (changing the password, deleting the account) — an
 * already-open session token alone isn't proof the original owner is still
 * the one holding it.
 */
export async function reauthenticateWithPassword(currentPassword: string): Promise<AuthResult> {
  try {
    const { data, error: getUserError } = await supabase.auth.getUser();
    if (getUserError || !data.user?.email) {
      return { ok: false, error: 'No se pudo verificar tu sesión. Vuelve a iniciar sesión.' };
    }
    const { error } = await supabase.auth.signInWithPassword({ email: data.user.email, password: currentPassword });
    if (error) return { ok: false, error: translateAuthError(error) };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: translateAuthError(err) };
  }
}

/** Changes the password for the signed-in user, after confirming the current one. */
export async function changePassword(currentPassword: string, newPassword: string): Promise<AuthResult> {
  const reauth = await reauthenticateWithPassword(currentPassword);
  if (!reauth.ok) return reauth;
  return updatePassword(newPassword);
}

/**
 * Permanently deletes the signed-in user's account, after confirming the
 * current password. Calls `fn_delete_own_account` (see
 * supabase/migrations/20260826130000_delete_own_account.sql), a
 * SECURITY DEFINER function that only ever deletes `auth.uid()` itself —
 * everything else (profile, progress, exam history) cascades from the
 * foreign keys on `auth.users(id)`, so there is nothing left to clean up
 * client-side. There is no undo.
 */
export async function deleteOwnAccount(currentPassword: string): Promise<AuthResult> {
  const reauth = await reauthenticateWithPassword(currentPassword);
  if (!reauth.ok) return reauth;
  try {
    const { error } = await supabase.rpc('fn_delete_own_account');
    if (error) return { ok: false, error: translateAuthError(error) };
    await supabase.auth.signOut();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: translateAuthError(err) };
  }
}
