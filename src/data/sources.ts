/**
 * Canonical registry of every source consulted while building Roady's
 * content. This is the single source of truth: `scripts/export-sources.ts`
 * regenerates content/sources/*.json and CONTENT-LICENSES.md from this file
 * — edit here, not there.
 *
 * `reviewStatus`:
 *   cleared        — safe to ground `derived`/`official` content in.
 *   needs_review   — provenance/license unclear; reference-only, never a
 *                     basis for `official` content, and not imported in bulk.
 *   reference_only — useful to spot missing topics, nothing more (content
 *                     spec §27, priority 4).
 */
export type SourceReviewStatus = 'cleared' | 'needs_review' | 'reference_only';

export interface ContentSource {
  id: string;
  name: string;
  description: string;
  url: string;
  owner: string;
  /** SPDX id, plain-language description, or 'unknown' when undocumented. */
  license: string;
  contentType: string;
  reviewStatus: SourceReviewStatus;
  /** What we've concluded we CAN reuse from this source, in plain language. */
  canReuse: string[];
  /** What we've concluded we CANNOT (or haven't cleared to) reuse. */
  cannotReuse: string[];
  attribution?: string;
  /** Date we last checked this source, ISO format. */
  consultedAt: string;
  /** Free-text research notes — why the status is what it is. */
  notes?: string;
}

