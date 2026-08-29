import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useFriendNotificationStore } from '../../store/friendNotificationStore';

/**
 * Mounted once in App.tsx (like SyncNoticeToast) — keeps BottomNav's "Amigos"
 * red dot correct even if the user never opens /friends: checks once on
 * sign-in and then every 15s while authenticated (fast enough that a new
 * friend/duel request feels like it "just arrives", not like the app needed
 * a manual reload — no loading state is ever shown for this). FriendsPage
 * itself updates the same store instantly from its own fetch, so this is
 * only filling the gap for every other screen.
 */
export function FriendNotificationWatcher() {
  const status = useAuthStore((s) => s.status);
  const refresh = useFriendNotificationStore((s) => s.refresh);

  useEffect(() => {
    if (status !== 'authenticated') return;
    refresh();
    const interval = setInterval(refresh, 15_000);
    return () => clearInterval(interval);
  }, [status, refresh]);

  return null;
}
