import { useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { usePremiumStore } from '../../store/premiumStore';
import { useProgressStore } from '../../store/progressStore';

/**
 * Mounted once in App.tsx (like FriendNotificationWatcher) — keeps premium
 * status current even without a manual reload: checks on sign-in and every
 * 30s while authenticated, so a Stripe-webhook-driven upgrade (or the
 * dev-bypass flag) shows up on its own. Also unlocks the "Miembro Premium"
 * achievement directly the moment premium status is confirmed true.
 */
export function PremiumStatusSync() {
  const status = useAuthStore((s) => s.status);
  const refresh = usePremiumStore((s) => s.refresh);
  const isPremium = usePremiumStore((s) => s.isPremium);
  const unlockAchievement = useProgressStore((s) => s.unlockAchievement);
  const hasUnlockedRef = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated') return;
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [status, refresh]);

  useEffect(() => {
    if (!isPremium || hasUnlockedRef.current) return;
    hasUnlockedRef.current = true;
    unlockAchievement('miembro-premium');
  }, [isPremium, unlockAchievement]);

  return null;
}
