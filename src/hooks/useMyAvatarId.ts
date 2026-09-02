import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { getMyAvatarId } from '../services/avatarService';

/**
 * The chosen avatar catalog id (see src/data/avatars.ts), or null until
 * fetched / for guests / for users who haven't picked one. Shared so every
 * screen that shows "my" avatar (Home header, Profile) reads the same
 * source instead of each re-implementing the Supabase fetch.
 */
export function useMyAvatarId(): string | null {
  const authStatus = useAuthStore((s) => s.status);
  const [avatarId, setAvatarId] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus !== 'authenticated') return;
    getMyAvatarId()
      .then(setAvatarId)
      .catch(() => setAvatarId(null));
  }, [authStatus]);

  return avatarId;
}
