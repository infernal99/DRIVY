import type { TrafficSign } from '../types';

// --- 2026-09-01 verification pass ---------------------------------------
// Cross-checked every coded sign below against the Wikipedia Anexo pages
// already cited as `source.url` (WIKI_R/WIKI_P/WIKI_S), which structurally
// mirror the Reglamento General de Circulación's own Anexo I nomenclature
// and were independently corroborated against commercial/driving-school
// signage catalogs (Rotuvall, Preventec, Rótulos González) during this
// audit — never against TodoTest/PracticaTest/autoescuela blog prose, per
// the content-quality initiative's sourcing rules. Confirmed unchanged:
// none of these 17 pre-existing codes appear among the pictograms the 2025
// catalogue reform (Real Decreto 465/2025, BOE-A-2025-12199, in force since
// 2025-07-01) added, redesigned, or repealed — that reform's public
// reporting names P-15a/P-15b (resalto/badén) and new ZBE/VMP signage as
// its notable changes, not any sign in this file. Two previously uncoded
// signs got a confirmed code from this pass (R-100, S-2). 'obras' and
// 'prohibido-paso-peatones' stayed uncoded from this first pass (P-50
// "otros peligros" turned out to be a different, generic sign, not the
// roadworks pictogram; no source pinned down the pedestrian one yet) — both
// were later resolved in the 2026-09-01 real-image pass below (P-18, R-116).
const VERIFIED_AT = '2026-09-01';

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

// --- 2026-09-01 real-image pass (two rounds) ------------------------------
// 16 of the 21 signs below got a real vendored image (public/signs/<image>.svg)
// instead of our hand-drawn <TrafficSign> registry entry — independent
// vector recreations from Wikimedia Commons (mostly Benedicto16, two by
// NACLE2), each individually confirmed public-domain-no-conditions (or CC0
// for the NACLE2 ones) AND not superseded by a newer "2023 set" redesign
// before being used (see TrafficSign.tsx's REAL_SIGN_KEYS comment for why
// this is a small allowlist, not "any Commons file"). Each affected entry
// below has its own comment recording the exact Commons file/license
// checked, so a later pass doesn't have to redo that research from scratch.
// Third pass (2026-09-01, same day): resolved 4 of the remaining 5.
// 'stop' got a second, independently-authored public-domain file (unlike
// the "2023 set"-derived one blocking it in the first pass). The 3 CC-BY-SA/
// GFDL signs (direccion-obligatoria-recto, glorieta-obligatoria,
// fin-limite-velocidad) now ship with visible attribution on the "Fuentes
// oficiales" screen (see sources.ts, id wikimedia-cc-by-sa-sign-attribution),
// so their license condition is satisfied. Only 'paso-peatones' (S-13)
// remains hand-drawn: its only "public domain" Commons file turned out to
// be a relicensed copy of the disputed 2023-set government artwork (same
// sodipodi:docname internally) — not actually independent, so the same
// art. 13 LPI question that blocks the 2023-set file blocks this one too.

