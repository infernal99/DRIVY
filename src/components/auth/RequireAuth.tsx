import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AppShell } from '../layout/AppShell';
import { LoadingScreen } from '../ui/Loading';

/**
 * Gate for every screen of the actual app: Roady now requires an account
 * (no guest mode) per an explicit product decision, so anything under this
 * guard bounces to /login until `authStore.status` is 'authenticated'.
 * `status === 'loading'` covers the brief window while the Supabase client
 * checks for an existing session on first load — showing nothing (or the
 * real page underneath) there would flash content a guest shouldn't see.
 */
export function RequireAuth() {
  const status = useAuthStore((s) => s.status);
  const location = useLocation();

  if (status === 'loading') {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  if (status === 'guest') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
