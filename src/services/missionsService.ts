import { supabase } from '../lib/supabase';
import { todayISO } from '../utils/date';

// Unlike achievements (mirrored by hand into a TS array), daily_missions is
// pure display data with no client-side logic attached, so it's read
// straight from the DB — one fewer place to keep in sync. Progress is
// written only by fn_advance_daily_missions (see the Phase D migration),
// called from inside fn_record_answer/fn_complete_lesson/fn_submit_exam as
// those record a real event — there is no client-callable "complete
// mission" RPC.

export type DailyMissionMetric = 'questions_answered' | 'lessons_completed' | 'mistakes_practiced' | 'xp_earned';

export interface DailyMissionProgress {
  id: string;
  description: string;
  metric: DailyMissionMetric;
  targetAmount: number;
  progress: number;
  completed: boolean;
}

interface DailyMissionRow {
  id: string;
  description: string;
  metric: DailyMissionMetric;
  target_amount: number;
}

interface UserDailyMissionRow {
  mission_id: string;
  progress: number;
  completed_at: string | null;
}

export async function fetchTodayMissions(userId: string): Promise<DailyMissionProgress[]> {
  const today = todayISO();
  const [catalogRes, progressRes] = await Promise.all([
    supabase.from('daily_missions').select('id, description, metric, target_amount'),
    supabase.from('user_daily_missions').select('mission_id, progress, completed_at').eq('user_id', userId).eq('day', today),
  ]);

  if (catalogRes.error) throw catalogRes.error;
  if (progressRes.error) throw progressRes.error;

  const progressByMission = new Map<string, UserDailyMissionRow>();
  for (const row of (progressRes.data ?? []) as UserDailyMissionRow[]) {
    progressByMission.set(row.mission_id, row);
  }

  return ((catalogRes.data ?? []) as DailyMissionRow[]).map((row) => {
    const userRow = progressByMission.get(row.id);
    return {
      id: row.id,
      description: row.description,
      metric: row.metric,
      targetAmount: row.target_amount,
      progress: Math.min(userRow?.progress ?? 0, row.target_amount),
      completed: Boolean(userRow?.completed_at),
    };
  });
}
