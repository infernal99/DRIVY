import { q } from './helpers';

const SRC = 'https://www.dgt.es/muevete-con-seguridad/conoce-las-normas-de-trafico/normativa-para-la-circulacion/';
const SPEED_SRC = 'https://www.dgt.es/comunicacion/notas-de-prensa/la-dgt-y-la-femp-presentan-el-manual-de-aplicacion-de-los-nuevos-limites-de-velocidad-en-vias-urbanas/';

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
  }),
  q({
    id: 'VIA-CAR-02',
    categoryId: 'vias',
    subcategoryId: 'carreteras-convencionales',
    question: 'En una carretera convencional con arcén señalizado igual o superior a 1,5 m para turismos, autocaravanas o motocicletas de hasta 3.500 kg, la velocidad máxima puede llegar a:',
    options: ['100 km/h si así lo indica la señal', '130 km/h en cualquier caso', '90 km/h siempre, sin excepción'],
    correctAnswer: 0,
    explanation:
      'Como excepción al límite genérico de 90 km/h, en carreteras convencionales con separación física de sentidos o arcén amplio, la señalización puede autorizar hasta 100 km/h para turismos, motocicletas y autocaravanas ligeras.',
    difficulty: 'hard',
    tags: ['vías', 'carreteras convencionales', 'velocidad'],
    sourceUrl: SPEED_SRC,
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
  }),
  q({
    id: 'VIA-URB-02',
    categoryId: 'vias',
    subcategoryId: 'vias-urbanas',
    question: 'En una vía urbana con plataforma única (calzada y acera al mismo nivel, sin separación), el límite es:',
    options: ['20 km/h', '30 km/h', '50 km/h'],
    correctAnswer: 0,
    explanation:
      'Las calles de plataforma única, donde calzada y acera comparten el mismo nivel sin diferenciación, tienen un límite máximo de 20 km/h.',
    tags: ['vías', 'urbanas', 'velocidad'],
    sourceUrl: SPEED_SRC,
  }),
  q({
    id: 'VIA-URB-03',
    categoryId: 'vias',
    subcategoryId: 'vias-urbanas',
    question: 'En una vía urbana con dos o más carriles por sentido, el límite genérico es:',
    options: ['50 km/h', '30 km/h', '70 km/h'],
    correctAnswer: 0,
    explanation:
      'Cuando una vía urbana dispone de dos o más carriles por sentido de circulación, el límite genérico se mantiene en 50 km/h.',
    tags: ['vías', 'urbanas', 'velocidad'],
    sourceUrl: SPEED_SRC,
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
  }),
  q({
    id: 'VIA-CRR-01',
    categoryId: 'vias',
    subcategoryId: 'carriles',
    question: 'El carril central de una vía con tres carriles y sentido reversible se identifica habitualmente con:',
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
  }),
  q({
    id: 'VIA-CRR-02',
    categoryId: 'vias',
    subcategoryId: 'carriles',
    question: 'Un carril "VAO" (vehículo de alta ocupación) permite circular a:',
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
  }),
  q({
    id: 'VIA-ARC-02',
    categoryId: 'vias',
    subcategoryId: 'arcenes',
    question: 'Si tu vehículo sufre una avería en autovía y debes detenerte en el arcén, debes:',
    options: [
      'Señalizar el vehículo, ponerte el chaleco reflectante y alejarte a un lugar seguro si es posible',
      'Permanecer siempre dentro del vehículo con las puertas cerradas',
      'Detenerte en el carril derecho de circulación, no en el arcén',
    ],
    correctAnswer: 0,
    explanation:
      'Ante una avería, se debe situar el vehículo en el arcén, señalizarlo (luces de emergencia y, si procede, dispositivos de señalización), ponerse el chaleco reflectante antes de salir y, si es seguro, alejarse del vehículo y de la calzada.',
    tags: ['vías', 'arcén', 'seguridad'],
    sourceUrl: SRC,
  }),
];