export const TRAFFIC_SIGNS: TrafficSign[] = [
  {
    id: 'ceda-el-paso',
    code: 'R-1',
    name: 'Ceda el paso',
    category: 'senales-prioridad',
    image: 'ceda-el-paso',
    // Image: Spain_traffic_signal_r1.svg (Wikimedia Commons, user
    // Benedicto16) — "released into the public domain... for any purpose,
    // without any conditions", no "2023 set" replacement found for this code.
    source: { name: 'Reglamento General de Circulación (RD 1428/2003), Anexo I', url: RGC_BASE, type: 'official' },
    validFrom: '2003-11-21',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'stop',
    code: 'R-2',
    name: 'Detención obligatoria (STOP)',
    category: 'senales-prioridad',
    image: 'stop',
    // Image: Spain_traffic_signal_r2_1992.svg (Wikimedia Commons,
    // Benedicto16), public domain — a distinct, independently-authored file
    // from the "2023 set" one (docname "Ajax.svg", created 2006, predates
    // the 2025 catalogue reform entirely). The octagon has been unchanged
    // internationally for decades, so a pre-reform recreation is still
    // current.
    source: { name: 'Reglamento General de Circulación (RD 1428/2003), Anexo I', url: RGC_BASE, type: 'official' },
    validFrom: '2003-11-21',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'interseccion-prioridad',
    code: 'P-1a',
    name: 'Intersección con prioridad',
    category: 'senales-peligro',
    image: 'interseccion-prioridad',
    source: { name: 'Anexo de señales de peligro (referencia secundaria sobre el Reglamento)', url: WIKI_P, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'curva-peligrosa-derecha',
    code: 'P-13a',
    name: 'Curva peligrosa hacia la derecha',
    category: 'senales-peligro',
    image: 'curva-peligrosa-derecha',
    // Image: Spain_traffic_signal_p13a.svg (Wikimedia Commons, Benedicto16),
    // public domain, no "2023 set" replacement found for this code (only
    // s13/p33/s45/s46 turned up "2023 set" files in this pass).
    source: { name: 'Anexo de señales de peligro (referencia secundaria sobre el Reglamento)', url: WIKI_P, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'paso-nivel',
    code: 'P-11',
    name: 'Paso a nivel sin barreras',
    category: 'senales-peligro',
    image: 'paso-nivel',
    // Image: Spain_traffic_signal_p11.svg (Wikimedia Commons, Benedicto16),
    // public domain, no "2023 set" replacement found for this code.
    source: { name: 'Anexo de señales de peligro (referencia secundaria sobre el Reglamento)', url: WIKI_P, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'animales-sueltos',
    code: 'P-24',
    name: 'Paso de animales en libertad',
    category: 'senales-peligro',
    image: 'animales-sueltos',
    // Image: Spain_traffic_signal_p24.svg (Wikimedia Commons, Benedicto16),
    // public domain, no "2023 set" replacement found for this code.
    source: { name: 'Anexo de señales de peligro (referencia secundaria sobre el Reglamento)', url: WIKI_P, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'obras',
    code: 'P-18',
    name: 'Obras',
    category: 'senales-peligro',
    image: 'obras',
    // NOT P-50: that code is the generic "otros peligros" (exclamation
    // mark) sign, a different pictogram from the roadworks one. The actual
    // code, P-18, was confirmed via Rotuvall/Preventec/Seton signage
    // catalogs (its temporary-worksite variant is TP-18, same pictogram on
    // a yellow background). Image: Spain_traffic_signal_p18.svg (Wikimedia
    // Commons, Benedicto16), public domain — the file's own description
    // flags it as the "1992-2003" design, so if the pictogram was
    // redrawn after 2003 this may need re-checking, but no evidence of a
    // newer replacement (no "2023 set" file for p18) turned up.
    source: { name: 'Reglamento General de Circulación — señales de peligro', url: RGC_BASE, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'prohibido-adelantar',
    code: 'R-305',
    name: 'Adelantamiento prohibido',
    category: 'senales-prohibicion',
    image: 'prohibido-adelantar',
    // Image: Spain_traffic_signal_r305.svg (Wikimedia Commons, Benedicto16),
    // public domain, no "2023 set" replacement found for this code.
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'limite-velocidad-50',
    code: 'R-301',
    name: 'Velocidad máxima (50 km/h)',
    category: 'senales-prohibicion',
    image: 'limite-velocidad-50',
    // Image: Spain_traffic_signal_r301-50.svg (Wikimedia Commons), public
    // domain, no "2023 set" replacement found for this code.
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'limite-velocidad-90',
    code: 'R-301',
    name: 'Velocidad máxima (90 km/h)',
    category: 'senales-prohibicion',
    image: 'limite-velocidad-90',
    // Image: Spain_traffic_signal_r301-90.svg (Wikimedia Commons), public
    // domain, no "2023 set" replacement found for this code.
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'fin-limite-velocidad',
    code: 'R-501',
    name: 'Fin de limitación de velocidad',
    category: 'senales-prohibicion',
    image: 'fin-limite-velocidad',
    // Image: Spain_traffic_signal_r501.svg (Wikimedia Commons, Gigillo83) —
    // CC BY-SA 3.0 / GFDL, attribution given on the "Fuentes oficiales"
    // screen. Shows the pictogram with an example number ("60") crossed out
    // by the diagonal bar — confirmed against the Wikipedia Anexo (already
    // cited as WIKI_R) that R-501's real pictogram includes the specific
    // speed limit being lifted, same convention SEN-PRO-03's own explanation
    // text already describes ("la señal con el número tachado...").
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'circulacion-prohibida-ambos-sentidos',
    code: 'R-100',
    name: 'Circulación prohibida',
    category: 'senales-prohibicion',
    image: 'circulacion-prohibida-ambos-sentidos',
    // Image: Spain_traffic_signal_r100.svg (Wikimedia Commons, Benedicto16),
    // public domain (last touched 2011, "color corrected"), no "2023 set"
    // replacement found for this code.
    source: { name: 'Reglamento General de Circulación — señales de prohibición', url: RGC_BASE, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'prohibido-paso-peatones',
    code: 'R-116',
    name: 'Prohibido el paso a peatones',
    category: 'senales-prohibicion',
    image: 'prohibido-paso-peatones',
    // Code confirmed in the second pass via multiple independent commercial
    // signage catalogs (Rotuvall, Preventec, Seton, Rótulos González) all
    // agreeing on R-116 "Entrada prohibida a peatones" — the Fase 1 pass
    // hadn't found a source solid enough to trust. Image:
    // Spain_traffic_signal_r116.svg (Wikimedia Commons, Benedicto16 +
    // Citypeek cleanup), public domain, no "2023 set" replacement found.
    source: { name: 'Reglamento General de Circulación — señales de prohibición', url: RGC_BASE, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'prohibido-aparcar',
    code: 'R-308',
    name: 'Estacionamiento prohibido',
    category: 'senales-prohibicion',
    image: 'prohibido-aparcar',
    // Image: Spain_traffic_signal_r308.svg (Wikimedia Commons), public
    // domain — redrawn 2025-11-29 by a second contributor (Caminetero)
    // explicitly noting "Color (2025 BOE)", i.e. updated for the current
    // catalogue. The best-confirmed-current file of this whole batch.
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'direccion-obligatoria-recto',
    code: 'R-400a',
    name: 'Sentido obligatorio (recto)',
    category: 'senales-obligacion',
    image: 'direccion-obligatoria-recto',
    // Image: Spain_traffic_signal_r400c.svg (Wikimedia Commons, Gigillo83) —
    // CC BY-SA 3.0 / GFDL, attribution given on the "Fuentes oficiales"
    // screen (sources.ts, id wikimedia-cc-by-sa-sign-attribution). NOTE the
    // filename mismatch: Commons' own r400a.svg/r400b.svg actually depict
    // right/left turn arrows (confirmed by rendering them, not just trusting
    // the filename) — its "c" file is the straight-ahead pictogram this
    // R-400a code needs. Commons' internal a/b/c suffixes for this gallery
    // don't correspond to the official R-400a/b/c code suffixes.
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'glorieta-obligatoria',
    code: 'R-402',
    name: 'Intersección de sentido giratorio obligatorio',
    category: 'senales-obligacion',
    image: 'glorieta-obligatoria',
    // Image: Spain_traffic_signal_r402.svg (Wikimedia Commons) — CC BY-SA
    // (all versions) / GFDL, attribution given on the "Fuentes oficiales"
    // screen. Author is Majafego, NOT Gigillo83 — an earlier research pass
    // wrongly assumed all 3 remaining CC-BY-SA signs shared one author;
    // confirmed via the page's raw wikitext (Information template), not the
    // AI-summarized page view, after that same summarizer got another fact
    // wrong on this file (see wikimedia-cc-by-sa-sign-attribution notes).
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'velocidad-minima-40',
    code: 'R-411',
    name: 'Velocidad mínima (40 km/h)',
    category: 'senales-obligacion',
    image: 'velocidad-minima-40',
    // Image: "Señal r411 velocidad mínima.svg" (Wikimedia Commons, user
    // NACLE2) — CC0 1.0 Universal, a direct public-domain dedication by its
    // own author, not dependent on the government-artwork/art.13 LPI
    // argument that blocks the "2023 set" files elsewhere in this catalogue.
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'carril-bici',
    code: 'R-407a',
    name: 'Vía obligatoria para ciclos',
    category: 'senales-obligacion',
    image: 'carril-bici',
    // Image: "Señal r407 bicicletas.svg" (Wikimedia Commons, user NACLE2,
    // cleanup by Caminetero 2025) — CC0 1.0 Universal, same clean private
    // dedication as velocidad-minima-40 above (not the ambiguous
    // government-sourced "2023 set" license).
    source: { name: 'Anexo de señales de reglamentación (referencia secundaria sobre el Reglamento)', url: WIKI_R, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'paso-peatones',
    code: 'S-13',
    name: 'Situación de un paso para peatones',
    category: 'senales-indicacion',
    image: 'paso-peatones',
    // Stays hand-drawn: Commons' "Spain_traffic_signal_s13.svg" claims
    // public domain (author Benedicto16) but its internal Inkscape metadata
    // (sodipodi:docname="Spain_traffic_signal_s13,_2023_set.svg") shows it's
    // a relicensed copy of the government-traced "2023 set" file, whose own
    // reuse status is the unresolved art. 13 LPI question in sources.ts — a
    // second uploader's PD claim doesn't resolve that question. No other S-13
    // file exists on Commons.
    source: { name: 'Anexo de señales de indicación (referencia secundaria sobre el Reglamento)', url: WIKI_S, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'aparcamiento',
    code: 'S-17',
    name: 'Estacionamiento',
    category: 'senales-indicacion',
    image: 'aparcamiento',
    // Image: Spain_traffic_signal_s17.svg (Wikimedia Commons), public
    // domain — updated 2026-01-11 explicitly for "2025 BOE" colors, one of
    // the best-confirmed-current files in this whole batch.
    source: { name: 'Anexo de señales de indicación (referencia secundaria sobre el Reglamento)', url: WIKI_S, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'autopista',
    code: 'S-1',
    name: 'Autopista',
    category: 'senales-indicacion',
    image: 'autopista',
    // Image: Spain_traffic_signal_s1.svg (Wikimedia Commons), public
    // domain, updated 2026-01-11, no "2023 set" replacement found.
    source: { name: 'Anexo de señales de indicación (referencia secundaria sobre el Reglamento)', url: WIKI_S, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'fin-autopista',
    code: 'S-2',
    name: 'Fin de autopista',
    category: 'senales-indicacion',
    image: 'fin-autopista',
    // Image: Spain_traffic_signal_s2.svg (Wikimedia Commons), public
    // domain, updated 2026-01-11, no "2023 set" replacement found.
    source: { name: 'Reglamento General de Circulación — señales de indicación', url: RGC_BASE, type: 'derived' },
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
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
