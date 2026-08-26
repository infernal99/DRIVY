import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { fetchTodayMissions, type DailyMissionProgress } from '../services/missionsService';

/**
 * A short delay before re-fetching after `progress` changes: the action that
 * changed it (answering a question, finishing a lesson, submitting an exam)
 * updates local state optimistically, but the RPC that actually advances
 * mission progress server-side runs afterward in the background (see
 * SupabaseProgressRepository.save) — fetching immediately would often read
 * stale progress.
 */
const REFRESH_DEBOUNCE_MS = 500;

export function useDailyMissions() {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const progress = useProgressStore((s) => s.progress);
  const [missions, setMissions] = useState<DailyMissionProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!userId) {
      setMissions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchTodayMissions(userId)
      .then(setMissions)
      .catch((err) => {
        console.error('DRIVY: failed to load daily missions', err);
        setMissions([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    const timeout = setTimeout(refresh, REFRESH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
    // Re-fetches whenever the signed-in user or their progress snapshot
    // changes — `refresh` itself only changes when `userId` does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, progress]);

  return { missions, loading, refresh };
}