export const CONTENT_SOURCES: ContentSource[] = [
  {
    id: 'dgt-normativa-circulacion',
    name: 'DGT — Normativa para la circulación',
    description:
      'Reglamento General de Circulación y normas de prioridad, adelantamiento, velocidad, paradas y estacionamiento.',
    url: 'https://www.dgt.es/muevete-con-seguridad/conoce-las-normas-de-trafico/normativa-para-la-circulacion/',
    owner: 'Dirección General de Tráfico (Ministerio del Interior)',
    license: 'unknown (contenido institucional público; sin licencia de reutilización explícita)',
    contentType: 'Normativa e información oficial',
    reviewStatus: 'cleared',
    canReuse: ['Redactar preguntas y explicaciones propias (derived) basadas en estos hechos normativos, citando la fuente'],
    cannotReuse: ['Copiar texto literal de la página como si fuera nuestro'],
    consultedAt: '2026-08-25',
  },
  {
    id: 'dgt-normativa-conductores',
    name: 'DGT — Normativa para conductores',
    description: 'Obligaciones del conductor, documentación y aptitudes psicofísicas.',
    url: 'https://www.dgt.es/muevete-con-seguridad/conoce-las-normas-de-trafico/normativa-para-conductores/',
    owner: 'Dirección General de Tráfico (Ministerio del Interior)',
    license: 'unknown (contenido institucional público; sin licencia de reutilización explícita)',
    contentType: 'Normativa e información oficial',
    reviewStatus: 'cleared',
    canReuse: ['Redactar preguntas y explicaciones propias (derived) basadas en estos hechos normativos, citando la fuente'],
    cannotReuse: ['Copiar texto literal de la página como si fuera nuestro'],
    consultedAt: '2026-08-25',
  },
  {
    id: 'dgt-consumo-alcohol',
    name: 'DGT — Consumo de alcohol',
    description: 'Tasas de alcoholemia permitidas, efectos del alcohol y controles preventivos.',
    url: 'https://www.dgt.es/muevete-con-seguridad/evita-conductas-de-riesgo/consumo-de-alcohol/',
    owner: 'Dirección General de Tráfico (Ministerio del Interior)',
    license: 'unknown (contenido institucional público; sin licencia de reutilización explícita)',
    contentType: 'Normativa e información oficial',
    reviewStatus: 'cleared',
    canReuse: ['Redactar preguntas y explicaciones propias (derived) basadas en estos hechos normativos, citando la fuente'],
    cannotReuse: ['Copiar texto literal de la página como si fuera nuestro'],
    consultedAt: '2026-08-25',
  },
  {
    id: 'dgt-permiso-por-puntos',
    name: 'DGT — Cómo funciona el permiso por puntos',
    description: 'Saldo inicial de puntos, recuperación y pérdida de puntos por infracción.',
    url: 'https://www.dgt.es/nuestros-servicios/permisos-de-conducir/tus-puntos-y-tus-permisos/como-funciona-el-permiso-por-puntos/',
    owner: 'Dirección General de Tráfico (Ministerio del Interior)',
    license: 'unknown (contenido institucional público; sin licencia de reutilización explícita)',
    contentType: 'Normativa e información oficial',
    reviewStatus: 'cleared',
    canReuse: ['Redactar preguntas y explicaciones propias (derived) basadas en estos hechos normativos, citando la fuente'],
    cannotReuse: ['Copiar texto literal de la página como si fuera nuestro'],
    consultedAt: '2026-08-25',
  },
  {
    id: 'dgt-limites-velocidad-urbanos',
    name: 'DGT — Nuevos límites de velocidad en vías urbanas',
    description: 'Límites de 20/30/50 km/h en vías urbanas según número de carriles y tipo de plataforma.',
    url: 'https://www.dgt.es/comunicacion/notas-de-prensa/la-dgt-y-la-femp-presentan-el-manual-de-aplicacion-de-los-nuevos-limites-de-velocidad-en-vias-urbanas/',
    owner: 'Dirección General de Tráfico (Ministerio del Interior)',
    license: 'unknown (nota de prensa institucional; sin licencia de reutilización explícita)',
    contentType: 'Nota de prensa oficial',
    reviewStatus: 'cleared',
    canReuse: ['Redactar preguntas y explicaciones propias (derived) basadas en estos hechos normativos, citando la fuente'],
    cannotReuse: ['Copiar texto literal de la nota de prensa'],
    consultedAt: '2026-08-25',
  },
  {
    id: 'dgt-catalogo-senales-2025',
    name: 'DGT — Actualización del catálogo oficial de señales (2025)',
    description:
      'Nota de prensa sobre la actualización del catálogo de señales de tráfico (Real Decreto 465/2025), en vigor desde el 1 de julio de 2025 con implantación progresiva.',
    url: 'https://www.dgt.es/comunicacion/notas-de-prensa/20250610-el-gobierno-aprueba-la-actualizacion-del-catalogo-oficial-de-senales-de-trafico/',
    owner: 'Dirección General de Tráfico (Ministerio del Interior)',
    license: 'unknown (nota de prensa institucional; sin licencia de reutilización explícita)',
    contentType: 'Nota de prensa oficial',
    reviewStatus: 'cleared',
    canReuse: ['Citar el hecho normativo (fecha, alcance) y marcar preguntas afectadas con signCatalogVersion'],
    cannotReuse: ['Reproducir los pictogramas oficiales del catálogo (no tenemos el Anexo I con licencia de redistribución)'],
    consultedAt: '2026-08-25',
  },
  {
    id: 'boe-reglamento-general-circulacion',
    name: 'BOE — Reglamento General de Circulación (RD 1428/2003) y su modificación (RD 465/2025)',
    description: 'Texto consolidado del Reglamento General de Circulación, incluido el Anexo I (catálogo de señales).',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2003-23514',
    owner: 'Boletín Oficial del Estado / Ministerio del Interior',
    license: 'Texto normativo público (BOE) — reutilizable para citar y referenciar; el Anexo I incluye artwork gráfico cuya redistribución no hemos verificado',
    contentType: 'Norma jurídica (texto legal)',
    reviewStatus: 'cleared',
    canReuse: ['Citar artículos y códigos de señal para dar contexto normativo a preguntas `derived`'],
    cannotReuse: ['Reproducir el artwork gráfico del Anexo I como imagen de la app'],
    consultedAt: '2026-08-26',
  },
  {
    id: 'boe-reutilizacion-anexos-graficos-rd465-2025',
    name: 'BOE — ¿son reutilizables los pictogramas del Anexo del RD 465/2025 (catálogo de señales)?',
    description:
      'Investigación específica (2026-09-01) sobre si el artwork gráfico del catálogo oficial de señales, publicado como anexo del Real Decreto 465/2025, es legalmente reutilizable — para decidir si Roady puede sustituir sus SVG propios por reproducciones fieles del pictograma oficial.',
    url: 'https://www.boe.es/informacion/aviso_legal/index.php',
    owner: 'Agencia Estatal Boletín Oficial del Estado',
    license: 'NO CONCLUYENTE — ver notes. No usar como base para reproducir artwork sin revisión legal profesional.',
    contentType: 'Análisis legal (dos fuentes en tensión, sin resolver)',
    reviewStatus: 'needs_review',
    canReuse: [
      'Citar el razonamiento en la documentación interna como punto de partida para una consulta legal real',
    ],
    cannotReuse: [
      'Reproducir el artwork del Anexo I / RD 465/2025 en la app basándose únicamente en este análisis',
      'Presentar esos pictogramas como "oficiales" en el sentido legal de "reutilización confirmada"',
    ],
    consultedAt: '2026-09-01',
    notes:
      'Dos argumentos en tensión, ninguno concluyente: (1) A FAVOR — el art. 13 del TRLPI (RDLeg 1/1996) excluye de propiedad intelectual "las disposiciones legales o reglamentarias"; la propia Wikipedia en español se apoya en este artículo para alojar libremente textos legales españoles y afirma (página "Recursos libres/Artículo 13") que la exclusión alcanza a "anexos, gráficos, etc." de esas disposiciones — y el Anexo I del RD 465/2025 no es una ilustración decorativa añadida a la norma, es la norma misma (el decreto define el pictograma oficial dibujándolo). (2) EN CONTRA — la licencia de reutilización que el propio BOE publica en su aviso legal excluye expresamente "el diseño del portal, así como sus elementos gráficos"; no está claro si esa frase se refiere solo al diseño de la web boe.es o también a las imágenes incrustadas en los documentos que aloja, y no encontré jurisprudencia ni doctrina que resuelva específicamente este caso (catálogos técnicos/pictogramas de un reglamento). Conclusión: mantener needs_review y NO reproducir artwork DGT/BOE hasta que un abogado de propiedad intelectual lo confirme — el coste de equivocarse (retirar contenido, quedar mal con Stripe/premium ya en producción) supera el beneficio estético de un pictograma más fiel. Nota posterior (mismo día): esta vía sigue cerrada, pero se encontró una vía distinta y sí resuelta — ver la fuente `wikimedia-commons-spain-traffic-signals`.',
  },
  {
    id: 'wikimedia-commons-spain-traffic-signals',
    name: 'Wikimedia Commons — serie "Spain traffic signal *.svg" (recreaciones independientes de señales españolas)',
    description:
      'Catálogo de la comunidad de Wikimedia Commons con recreaciones vectoriales independientes de señales de tráfico españolas (no el artwork oficial de la DGT/BOE). Investigado como alternativa a los SVG dibujados a mano de TrafficSign.tsx, después de que un usuario detectara que el icono de "Obras" era ilegible (parecía un peatón).',
    url: 'https://commons.wikimedia.org/wiki/Category:SVG_road_signs_in_Spain',
    owner: 'Comunidad de Wikimedia Commons (mayormente el usuario Benedicto16, cesión individual por archivo)',
    license: 'Variable por archivo — NUNCA asumir dominio público solo por estar en Commons; ver notes.',
    contentType: 'Recreaciones vectoriales de señales de tráfico (contenido de terceros, no gubernamental)',
    reviewStatus: 'needs_review',
    canReuse: [
      'Los archivos de Benedicto16 (o NACLE2, con dedicación CC0 propia) explícitamente liberados a dominio público, verificados individualmente y sin sustituto "2023 set" conocido — ya usados en signs.ts para 16 señales: R-1, P-11, P-18, R-305, R-100, R-308, P-24, P-13a, R-301 (50/90), S-1, S-2, S-17, R-116, R-407a, R-411',
      'Un segundo archivo de Benedicto16 para R-2 (STOP), "Spain_traffic_signal_r2_1992.svg" — distinto del bloqueado por "2023 set", con docname genérico ("Ajax.svg") que no indica ningún origen gubernamental',
      'Archivos CC BY-SA/GFDL de Gigillo83 (R-400a → usa el fichero Commons "r400c.svg", ver nota) y Majafego (R-402), y de Gigillo83 (R-501), ahora que la app muestra atribución visible en la pantalla "Fuentes oficiales" (ver `wikimedia-cc-by-sa-sign-attribution`)',
    ],
    cannotReuse: [
      'El archivo "Spain_traffic_signal_s13.svg" pese a su etiqueta de dominio público: su metadato interno de Inkscape (sodipodi:docname) revela que es una copia relicenciada del artwork "2023 set" de origen gubernamental — el mismo problema del art. 13 LPI sin resolver, no una fuente independiente. No usado; S-13 (paso de peatones) se mantiene dibujado a mano.',
      'Cualquier archivo de esta serie sin comprobar individualmente licencia + vigencia + contenido real (no solo el nombre del archivo) — no extrapolar "esta serie es toda de dominio público", y no asumir que el sufijo a/b/c de un nombre de archivo Commons corresponde al sufijo del código oficial (ver nota sobre R-400a/b/c)',
    ],
    consultedAt: '2026-09-01',
    notes:
      'La serie "Spain traffic signal X.svg" no es homogénea: mismo patrón de nombres, pero distintos autores y licencias mezclados en el mismo árbol de categorías. Confirmado dominio público (mismo texto de cesión, autor Benedicto16, sin sustituto posterior) para: r1, p11, p18, r305, r100, r308, p24, p13a, r301-50, r301-90, s1, s2, s17, r116, y (tercera pasada) r2_1992 (STOP). Confirmado CC0 1.0 (dedicación privada de su propio autor, NACLE2 — no depende del argumento del art. 13 LPI sobre artwork gubernamental) para: r407a ("Señal_r407_bicicletas.svg"), r411 ("Señal_r411_velocidad_mínima.svg"). Confirmado CC BY-SA/GFDL —usados en la tercera pasada con atribución— para: r400a (en realidad el fichero "r400c.svg", ver más abajo), r402 (autor real Majafego, no Gigillo83 — la investigación de la segunda pasada asumió mal que las 3 señales compartían autor; corregido tras leer el wikitext crudo de la página, no el resumen de un summarizer que ya se había equivocado una vez en esta misma investigación), r501 (autor Gigillo83). Confirmado NO reutilizable (relicenciado de artwork "2023 set" gubernamental) para: s13 (paso de peatones) — ver cannotReuse. Trampa detectada en la tercera pasada: la galería Commons de R-400 (r400a.svg/r400b.svg/r400c.svg) NO usa el mismo criterio a/b/c que el código oficial R-400a/b/c — al renderizar cada fichero, "r400a.svg" resultó ser la flecha de giro a la DERECHA (según su propia descripción "Turn right sign... used for not turning left or straight ahead"), "r400b.svg" la de giro a la IZQUIERDA, y "r400c.svg" la de RECTO — este último es el que se usa para nuestra señal R-400a ("Sentido obligatorio recto"). Sin esta comprobación visual se habría introducido un error de contenido real (flecha equivocada), del mismo tipo que el bug de "obras" que motivó todo este trabajo. r501 se usa con un número de ejemplo ("60") tachado por la franja diagonal — confirmado contra la Wikipedia Anexo (WIKI_R) que el pictograma real de R-501 SÍ incluye el número de la limitación que termina, no una franja genérica sin número. Segunda pasada (mismo día) resolvió también el código de dos señales que en la Fase 1 habían quedado sin confirmar: obras = P-18, prohibido-paso-peatones = R-116 (este último confirmado además contra cuatro catálogos comerciales independientes: Rotuvall, Preventec, Seton, Rótulos González).',
  },
  {
    id: 'wikimedia-cc-by-sa-sign-attribution',
    name: 'Atribución de imágenes CC BY-SA / GFDL de señales de tráfico (Wikimedia Commons)',
    description:
      'Cumplimiento de la condición de atribución de las 3 señales del catálogo (R-400a, R-402, R-501) cuya imagen real procede de un archivo de Wikimedia Commons licenciado CC BY-SA / GFDL, no de dominio público. La atribución se muestra aquí, en la pantalla "Fuentes oficiales" de la propia app.',
    url: 'https://commons.wikimedia.org/wiki/Category:SVG_road_signs_in_Spain',
    owner: 'Autores individuales en Wikimedia Commons (ver detalle)',
    license:
      'CC BY-SA 3.0 / GNU Free Documentation License — R-400a ("Spain_traffic_signal_r400c.svg"): autor Gigillo83. R-402 ("Spain_traffic_signal_r402.svg"): autor Majafego. R-501 ("Spain_traffic_signal_r501.svg"): autor Gigillo83. Ninguno de los 3 ficheros ha sido modificado respecto al original.',
    contentType: 'Atribución de imagen (requisito de licencia)',
    reviewStatus: 'cleared',
    canReuse: [
      'Mostrar estos 3 iconos en la app tal cual, con esta atribución visible, tal y como exige CC BY-SA/GFDL',
    ],
    cannotReuse: ['Modificar estos 3 SVG y redistribuirlos sin conservar la misma licencia (cláusula share-alike)'],
    consultedAt: '2026-09-01',
  },
  {
    id: 'dgt-que-hacer-accidente',
    name: 'DGT — Qué hacer ante un accidente de tráfico',
    description: 'Protocolo PAS (Proteger, Alertar, Socorrer), distancias de los triángulos de señalización, qué hacer y qué no hacer con los heridos, y el teléfono 112.',
    url: 'https://www.dgt.es/muevete-con-seguridad/que-hacer-ante-un-accidente-de-trafico/',
    owner: 'Dirección General de Tráfico (Ministerio del Interior)',
    license: 'unknown (contenido institucional público; sin licencia de reutilización explícita)',
    contentType: 'Normativa e información oficial',
    reviewStatus: 'cleared',
    canReuse: ['Redactar preguntas y explicaciones propias (derived) basadas en estos hechos, citando la fuente'],
    cannotReuse: ['Copiar texto literal de la página como si fuera nuestro'],
    consultedAt: '2026-09-01',
  },
  {
    id: 'dgt-conduccion-eficiente',
    name: 'DGT — Conducción eficiente',
    description: 'Consejos oficiales de conducción eficiente y ecológica: marchas largas, apagar el motor en paradas superiores a 60 segundos, efecto de la baca en el consumo, y freno motor en descensos.',
    url: 'https://www.dgt.es/muevete-con-seguridad/conviertete-en-un-buen-conductor/consejos-generales/conduccion-eficiente/',
    owner: 'Dirección General de Tráfico (Ministerio del Interior)',
    license: 'unknown (contenido institucional público; sin licencia de reutilización explícita)',
    contentType: 'Normativa e información oficial',
    reviewStatus: 'cleared',
    canReuse: ['Redactar preguntas y explicaciones propias (derived) basadas en estos hechos, citando la fuente'],
    cannotReuse: ['Copiar texto literal de la página como si fuera nuestro'],
    consultedAt: '2026-09-01',
  },
  {
    id: 'dgt-a-pie',
    name: 'DGT — A pie',
    description: 'Recomendaciones oficiales para peatones, incluida la prioridad (o falta de ella) al cruzar fuera de un paso señalizado.',
    url: 'https://www.dgt.es/muevete-con-seguridad/viaja-seguro/a-pie/',
    owner: 'Dirección General de Tráfico (Ministerio del Interior)',
    license: 'unknown (contenido institucional público; sin licencia de reutilización explícita)',
    contentType: 'Normativa e información oficial',
    reviewStatus: 'cleared',
    canReuse: ['Redactar preguntas y explicaciones propias (derived) basadas en estos hechos, citando la fuente'],
    cannotReuse: ['Copiar texto literal de la página como si fuera nuestro'],
    consultedAt: '2026-09-01',
  },
  {
    id: 'dgt-manual-permiso-b-lectura-facil',
    name: 'DGT — Manual básico del permiso B (Lectura Fácil)',
    description: 'Manual oficial de la DGT sobre los contenidos del permiso B.',
    url: 'https://seguridadvial2030.dgt.es/.galleries/enlaces/practicas-interes/personas-formadas-y-capaces/manual-permiso-b-lectura-facil.html',
    owner: 'Dirección General de Tráfico (Ministerio del Interior)',
    license: 'unknown (material institucional público; sin licencia de reutilización explícita)',
    contentType: 'Manual oficial',
    reviewStatus: 'cleared',
    canReuse: ['Redactar preguntas y explicaciones propias (derived) basadas en su contenido, citando la fuente'],
    cannotReuse: ['Copiar el manual literalmente'],
    consultedAt: '2026-08-25',
  },
  {
    id: 'dgt-sede-test-examenes',
    name: 'DGT (Sede electrónica) — Tests oficiales de examen',
    description:
      'Herramienta oficial y gratuita de la DGT para practicar el formato real del examen teórico (sin necesidad de registro). Es una herramienta interactiva, no una base de datos descargable, y el propio sitio indica que el número de cuestionarios distintos es limitado.',
    url: 'https://sede.dgt.gob.es/es/permisos-de-conducir/test-de-examenes/',
    owner: 'Dirección General de Tráfico (Ministerio del Interior)',
    license: 'unknown — herramienta pública de uso interactivo; sin licencia de reutilización/redistribución en bloque',
    contentType: 'Herramienta interactiva oficial',
    reviewStatus: 'needs_review',
    canReuse: ['Usar como referencia de formato (número de preguntas, opciones, duración) — ya incorporado a EXAM_CONFIG'],
    cannotReuse: ['Extraer y redistribuir en bloque su banco de preguntas: no hay licencia clara para ello'],
    consultedAt: '2026-08-26',
    notes:
      'No implementamos un scraper contra este sitio (ver github-dgt-test-downloader): el repositorio de referencia que lo automatizaba está descrito como no mantenido desde que la DGT cambió el sitio.',
  },
  {
    id: 'revista-dgt-test',
    name: 'Revista DGT — Sección Test',
    description:
      'Sección de test de la revista digital de la DGT: preguntas editoriales de cultura vial, no un banco de examen oficial. Pie de página con © Dirección General de Tráfico, sin aviso de reutilización.',
    url: 'https://revista.dgt.es/es/test/',
    owner: 'Dirección General de Tráfico (Ministerio del Interior) — contenido editorial de la revista',
    license: '© DGT — contenido editorial protegido, sin licencia de reutilización explícita',
    contentType: 'Contenido editorial (revista digital)',
    reviewStatus: 'reference_only',
    canReuse: ['Consultarlo para detectar temas o formatos de pregunta que podríamos estar pasando por alto'],
    cannotReuse: ['Copiar sus preguntas', 'Presentar su contenido como banco de examen oficial'],
    consultedAt: '2026-08-26',
  },
  {
    id: 'github-dgt-test-downloader',
    name: 'GitHub — alvarolozano/dgt-test-downloader',
    description:
      'Script que hacía scraping (ingeniería inversa, según su propio README) del test oficial de la sede electrónica de la DGT. El propio autor indica que no está mantenido desde que la DGT cambió el sitio (mayo de 2025).',
    url: 'https://github.com/alvarolozano/dgt-test-downloader',
    owner: 'alvarolozano (repositorio de terceros)',
    license: 'CC BY-NC-SA 4.0 — pero esa licencia cubre el código del scraper, no el contenido de la DGT que extrae',
    contentType: 'Herramienta de scraping (código), referenciando contenido oficial de la DGT',
    reviewStatus: 'needs_review',
    canReuse: ['Entender el formato del test oficial (ya reflejado en EXAM_CONFIG)'],
    cannotReuse: [
      'Ejecutar el scraper contra la DGT en producción (uso no comercial exigido por su licencia; Roady no ha decidido su modelo de uso, y el sitio objetivo cambió)',
      'Redistribuir cualquier pregunta/imagen que este script extraiga, dado que la propia DGT no otorga licencia sobre ese contenido',
    ],
    attribution: 'alvarolozano.dev (exigido por la licencia del código, si se reutilizara el script)',
    consultedAt: '2026-08-26',
    notes:
      'scripts/import-dgt-test-downloader.ts documenta esto y solo permite una importación LOCAL de un export ya obtenido legalmente por un administrador — nunca un scraping automático, y todo lo importado se etiqueta needs_review.',
  },
  {
    id: 'github-anki-carnet-conducir',
    name: 'GitHub — donmerendolo/anki-carnet-conducir',
    description:
      'Mazos de Anki (A1/B/D) con miles de preguntas. No se indica el origen de las preguntas ni de las imágenes (alojadas externamente vía un enlace de ProtonMail), y no hay una licencia de contenido separada de la del código.',
    url: 'https://github.com/donmerendolo/anki-carnet-conducir',
    owner: 'donmerendolo (repositorio de terceros)',
    license: 'GPL-3.0 declarada para el código/script; sin licencia explícita para el contenido de las tarjetas ni las imágenes',
    contentType: 'Mazo de tarjetas de estudio (contenido de terceros, procedencia no documentada)',
    reviewStatus: 'needs_review',
    canReuse: ['Usarlo como referencia externa de temas cubiertos (prioridad 4, nunca como fuente de verdad)'],
    cannotReuse: [
      'Importar sus preguntas o imágenes a Roady: no hay cadena de procedencia verificable ni licencia clara del contenido',
      'Presentar nada de este mazo como contenido oficial de la DGT',
    ],
    consultedAt: '2026-08-26',
    notes:
      'scripts/import-anki.ts documenta esto y solo permite una importación LOCAL de un export .apkg ya revisado manualmente — nunca automática, y todo lo importado se etiqueta needs_review.',
  },
  {
    id: 'dgt-revista',
    name: 'Revista DGT',
    description: 'Publicación oficial de la Dirección General de Tráfico con reportajes de educación vial.',
    url: 'https://revista.dgt.es/',
    owner: 'Dirección General de Tráfico (Ministerio del Interior)',
    license: '© DGT — contenido editorial protegido',
    contentType: 'Publicación institucional',
    reviewStatus: 'reference_only',
    canReuse: ['Consultarla para detectar temas de educación vial'],
    cannotReuse: ['Copiar sus artículos o preguntas'],
    consultedAt: '2026-08-25',
  },
  {
    id: 'dgt-home',
    name: 'DGT — Dirección General de Tráfico',
    description: 'Portal oficial de la DGT.',
    url: 'https://www.dgt.es/',
    owner: 'Dirección General de Tráfico (Ministerio del Interior)',
    license: 'unknown (portal institucional público)',
    contentType: 'Portal institucional',
    reviewStatus: 'cleared',
    canReuse: ['Punto de entrada para localizar normativa e informar la sección de fuentes'],
    cannotReuse: ['Copiar contenido literal'],
    consultedAt: '2026-08-25',
  },
];

/** Sources actually safe to show as "grounding" for content in the app UI. */
export const OFFICIAL_SOURCES = CONTENT_SOURCES.filter((s) => s.reviewStatus !== 'needs_review');
