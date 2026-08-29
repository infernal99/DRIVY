// Display catalog for avatars — id, name and unlock XP. Mirrors the
// `avatars` table in supabase/migrations/20260829110000_avatar_catalog.sql
// and 20260830090000_premium_subscriptions.sql (the actual unlock check
// happens server-side against that table; this copy exists purely for
// rendering — same split this codebase already uses for achievements).
// Keep both in sync by hand if this list changes.

export type AvatarId =
  | 'volante'
  | 'semaforo'
  | 'stop'
  | 'casco'
  | 'coche'
  | 'rayo'
  | 'trofeo'
  | 'corona'
  | 'diamante'
  | 'vip'
  | 'cometa';

export interface AvatarCatalogEntry {
  id: AvatarId;
  name: string;
  xpRequired: number;
  /** Premium-exclusive — unlocked by an active subscription (or the dev bypass) regardless of XP. */
  requiresPremium?: boolean;
}

export const AVATAR_CATALOG: AvatarCatalogEntry[] = [
  { id: 'volante', name: 'Volante', xpRequired: 50 },
  { id: 'semaforo', name: 'Semáforo', xpRequired: 150 },
  { id: 'stop', name: 'Señal de stop', xpRequired: 300 },
  { id: 'casco', name: 'Casco', xpRequired: 500 },
  { id: 'coche', name: 'Coche', xpRequired: 800 },
  { id: 'rayo', name: 'Rayo', xpRequired: 1200 },
  { id: 'trofeo', name: 'Trofeo', xpRequired: 1800 },
  { id: 'corona', name: 'Corona', xpRequired: 2500 },
  { id: 'diamante', name: 'Diamante', xpRequired: 3500 },
  { id: 'vip', name: 'VIP', xpRequired: 0, requiresPremium: true },
  { id: 'cometa', name: 'Cometa', xpRequired: 0, requiresPremium: true },
];

export function isAvatarId(value: string | null | undefined): value is AvatarId {
  return !!value && AVATAR_CATALOG.some((a) => a.id === value);
}

export function getAvatarCatalogEntry(id: string): AvatarCatalogEntry | undefined {
  return AVATAR_CATALOG.find((a) => a.id === id);
}
