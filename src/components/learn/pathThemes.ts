/**
 * Ambientación visual por categoría — la idea de producto es que cada tema
 * del temario tenga su propio "paisaje" en el camino (playa, ciudad,
 * montaña...) en vez de que las 8 categorías compartan siempre el mismo
 * fondo morado neutro. Empezamos con un único tema (playa, para "Normas de
 * circulación") como prueba de concepto — añadir otro es solo sumar una
 * entrada a THEME_BY_CATEGORY + una paleta en PATH_THEMES.
 */
export type PathThemeId = 'default' | 'beach';

export interface PathThemePalette {
  /** Fondo del "tramo" — banda detrás de la carretera, a todo el ancho de la pantalla. */
  bandBackground: string;
  /** Asfalto/superficie de la carretera cuando el tramo es alcanzable. */
  roadAsphalt: string;
  roadEdge: string;
  roadLane: string;
  /** Mismo trío, pero para el tramo todavía bloqueado (apagado). */
  roadAsphaltMuted: string;
  roadEdgeMuted: string;
  roadLaneMuted: string;
  /** Emoji de decorado junto a la carretera, sustituyen a los props por defecto en este tramo. */
  props: string[];
}

export const PATH_THEMES: Record<PathThemeId, PathThemePalette | null> = {
  default: null, // null = sigue usando los colores/decorado de siempre (sin banda de fondo).
  beach: {
    bandBackground: 'linear-gradient(180deg, #f6dfa8 0%, #f0cf8a 55%, #e3ba6c 100%)',
    roadAsphalt: '#e8c98f',
    roadEdge: '#fbecc7',
    roadLane: '#c9973f',
    roadAsphaltMuted: '#a89572',
    roadEdgeMuted: '#c4b28c',
    roadLaneMuted: '#8a7650',
    props: ['🌴', '🐚', '⛱️', '🦀', '🌊', '🏖️'],
  },
};

export const THEME_BY_CATEGORY: Partial<Record<string, PathThemeId>> = {
  normas: 'beach',
};

export function themeForCategory(categoryId: string | undefined): PathThemeId {
  if (!categoryId) return 'default';
  return THEME_BY_CATEGORY[categoryId] ?? 'default';
}
