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
  | 'owl_astronaut'
  | 'premium_rey'
  | 'premium_duque'
  | 'premium_comandante'
  | 'premium_hechicero'
  | 'premium_magnate'
  | 'premium_aristocrata'
  | 'premium_cesar'
  | 'premium_almirante'
  | 'premium_streamer'
  | 'premium_inspector'
  | 'premium_caballero'
  | 'premium_vip'
  | 'premium_cosmonauta'
  | 'premium_padrino'
  | 'premium_sultan'
  | 'premium_pirata'
  | 'premium_dragon'
  | 'premium_samurai'
  | 'premium_archimago'
  | 'premium_heroe';

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

/**
 * Set premium: no se desbloquean con XP sino con una suscripción activa —
 * mismo mecanismo que ya tenían 'vip' y 'cometa' en el catálogo antiguo.
 */
export const PREMIUM_AVATAR_CATALOG: AvatarCatalogEntry[] = [
  { id: 'premium_rey', name: 'Rey', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_rey.png' },
  { id: 'premium_duque', name: 'Duque', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_duque.png' },
  { id: 'premium_comandante', name: 'Comandante', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_comandante.png' },
  { id: 'premium_hechicero', name: 'Hechicero', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_hechicero.png' },
  { id: 'premium_magnate', name: 'Magnate', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_magnate.png' },
  { id: 'premium_aristocrata', name: 'Aristócrata', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_aristocrata.png' },
  { id: 'premium_cesar', name: 'César', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_cesar.png' },
  { id: 'premium_almirante', name: 'Almirante', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_almirante.png' },
  { id: 'premium_streamer', name: 'Streamer', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_streamer.png' },
  { id: 'premium_inspector', name: 'Inspector', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_inspector.png' },
  { id: 'premium_caballero', name: 'Caballero', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_caballero.png' },
  { id: 'premium_vip', name: 'VIP', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_vip.png' },
  { id: 'premium_cosmonauta', name: 'Cosmonauta', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_cosmonauta.png' },
  { id: 'premium_padrino', name: 'Padrino', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_padrino.png' },
  { id: 'premium_sultan', name: 'Sultán', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_sultan.png' },
  { id: 'premium_pirata', name: 'Pirata', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_pirata.png' },
  { id: 'premium_dragon', name: 'Dragón', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_dragon.png' },
  { id: 'premium_samurai', name: 'Samurái', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_samurai.png' },
  { id: 'premium_archimago', name: 'Archimago', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_archimago.png' },
  { id: 'premium_heroe', name: 'Héroe', xpRequired: 0, requiresPremium: true, imageUrl: '/avatars/premium/premium_heroe.png' },
];

AVATAR_CATALOG.push(...PREMIUM_AVATAR_CATALOG);

export function isAvatarId(value: string | null | undefined): value is AvatarId {
  return !!value && AVATAR_CATALOG.some((a) => a.id === value);
}

export function getAvatarCatalogEntry(id: string): AvatarCatalogEntry | undefined {
  return AVATAR_CATALOG.find((a) => a.id === id);
}
