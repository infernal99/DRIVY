import type { User } from '@supabase/supabase-js';
import { progressRepository } from './storage';
import { SupabaseProgressRepository } from './supabaseProgressRepository';
import { setActiveRepository } from '../store/progressStore';

export interface SyncNotice {
  kind: 'success' | 'error';
  message: string;
}

let activeSupabaseRepo: SupabaseProgressRepository | null = null;

function displayNameFor(user: User): string {
  const metaName = typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name.trim() : '';
  return metaName || user.email?.split('@')[0] || 'Alex';
}

function hasMeaningfulProgress(local: ReturnType<typeof progressRepository.load>): boolean {
  if (!local) return false;
  return (
    local.xp > 0 ||
    Object.keys(local.questionStats).length > 0 ||
    local.examResults.length > 0 ||
    local.completedLessonIds.length > 0
  );
}

/**
 * Runs once per genuine sign-in (see src/store/authStore.ts, which is the
 * only caller — it deliberately does not call this on token refresh or
 * password-update events). Hydrates cloud progress, migrates local guest
 * progress into it exactly once if there's anything to migrate and the
 * cloud account is still empty, then switches progressStore to read/write
 * through the cloud repository from now on.
 */
export async function handleSignedIn(user: User): Promise<SyncNotice | null> {
  const local = progressRepository.load();
  const repo = new SupabaseProgressRepository();
  activeSupabaseRepo = repo;

  const hydrated = await repo.hydrate(user.id, displayNameFor(user));
  const cloudIsEmpty = hydrated.xp === 0 && Object.keys(hydrated.questionStats).length === 0 && hydrated.examResults.length === 0;

  let notice: SyncNotice | null = null;
  if (local && hasMeaningfulProgress(local) && cloudIsEmpty) {
    const result = await repo.migrateGuestProgress(local);
    if (result.migrated) {
      // Only clear the local copy once the cloud copy is confirmed —
      // avoids ever losing progress to a failed migration.
      progressRepository.clear();
      await repo.refresh();
      notice = { kind: 'success', message: 'Tu progreso se ha sincronizado con tu cuenta.' };
    } else if (result.error) {
      notice = { kind: 'error', message: 'No se pudo sincronizar tu progreso anterior. Se ha mantenido guardado en este dispositivo.' };
    }
  }

  setActiveRepository(activeSupabaseRepo);
  return notice;
}

export function handleSignedOut(): void {
  activeSupabaseRepo = null;
  setActiveRepository(progressRepository);
}
