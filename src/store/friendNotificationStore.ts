import { create } from 'zustand';
import { getMyFriendships, type FriendRequestSummary, type FriendSummary, type MyFriendships } from '../services/friendsService';
import { getMyBattles, type BattleInviteSummary, type MyBattles } from '../services/battlesService';

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

// Separate "seen" bookkeeping for the in-app pop-up toast (IncomingRequestToast)
// — a request/invite is only ever popped up ONCE across reloads, even if it's
// still pending next time the app is opened (the Amigos list is still there
// for it regardless).
const TOAST_SEEN_KEY = 'drivy.notifications.toastSeenIds.v1';

function loadToastSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(TOAST_SEEN_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveToastSeenIds(ids: Set<string>) {
  try {
    localStorage.setItem(TOAST_SEEN_KEY, JSON.stringify([...ids]));
  } catch {
    // Best-effort, same reasoning as saveSeenIds above.
  }
}

export interface FriendRequestToastItem {
  kind: 'friend_request';
  key: string;
  requestId: number;
  displayName: string;
  avatarUrl: string | null;
}

export interface BattleInviteToastItem {
  kind: 'battle_request';
  key: string;
  battleId: number;
  displayName: string;
  avatarUrl: string | null;
  questionCount: number;
}

export type NotificationToastItem = FriendRequestToastItem | BattleInviteToastItem;

interface FriendNotificationState {
  hasIncomingRequests: boolean;
  hasNewFriend: boolean;
  hasIncomingBattles: boolean;
  toastQueue: NotificationToastItem[];
  /** Applies an already-fetched fn_get_my_friendships() result — avoids a second network call from pages that already have it. */
  ingest: (data: Pick<MyFriendships, 'incomingRequests' | 'friends'>) => void;
  /** Applies an already-fetched fn_get_my_battles() result — same reasoning as `ingest`. */
  ingestBattles: (data: Pick<MyBattles, 'incoming'>) => void;
  /** Marks every friend currently in the list as "seen" — call when the Friends page is actually opened. */
  markFriendsSeen: (friends: FriendSummary[]) => void;
  /** Removes one item from the toast queue — call once it's been shown and acted on (or dismissed). */
  dismissToast: (key: string) => void;
  /** Fetches fresh friendship + battle data just to update the badge (e.g. from a background watcher that isn't otherwise on the Friends page). */
  refresh: () => Promise<void>;
}

function newFriendRequestToasts(requests: FriendRequestSummary[], seen: Set<string>): FriendRequestToastItem[] {
  return requests
    .filter((r) => !seen.has(`fr:${r.requestId}`))
    .map((r) => ({ kind: 'friend_request', key: `fr:${r.requestId}`, requestId: r.requestId, displayName: r.displayName, avatarUrl: r.avatarUrl }));
}

function newBattleInviteToasts(invites: BattleInviteSummary[], seen: Set<string>): BattleInviteToastItem[] {
  return invites
    .filter((b) => !seen.has(`bi:${b.battleId}`))
    .map((b) => ({
      kind: 'battle_request',
      key: `bi:${b.battleId}`,
      battleId: b.battleId,
      displayName: b.displayName,
      avatarUrl: b.avatarUrl,
      questionCount: b.questionCount,
    }));
}

export const useFriendNotificationStore = create<FriendNotificationState>((set, get) => ({
  hasIncomingRequests: false,
  hasNewFriend: false,
  hasIncomingBattles: false,
  toastQueue: [],

  ingest: (data) => {
    const seen = loadSeenIds();
    const toastSeen = loadToastSeenIds();
    const newItems = newFriendRequestToasts(data.incomingRequests, toastSeen);
    if (newItems.length > 0) {
      saveToastSeenIds(new Set([...toastSeen, ...newItems.map((i) => i.key)]));
      set((s) => ({ toastQueue: [...s.toastQueue, ...newItems] }));
    }
    set({
      hasIncomingRequests: data.incomingRequests.length > 0,
      hasNewFriend: data.friends.some((f) => !seen.has(f.userId)),
    });
  },

  ingestBattles: (data) => {
    const toastSeen = loadToastSeenIds();
    const newItems = newBattleInviteToasts(data.incoming, toastSeen);
    if (newItems.length > 0) {
      saveToastSeenIds(new Set([...toastSeen, ...newItems.map((i) => i.key)]));
      set((s) => ({ toastQueue: [...s.toastQueue, ...newItems] }));
    }
    set({ hasIncomingBattles: data.incoming.length > 0 });
  },

  markFriendsSeen: (friends) => {
    saveSeenIds(new Set(friends.map((f) => f.userId)));
    set({ hasNewFriend: false });
  },

  dismissToast: (key) => {
    set((s) => ({ toastQueue: s.toastQueue.filter((i) => i.key !== key) }));
  },

  refresh: async () => {
    try {
      const [friendships, battles] = await Promise.all([getMyFriendships(), getMyBattles()]);
      get().ingest(friendships);
      get().ingestBattles(battles);
    } catch {
      // Silent — a stale/missing badge isn't worth an error toast over.
    }
  },
}));
