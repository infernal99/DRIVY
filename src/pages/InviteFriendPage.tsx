import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/Button';
import { LoadingScreen } from '../components/ui/Loading';

export const PENDING_INVITE_STORAGE_KEY = 'drivy.pendingInviteCode.v1';

/**
 * Public landing page for a friend's invite link — reachable with or
 * without a session. It never calls fn_accept_friend_invite itself: it
 * just stashes the code in localStorage and either sends an
 * already-authenticated visitor straight into the app (where
 * PendingFriendInviteHandler, mounted app-wide, picks the code up and
 * applies it) or shows a "create an account / log in" landing for a guest.
 * That single-owner-of-the-actual-RPC-call design is what makes this work
 * even across the multi-step register → confirm email → log in flow,
 * where the visitor lands back in the app on a totally different route
 * than this one.
 */
export function InviteFriendPage() {
  const { code = '' } = useParams();
  const navigate = useNavigate();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (!code) return;
    try {
      localStorage.setItem(PENDING_INVITE_STORAGE_KEY, code.toUpperCase());
    } catch {
      // Best-effort — worst case the visitor just has to add the friend manually.
    }
  }, [code]);

  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/friends', { replace: true });
    }
  }, [status, navigate]);

  if (status === 'loading' || status === 'authenticated') {
    return <LoadingScreen />;
  }

  return (
    <AuthLayout title="Te han invitado" tagline="Alguien quiere añadirte como amigo en DRIVY.">
      <div style={{ textAlign: 'center', padding: '10px 4px 0' }}>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted-60)', lineHeight: 1.6, margin: '0 0 24px' }}>
          Crea una cuenta o inicia sesión para aceptar la invitación — os añadiréis como amigos automáticamente.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button onClick={() => navigate('/register')}>CREAR CUENTA</Button>
          <Button variant="secondary" onClick={() => navigate('/login')}>
            YA TENGO CUENTA
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
