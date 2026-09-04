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
  /**
   * Textura de fondo del tramo — opaca de borde a borde (no un recorte con
   * huecos), se repite en horizontal Y vertical (como un papel pintado)
   * para cubrir cualquier ancho de pantalla y cualquier longitud de tramo.
   */
  bandImage: string;
  /** Ancho de cada baldosa de bandImage al repetirse (alto sale solo, respetando su proporción real). */
  bandImageWidth: number;
  /** Asfalto/superficie de la carretera cuando el tramo es alcanzable. */
  roadAsphalt: string;
  roadEdge: string;
  roadLane: string;
  /** Mismo trío, pero para el tramo todavía bloqueado (apagado). */
  roadAsphaltMuted: string;
  roadEdgeMuted: string;
  roadLaneMuted: string;
}

export const PATH_THEMES: Record<PathThemeId, PathThemePalette | null> = {
  default: null, // null = sigue usando los colores/decorado de siempre (sin banda de fondo).
  beach: {
    // La propia imagen ya trae palmeras/sombrillas/conchas dibujadas, así
    // que en este tema no se añaden los props de carretera de siempre
    // (ver skip de RoadProps en LearnPath.tsx) — se solaparían con el arte.
    bandImage: '/learn-path/beach_background.png',
    // Ancho de cada "baldosa" de la textura al repetirse — el mismo que
    // --app-max-width (theme.css), así en una pantalla de móvil normal se
    // ve una sola baldosa de lado a lado sin costura visible.
    bandImageWidth: 480,
    roadAsphalt: '#e8c98f',
    roadEdge: '#fbecc7',
    roadLane: '#c9973f',
    roadAsphaltMuted: '#a89572',
    roadEdgeMuted: '#c4b28c',
    roadLaneMuted: '#8a7650',
  },
};

export const THEME_BY_CATEGORY: Partial<Record<string, PathThemeId>> = {
  normas: 'beach',
};

export function themeForCategory(categoryId: string | undefined): PathThemeId {
  if (!categoryId) return 'default';
  return THEME_BY_CATEGORY[categoryId] ?? 'default';
}
