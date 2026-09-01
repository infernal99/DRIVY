import { q } from './helpers';

const SRC = 'https://www.dgt.es/muevete-con-seguridad/conoce-las-normas-de-trafico/normativa-para-la-circulacion/';
const VERIFIED_AT = '2026-09-01';

// --- 2026-09-01 audit pass (content-quality initiative, Fase 2) ---------
// These are long-standing rules of the road (priority, overtaking, turns,
// stopping/parking definitions) that haven't been subject to the kind of
// recent legislative churn alcohol limits or speed limits have — reasoned
// through each for internal correctness/ambiguity, and actively re-checked
// against current sources anywhere a specific number, exception, or
// wording looked risky enough to be worth confirming rather than assuming:
//   - NOR-PRI-03 (prioridad en pendiente): confirmed current — "el que
//     sube" has priority on grades ≥7%, except when it has a nearby
//     apartadero to pull into (this exception exists in the regulation but
//     is a reasonable simplification to omit from a "norma general"
//     question, same as it is in official test material).
//   - NOR-PAR-01 (parada = menos de 2 minutos): confirmed unchanged.
//   - NOR-CIR-02 (luces de cruce de día): the old wording ("para turismos
//     depende de la normativa vigente en cada momento") was a vague
//     non-answer, exactly the kind of phrasing the audit is meant to catch
//     — rewritten with the actual current rule (see comment at that entry).
export const normasQuestions = [
  q({
    id: 'NOR-PRI-01',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: 'En una intersección sin señalizar, si dos vehículos llegan a la vez, tiene prioridad:',
    options: [
      'El que circula por la derecha del otro',
      'El que circula más deprisa',
      'El vehículo de mayor tamaño',
    ],
    correctAnswer: 0,
    explanation:
      'A falta de señalización, la norma general de prioridad de paso es la de la derecha: cede el paso a los vehículos que se aproximen por tu derecha.',
    difficulty: 'easy',
    tags: ['normas', 'prioridad'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PRI-02',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: 'En una glorieta sin semáforo ni señal de STOP/ceda el paso, tiene preferencia:',
    options: [
      'El vehículo que ya circula dentro de la glorieta',
      'El vehículo que se incorpora',
      'El vehículo situado más a la izquierda',
    ],
    correctAnswer: 0,
    explanation:
      'Como norma general en las glorietas, quien va a entrar debe ceder el paso a los vehículos que ya circulan por su interior.',
    tags: ['normas', 'prioridad', 'glorieta'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PRI-03',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: 'Cuando dos vehículos van a cruzarse en un tramo estrecho en pendiente, tiene preferencia:',
    options: [
      'El que sube, como norma general',
      'El que baja, siempre',
      'El que primero toque el claxon',
    ],
    correctAnswer: 0,
    explanation:
      'En tramos estrechos con pendiente pronunciada donde no puedan cruzarse dos vehículos, como norma general tiene preferencia de paso el que sube, ya que reanudar la marcha cuesta arriba es más difícil.',
    difficulty: 'hard',
    tags: ['normas', 'prioridad'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PRI-04',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: 'Un vehículo de emergencia con las señales luminosas y acústicas activadas:',
    options: [
      'Tiene prioridad de paso sobre el resto de usuarios de la vía',
      'Solo tiene prioridad si además circula por el carril izquierdo',
      'Debe respetar la prioridad de paso normal',
    ],
    correctAnswer: 0,
    explanation:
      'Los vehículos prioritarios en servicio urgente, con dispositivos luminosos y acústicos activados, tienen preferencia de paso; el resto de conductores deben facilitarles el paso y, si es necesario, detenerse.',
    tags: ['normas', 'prioridad', 'vehículos prioritarios'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-ADE-01',
    categoryId: 'normas',
    subcategoryId: 'adelantamientos',
    question: 'Antes de iniciar un adelantamiento debes comprobar que:',
    options: [
      'Dispones de espacio y visibilidad suficientes y nadie te está adelantando a ti',
      'Solo hace falta poner el intermitente',
      'Basta con acelerar con decisión',
    ],
    correctAnswer: 0,
    explanation:
      'Antes de adelantar hay que asegurarse de que ningún vehículo que te siga ha iniciado ya la maniobra, de que hay espacio suficiente para reincorporarse y de que la visibilidad permite completar la maniobra con seguridad.',
    difficulty: 'easy',
    tags: ['normas', 'adelantamiento'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-ADE-02',
    categoryId: 'normas',
    subcategoryId: 'adelantamientos',
    question: '¿Está permitido adelantar en un paso de peatones señalizado?',
    options: [
      'No, está prohibido adelantar en pasos para peatones y sus proximidades',
      'Sí, siempre que no haya peatones cruzando',
      'Solo está prohibido si hay un semáforo',
    ],
    correctAnswer: 0,
    explanation:
      'Está prohibido adelantar en pasos para peatones señalizados como tales y en sus proximidades, precisamente por el riesgo que supone para quienes cruzan.',
    tags: ['normas', 'adelantamiento', 'peatones'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-ADE-03',
    categoryId: 'normas',
    subcategoryId: 'adelantamientos',
    question: '¿Por qué lado se debe adelantar como norma general?',
    options: ['Por la izquierda', 'Por la derecha', 'Por el lado que quede más libre'],
    correctAnswer: 0,
    explanation:
      'Como norma general, el adelantamiento debe realizarse por la izquierda del vehículo adelantado, salvo excepciones como cuando el vehículo a adelantar va a girar a la izquierda.',
    difficulty: 'easy',
    tags: ['normas', 'adelantamiento'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-ADE-04',
    categoryId: 'normas',
    subcategoryId: 'adelantamientos',
    question: 'Adelantar en una curva sin visibilidad o cerca de la cima de un puerto:',
    options: [
      'Está prohibido por el riesgo de colisión frontal',
      'Está permitido si tu vehículo es rápido',
      'Solo está prohibido de noche',
    ],
    correctAnswer: 0,
    explanation:
      'Está prohibido adelantar en curvas, cambios de rasante y demás lugares con visibilidad insuficiente, ya que no se puede garantizar que no venga tráfico en sentido contrario.',
    tags: ['normas', 'adelantamiento'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-CDI-01',
    categoryId: 'normas',
    subcategoryId: 'cambios-direccion',
    question: 'Antes de girar a la derecha o a la izquierda debes:',
    options: [
      'Señalizar con antelación suficiente y comprobar los retrovisores y el ángulo muerto',
      'Girar directamente sin avisar si no hay tráfico',
      'Solo es necesario avisar en carretera, no en ciudad',
    ],
    correctAnswer: 0,
    explanation:
      'Todo cambio de dirección debe anunciarse con antelación suficiente mediante el intermitente correspondiente, además de comprobar los retrovisores y el ángulo muerto antes de ejecutar la maniobra.',
    difficulty: 'easy',
    tags: ['normas', 'cambio de dirección'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-CDI-02',
    categoryId: 'normas',
    subcategoryId: 'cambios-direccion',
    question: 'Para girar a la izquierda en una vía de doble sentido, como norma general debes situarte:',
    options: [
      'Lo más cerca posible del centro de la calzada o del eje central',
      'Junto al bordillo derecho',
      'Es indiferente el carril que ocupes',
    ],
    correctAnswer: 0,
    explanation:
      'Antes de girar a la izquierda hay que situarse lo más cerca posible del centro de la calzada (o en el carril izquierdo si existen varios), sin invadir el sentido contrario.',
    tags: ['normas', 'cambio de dirección'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-CSE-01',
    categoryId: 'normas',
    subcategoryId: 'cambios-sentido',
    question: '¿Dónde está prohibido cambiar de sentido?',
    options: [
      'En curvas, cambios de rasante y tramos con visibilidad reducida',
      'En cualquier calle de doble sentido',
      'Nunca está prohibido si no hay señal expresa',
    ],
    correctAnswer: 0,
    explanation:
      'Cambiar de sentido está prohibido en lugares sin visibilidad suficiente, como curvas o cambios de rasante, en pasos a nivel, túneles y otros puntos peligrosos.',
    tags: ['normas', 'cambio de sentido'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-CSE-02',
    categoryId: 'normas',
    subcategoryId: 'cambios-sentido',
    question: 'Antes de realizar un cambio de sentido debes:',
    options: [
      'Señalizarlo y cerciorarte de que no supone peligro ni entorpecimiento para otros usuarios',
      'Hacerlo rápido para no molestar al tráfico',
      'Solo mirar por el retrovisor central',
    ],
    correctAnswer: 0,
    explanation:
      'El cambio de sentido debe anunciarse con los intermitentes y ejecutarse solo cuando no suponga peligro ni entorpecimiento grave para el resto de la circulación.',
    tags: ['normas', 'cambio de sentido'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-INC-01',
    categoryId: 'normas',
    subcategoryId: 'incorporaciones',
    question: 'Al incorporarte a una autovía desde el carril de aceleración debes:',
    options: [
      'Adaptar tu velocidad a la del tráfico de la vía principal antes de incorporarte',
      'Detenerte en el carril de aceleración y esperar un hueco',
      'Incorporarte a la velocidad que llevabas en la vía secundaria',
    ],
    correctAnswer: 0,
    explanation:
      'El carril de aceleración existe para que puedas igualar tu velocidad a la del tráfico de la vía principal antes de incorporarte, cediendo el paso a quienes ya circulan por ella.',
    difficulty: 'easy',
    tags: ['normas', 'incorporación'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-INC-02',
    categoryId: 'normas',
    subcategoryId: 'incorporaciones',
    question: 'Los vehículos que ya circulan por la vía principal ante una incorporación deben:',
    options: [
      'Facilitar la incorporación cuando sea razonablemente posible',
      'Mantener siempre su velocidad sin ceder nunca',
      'Cambiar de carril obligatoriamente aunque haya tráfico denso',
    ],
    correctAnswer: 0,
    explanation:
      'Aunque quien se incorpora debe ceder el paso, los conductores de la vía principal deben facilitar la maniobra, moderando su velocidad o cambiando de carril cuando sea posible con seguridad.',
    tags: ['normas', 'incorporación'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PAR-01',
    categoryId: 'normas',
    subcategoryId: 'paradas',
    question: '¿Qué diferencia a la "parada" del "estacionamiento"?',
    options: [
      'La parada es una inmovilización breve para dejar o recoger personas u objetos, sin que el conductor se aleje del vehículo',
      'No hay diferencia legal entre ambas',
      'El estacionamiento es siempre gratuito y la parada de pago',
    ],
    correctAnswer: 0,
    explanation:
      'La parada es la inmovilización de un vehículo durante un tiempo inferior a dos minutos, sin que el conductor pueda abandonarlo, para subir o bajar personas o cargar/descargar objetos; el estacionamiento es cualquier inmovilización que no sea parada.',
    tags: ['normas', 'paradas', 'estacionamiento'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PAR-02',
    categoryId: 'normas',
    subcategoryId: 'paradas',
    question: '¿Está permitido parar en un carril reservado para transporte público?',
    options: [
      'No, salvo causa justificada de fuerza mayor',
      'Sí, siempre que sea menos de dos minutos',
      'Sí, sin ninguna restricción',
    ],
    correctAnswer: 0,
    explanation:
      'Está prohibido parar en carriles o partes de la vía reservados a un determinado tipo de usuarios, como los carriles bus, salvo causa de fuerza mayor.',
    tags: ['normas', 'paradas'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-EST-01',
    categoryId: 'normas',
    subcategoryId: 'estacionamiento-normas',
    question: '¿Dónde está prohibido estacionar con carácter general?',
    options: [
      'En pasos de peatones, curvas y cambios de rasante con visibilidad reducida',
      'Solo delante de comercios',
      'En cualquier calle de sentido único',
    ],
    correctAnswer: 0,
    explanation:
      'Está prohibido estacionar en pasos de peatones y ciclistas, en curvas, cambios de rasante, y en general en cualquier lugar donde se genere un riesgo o se obstaculice la visibilidad.',
    difficulty: 'easy',
    tags: ['normas', 'estacionamiento'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-EST-02',
    categoryId: 'normas',
    subcategoryId: 'estacionamiento-normas',
    question: 'En una vía urbana con estacionamiento en línea, ¿en qué sentido debes situarte respecto a la circulación?',
    options: [
      'En el sentido de la marcha, ocupando el lugar más próximo al borde de la calzada permitido',
      'Siempre en sentido contrario a la marcha',
      'Es indiferente el sentido',
    ],
    correctAnswer: 0,
    explanation:
      'Al estacionar en vías urbanas de doble sentido, como norma general el vehículo debe quedar orientado en el sentido de la circulación, salvo que la ordenación municipal indique otra cosa.',
    difficulty: 'hard',
    tags: ['normas', 'estacionamiento'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-CIR-01',
    categoryId: 'normas',
    subcategoryId: 'circulacion-vias',
    question: 'En una vía con varios carriles en el mismo sentido, el carril de la derecha se debe usar:',
    options: [
      'Como carril general de circulación, reservando los de la izquierda para adelantar',
      'Solo para vehículos lentos',
      'Únicamente para incorporarse o salir de la vía',
    ],
    correctAnswer: 0,
    explanation:
      'La norma general es circular por el carril de la derecha, utilizando los carriles de la izquierda solo mientras dura el adelantamiento u otra maniobra, para no entorpecer al resto del tráfico.',
    tags: ['normas', 'circulación'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-CIR-02',
    categoryId: 'normas',
    subcategoryId: 'circulacion-vias',
    // CORRECTED 2026-09-01 (content-quality audit): the old correct answer
    // read "para turismos depende de la normativa vigente en cada
    // momento" — a vague non-answer instead of stating the actual rule.
    // Verified current rule: motorcycles/mopeds must run with low-beam
    // lights on at all times, day and night, any road; cars/vans are NOT
    // generally required to on ordinary roads, but ARE required in
    // tunnels, underpasses, stretches signed for mandatory lighting,
    // reversible/contraflow lanes, and low-visibility conditions (rain,
    // fog). Rewritten to state that instead of hedging.
    question: '¿Es obligatorio circular con las luces de cruce encendidas de día?',
    options: [
      'Sí, siempre para motocicletas y ciclomotores; para turismos solo en túneles, tramos mal iluminados, carriles reversibles o con poca visibilidad',
      'Está totalmente prohibido llevarlas encendidas de día',
      'Solo se pueden usar en túneles',
    ],
    correctAnswer: 0,
    explanation:
      'Las motocicletas y ciclomotores deben circular siempre con la luz de cruce encendida, de día y de noche, en cualquier vía. Los turismos y furgonetas no están obligados con carácter general en vías normales, pero sí en túneles, pasos inferiores, tramos señalizados con obligación de alumbrado, carriles reversibles o adicionales, y en condiciones de poca visibilidad como lluvia o niebla.',
    difficulty: 'hard',
    tags: ['normas', 'alumbrado'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-CIR-03',
    categoryId: 'normas',
    subcategoryId: 'circulacion-vias',
    question: 'Circular marcha atrás está permitido:',
    options: [
      'Solo en un breve trecho y cuando no origine peligro, por ejemplo para estacionar',
      'En cualquier vía y distancia sin restricciones',
      'Únicamente en autopistas',
    ],
    correctAnswer: 0,
    explanation:
      'La marcha atrás solo puede realizarse en un trecho corto, sin que suponga peligro para el resto de usuarios; está prohibida en autopistas y autovías salvo casos excepcionales.',
    tags: ['normas', 'circulación'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
];
