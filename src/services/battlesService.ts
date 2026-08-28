import { supabase } from '../lib/supabase';
import { getQuestion, pickRandomQuestionIds } from './questionService';
import type { Question } from '../types';

// A "battle" is a synchronized round-by-round duel: both players get the
// same question ids, and each round (one question) is open for exactly 30
// seconds — tracked server-side via `questionStartedAt` so both clients
// count down from the same instant. A round only advances once both
// players have an answer for it (a real one, or a forced "no answer" once
// the deadline passes — see fn_submit_battle_answer). See the migration
// (20260827110000_synchronized_battle_rounds.sql) for the full server-side
// design rationale.

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
  currentQuestionIndex: number;
  questionStartedAt: string;
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
  /** 'abandoned' means neither `won`/`tied` is meaningful — no winner was ever decided and nothing counted toward stats/XP. */
  status: 'completed' | 'abandoned';
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

/** Ends an active duel outright — counts toward neither player's stats/XP, but stays reviewable. */
export async function abandonBattle(battleId: number): Promise<void> {
  const { error } = await supabase.rpc('fn_abandon_battle', { p_battle_id: battleId });
  if (error) throw error;
}

export interface BattleRoundAnswer {
  selectedOptionId: string | null;
  correct: boolean;
}

export interface BattleRoundState {
  status: 'active' | 'completed' | 'abandoned';
  currentQuestionIndex: number;
  questionStartedAt: string;
  questionCount: number;
  myAnsweredThisRound: boolean;
  opponentAnsweredThisRound: boolean;
  lastRound: { index: number; myAnswer: BattleRoundAnswer; opponentAnswer: BattleRoundAnswer } | null;
  winnerId: string | null;
}

export async function getBattleRound(battleId: number): Promise<BattleRoundState> {
  const { data, error } = await supabase.rpc('fn_get_battle_round', { p_battle_id: battleId });
  if (error) throw error;
  return data as BattleRoundState;
}

/** Submits (or re-submits, idempotently) this player's answer for exactly one round. */
export async function submitBattleAnswer(
  battleId: number,
  questionIndex: number,
  questionId: string,
  selectedOptionId: string | null,
  correct: boolean,
): Promise<BattleRoundState> {
  const { data, error } = await supabase.rpc('fn_submit_battle_answer', {
    p_battle_id: battleId,
    p_question_index: questionIndex,
    p_question_id: questionId,
    p_selected_option_id: selectedOptionId,
    p_correct: correct,
  });
  if (error) throw error;
  return data as BattleRoundState;
}

export interface BattleReviewEntry {
  questionId: string;
  mySelectedOptionId: string | null;
  myCorrect: boolean;
  opponentSelectedOptionId: string | null;
  opponentCorrect: boolean;
}

export async function getBattleReview(battleId: number): Promise<BattleReviewEntry[]> {
  const { data, error } = await supabase.rpc('fn_get_battle_review', { p_battle_id: battleId });
  if (error) throw error;
  return (data ?? []) as BattleReviewEntry[];
}
