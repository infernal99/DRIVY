import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { acceptFriendInvite } from '../../services/friendsService';
import { PENDING_INVITE_STORAGE_KEY } from '../../pages/InviteFriendPage';

/**
 * Mounted once in App.tsx (like SyncNoticeToast). InviteFriendPage never
 * calls the accept RPC itself — it only stashes the code — because the
 * visitor might land back in the app on a completely different route
 * (register → confirm email → log in redirects to "/", not back to
 * /invite/:code). Checking here, on every transition to 'authenticated',
 * is the one place guaranteed to run regardless of how they got signed in.
 */
export function PendingFriendInviteHandler() {
  const status = useAuthStore((s) => s.status);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;

    let code: string | null = null;
    try {
      code = localStorage.getItem(PENDING_INVITE_STORAGE_KEY);
    } catch {
      return;
    }
    if (!code) return;

    try {
      localStorage.removeItem(PENDING_INVITE_STORAGE_KEY);
    } catch {
      // Not fatal — worst case the same invite gets (harmlessly) re-applied next time.
    }

    acceptFriendInvite(code)
      .then((result) => setNotice(`Ahora eres amigo de ${result.displayName} en Roady`))
      .catch(() => {
        // Invalid/self/blocked code — nothing meaningful to show a new user for this.
      });
  }, [status]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  if (!notice) return null;

  return (
    <div
      className="anim-pop-in"
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        maxWidth: 320,
        textAlign: 'center',
        background: 'var(--color-success-bg)',
        color: 'var(--color-success)',
        padding: '10px 16px',
        borderRadius: 14,
        fontSize: 12.5,
        fontWeight: 700,
        boxShadow: 'var(--shadow-elevated)',
      }}
    >
      {notice}
    </div>
  );
}
