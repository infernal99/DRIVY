import type {
  CategoryStat,
  ExamAnswer,
  ExamResult,
  QuestionStat,
  UnlockedAchievement,
  UserProgress,
} from '../types';
import type { ProgressRepository } from './storage';
import { supabase } from '../lib/supabase';
import { createInitialProgress } from './progressService';
import { getQuestion } from './questionService';
import { todayISO } from '../utils/date';

const SCHEMA_VERSION = 1;

interface ExamAttemptRow {
  id: number;
  mode: ExamResult['mode'];
  started_at: string;
  finished_at: string;
  duration_seconds: number;
  correct_count: number;
  total_count: number;
  passed: boolean;
}

interface ExamAnswerRow {
  exam_attempt_id: number;
  question_id: string;
  selected_option_id: string | null;
  correct: boolean;
}

/**
 * Cloud-backed ProgressRepository. Implements the same synchronous interface
 * as LocalStorageProgressRepository (see src/services/storage.ts) by keeping
 * an in-memory cache that's populated by an explicit, awaited `hydrate()`
 * call before this repository is ever made active — see
 * src/services/progressSync.ts, which is the only code that constructs and
 * activates this class.
 *
 * `save()` never uploads the whole UserProgress object: it diffs the
 * incoming snapshot against the last-known one and calls the one
 * SECURITY DEFINER RPC that matches what actually changed, so the server
 * (never the client) decides how much XP that action is worth. This mirrors
 * the single-action-at-a-time way progressStore.ts already calls
 * `persist()` — one answered question, one completed lesson, one unlocked
 * category, or one submitted exam per call.
 */
export class SupabaseProgressRepository implements ProgressRepository {
  private cache: UserProgress | null = null;
  private userId: string | null = null;
  private pending: Promise<void> = Promise.resolve();

  async hydrate(userId: string, fallbackName: string): Promise<UserProgress> {
    this.userId = userId;
    this.cache = await this.fetchFullProgress(userId, fallbackName);
    return this.cache;
  }

  /** Re-runs hydrate() for the already-known user, e.g. right after a guest migration. */
  async refresh(): Promise<UserProgress | null> {
    if (!this.userId) return null;
    this.cache = await this.fetchFullProgress(this.userId, this.cache?.userName ?? 'Alex');
    return this.cache;
  }

  async migrateGuestProgress(local: UserProgress): Promise<{ migrated: boolean; error?: string }> {
    if (!this.userId) return { migrated: false, error: 'no-session' };
    try {
      const { data, error } = await supabase.rpc('fn_migrate_guest_progress', { p_payload: local });
      if (error) {
        console.error('Roady: guest progress migration failed', error);
        return { migrated: false, error: error.message };
      }
      return { migrated: Boolean((data as { migrated?: boolean } | null)?.migrated) };
    } catch (err) {
      console.error('Roady: guest progress migration threw', err);
      return { migrated: false, error: String(err) };
    }
  }

  load(): UserProgress | null {
    return this.cache;
  }

  save(next: UserProgress): void {
    const previous = this.cache;
    this.cache = next;
    if (!this.userId) return;

    this.pending = this.pending
      .then(() => this.syncDelta(previous, next))
      .catch((err) => {
        console.error('Roady: failed to sync progress to Supabase', err);
      });
  }

  clear(): void {
    this.cache = null;
    if (!this.userId) return;
    this.pending = this.pending
      .then(async () => {
        const { error } = await supabase.rpc('fn_reset_progress');
        if (error) throw error;
      })
      .catch((err) => {
        console.error('Roady: failed to reset cloud progress', err);
      });
  }

  private async syncDelta(previous: UserProgress | null, next: UserProgress): Promise<void> {
    const prevExamCount = previous?.examResults.length ?? 0;
    if (next.examResults.length > prevExamCount) {
      for (const exam of next.examResults.slice(prevExamCount)) {
        await this.submitExam(exam);
      }
      return;
    }

    for (const [questionId, stat] of Object.entries(next.questionStats)) {
      const prevStat = previous?.questionStats[questionId];
      if (prevStat && stat.timesSeen <= prevStat.timesSeen) continue;
      const categoryId = getQuestion(questionId)?.categoryId;
      if (!categoryId) continue;
      const { error } = await supabase.rpc('fn_record_answer', {
        p_question_id: questionId,
        p_category_id: categoryId,
        p_correct: stat.lastResult === 'correct',
        p_today: todayISO(),
      });
      if (error) throw error;
    }

    const prevLessons = new Set(previous?.completedLessonIds ?? []);
    for (const lessonId of next.completedLessonIds) {
      if (prevLessons.has(lessonId)) continue;
      const { error } = await supabase.rpc('fn_complete_lesson', { p_lesson_id: lessonId, p_today: todayISO() });
      if (error) throw error;
    }

    const prevCategories = new Set(previous?.unlockedCategoryIds ?? []);
    for (const categoryId of next.unlockedCategoryIds) {
      if (prevCategories.has(categoryId)) continue;
      const { error } = await supabase.rpc('fn_unlock_category', { p_category_id: categoryId });
      if (error) throw error;
    }
  }

