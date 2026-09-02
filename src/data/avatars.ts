// Display catalog for avatars — id, name, unlock XP and artwork. Mirrors the
// `avatars` table in supabase/migrations/20260902120000_owl_player_avatars.sql
// (the actual unlock check happens server-side against that table; this copy
// exists purely for rendering — same split this codebase already uses for
// achievements). Keep both in sync by hand if this list changes.
//
// The original driving-icon catalog (volante/semaforo/stop/casco/coche/
// rayo/trofeo/corona/diamante/vip/cometa, from 20260829110000_avatar_catalog.sql)
// was replaced by these 20 player-avatar owls, per explicit product
// decision — removed here from the picker, but left alone in the DB so any
// profile that already has one saved keeps working (Avatar just falls back
// to the initial-letter circle for an id no longer in this catalog).

export type AvatarId =
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
  /** Real artwork (public/avatars/*.png), rendered directly by AvatarIcon. */
  imageUrl: string;
}

/** Avatares de jugador (búho con distintas personalidades) — puramente cosméticos, se desbloquean progresivamente con XP. */
export const AVATAR_CATALOG: AvatarCatalogEntry[] = [
  { id: 'owl_professor', name: 'Profesor', xpRequired: 0, imageUrl: '/avatars/owl_professor.png' },
  { id: 'owl_construction', name: 'Obrero', xpRequired: 80, imageUrl: '/avatars/owl_construction.png' },
  { id: 'owl_pilot', name: 'Piloto', xpRequired: 180, imageUrl: '/avatars/owl_pilot.png' },
  { id: 'owl_student', name: 'Estudiante', xpRequired: 320, imageUrl: '/avatars/owl_student.png' },
  { id: 'owl_detective', name: 'Detective', xpRequired: 500, imageUrl: '/avatars/owl_detective.png' },
  { id: 'owl_artist', name: 'Artista', xpRequired: 720, imageUrl: '/avatars/owl_artist.png' },
  { id: 'owl_gamer', name: 'Gamer', xpRequired: 980, imageUrl: '/avatars/owl_gamer.png' },
  { id: 'owl_scientist', name: 'Científico', xpRequired: 1280, imageUrl: '/avatars/owl_scientist.png' },
  { id: 'owl_rockstar', name: 'Rockstar', xpRequired: 1620, imageUrl: '/avatars/owl_rockstar.png' },
  { id: 'owl_chef', name: 'Chef', xpRequired: 2000, imageUrl: '/avatars/owl_chef.png' },
  { id: 'owl_tech', name: 'Tech', xpRequired: 2420, imageUrl: '/avatars/owl_tech.png' },
  { id: 'owl_captain', name: 'Capitán', xpRequired: 2880, imageUrl: '/avatars/owl_captain.png' },
  { id: 'owl_explorer', name: 'Explorador', xpRequired: 3380, imageUrl: '/avatars/owl_explorer.png' },
  { id: 'owl_athlete', name: 'Atleta', xpRequired: 3920, imageUrl: '/avatars/owl_athlete.png' },
  { id: 'owl_doctor', name: 'Doctor', xpRequired: 4500, imageUrl: '/avatars/owl_doctor.png' },
  { id: 'owl_magician', name: 'Mago', xpRequired: 5120, imageUrl: '/avatars/owl_magician.png' },
  { id: 'owl_football', name: 'Futbolista', xpRequired: 5780, imageUrl: '/avatars/owl_football.png' },
  { id: 'owl_ninja', name: 'Ninja', xpRequired: 6480, imageUrl: '/avatars/owl_ninja.png' },
  { id: 'owl_musician', name: 'Músico', xpRequired: 7220, imageUrl: '/avatars/owl_musician.png' },
  { id: 'owl_astronaut', name: 'Astronauta', xpRequired: 8000, imageUrl: '/avatars/owl_astronaut.png' },
];

export function isAvatarId(value: string | null | undefined): value is AvatarId {
  return !!value && AVATAR_CATALOG.some((a) => a.id === value);
}

export function getAvatarCatalogEntry(id: string): AvatarCatalogEntry | undefined {
  return AVATAR_CATALOG.find((a) => a.id === id);
}
