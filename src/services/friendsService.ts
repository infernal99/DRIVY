import { supabase } from '../lib/supabase';

// Every cross-user read here goes through a SECURITY DEFINER RPC (see the
// Phase E migration) — never a direct `.from('profiles')` select, since
// profiles' RLS only allows reading your own row. Search results and the
// friends-page summary never carry a raw UUID for anyone who isn't already
// an accepted friend; only friend_code is ever used to look someone up.

export interface FriendSearchResult {
  friendCode: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface FriendRequestSummary {
  requestId: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface FriendSummary {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  currentStreak: number;
}

export interface MyFriendships {
  friends: FriendSummary[];
  incomingRequests: FriendRequestSummary[];
  outgoingRequests: FriendRequestSummary[];
  myFriendCode: string;
  searchVisibility: boolean;
  profileVisibility: boolean;
}

export interface FriendProfile {
  displayName: string;
  avatarUrl: string | null;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  examsTaken: number;
  examsPassed: number;
  bestExamScorePct: number;
  averageExamScorePct: number;
  achievements: { id: string; unlockedAt: string }[];
  categoryStats: { categoryId: string; answered: number; correct: number }[];
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  weeklyXp: number;
  isMe: boolean;
}

export async function searchProfiles(query: string): Promise<FriendSearchResult[]> {
  const { data, error } = await supabase.rpc('fn_search_profiles', { p_query: query });
  if (error) throw error;
  return ((data ?? []) as { friend_code: string; display_name: string; avatar_url: string | null }[]).map((row) => ({
    friendCode: row.friend_code,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
  }));
}

export async function getMyFriendships(): Promise<MyFriendships> {
  const { data, error } = await supabase.rpc('fn_get_my_friendships');
  if (error) throw error;
  return data as MyFriendships;
}

export async function sendFriendRequest(friendCode: string): Promise<void> {
  const { error } = await supabase.rpc('fn_send_friend_request', { p_friend_code: friendCode });
  if (error) throw error;
}

export async function respondFriendRequest(requestId: number, accept: boolean): Promise<void> {
  const { error } = await supabase.rpc('fn_respond_friend_request', { p_request_id: requestId, p_accept: accept });
  if (error) throw error;
}

export async function cancelFriendRequest(requestId: number): Promise<void> {
  const { error } = await supabase.rpc('fn_cancel_friend_request', { p_request_id: requestId });
  if (error) throw error;
}

export async function removeFriend(otherUserId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_remove_friend', { p_other_user_id: otherUserId });
  if (error) throw error;
}

export interface AcceptedInvite {
  friendUserId: string;
  displayName: string;
}

/** Invite-link add: immediately 'accepted', no pending step — see the migration for why that's safe here. */
export async function acceptFriendInvite(friendCode: string): Promise<AcceptedInvite> {
  const { data, error } = await supabase.rpc('fn_accept_friend_invite', { p_friend_code: friendCode });
  if (error) throw error;
  return data as AcceptedInvite;
}

export async function updatePrivacySettings(searchVisibility: boolean, profileVisibility: boolean): Promise<void> {
  const { error } = await supabase.rpc('fn_update_privacy_settings', {
    p_search_visibility: searchVisibility,
    p_profile_visibility: profileVisibility,
  });
  if (error) throw error;
}

export async function getFriendProfile(userId: string): Promise<FriendProfile> {
  const { data, error } = await supabase.rpc('fn_get_friend_profile', { p_friend_user_id: userId });
  if (error) throw error;
  return data as FriendProfile;
}

export type ReportReason = 'spam' | 'acoso' | 'contenido_inapropiado' | 'suplantacion' | 'otro';

export interface BlockedUser {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  blockedAt: string;
}

export async function blockUser(userId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_block_user', { p_user_id: userId });
  if (error) throw error;
}

export async function unblockUser(userId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_unblock_user', { p_user_id: userId });
  if (error) throw error;
}

export async function getBlockedUsers(): Promise<BlockedUser[]> {
  const { data, error } = await supabase.rpc('fn_get_blocked_users');
  if (error) throw error;
  return ((data ?? []) as { user_id: string; display_name: string; avatar_url: string | null; blocked_at: string }[]).map(
    (row) => ({
      userId: row.user_id,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
      blockedAt: row.blocked_at,
    }),
  );
}

export async function reportUser(userId: string, reason: ReportReason, details?: string, alsoBlock = true): Promise<void> {
  const { error } = await supabase.rpc('fn_report_user', {
    p_user_id: userId,
    p_reason: reason,
    p_details: details ?? null,
    p_also_block: alsoBlock,
  });
  if (error) throw error;
}

export async function getFriendLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase.rpc('fn_get_friend_leaderboard', {});
  if (error) throw error;
  return (
    (data ?? []) as { user_id: string; display_name: string; avatar_url: string | null; weekly_xp: number; is_me: boolean }[]
  ).map((row) => ({
    userId: row.user_id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    weeklyXp: Number(row.weekly_xp),
    isMe: row.is_me,
  }));
}
