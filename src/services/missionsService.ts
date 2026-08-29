import { supabase } from '../lib/supabase';
import { todayISO } from '../utils/date';

// Unlike achievements (mirrored by hand into a TS array), daily_missions is
// pure display data with no client-side logic attached. Which 3 missions are
// "today's" is decided server-side (fn_get_my_daily_missions), deterministic
// per (user, day) — see the migration for why: it has to match exactly what
// fn_advance_daily_missions credits, or a client could see one set of
// missions but earn progress toward a different set.

export type DailyMissionMetric =
  | 'questions_answered'
  | 'lessons_completed'
  | 'mistakes_practiced'
  | 'xp_earned'
  | 'exams_taken'
  | 'battles_played'
  | 'battles_won';

export interface DailyMissionProgress {
  id: string;
  description: string;
  metric: DailyMissionMetric;
  targetAmount: number;
  /** Bonus XP awarded once, the moment this mission is first completed for the day. */
  xpReward: number;
  progress: number;
  completed: boolean;
}

interface DailyMissionApiRow {
  id: string;
  description: string;
  metric: DailyMissionMetric;
  targetAmount: number;
  xpReward: number;
  progress: number;
  completed: boolean;
}

export async function fetchTodayMissions(_userId: string): Promise<DailyMissionProgress[]> {
  const { data, error } = await supabase.rpc('fn_get_my_daily_missions', { p_today: todayISO() });
  if (error) throw error;
  return (data ?? []) as DailyMissionApiRow[];
}
