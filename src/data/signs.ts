import type { TrafficSign } from '../types';

// Internal sign catalogue (content spec §10). `image` is a key into our own
// <TrafficSign> SVG registry (src/components/ui/TrafficSign.tsx) — never a
// path to DGT artwork, which we have no license to redistribute.
//
// `code` is only set when a specific R-/P-/S- code was actually verified
// against a citable source (see each entry's `source.url`); left undefined
// rather than guessed where we couldn't confirm it — see CONTENT-LICENSES.md
// §"Sign codes" for the research trail.
//
// The 2025 catalogue update (Real Decreto 465/2025, in force since
// 2025-07-01) modified some pictograms; `validFrom`/`validUntil` distinguish
// pre-2025 signage from the current catalogue so we never silently mix them.
const RGC_BASE = 'https://www.boe.es/buscar/act.php?id=BOE-A-2003-23514';
const RD_2025 = 'https://www.boe.es/buscar/doc.php?id=BOE-A-2025-12199';
const WIKI_R = 'https://es.wikipedia.org/wiki/Anexo:Se%C3%B1ales_de_tr%C3%A1fico_de_reglamentaci%C3%B3n_de_Espa%C3%B1a';
const WIKI_P = 'https://es.wikipedia.org/wiki/Anexo:Se%C3%B1ales_de_tr%C3%A1fico_de_peligro_de_Espa%C3%B1a';
const WIKI_S = 'https://es.wikipedia.org/wiki/Anexo:Se%C3%B1ales_de_tr%C3%A1fico_de_indicaci%C3%B3n_de_Espa%C3%B1a';

