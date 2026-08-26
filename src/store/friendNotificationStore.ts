import { create } from 'zustand';
import { getMyFriendships, type FriendSummary, type MyFriendships } from '../services/friendsService';

// Drives the red dot on BottomNav's "Amigos" tab. Two independent triggers:
//   - hasIncomingRequests: a pending friend request is waiting on you. Fully
//     derived from the server each time — clears itself the moment you
//     accept/reject (no local "seen" bookkeeping needed, since the request
//     itself disappears from the list).
//   - hasNewFriend: someone accepted a request you sent (or you accepted
//     theirs) since you last actually looked at the Friends page. Unlike a
//     pending request, an accepted friendship doesn't go away on its own, so
//     this needs a local "have I seen this friend yet" marker — see
//     markFriendsSeen, called by FriendsPage on load.
const SEEN_STORAGE_KEY = 'drivy.friends.seenIds.v1';

function loadSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveSeenIds(ids: Set<string>) {
  try {
    localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Best-effort — this is a passive UI marker, not user data worth failing over.
  }
}

interface FriendNotificationState {
  hasIncomingRequests: boolean;
  hasNewFriend: boolean;
  /** Applies an already-fetched fn_get_my_friendships() result — avoids a second network call from pages that already have it. */
  ingest: (data: Pick<MyFriendships, 'incomingRequests' | 'friends'>) => void;
  /** Marks every friend currently in the list as "seen" — call when the Friends page is actually opened. */
  markFriendsSeen: (friends: FriendSummary[]) => void;
  /** Fetches fresh friendship data just to update the badge (e.g. from a background watcher that isn't otherwise on the Friends page). */
  refresh: () => Promise<void>;
}

export const useFriendNotificationStore = create<FriendNotificationState>((set, get) => ({
  hasIncomingRequests: false,
  hasNewFriend: false,

  ingest: (data) => {
    const seen = loadSeenIds();
    set({
      hasIncomingRequests: data.incomingRequests.length > 0,
      hasNewFriend: data.friends.some((f) => !seen.has(f.userId)),
    });
  },

  markFriendsSeen: (friends) => {
    saveSeenIds(new Set(friends.map((f) => f.userId)));
    set({ hasNewFriend: false });
  },

  refresh: async () => {
    try {
      const data = await getMyFriendships();
      get().ingest(data);
    } catch {
      // Silent — a stale/missing badge isn't worth an error toast over.
    }
  },
}));
