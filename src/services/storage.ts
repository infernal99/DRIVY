import type { UserProgress } from '../types';

/**
 * Persistence boundary. Nothing outside this file (and progressService,
 * which depends only on this interface) should know progress is stored in
 * localStorage — swapping to Supabase/Postgres/Firebase later means
 * implementing this same interface and changing one line in progressStore.
 */
export interface ProgressRepository {
  load(): UserProgress | null;
  save(progress: UserProgress): void;
  clear(): void;
}

const STORAGE_KEY = 'drivy.progress.v1';

export class LocalStorageProgressRepository implements ProgressRepository {
  load(): UserProgress | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as UserProgress;
    } catch (err) {
      console.error('DRIVY: failed to read progress from localStorage', err);
      return null;
    }
  }

  save(progress: UserProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (err) {
      console.error('DRIVY: failed to persist progress to localStorage', err);
    }
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const progressRepository: ProgressRepository = new LocalStorageProgressRepository();
