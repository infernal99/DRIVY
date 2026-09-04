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
   * Imagen de fondo del tramo (con su propia transparencia — no es un
   * rectángulo sólido, así que el fondo oscuro de la app se sigue viendo
   * fuera de la silueta de arena) — se repite en vertical (repeat-y) para
   * cubrir tramos de cualquier longitud.
   */
  bandImage: string;
  /** Ancho al que se pinta bandImage (alto sale solo, respetando su proporción real). */
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
    // Ancho de la pantalla del móvil (--app-max-width en theme.css), no el
    // de la columna de 330px de la carretera — así la imagen llega de lado
    // a lado en vez de dejar franjas oscuras a los dos lados.
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
