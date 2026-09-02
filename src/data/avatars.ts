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
  | 'cometa'
  | 'owl_professor'
  | 'owl_construction'
  | 'owl_pilot'
  | 'owl_student'
  | 'owl_detective'
  | 'owl_artist'
  | 'owl_gamer'
  | 'owl_scientist'
  | 'owl_rockstar'
  | 'owl_chef'
  | 'owl_tech'
  | 'owl_captain'
  | 'owl_explorer'
  | 'owl_athlete'
  | 'owl_doctor'
  | 'owl_magician'
  | 'owl_football'
  | 'owl_ninja'
  | 'owl_musician'
  | 'owl_astronaut';

export interface AvatarCatalogEntry {
  id: AvatarId;
  name: string;
  xpRequired: number;
  /** Premium-exclusive — unlocked by an active subscription (or the dev bypass) regardless of XP. */
  requiresPremium?: boolean;
  /** Real artwork (public/avatars/*.png) to render directly instead of the drawn glyph in AvatarIcon. */
  imageUrl?: string;
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

/**
 * Avatares de jugador (búho con distintas personalidades) — puramente
 * cosméticos, no representan NPCs ni lecciones. Todos desbloqueados desde
 * el principio (xpRequired: 0, sin premium), a petición explícita.
 */
export const OWL_AVATAR_CATALOG: AvatarCatalogEntry[] = [
  { id: 'owl_professor', name: 'Profesor', xpRequired: 0, imageUrl: '/avatars/owl_professor.png' },
  { id: 'owl_construction', name: 'Obrero', xpRequired: 0, imageUrl: '/avatars/owl_construction.png' },
  { id: 'owl_pilot', name: 'Piloto', xpRequired: 0, imageUrl: '/avatars/owl_pilot.png' },
  { id: 'owl_student', name: 'Estudiante', xpRequired: 0, imageUrl: '/avatars/owl_student.png' },
  { id: 'owl_detective', name: 'Detective', xpRequired: 0, imageUrl: '/avatars/owl_detective.png' },
  { id: 'owl_artist', name: 'Artista', xpRequired: 0, imageUrl: '/avatars/owl_artist.png' },
  { id: 'owl_gamer', name: 'Gamer', xpRequired: 0, imageUrl: '/avatars/owl_gamer.png' },
  { id: 'owl_scientist', name: 'Científico', xpRequired: 0, imageUrl: '/avatars/owl_scientist.png' },
  { id: 'owl_rockstar', name: 'Rockstar', xpRequired: 0, imageUrl: '/avatars/owl_rockstar.png' },
  { id: 'owl_chef', name: 'Chef', xpRequired: 0, imageUrl: '/avatars/owl_chef.png' },
  { id: 'owl_tech', name: 'Tech', xpRequired: 0, imageUrl: '/avatars/owl_tech.png' },
  { id: 'owl_captain', name: 'Capitán', xpRequired: 0, imageUrl: '/avatars/owl_captain.png' },
  { id: 'owl_explorer', name: 'Explorador', xpRequired: 0, imageUrl: '/avatars/owl_explorer.png' },
  { id: 'owl_athlete', name: 'Atleta', xpRequired: 0, imageUrl: '/avatars/owl_athlete.png' },
  { id: 'owl_doctor', name: 'Doctor', xpRequired: 0, imageUrl: '/avatars/owl_doctor.png' },
  { id: 'owl_magician', name: 'Mago', xpRequired: 0, imageUrl: '/avatars/owl_magician.png' },
  { id: 'owl_football', name: 'Futbolista', xpRequired: 0, imageUrl: '/avatars/owl_football.png' },
  { id: 'owl_ninja', name: 'Ninja', xpRequired: 0, imageUrl: '/avatars/owl_ninja.png' },
  { id: 'owl_musician', name: 'Músico', xpRequired: 0, imageUrl: '/avatars/owl_musician.png' },
  { id: 'owl_astronaut', name: 'Astronauta', xpRequired: 0, imageUrl: '/avatars/owl_astronaut.png' },
];

AVATAR_CATALOG.push(...OWL_AVATAR_CATALOG);

export function isAvatarId(value: string | null | undefined): value is AvatarId {
  return !!value && AVATAR_CATALOG.some((a) => a.id === value);
}

export function getAvatarCatalogEntry(id: string): AvatarCatalogEntry | undefined {
  return AVATAR_CATALOG.find((a) => a.id === id);
}
