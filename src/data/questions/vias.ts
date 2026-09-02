import { q } from './helpers';

const SRC = 'https://www.dgt.es/muevete-con-seguridad/conoce-las-normas-de-trafico/normativa-para-la-circulacion/';
const SPEED_SRC = 'https://www.dgt.es/comunicacion/notas-de-prensa/la-dgt-y-la-femp-presentan-el-manual-de-aplicacion-de-los-nuevos-limites-de-velocidad-en-vias-urbanas/';
const RGC_BASE = 'https://www.boe.es/buscar/act.php?id=BOE-A-2003-23514';

export const viasQuestions = [
  q({
    id: 'VIA-AUP-01',
    categoryId: 'vias',
    subcategoryId: 'autopistas',
    question: '¿Qué está prohibido en una autopista?',
    options: [
      'Circular peatones, ciclos y vehículos que no puedan alcanzar cierta velocidad mínima',
      'Adelantar en cualquier circunstancia',
      'Circular con las luces de cruce encendidas',
    ],
    correctAnswer: 0,
    explanation:
      'Las autopistas están reservadas a la circulación de determinados vehículos de motor; tienen prohibido el acceso peatones, ciclos, y vehículos que por su naturaleza no puedan alcanzar la velocidad mínima exigida.',
    difficulty: 'easy',
    tags: ['vías', 'autopistas'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  q({
    id: 'VIA-AUP-02',
    categoryId: 'vias',
    subcategoryId: 'autopistas',
    question: 'La velocidad máxima genérica para turismos en autopista es:',
    options: ['120 km/h', '100 km/h', '140 km/h'],
    correctAnswer: 0,
    explanation:
      'Con carácter general, la velocidad máxima para turismos en autopistas y autovías es de 120 km/h, salvo que una señal indique un límite distinto.',
    difficulty: 'easy',
    tags: ['vías', 'autopistas', 'velocidad'],
    sourceUrl: SPEED_SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  q({
    id: 'VIA-AUV-01',
    categoryId: 'vias',
    subcategoryId: 'autovias',
    question: '¿Cuál es la principal diferencia entre autopista y autovía?',
    options: [
      'La autovía puede tener cruces a nivel y accesos directos a fincas colindantes; la autopista no',
      'La autovía es siempre de peaje y la autopista gratuita',
      'No existe ninguna diferencia legal',
    ],
    correctAnswer: 0,
    explanation:
      'A diferencia de la autopista, la autovía puede presentar cruces a nivel y accesos directos a las propiedades colindantes, aunque comparte con ella la calzada única por sentido separada físicamente.',
    tags: ['vías', 'autovías'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  q({
    id: 'VIA-AUV-02',
    categoryId: 'vias',
    subcategoryId: 'autovias',
    question: 'Los ciclistas mayores de 14 años, a diferencia de las bicicletas en general en autopistas y autovías:',
    options: [
      'Pueden circular por el arcén de una autovía, salvo que una señal lo prohíba expresamente por seguridad',
      'Tienen prohibido circular por cualquier parte de una autovía, sin excepción',
      'Pueden circular por cualquier carril de la autovía, igual que un turismo',
    ],
    correctAnswer: 0,
    explanation:
      'Aunque las bicicletas tienen prohibido, con carácter general, circular por autopistas y autovías, existe una excepción para los ciclistas mayores de 14 años, que sí pueden usar el arcén de una autovía salvo que la señalización lo prohíba por razones justificadas de seguridad vial.',
    difficulty: 'hard',
    tags: ['vías', 'autovías', 'ciclistas'],
    sourceUrl: RGC_BASE,
    legalReference: 'Reglamento General de Circulación, artículo 38',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  q({
    id: 'VIA-CAR-01',
    categoryId: 'vias',
    subcategoryId: 'carreteras-convencionales',
    question: 'La velocidad máxima genérica en una carretera convencional (sin separación física de sentidos) es:',
    options: ['90 km/h', '100 km/h', '110 km/h'],
    correctAnswer: 0,
    explanation:
      'En carreteras convencionales sin separación física de sentidos, el límite genérico es de 90 km/h para turismos, salvo señalización específica que indique otro límite.',
    tags: ['vías', 'carreteras convencionales', 'velocidad'],
    sourceUrl: SPEED_SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  q({
    id: 'VIA-CAR-02',
    categoryId: 'vias',
    subcategoryId: 'carreteras-convencionales',
    // CORRECTED 2026-09-01 (content-quality audit): the old condition here
    // was "arcén señalizado ≥ 1,5 m", which was the PRE-2019 rule. The 2018
    // reform of the RGC (RD 1514/2018, en vigor desde 2019) removed the
    // shoulder-width criterion entirely — the only remaining exception is
    // physical separation between the two directions of travel. Question
    // rewritten to test the current condition instead of the obsolete one.
    question: 'En una carretera convencional con separación física entre ambos sentidos de circulación, la velocidad máxima puede llegar a, para turismos, motocicletas y autocaravanas de hasta 3.500 kg:',
    options: ['100 km/h si así lo indica la señal', '130 km/h en cualquier caso', '90 km/h siempre, sin excepción'],
    correctAnswer: 0,
    explanation:
      'Desde la reforma del Reglamento General de Circulación de 2018 (en vigor desde 2019), el criterio del arcén ancho desapareció: la única excepción al límite genérico de 90 km/h es que exista separación física entre ambos sentidos de circulación, en cuyo caso la señalización puede autorizar hasta 100 km/h para turismos, motocicletas y autocaravanas con MMA de hasta 3.500 kg.',
    difficulty: 'hard',
    tags: ['vías', 'carreteras convencionales', 'velocidad'],
    sourceUrl: SPEED_SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  q({
    id: 'VIA-URB-01',
    categoryId: 'vias',
    subcategoryId: 'vias-urbanas',
    question: 'Desde la reforma de límites urbanos, ¿cuál es la velocidad máxima en una calle de un único carril por sentido?',
    options: ['30 km/h', '50 km/h', '20 km/h'],
    correctAnswer: 0,
    explanation:
      'Las vías urbanas de un único carril por sentido de circulación tienen un límite máximo de 30 km/h, salvo que estén específicamente señalizadas con un límite distinto.',
    difficulty: 'easy',
    tags: ['vías', 'urbanas', 'velocidad'],
    sourceUrl: SPEED_SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  q({
    id: 'VIA-URB-02',
    categoryId: 'vias',
    subcategoryId: 'vias-urbanas',
    question: 'En una vía urbana con plataforma única (calzada y acera al mismo nivel, sin separación), el límite es:',
    options: ['20 km/h', '30 km/h', '50 km/h'],
    correctAnswer: 0,
    explanation:
      'La reforma de límites urbanos fija tres escalones según el tipo de vía: 20 km/h para plataforma única, 30 km/h para el resto de calles de un solo carril por sentido, y 50 km/h con dos o más carriles por sentido. El límite más bajo se aplica aquí porque, al no haber separación física entre calzada y acera, peatones y vehículos comparten literalmente el mismo espacio.',
    tags: ['vías', 'urbanas', 'velocidad'],
    sourceUrl: SPEED_SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  q({
    id: 'VIA-URB-03',
    categoryId: 'vias',
    subcategoryId: 'vias-urbanas',
    question: 'En una vía urbana con dos o más carriles por sentido, el límite genérico es:',
    options: ['50 km/h', '30 km/h', '70 km/h'],
    correctAnswer: 0,
    explanation:
      'De los tres escalones de velocidad urbana (20/30/50 según el tipo de vía), el de 50 km/h es el único que se mantiene igual que antes de la reforma, y se reserva para vías con dos o más carriles por sentido, donde la separación entre carriles y respecto a los peatones es mayor que en una calle de un solo carril.',
    tags: ['vías', 'urbanas', 'velocidad'],
    sourceUrl: SPEED_SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  q({
    id: 'VIA-URB-04',
    categoryId: 'vias',
    subcategoryId: 'vias-urbanas',
    question: 'Una "travesía" es:',
    options: [
      'El tramo de una carretera que atraviesa una zona urbana o un poblado',
      'Un tipo de rotonda de doble carril',
      'Un carril adicional en autopista',
    ],
    correctAnswer: 0,
    explanation:
      'Se llama travesía al tramo de una carretera que discurre por dentro de un casco urbano; su límite genérico de velocidad es de 50 km/h, salvo que se indique otro por señalización.',
    tags: ['vías', 'urbanas'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  q({
    id: 'VIA-CRR-01',
    categoryId: 'vias',
    subcategoryId: 'carriles',
    question: 'El carril central de una vía con tres carriles y sentido reversible se identifica habitualmente con:',
    image: 'diagram:carril-reversible',
    options: [
      'Semáforos o paneles especiales sobre el carril que indican si está abierto o cerrado',
      'Ninguna señal, se usa libremente',
      'Una línea amarilla continua',
    ],
    correctAnswer: 0,
    explanation:
      'Los carriles reversibles se señalizan con paneles o semáforos específicos situados sobre el carril, que indican mediante una flecha verde o una cruz roja si puede utilizarse en ese sentido.',
    difficulty: 'hard',
    tags: ['vías', 'carriles'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  q({
    id: 'VIA-CRR-02',
    categoryId: 'vias',
    subcategoryId: 'carriles',
    question: 'Un carril "VAO" (vehículo de alta ocupación) permite circular a:',
    image: 'diagram:carril-vao',
    options: [
      'Vehículos con un número mínimo de ocupantes, según señalización',
      'Cualquier vehículo sin restricciones',
      'Solo vehículos eléctricos',
    ],
    correctAnswer: 0,
    explanation:
      'Los carriles VAO están reservados a vehículos que circulen con un número mínimo de ocupantes (habitualmente dos o más), tal y como se indique en la señalización del carril.',
    tags: ['vías', 'carriles'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  // 2026-09-01, ampliación del banco (Fase 1, bloque 8): situación práctica
  // de elección de carril mediante flechas pintadas, distinta de la
  // pregunta abstracta ya existente sobre esas mismas flechas
  // (SEN-...528, "carácter obligatorio") — aquí se aplica a un caso
  // concreto con imagen, no se repite la definición.
  q({
    id: 'VIA-CRR-03',
    categoryId: 'vias',
    subcategoryId: 'carriles',
    question: 'Te acercas a una vía de dos carriles en tu sentido: el izquierdo tiene pintada una flecha de giro a la izquierda, y el derecho una flecha recta. Si quieres continuar recto, debes:',
    image: 'diagram:eleccion-carril-flechas',
    options: [
      'Circular por el carril derecho, el único que permite continuar recto',
      'Circular por el carril que prefieras, ya que ambos lo permiten',
      'Circular por el izquierdo y cambiar de carril en el último momento',
    ],
    correctAnswer: 0,
    explanation:
      'Las flechas pintadas en el carril tienen carácter obligatorio: marcan la única dirección permitida para quien circule por ese carril, así que para seguir recto hay que situarse con antelación en el carril marcado con la flecha recta.',
    difficulty: 'medium',
    tags: ['vías', 'carriles', 'marcas viales'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  // 2026-09-02, imágenes de situaciones reales (Lote 7: carriles
  // especiales). Verificado contra el art. 42 RGC (carril adicional
  // circunstancial) y la definición general de carril de deceleración.
  q({
    id: 'VIA-CRR-04',
    categoryId: 'vias',
    subcategoryId: 'carriles',
    question: 'Un carril de deceleración es el carril auxiliar que sirve para:',
    image: 'diagram:carril-deceleracion',
    options: [
      'Reducir la velocidad antes de abandonar la vía principal, sin frenar todavía sobre ella',
      'Adelantar a los vehículos más lentos de la vía principal',
      'Aumentar la velocidad antes de incorporarse a la vía principal',
    ],
    correctAnswer: 0,
    explanation:
      'El carril de deceleración es un carril auxiliar de longitud suficiente para que el vehículo reduzca la velocidad al salir de una vía, evitando frenar todavía sobre la calzada principal y afectar al tráfico que continúa por ella.',
    difficulty: 'medium',
    tags: ['vías', 'carriles'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-02',
  }),
  q({
    id: 'VIA-CRR-05',
    categoryId: 'vias',
    subcategoryId: 'carriles',
    question: 'En un carril adicional circunstancial (por ejemplo, el arcén abierto al tráfico en una operación salida), la velocidad debe estar entre:',
    image: 'diagram:carril-adicional-circunstancial',
    options: [
      'Un mínimo de 60 km/h y un máximo de 80 km/h, salvo que se señale otra cosa',
      'Sin ningún límite mínimo ni máximo específico',
      'Un máximo de 120 km/h, igual que el resto de la autovía',
    ],
    correctAnswer: 0,
    explanation:
      'Cuando se habilita un carril adicional circunstancial (como el arcén en una operación salida), quienes circulen por él deben hacerlo entre 60 y 80 km/h salvo que la señalización específica indique otra cosa, y con el alumbrado de cruce encendido tanto de día como de noche.',
    difficulty: 'hard',
    tags: ['vías', 'carriles'],
    sourceUrl: RGC_BASE,
    legalReference: 'Reglamento General de Circulación, artículo 42',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-02',
  }),
  q({
    id: 'VIA-ARC-01',
    categoryId: 'vias',
    subcategoryId: 'arcenes',
    question: '¿Se puede circular habitualmente por el arcén con un turismo?',
    options: [
      'No, el arcén no forma parte de la calzada y solo se usa en casos excepcionales (avería, emergencia)',
      'Sí, siempre que no haya tráfico denso',
      'Sí, es un carril más para adelantar',
    ],
    correctAnswer: 0,
    explanation:
      'El arcén no está destinado a la circulación habitual de vehículos; solo debe utilizarse en situaciones excepcionales como una avería, una emergencia o cuando lo indique una señal específica.',
    difficulty: 'easy',
    tags: ['vías', 'arcén'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  q({
    id: 'VIA-ARC-02',
    categoryId: 'vias',
    subcategoryId: 'arcenes',
    // UPDATED 2026-09-01 (content-quality audit): the old explanation said
    // only "dispositivos de señalización" generically. Since 2026-01-01 the
    // V16 luz de emergencia conectada is mandatory and is now the ONLY
    // legal roadside signaling method — the old warning triangles are no
    // longer valid on their own. Rewritten to state this specifically
    // instead of the vague catch-all phrase.
    question: 'Si tu vehículo sufre una avería en autovía y debes detenerte en el arcén, debes:',
    options: [
      'Encender la luz V16 de emergencia, ponerte el chaleco reflectante y alejarte a un lugar seguro si es posible',
      'Permanecer siempre dentro del vehículo con las puertas cerradas',
      'Detenerte en el carril derecho de circulación, no en el arcén',
    ],
    correctAnswer: 0,
    explanation:
      'Ante una avería, se debe situar el vehículo en el arcén y señalizarlo con la luz V16 de emergencia conectada, obligatoria desde el 1 de enero de 2026 y único medio de señalización ya válido (sustituye a los triángulos). Después hay que ponerse el chaleco reflectante antes de salir y, si es seguro, alejarse del vehículo y de la calzada.',
    tags: ['vías', 'arcén', 'seguridad'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
];