export const TRAFFIC_SIGNS: TrafficSign[] = [
  {
    id: 'ceda-el-paso',
    code: 'R-1',
    name: 'Ceda el paso',
    category: 'senales-prioridad',
    image: 'ceda-el-paso',
    source: { name: 'Reglamento General de Circulación (RD 1428/2003), Anexo I', url: RGC_BASE, type: 'official' },
    validFrom: '2003-11-21',
  },
  {
    id: 'stop',
    code: 'R-2',
    name: 'Detención obligatoria (STOP)',
    category: 'senales-prioridad',
    image: 'stop',
    source: { name: 'Reglamento General de Circulación (RD 1428/2003), Anexo I', url: RGC_BASE, type: 'official' },
    validFrom: '2003-11-21',
  },
  {
    id: 'interseccion-prioridad',
    code: 'P-1a',
    name: 'Intersección con prioridad',
    category: 'senales-peligro',
    image: 'interseccion-prioridad',
    source: { name: 'Anexo de señales de peligro (referencia secundaria sobre el Reglamento)', url: WIKI_P, type: 'derived' },
  },
  {
    id: 'curva-peligrosa-derecha',
    code: 'P-13a',
    name: 'Curva peligrosa hacia la derecha',
    category: 'senales-peligro',
    image: 'curva-peligrosa-derecha',
    source: { name: 'Anexo de señales de peligro (referencia secundaria sobre el Reglamento)', url: WIKI_P, type: 'derived' },
  },
  {
    id: 'paso-nivel',
    code: 'P-11',
    name: 'Paso a nivel sin barreras',
    category: 'senales-peligro',
    image: 'paso-nivel',
    source: { name: 'Anexo de señales de peligro (referencia secundaria sobre el Reglamento)', url: WIKI_P, type: 'derived' },
  },
  {
    id: 'animales-sueltos',
    code: 'P-24',
    name: 'Paso de animales en libertad',
    category: 'senales-peligro',
    image: 'animales-sueltos',
    source: { name: 'Anexo de señales de peligro (referencia secundaria sobre el Reglamento)', url: WIKI_P, type: 'derived' },
  },
  {
    id: 'obras',
    name: 'Obras',
    category: 'senales-peligro',
    image: 'obras',
    source: { name: 'Reglamento General de Circulación — señales de peligro', url: RGC_BASE, type: 'derived' },
  },
  {
    id: 'prohibido-adelantar',
    code: 'R-305',
    name: 'Adelantamiento prohibido',
    category: 'senales-prohibicion',
    image: 'prohibido-adelantar',
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
  },
  {
    id: 'limite-velocidad-50',
    code: 'R-301',
    name: 'Velocidad máxima (50 km/h)',
    category: 'senales-prohibicion',
    image: 'limite-velocidad-50',
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
  },
  {
    id: 'limite-velocidad-90',
    code: 'R-301',
    name: 'Velocidad máxima (90 km/h)',
    category: 'senales-prohibicion',
    image: 'limite-velocidad-90',
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
  },
  {
    id: 'fin-limite-velocidad',
    code: 'R-501',
    name: 'Fin de limitación de velocidad',
    category: 'senales-prohibicion',
    image: 'fin-limite-velocidad',
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
  },
  {
    id: 'circulacion-prohibida-ambos-sentidos',
    name: 'Circulación prohibida',
    category: 'senales-prohibicion',
    image: 'circulacion-prohibida-ambos-sentidos',
    source: { name: 'Reglamento General de Circulación — señales de prohibición', url: RGC_BASE, type: 'derived' },
  },
  {
    id: 'prohibido-paso-peatones',
    name: 'Prohibido el paso a peatones',
    category: 'senales-prohibicion',
    image: 'prohibido-paso-peatones',
    source: { name: 'Reglamento General de Circulación — señales de prohibición', url: RGC_BASE, type: 'derived' },
  },
  {
    id: 'prohibido-aparcar',
    code: 'R-308',
    name: 'Estacionamiento prohibido',
    category: 'senales-prohibicion',
    image: 'prohibido-aparcar',
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
  },
  {
    id: 'direccion-obligatoria-recto',
    code: 'R-400a',
    name: 'Sentido obligatorio (recto)',
    category: 'senales-obligacion',
    image: 'direccion-obligatoria-recto',
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
  },
  {
    id: 'glorieta-obligatoria',
    code: 'R-402',
    name: 'Intersección de sentido giratorio obligatorio',
    category: 'senales-obligacion',
    image: 'glorieta-obligatoria',
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
  },
  {
    id: 'velocidad-minima-40',
    code: 'R-411',
    name: 'Velocidad mínima (40 km/h)',
    category: 'senales-obligacion',
    image: 'velocidad-minima-40',
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
  },
  {
    id: 'carril-bici',
    code: 'R-407a',
    name: 'Vía obligatoria para ciclos',
    category: 'senales-obligacion',
    image: 'carril-bici',
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
  },
  {
    id: 'paso-peatones',
    code: 'S-13',
    name: 'Situación de un paso para peatones',
    category: 'senales-indicacion',
    image: 'paso-peatones',
    source: { name: 'Anexo de señales de indicación (referencia secundaria sobre el Reglamento)', url: WIKI_S, type: 'derived' },
  },
  {
    id: 'aparcamiento',
    code: 'S-17',
    name: 'Estacionamiento',
    category: 'senales-indicacion',
    image: 'aparcamiento',
    source: { name: 'Anexo de señales de indicación (referencia secundaria sobre el Reglamento)', url: WIKI_S, type: 'derived' },
  },
  {
    id: 'autopista',
    code: 'S-1',
    name: 'Autopista',
    category: 'senales-indicacion',
    image: 'autopista',
    source: { name: 'Anexo de señales de indicación (referencia secundaria sobre el Reglamento)', url: WIKI_S, type: 'derived' },
  },
  {
    id: 'fin-autopista',
    name: 'Fin de autopista',
    category: 'senales-indicacion',
    image: 'fin-autopista',
    source: { name: 'Reglamento General de Circulación — señales de indicación', url: RGC_BASE, type: 'derived' },
  },
];

/**
 * The 2025 catalogue update (RD 465/2025) is in force but signage is being
 * replaced progressively — see the `dgt-catalogo-senales-2025` source. Signs
 * here don't yet carry per-sign 2015-vs-2025 pictogram variants (we'd need
 * the official Anexo I artwork to draw those precisely, which we don't have
 * rights to reproduce); this constant exists so the app can at least surface
 * the caveat wherever it lists signs, and it's the extension point for
 * adding validFrom/validUntil pairs once specific superseded signs are
 * identified with a citable source.
 */
export const SIGN_CATALOG_2025_SOURCE_URL = RD_2025;

export function getSignById(id: string): TrafficSign | undefined {
  return TRAFFIC_SIGNS.find((s) => s.id === id);
}

export function getSignsByCategory(categoryId: string): TrafficSign[] {
  return TRAFFIC_SIGNS.filter((s) => s.category === categoryId);
}
