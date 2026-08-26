import { supabase } from '../lib/supabase';
import { getQuestion, pickRandomQuestionIds } from './questionService';
import type { Question } from '../types';

// A "battle" is an async-but-shared duel, not a millisecond-synced live
// session: both players get the exact same question ids and can answer at
// their own pace while it's open. See the migration
// (20260827090000_mission_rotation_and_battles.sql) for the full design
// rationale and the server-side rules this client only ever asks for.

export interface BattleInviteSummary {
  battleId: number;
  friendUserId: string;
  displayName: string;
  avatarUrl: string | null;
  questionCount: number;
  createdAt: string;
}

export interface ActiveBattleSummary {
  battleId: number;
  friendUserId: string;
  displayName: string;
  avatarUrl: string | null;
  questionCount: number;
  questionIds: string[];
  amIChallenger: boolean;
  iHaveFinished: boolean;
  opponentHasFinished: boolean;
}

export interface BattleHistoryEntry {
  battleId: number;
  friendUserId: string;
  displayName: string;
  avatarUrl: string | null;
  myCorrectCount: number;
  opponentCorrectCount: number;
  totalCount: number;
  won: boolean;
  tied: boolean;
  completedAt: string;
}

export interface BattleStats {
  battlesPlayed: number;
  battlesWon: number;
  winRatePct: number;
  accuracyPct: number;
}

export interface MyBattles {
  incoming: BattleInviteSummary[];
  outgoing: BattleInviteSummary[];
  active: ActiveBattleSummary[];
  history: BattleHistoryEntry[];
  stats: BattleStats;
}

export async function getMyBattles(): Promise<MyBattles> {
  const { data, error } = await supabase.rpc('fn_get_my_battles');
  if (error) throw error;
  return data as MyBattles;
}

export async function getFriendBattleStats(friendUserId: string): Promise<BattleStats> {
  const { data, error } = await supabase.rpc('fn_get_friend_battle_stats', { p_friend_user_id: friendUserId });
  if (error) throw error;
  return data as BattleStats;
}

export async function sendBattleRequest(friendUserId: string, questionCount = 10): Promise<{ battleId: number }> {
  const { data, error } = await supabase.rpc('fn_send_battle_request', {
    p_friend_user_id: friendUserId,
    p_question_count: questionCount,
  });
  if (error) throw error;
  return data as { battleId: number };
}

export async function cancelBattleRequest(battleId: number): Promise<void> {
  const { error } = await supabase.rpc('fn_cancel_battle_request', { p_battle_id: battleId });
  if (error) throw error;
}

/** Accepting picks the shared question set client-side and sends just the ids — see the module header. */
export async function acceptBattleRequest(battleId: number, questionCount: number): Promise<void> {
  const questionIds = pickRandomQuestionIds(questionCount);
  const { error } = await supabase.rpc('fn_respond_battle_request', {
    p_battle_id: battleId,
    p_accept: true,
    p_question_ids: questionIds,
  });
  if (error) throw error;
}

export async function declineBattleRequest(battleId: number): Promise<void> {
  const { error } = await supabase.rpc('fn_respond_battle_request', {
    p_battle_id: battleId,
    p_accept: false,
  });
  if (error) throw error;
}

/** Resolves an active battle's shared question ids to full local Question objects, in the server-given order. */
export function resolveBattleQuestions(questionIds: string[]): Question[] {
  return questionIds.map((id) => getQuestion(id)).filter((q): q is Question => Boolean(q));
}

export interface SubmitBattleAnswersResult {
  waitingForOpponent: boolean;
  correctCount: number;
  totalCount: number;
  opponentCorrectCount?: number;
  winnerId?: string | null;
}

export async function submitBattleAnswers(
  battleId: number,
  answers: { questionId: string; selectedOptionId: string | null; correct: boolean }[],
): Promise<SubmitBattleAnswersResult> {
  const { data, error } = await supabase.rpc('fn_submit_battle_answers', {
    p_battle_id: battleId,
    p_answers: answers,
  });
  if (error) throw error;
  return data as SubmitBattleAnswersResult;
}
