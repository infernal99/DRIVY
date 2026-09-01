import { q } from './helpers';

const SRC = 'https://www.dgt.es/muevete-con-seguridad/conoce-las-normas-de-trafico/normativa-para-la-circulacion/';
const SRC_VMP = 'https://www.dgt.es/muevete-con-seguridad/viaja-seguro/en-patinete/';
const BOE_VMP = 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-2140';
const VERIFIED_AT = '2026-09-01';

// --- 2026-09-01 audit pass (content-quality initiative, Fase 2) ---------
// Confirmed the one headline numeric rule here (OTR-CIC-01's 1,5 m de
// distancia lateral al adelantar a un ciclista) is unchanged and current.
//
// FUTURE REVIEW FLAG: a reform of the RGC enters into force 2026-10-01
// requiring drivers to also reduce speed by at least 20 km/h when
// overtaking a cyclist, and to fully change lanes on multi-lane roads to
// keep the 1,5 m gap. Not yet in force as of this audit (2026-09-01), so
// not added to OTR-CIC-01 to avoid asserting a rule before it applies —
// but re-check this file once that date passes, since the question will
// then be incomplete (still true, just no longer the whole picture).
export const otrosUsuariosQuestions = [
  q({
    id: 'OTR-PEA-01',
    categoryId: 'otros-usuarios',
    subcategoryId: 'peatones',
    question: 'En un paso de peatones sin semáforo, un peatón que ya ha iniciado el cruce tiene:',
    image: 'diagram:peaton-paso-senalizado-cruzando',
    options: [
      'Prioridad; debes detenerte o reducir para dejarlo pasar',
      'Ninguna prioridad si el vehículo ya se aproxima',
      'Prioridad solo si es menor de edad',
    ],
    correctAnswer: 0,
    explanation:
      'Los conductores deben ceder el paso a los peatones que estén cruzando por un paso señalizado, incluso sin semáforo, especialmente si ya han iniciado el cruce.',
    difficulty: 'easy',
    tags: ['otros usuarios', 'peatones'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-PEA-02',
    categoryId: 'otros-usuarios',
    subcategoryId: 'peatones',
    question: 'Al girar en una intersección donde hay peatones cruzando la calle a la que te incorporas:',
    options: [
      'Debes cederles el paso antes de completar el giro',
      'Tienes prioridad porque estás circulando',
      'Solo debes ceder si son niños o personas mayores',
    ],
    correctAnswer: 0,
    explanation:
      'Al girar, el vehículo debe ceder el paso a los peatones que ya estén cruzando legalmente la vía a la que se incorpora, sin distinción de edad.',
    tags: ['otros usuarios', 'peatones'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-PEA-03',
    categoryId: 'otros-usuarios',
    subcategoryId: 'peatones',
    question: 'En una vía sin acera y sin arcén, los peatones deben circular:',
    options: [
      'Por el borde de la calzada, en sentido contrario a la marcha de los vehículos, como norma general',
      'Siempre por el centro de la calzada',
      'En el mismo sentido que los vehículos',
    ],
    correctAnswer: 0,
    explanation:
      'A falta de acera y arcén, los peatones deben caminar lo más cerca posible del borde de la calzada, y como norma general en sentido contrario al de los vehículos, para verlos llegar de frente.',
    difficulty: 'hard',
    tags: ['otros usuarios', 'peatones'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  // 2026-09-01, cobertura temática (Fase 3): la DGT aclara en su página "A
  // pie" que fuera de un paso señalizado el peatón NO tiene prioridad
  // automática y debe cruzar con máxima precaución — no confundir con
  // OTR-PEA-01 (que sí trata un paso señalizado). Esto no exime al
  // conductor de su deber general de evitar el atropello si lo ve a tiempo.
  q({
    id: 'OTR-PEA-04',
    categoryId: 'otros-usuarios',
    subcategoryId: 'peatones',
    question: 'Un peatón cruza la calzada fuera de un paso de peatones señalizado. Como conductor debes:',
    image: 'diagram:peaton-cruce-no-senalizado',
    options: [
      'Extremar la precaución y estar preparado para detenerte, aunque allí el peatón no tenga prioridad legal automática',
      'Continuar sin reducir la velocidad, ya que en ese punto el peatón no tiene ningún derecho',
      'Tocar el claxon para que se aparte y mantener tu trayectoria sin reducir',
    ],
    correctAnswer: 0,
    explanation:
      'Fuera de un paso señalizado el peatón no tiene prioridad automática y debe cruzar eligiendo el lugar más seguro; pero eso no exime al conductor de su deber general de conducir con precaución y evitar atropellar a quien vea cruzando.',
    difficulty: 'medium',
    tags: ['otros usuarios', 'peatones'],
    sourceUrl: 'https://www.dgt.es/muevete-con-seguridad/viaja-seguro/a-pie/',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-CIC-01',
    categoryId: 'otros-usuarios',
    subcategoryId: 'ciclistas',
    question: 'Al adelantar a un ciclista, un turismo debe dejar una separación lateral mínima de:',
    image: 'diagram:ciclista-distancia-lateral',
    options: ['1,5 metros', '0,5 metros', 'No hay una distancia mínima regulada'],
    correctAnswer: 0,
    explanation:
      'La normativa exige respetar una distancia lateral mínima de 1,5 metros al adelantar a un ciclista, tanto dentro como fuera de poblado.',
    difficulty: 'medium',
    tags: ['otros usuarios', 'ciclistas'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-CIC-02',
    categoryId: 'otros-usuarios',
    subcategoryId: 'ciclistas',
    question: 'Los ciclistas, en vías sin arcén o carril bici, pueden circular:',
    options: [
      'Ocupando la parte de la calzada que necesiten, pudiendo hacerlo en paralelo en algunas condiciones',
      'Nunca por la calzada, siempre por la acera',
      'Solo pegados al bordillo, sin excepción',
    ],
    correctAnswer: 0,
    explanation:
      'Los ciclistas tienen derecho a circular por la calzada ocupando el espacio necesario para su seguridad, y en determinadas condiciones (por ejemplo, en zonas urbanas o de baja velocidad) se les permite circular en paralelo.',
    tags: ['otros usuarios', 'ciclistas'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-CIC-03',
    categoryId: 'otros-usuarios',
    subcategoryId: 'ciclistas',
    question: '¿Pueden circular dos ciclistas en paralelo por la calzada?',
    options: [
      'Sí, siempre que no entorpezcan indebidamente al resto de vehículos',
      'Nunca, es siempre obligatorio ir en fila',
      'Solo en autopistas',
    ],
    correctAnswer: 0,
    explanation:
      'Con carácter general, los ciclistas pueden circular en paralelo dentro de un carril, siempre que no entorpezcan de forma indebida la circulación del resto de vehículos.',
    tags: ['otros usuarios', 'ciclistas'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-MOT-01',
    categoryId: 'otros-usuarios',
    subcategoryId: 'motocicletas',
    question: 'El uso del casco de protección homologado es obligatorio para:',
    options: [
      'El conductor y el pasajero de motocicletas y ciclomotores',
      'Solo el conductor',
      'Solo en carretera, no en ciudad',
    ],
    correctAnswer: 0,
    explanation:
      'Tanto el conductor como cualquier pasajero de una motocicleta o ciclomotor están obligados a usar casco de protección homologado, tanto en vías urbanas como interurbanas.',
    difficulty: 'easy',
    tags: ['otros usuarios', 'motocicletas'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-MOT-02',
    categoryId: 'otros-usuarios',
    subcategoryId: 'motocicletas',
    question: 'Al circular junto a una motocicleta, un turismo debe:',
    options: [
      'Extremar la precaución, ya que su menor tamaño la hace más difícil de ver y más vulnerable',
      'Tratarla como cualquier otro vehículo sin ninguna precaución adicional',
      'Adelantarla siempre lo más rápido posible',
    ],
    correctAnswer: 0,
    explanation:
      'Las motocicletas son más vulnerables ante una colisión y más difíciles de detectar por su tamaño; conviene comprobar dos veces los retrovisores y el ángulo muerto antes de cualquier maniobra.',
    tags: ['otros usuarios', 'motocicletas'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-VPR-01',
    categoryId: 'otros-usuarios',
    subcategoryId: 'vehiculos-prioritarios',
    question: 'Ante un vehículo de emergencias con las señales luminosas y acústicas en marcha, debes:',
    options: [
      'Facilitarle el paso, reduciendo la velocidad o cambiando de carril si es necesario',
      'Ignorarlo si tú también llevas prisa',
      'Adelantarlo antes de que se acerque más',
    ],
    correctAnswer: 0,
    explanation:
      'Los vehículos prioritarios en servicio de urgencia tienen preferencia de paso; el resto de conductores deben facilitarles la circulación, apartándose o deteniéndose si es necesario, con precaución.',
    difficulty: 'easy',
    tags: ['otros usuarios', 'vehículos prioritarios'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-VPR-02',
    categoryId: 'otros-usuarios',
    subcategoryId: 'vehiculos-prioritarios',
    question: 'Los vehículos prioritarios en servicio urgente pueden, cuando resulte imprescindible:',
    options: [
      'Incumplir algunas normas de circulación siempre que no pongan en peligro a otros usuarios',
      'Incumplir cualquier norma sin ninguna limitación',
      'Solo circular en horario nocturno',
    ],
    correctAnswer: 0,
    explanation:
      'Cuando la urgencia lo justifique, estos vehículos pueden apartarse de determinadas normas de circulación, pero siempre extremando la precaución y sin generar un peligro innecesario para otros usuarios.',
    tags: ['otros usuarios', 'vehículos prioritarios'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-TRP-01',
    categoryId: 'otros-usuarios',
    subcategoryId: 'transporte-publico',
    question: 'Al aproximarte a un autobús urbano detenido en una parada señalizada, debes:',
    options: [
      'Moderar la velocidad y extremar la precaución por la posible presencia de peatones',
      'Adelantarlo sin reducir la velocidad',
      'Tocar el claxon para que arranque',
    ],
    correctAnswer: 0,
    explanation:
      'Cerca de una parada de autobús es habitual que haya peatones cruzando la calzada por delante o por detrás del vehículo, por lo que hay que reducir la velocidad y aumentar la atención.',
    difficulty: 'easy',
    tags: ['otros usuarios', 'transporte público'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-TRP-02',
    categoryId: 'otros-usuarios',
    subcategoryId: 'transporte-publico',
    question: 'Un carril bus (reservado para transporte público) puede ser utilizado por un turismo particular:',
    options: [
      'No, salvo que la señalización indique expresamente que está permitido en determinadas circunstancias',
      'Sí, siempre que no haya autobuses cerca',
      'Sí, sin ninguna restricción',
    ],
    correctAnswer: 0,
    explanation:
      'Los carriles reservados a determinados vehículos, como el carril bus, no pueden ser utilizados por el resto de vehículos salvo que la señalización lo permita expresamente (por ejemplo, para girar).',
    tags: ['otros usuarios', 'transporte público'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  // --- 2026-09-01, ampliación del banco (Fase 1, bloque VMP) ---------------
  // VMP (patinetes eléctricos): el hueco temático más grave detectado en el
  // análisis de cobertura — 0 preguntas pese a ser normativa muy reciente y
  // activa. Verificado contra el BOE (RD 52/2026, BOE-A-2026-2140, en vigor
  // desde 2026-01-30) y la página oficial "DGT - En patinete", no contra
  // blogs de patinetes. Deliberadamente NO se pregunta por la edad mínima
  // ni por una obligación nacional "en bloque" del casco: ambos datos
  // varían por ordenanza municipal y no tienen una cifra única a nivel
  // nacional — preguntarlo como si la hubiera sería inventar contenido.
  q({
    id: 'OTR-VMP-01',
    categoryId: 'otros-usuarios',
    subcategoryId: 'vmp',
    question: 'Un vehículo de movilidad personal (VMP, como un patinete eléctrico) se define legalmente como un vehículo de una o más ruedas:',
    options: [
      'De una única plaza, propulsado exclusivamente por motor eléctrico, con velocidad de diseño entre 6 y 25 km/h',
      'De cualquier número de plazas, con motor eléctrico o de combustión',
      'Sin límite de velocidad de diseño, siempre que sea eléctrico',
    ],
    correctAnswer: 0,
    explanation:
      'La normativa define el VMP como un vehículo de una o más ruedas, de una única plaza, propulsado exclusivamente por motores eléctricos, con una velocidad máxima por diseño de entre 6 y 25 km/h; quedan excluidas, entre otros, las bicicletas de pedaleo asistido.',
    difficulty: 'easy',
    tags: ['otros usuarios', 'vmp', 'patinete'],
    sourceUrl: BOE_VMP,
    legalReference: 'Reglamento General de Vehículos, Anexo XXI (redacción dada por el RD 52/2026)',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-VMP-02',
    categoryId: 'otros-usuarios',
    subcategoryId: 'vmp',
    question: 'Un VMP (patinete eléctrico) tiene prohibido circular por:',
    options: [
      'Aceras, zonas peatonales, pasos de peatones, autopistas, autovías, vías interurbanas y túneles urbanos',
      'Los carriles bici, en cualquier caso',
      'Las calzadas urbanas con límite de 30 km/h, en cualquier caso',
    ],
    correctAnswer: 0,
    explanation:
      'Los VMP tienen prohibida la circulación por aceras, zonas peatonales, pasos de peatones, autopistas, autovías, vías interurbanas y túneles urbanos; pueden circular por calzada urbana o carril bici según lo que establezca la ordenanza municipal correspondiente.',
    difficulty: 'medium',
    tags: ['otros usuarios', 'vmp', 'patinete'],
    sourceUrl: SRC_VMP,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-VMP-03',
    categoryId: 'otros-usuarios',
    subcategoryId: 'vmp',
    question: 'La velocidad máxima a la que puede circular un VMP (patinete eléctrico) es de:',
    options: ['25 km/h', '45 km/h', 'No existe límite específico, solo el genérico de la vía'],
    correctAnswer: 0,
    explanation:
      'Los VMP no pueden superar los 25 km/h de velocidad, con independencia del límite genérico que pueda tener la vía por la que circulan.',
    difficulty: 'easy',
    tags: ['otros usuarios', 'vmp', 'patinete'],
    sourceUrl: SRC_VMP,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-VMP-04',
    categoryId: 'otros-usuarios',
    subcategoryId: 'vmp',
    question: '¿Está permitido llevar un segundo ocupante en un VMP (patinete eléctrico) diseñado para una sola plaza?',
    options: [
      'No, los VMP son de una única plaza y no pueden llevar pasajeros',
      'Sí, siempre que el segundo ocupante sea menor de edad',
      'Sí, si el trayecto es muy corto',
    ],
    correctAnswer: 0,
    explanation:
      'Los VMP están homologados y diseñados para una única plaza; llevar un segundo ocupante incumple esa condición técnica, sin que existan excepciones por la edad del acompañante o la distancia del trayecto.',
    difficulty: 'easy',
    tags: ['otros usuarios', 'vmp', 'patinete'],
    sourceUrl: SRC_VMP,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-VMP-05',
    categoryId: 'otros-usuarios',
    subcategoryId: 'vmp',
    question: 'Respecto al uso del casco al circular en un VMP (patinete eléctrico), la normativa actual establece que:',
    options: [
      'Es obligatorio solo si lo exige la ordenanza municipal correspondiente, aunque la DGT recomienda usarlo siempre',
      'Es obligatorio en toda España sin excepción, igual que en motocicleta',
      'Nunca es obligatorio, ni siquiera si lo exige una ordenanza municipal',
    ],
    correctAnswer: 0,
    explanation:
      'A día de hoy el uso del casco en VMP no es una obligación general en toda España: depende de si la ordenanza municipal correspondiente lo exige (en cuyo caso no llevarlo se sanciona), aunque la DGT recomienda usarlo siempre, exista o no esa exigencia local.',
    difficulty: 'hard',
    tags: ['otros usuarios', 'vmp', 'patinete'],
    sourceUrl: SRC_VMP,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-VMP-06',
    categoryId: 'otros-usuarios',
    subcategoryId: 'vmp',
    question: '¿Qué límite de alcoholemia se aplica a quien circula en un VMP (patinete eléctrico)?',
    options: [
      'El mismo que a los conductores de vehículos a motor',
      'Ninguno: los VMP no están sujetos a control de alcoholemia',
      'Un límite más permisivo, al no ser un vehículo a motor',
    ],
    correctAnswer: 0,
    explanation:
      'A los usuarios de VMP se les aplican los mismos límites de alcoholemia que al resto de conductores, y pueden ser sometidos a las pruebas de detección correspondientes.',
    difficulty: 'medium',
    tags: ['otros usuarios', 'vmp', 'patinete'],
    sourceUrl: SRC_VMP,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-VMP-07',
    categoryId: 'otros-usuarios',
    subcategoryId: 'vmp',
    question: '¿Está permitido usar el teléfono móvil o auriculares mientras se circula en un VMP (patinete eléctrico)?',
    options: [
      'No, está prohibido igual que en el resto de vehículos',
      'Sí, siempre que sea con manos libres',
      'Sí, solo los auriculares están permitidos',
    ],
    correctAnswer: 0,
    explanation:
      'El uso del teléfono móvil y de auriculares está expresamente prohibido mientras se circula en VMP, entre las tres prohibiciones básicas que la DGT resume para estos vehículos junto con el alcohol y la circulación por aceras.',
    difficulty: 'easy',
    tags: ['otros usuarios', 'vmp', 'patinete'],
    sourceUrl: SRC_VMP,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-VMP-08',
    categoryId: 'otros-usuarios',
    subcategoryId: 'vmp',
    question: 'Desde la entrada en vigor del Real Decreto 52/2026, circular en un VMP (patinete eléctrico) sin el seguro correspondiente:',
    options: [
      'Es una infracción, ya que el seguro de responsabilidad civil es obligatorio para los VMP',
      'Es legal: los VMP, al no ser vehículos a motor tradicionales, no necesitan seguro',
      'Solo es obligatorio para los patinetes de alquiler, no para los de propiedad particular',
    ],
    correctAnswer: 0,
    explanation:
      'El Real Decreto 52/2026, que desarrolla la Ley 5/2025, extiende la obligación del seguro de responsabilidad civil a todos los VMP, sin distinguir entre uso particular o de alquiler; circular sin él es una infracción sancionable.',
    difficulty: 'hard',
    tags: ['otros usuarios', 'vmp', 'patinete', 'seguro'],
    sourceUrl: BOE_VMP,
    legalReference: 'Real Decreto 52/2026, de 28 de enero (BOE-A-2026-2140), y Ley 5/2025, de 24 de julio',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'OTR-VMP-09',
    categoryId: 'otros-usuarios',
    subcategoryId: 'vmp',
    question: 'Un VMP comercializado sin la certificación exigida antes del 22 de enero de 2024:',
    options: [
      'Puede seguir circulando solo hasta el 22 de enero de 2027',
      'No puede circular en ningún caso desde esa fecha',
      'Puede circular indefinidamente, sin ninguna restricción de plazo',
    ],
    correctAnswer: 0,
    explanation:
      'Los VMP comercializados sin certificación antes del 22 de enero de 2024 cuentan con un régimen transitorio que les permite seguir circulando hasta el 22 de enero de 2027, fecha a partir de la cual dejarán de poder hacerlo.',
    difficulty: 'hard',
    tags: ['otros usuarios', 'vmp', 'patinete'],
    sourceUrl: BOE_VMP,
    legalReference: 'Real Decreto 52/2026, de 28 de enero (BOE-A-2026-2140), disposición transitoria primera',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
];
