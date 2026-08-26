import { create } from 'zustand';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import * as progressSync from '../services/progressSync';

export type AuthStatus = 'loading' | 'guest' | 'authenticated';

export interface SyncNotice {
  kind: 'success' | 'error';
  message: string;
}

interface AuthState {
  status: AuthStatus;
  user: User | null;
  syncNotice: SyncNotice | null;
  clearSyncNotice: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  user: null,
  syncNotice: null,
  clearSyncNotice: () => set({ syncNotice: null }),
}));

// Events that mean "the user's cloud progress may need (re)hydrating and a
// guest→account migration may be due". Deliberately excludes
// TOKEN_REFRESHED (fires silently every ~55min for a still-logged-in user)
// and USER_UPDATED (fires after updatePassword()) — re-running hydrate on
// those would be wasted work and would clobber any not-yet-synced state.
const SYNC_EVENTS: AuthChangeEvent[] = ['SIGNED_IN', 'INITIAL_SESSION', 'PASSWORD_RECOVERY'];

let initialized = false;

/** Sets up the single supabase.auth.onAuthStateChange listener for the app. Safe to call more than once. */
export function initAuth(): void {
  if (initialized) return;
  initialized = true;

  supabase.auth.onAuthStateChange((event, session) => {
    void handleAuthChange(event, session);
  });
}

async function handleAuthChange(event: AuthChangeEvent, session: Session | null): Promise<void> {
  if (session?.user) {
    useAuthStore.setState({ status: 'authenticated', user: session.user });
    if (SYNC_EVENTS.includes(event)) {
      const notice = await progressSync.handleSignedIn(session.user);
      if (notice) useAuthStore.setState({ syncNotice: notice });
    }
    return;
  }

  useAuthStore.setState({ status: 'guest', user: null });
  if (event === 'SIGNED_OUT') {
    progressSync.handleSignedOut();
  }
}
