import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * Keeps a signed-in user from landing back on /login or /register — but
 * deliberately NOT wrapped around /reset-password: that route can be hit
 * with `status === 'authenticated'` too (Supabase's PASSWORD_RECOVERY event
 * establishes a real session for the recovery link), and bouncing that case
 * to "/" would strand the user mid-recovery with no way to set a new
 * password. /forgot-password is also left unguarded — harmless either way.
 */
export function RedirectIfAuthed() {
  const status = useAuthStore((s) => s.status);
  if (status === 'authenticated') return <Navigate to="/" replace />;
  return <Outlet />;
}