  private async submitExam(exam: ExamResult): Promise<void> {
    const answers = exam.answers.map((a) => ({
      questionId: a.questionId,
      selectedOptionId: a.selectedOptionId,
      correct: a.correct,
      categoryId: getQuestion(a.questionId)?.categoryId,
    }));
    const { error } = await supabase.rpc('fn_submit_exam', {
      p_mode: exam.mode,
      p_started_at: exam.startedAt,
      p_finished_at: exam.finishedAt,
      p_duration_seconds: exam.durationSeconds,
      p_answers: answers,
      p_today: todayISO(),
    });
    if (error) throw error;
  }

  private async fetchFullProgress(userId: string, fallbackName: string): Promise<UserProgress> {
    const [profileRes, progressRes, questionStatsRes, categoryStatsRes, lessonsRes, categoriesRes, achievementsRes, examAttemptsRes] =
      await Promise.all([
        supabase.from('profiles').select('display_name, created_at').eq('user_id', userId).maybeSingle(),
        supabase.from('user_progress').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('question_stats').select('*').eq('user_id', userId),
        supabase.from('category_stats').select('*').eq('user_id', userId),
        supabase.from('completed_lessons').select('lesson_id').eq('user_id', userId),
        supabase.from('unlocked_categories').select('category_id').eq('user_id', userId),
        supabase.from('user_achievements').select('achievement_id, unlocked_at').eq('user_id', userId),
        supabase.from('exam_attempts').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      ]);

    if (!progressRes.data) {
      // Should only happen for a brand-new account before fn_handle_new_user
      // has run, or if the row is momentarily unavailable — fall back rather
      // than crash the app.
      return createInitialProgress(profileRes.data?.display_name ?? fallbackName);
    }

    const questionStats: Record<string, QuestionStat> = {};
    const mistakeIds: string[] = [];
    for (const row of questionStatsRes.data ?? []) {
      questionStats[row.question_id] = {
        questionId: row.question_id,
        timesSeen: row.times_seen,
        timesCorrect: row.times_correct,
        timesWrong: row.times_wrong,
        lastSeenAt: row.last_seen_at,
        lastResult: row.last_result,
        dueScore: row.due_score,
      };
      if (row.last_result === 'wrong') mistakeIds.push(row.question_id);
    }

    const categoryStats: Record<string, CategoryStat> = {};
    for (const row of categoryStatsRes.data ?? []) {
      categoryStats[row.category_id] = { categoryId: row.category_id, answered: row.answered, correct: row.correct };
    }

    const attemptRows = (examAttemptsRes.data ?? []) as ExamAttemptRow[];
    const attemptIds = attemptRows.map((r) => r.id);
    const examAnswersRes = attemptIds.length
      ? await supabase.from('exam_answers').select('*').in('exam_attempt_id', attemptIds)
      : { data: [] as ExamAnswerRow[] };
    const answersByAttempt = new Map<number, ExamAnswer[]>();
    for (const row of (examAnswersRes.data ?? []) as ExamAnswerRow[]) {
      const list = answersByAttempt.get(row.exam_attempt_id) ?? [];
      list.push({ questionId: row.question_id, selectedOptionId: row.selected_option_id, correct: row.correct });
      answersByAttempt.set(row.exam_attempt_id, list);
    }
    const examResults: ExamResult[] = attemptRows.map((row) => ({
      id: `exam-${row.id}`,
      mode: row.mode,
      startedAt: row.started_at,
      finishedAt: row.finished_at,
      durationSeconds: row.duration_seconds,
      answers: answersByAttempt.get(row.id) ?? [],
      correctCount: row.correct_count,
      totalCount: row.total_count,
      passed: row.passed,
    }));

    const achievements: UnlockedAchievement[] = (achievementsRes.data ?? []).map((row) => ({
      id: row.achievement_id,
      unlockedAt: row.unlocked_at,
    }));

    const p = progressRes.data;
    return {
      schemaVersion: SCHEMA_VERSION,
      userName: profileRes.data?.display_name ?? fallbackName,
      xp: p.xp,
      streakCount: p.streak_count,
      bestStreakEver: p.best_streak_ever,
      lastActivityDate: p.last_activity_date,
      currentCorrectStreak: p.current_correct_streak,
      bestCorrectStreak: p.best_correct_streak,
      questionStats,
      categoryStats,
      mistakeIds,
      completedLessonIds: (lessonsRes.data ?? []).map((r) => r.lesson_id),
      unlockedCategoryIds: (categoriesRes.data ?? []).map((r) => r.category_id),
      achievements,
      examResults,
      createdAt: p.created_at,
    };
  }
}
