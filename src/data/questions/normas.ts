import { q } from './helpers';

const SRC = 'https://www.dgt.es/muevete-con-seguridad/conoce-las-normas-de-trafico/normativa-para-la-circulacion/';
const RGC_BASE = 'https://www.boe.es/buscar/act.php?id=BOE-A-2003-23514';
const SRC_GLORIETA = 'https://www.dgt.es/comunicacion/noticias/glorietas-como-actuar-en-6-situaciones-habituales/';
const SRC_INTERMITENTE = 'https://revista.dgt.es/es/educacion-formacion/conducir-mejor/2022/1202-CM-Intermitentes.shtml';
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
    image: 'diagram:cruce-prioridad-derecha',
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
    image: 'diagram:rotonda-prioridad-interior',
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
    image: 'diagram:pendiente-estrecha-prioridad',
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
  // --- 2026-09-01, ampliación del banco (Fase 1, bloque 3) -----------------
  // Tranvías (art. 57 RGC) y prioridad al incorporarse desde gasolineras,
  // fincas colindantes, caminos privados y carriles de aceleración (art. 72
  // RGC) — huecos verificados del análisis de cobertura. Texto de ambos
  // artículos confirmado contra Iberley (cita literal del articulado, no
  // una interpretación de blog) antes de redactar cada pregunta.
  q({
    id: 'NOR-PRI-05',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: 'En una intersección sin semáforo ni señal que regule la prioridad, un tranvía que circula sobre raíles tiene, frente al resto de vehículos:',
    options: [
      'Prioridad de paso, como excepción a la norma general de prioridad a la derecha',
      'Prioridad solo si llega por la derecha, igual que cualquier otro vehículo',
      'Ninguna prioridad especial: es un vehículo más',
    ],
    correctAnswer: 0,
    explanation:
      'Los vehículos que circulan sobre raíles, como el tranvía, tienen prioridad de paso sobre el resto de usuarios: es una de las excepciones legales a la norma general de prioridad a la derecha en intersecciones sin regular.',
    difficulty: 'medium',
    tags: ['normas', 'prioridad', 'tranvía'],
    sourceUrl: SRC,
    legalReference: 'Reglamento General de Circulación, artículo 57',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PRI-06',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: '¿Por qué los vehículos que circulan sobre raíles, como el tranvía, tienen prioridad de paso legal frente al resto del tráfico?',
    options: [
      'Porque su trayectoria está fijada por los raíles: no pueden maniobrar ni esquivar para evitar una colisión',
      'Porque siempre transportan más pasajeros que un turismo',
      'Porque circulan más despacio que el resto de vehículos',
    ],
    correctAnswer: 0,
    explanation:
      'A diferencia de un vehículo con ruedas, un tranvía no puede girar el volante para esquivar un obstáculo ni cambiar de trayectoria: va fijado a los raíles. Por eso la norma le da prioridad, trasladando a los demás vehículos la responsabilidad de evitar la colisión.',
    difficulty: 'hard',
    tags: ['normas', 'prioridad', 'tranvía'],
    sourceUrl: SRC,
    legalReference: 'Reglamento General de Circulación, artículo 57',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PRI-07',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: 'Un vehículo que sale de una gasolinera o de una finca colindante a la vía y quiere incorporarse a la circulación:',
    options: [
      'Debe ceder el paso a todos los vehículos que ya circulen por esa vía, sea cual sea su sentido',
      'Tiene prioridad si el otro vehículo circula más despacio',
      'Tiene prioridad si ya ha encendido el intermitente',
    ],
    correctAnswer: 0,
    explanation:
      'Quien se incorpora a la circulación desde una zona de servicio, gasolinera o propiedad colindante debe cerciorarse de que puede hacerlo sin peligro y ceder el paso a los vehículos que ya circulan por la vía, en cualquiera de los dos sentidos.',
    difficulty: 'easy',
    tags: ['normas', 'prioridad', 'incorporación'],
    sourceUrl: SRC,
    legalReference: 'Reglamento General de Circulación, artículo 72',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PRI-08',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: 'Si sales a una vía pública desde un camino de uso exclusivamente privado, debes:',
    options: [
      'Circular a una velocidad que te permita detenerte de inmediato y ceder el paso a los vehículos de esa vía',
      'Tener prioridad, ya que los caminos privados siempre ceden el paso a quien sale de ellos',
      'Únicamente activar las luces de emergencia antes de salir',
    ],
    correctAnswer: 0,
    explanation:
      'La salida desde un camino exclusivamente privado a una vía de uso público exige asegurarse de que se puede hacer sin peligro, circulando a una velocidad que permita parar en el acto y cediendo el paso a los vehículos que ya circulan por esa vía.',
    difficulty: 'medium',
    tags: ['normas', 'prioridad', 'incorporación'],
    sourceUrl: SRC,
    legalReference: 'Reglamento General de Circulación, artículo 72',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PRI-09',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: 'Al incorporarte a una autovía por un carril de aceleración, la prioridad de paso la tienen:',
    options: [
      'Los vehículos que ya circulan por la vía principal',
      'Los vehículos que se incorporan, si aceleran lo suficiente',
      'Nadie: ambos deben cederse el paso mutuamente',
    ],
    correctAnswer: 0,
    explanation:
      'Quien utiliza un carril de aceleración para incorporarse debe asegurarse de que puede hacerlo sin peligro para quienes ya circulan por la vía principal, pudiendo incluso detenerse en el propio carril si fuera necesario, antes de acelerar hasta alcanzar una velocidad adecuada para integrarse en el tráfico.',
    difficulty: 'medium',
    tags: ['normas', 'prioridad', 'incorporación'],
    sourceUrl: SRC,
    legalReference: 'Reglamento General de Circulación, artículo 72',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PRI-10',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: 'No ceder el paso al incorporarte a la circulación desde una vía de servicio o una propiedad colindante se considera:',
    options: ['Una infracción grave', 'Una infracción leve, salvo que cause un accidente', 'No está sancionado si no hay colisión'],
    correctAnswer: 0,
    explanation:
      'Incumplir la obligación de ceder el paso al incorporarse a la circulación está tipificado como infracción grave, independientemente de que llegue a producirse o no una colisión.',
    difficulty: 'hard',
    tags: ['normas', 'prioridad', 'incorporación'],
    sourceUrl: SRC,
    legalReference: 'Real Decreto Legislativo 6/2015 (Ley de Tráfico), artículo 76, en relación con el artículo 72 del Reglamento General de Circulación',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  // --- 2026-09-02, imágenes de situaciones reales (Lote 1: intersecciones,
  // Lote 2: glorietas) ------------------------------------------------------
  // Confirmado el artículo exacto del RGC que agrupa TODAS las excepciones a
  // la prioridad a la derecha (raíles, vía pavimentada, glorietas,
  // autopista): es el mismo artículo 57 que ya se citaba para el tranvía
  // (NOR-PRI-05/06), no uno distinto — verificado citando el texto íntegro
  // del artículo, no una paráfrasis suelta.
  q({
    id: 'NOR-PRI-11',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: 'Te acercas a un cruce señalizado con STOP. Aunque no veas venir ningún vehículo por la vía a la que te incorporas, debes:',
    image: 'diagram:interseccion-stop-obligatorio',
    options: [
      'Detenerte por completo ante la señal, sea cual sea el tráfico visible',
      'Reducir la velocidad, pero no hace falta parar del todo si no viene nadie',
      'Solo detenerte si hay otro vehículo esperando detrás de ti',
    ],
    correctAnswer: 0,
    explanation:
      'La señal STOP obliga a detener completamente el vehículo ante la línea de detención en todos los casos, aunque no se aprecie ningún vehículo por la vía a la que te incorporas; a diferencia de Ceda el paso, aquí la parada nunca es opcional.',
    difficulty: 'easy',
    tags: ['normas', 'prioridad', 'stop'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PRI-12',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: 'Te acercas a un cruce señalizado con Ceda el paso, sin ningún vehículo a la vista por la vía a la que te incorporas. A diferencia de una señal de STOP:',
    image: 'diagram:interseccion-ceda-paso',
    options: [
      'Solo estás obligado a detenerte si es necesario para dejar pasar a otro vehículo',
      'Debes detenerte igualmente por completo, sin excepción',
      'Puedes ignorar la señal si circulas despacio',
    ],
    correctAnswer: 0,
    explanation:
      'Ceda el paso obliga a ceder la prioridad a los vehículos de la vía a la que te incorporas, pero solo exige detenerse por completo cuando sea necesario para hacerlo con seguridad; si no viene nadie, se puede continuar sin pararse, algo que la señal de STOP nunca permite.',
    difficulty: 'medium',
    tags: ['normas', 'prioridad', 'ceda el paso'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PRI-13',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: 'En una intersección sin señalizar entre una vía pavimentada y un camino de tierra sin pavimentar, tiene prioridad:',
    image: 'diagram:via-pavimentada-prioridad',
    options: [
      'El vehículo que circula por la vía pavimentada, aunque el otro venga por la derecha',
      'Siempre el que viene por la derecha, sin excepción',
      'El camino sin pavimentar, para compensar su peor estado',
    ],
    correctAnswer: 0,
    explanation:
      'La vía pavimentada tiene preferencia sobre la que no lo está: es una de las excepciones legales a la norma general de prioridad a la derecha, y se aplica aunque el vehículo del camino de tierra llegue por la derecha del otro.',
    difficulty: 'hard',
    tags: ['normas', 'prioridad'],
    sourceUrl: SRC,
    legalReference: 'Reglamento General de Circulación, artículo 57',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PRI-14',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: 'Vas a abandonar una glorieta por una salida cercana. Como norma general, debes:',
    image: 'diagram:glorieta-salida-carril-derecho',
    options: [
      'Situarte con antelación en el carril exterior (derecho) y salir por él',
      'Salir desde cualquier carril, ya que dentro de la glorieta no hay normas de carril',
      'Esperar a estar justo en la salida para cambiarte al carril derecho',
    ],
    correctAnswer: 0,
    explanation:
      'La DGT recuerda que, como norma general, una glorieta se abandona por el carril exterior (derecho), ocupándolo con antelación suficiente para evitar la maniobra conocida como "cruzada", que consiste en salir cortando la trayectoria de quien circula por fuera.',
    difficulty: 'medium',
    tags: ['normas', 'prioridad', 'glorieta'],
    sourceUrl: SRC_GLORIETA,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PRI-15',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: '¿Está permitido abandonar una glorieta directamente desde un carril interior?',
    image: 'diagram:glorieta-salida-carril-interior-excepcion',
    options: [
      'Solo cuando una señal, como una flecha pintada en el suelo, lo indique expresamente',
      'Sí, siempre que se haga con el intermitente puesto',
      'Nunca, es una maniobra siempre prohibida sin excepción',
    ],
    correctAnswer: 0,
    explanation:
      'La norma general obliga a salir por el carril exterior, pero admite una excepción: cuando una señal (por ejemplo, una flecha pintada en el pavimento) indique expresamente que esa salida también puede tomarse desde un carril interior.',
    difficulty: 'hard',
    tags: ['normas', 'prioridad', 'glorieta'],
    sourceUrl: SRC_GLORIETA,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PRI-16',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: 'Al entrar en una glorieta muy transitada con el carril derecho de acceso completamente saturado, mientras el izquierdo está libre:',
    image: 'diagram:glorieta-entrada-izquierda-congestion',
    options: [
      'Puedes entrar directamente por el carril izquierdo al interior de la glorieta',
      'Debes esperar siempre a que se libere el carril derecho, por saturado que esté',
      'Debes invadir el arcén para rodear la congestión',
    ],
    correctAnswer: 0,
    explanation:
      'Cuando el carril derecho de entrada está saturado, la DGT admite entrar directamente desde el carril izquierdo al interior de la glorieta, pudiendo circular por el carril interior hasta las últimas salidas si la congestión lo justifica.',
    difficulty: 'hard',
    tags: ['normas', 'prioridad', 'glorieta'],
    sourceUrl: SRC_GLORIETA,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-PRI-17',
    categoryId: 'normas',
    subcategoryId: 'prioridad',
    question: 'Un grupo de varios ciclistas circula junto dentro de una glorieta. A efectos de prioridad, ese grupo:',
    image: 'diagram:glorieta-grupo-ciclistas',
    options: [
      'Se considera como un único vehículo, una vez que el primero ya ha entrado en la glorieta',
      'Pierde toda prioridad frente a los turismos, por tratarse de varios vehículos',
      'Debe circular en fila de uno, nunca en grupo, dentro de una glorieta',
    ],
    correctAnswer: 0,
    explanation:
      'Un grupo de ciclistas dentro de una glorieta goza de prioridad como si fuese un único vehículo desde el momento en que el primero ya ha entrado: el resto del grupo mantiene esa misma prioridad frente a quien pretenda incorporarse.',
    difficulty: 'medium',
    tags: ['normas', 'prioridad', 'glorieta', 'ciclistas'],
    sourceUrl: SRC_GLORIETA,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-ADE-01',
    categoryId: 'normas',
    subcategoryId: 'adelantamientos',
    question: 'Antes de iniciar un adelantamiento debes comprobar que:',
    image: 'diagram:adelantamiento-espacio-seguro',
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
    image: 'diagram:adelantamiento-curva-prohibido',
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
  // 2026-09-01, ampliación del banco (Fase 1, bloque 7): profundiza
  // adelantamientos con casos que el banco no cubría (túneles,
  // intersecciones, paso a nivel/vía ciclista, deberes del adelantado y la
  // excepción de vehículos inmovilizados/ciclos/peatones lentos).
  // Verificado contra el articulado (arts. 84, 86, 87 y 88 RGC), citando
  // la cita literal de cada fuente, no una paráfrasis de blog.
  q({
    id: 'NOR-ADE-05',
    categoryId: 'normas',
    subcategoryId: 'adelantamientos',
    question: 'Como norma general, ¿está permitido adelantar dentro de un túnel?',
    options: [
      'No, salvo que el túnel disponga de dos o más carriles para el mismo sentido de circulación',
      'Sí, siempre que se circule con las luces de cruce encendidas',
      'Sí, sin ninguna restricción adicional respecto a una vía normal',
    ],
    correctAnswer: 0,
    explanation:
      'El adelantamiento está prohibido en túneles, pasos inferiores y tramos señalizados con la señal de Túnel (S-5) que tengan un único carril por sentido; solo se permite cuando el túnel dispone de dos o más carriles para el mismo sentido de circulación.',
    difficulty: 'medium',
    tags: ['normas', 'adelantamiento', 'túnel'],
    sourceUrl: RGC_BASE,
    legalReference: 'Reglamento General de Circulación, artículo 87',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-ADE-06',
    categoryId: 'normas',
    subcategoryId: 'adelantamientos',
    question: 'Como norma general, adelantar en una intersección está prohibido. ¿En cuál de estos casos sí está permitido?',
    options: [
      'En una glorieta, o cuando la calzada por la que circulas goza de prioridad expresamente señalizada',
      'Siempre que no vengan vehículos de frente en ese preciso instante',
      'Siempre que la intersección esté en una vía urbana, nunca en carretera',
    ],
    correctAnswer: 0,
    explanation:
      'El reglamento prohíbe adelantar en intersecciones salvo excepciones tasadas: entre ellas, que se trate de una glorieta o que la vía por la que circulas tenga prioridad señalizada expresamente sobre la que corta, entre otros supuestos concretos.',
    difficulty: 'hard',
    tags: ['normas', 'adelantamiento', 'intersección'],
    sourceUrl: RGC_BASE,
    legalReference: 'Reglamento General de Circulación, artículo 87',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-ADE-07',
    categoryId: 'normas',
    subcategoryId: 'adelantamientos',
    question: 'Adelantar en una intersección con una vía ciclista, o en un paso a nivel y sus proximidades:',
    options: [
      'Está prohibido, igual que en un paso de peatones señalizado',
      'Está permitido si no hay ciclistas ni trenes a la vista en ese momento',
      'Solo está prohibido en el propio paso, pero no en sus proximidades',
    ],
    correctAnswer: 0,
    explanation:
      'El reglamento prohíbe adelantar en los pasos de peatones señalizados, en las intersecciones con vías ciclistas y en los pasos a nivel, así como en sus proximidades, precisamente por el riesgo que supone para estos usuarios especialmente vulnerables.',
    difficulty: 'medium',
    tags: ['normas', 'adelantamiento'],
    sourceUrl: RGC_BASE,
    legalReference: 'Reglamento General de Circulación, artículo 87',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-ADE-08',
    categoryId: 'normas',
    subcategoryId: 'adelantamientos',
    question: 'Si adviertes que otro vehículo está intentando adelantarte, tú, como conductor del vehículo adelantado, tienes prohibido:',
    options: [
      'Aumentar la velocidad o hacer maniobras que impidan o dificulten el adelantamiento',
      'Ceñirte al borde derecho de la calzada',
      'Reducir la velocidad si la maniobra entraña algún peligro',
    ],
    correctAnswer: 0,
    explanation:
      'El reglamento prohíbe expresamente al conductor que va a ser adelantado aumentar la velocidad o realizar maniobras que dificulten el adelantamiento; al contrario, debe ceñirse al borde derecho y reducir la velocidad si la situación se vuelve peligrosa.',
    difficulty: 'medium',
    tags: ['normas', 'adelantamiento'],
    sourceUrl: RGC_BASE,
    legalReference: 'Reglamento General de Circulación, artículo 86',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'NOR-ADE-09',
    categoryId: 'normas',
    subcategoryId: 'adelantamientos',
    question: 'En un tramo donde el adelantamiento está normalmente prohibido, te encuentras con un vehículo averiado e inmovilizado que ocupa parte del carril. ¿Puedes adelantarlo?',
    options: [
      'Sí, incluso en zona de adelantamiento prohibido, si puedes hacerlo sin peligro',
      'No, la prohibición de adelantamiento se aplica siempre, sin excepciones',
      'Solo si el vehículo inmovilizado lleva más de una hora parado',
    ],
    correctAnswer: 0,
    explanation:
      'Un vehículo inmovilizado que ocupa la calzada, así como ciclistas, peatones o animales que circulen despacio, pueden rebasarse incluso en tramos donde el adelantamiento está normalmente prohibido, siempre que la maniobra pueda hacerse sin peligro.',
    difficulty: 'hard',
    tags: ['normas', 'adelantamiento'],
    sourceUrl: RGC_BASE,
    legalReference: 'Reglamento General de Circulación, artículo 88',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  // 2026-09-02, imágenes de situaciones reales (Lote 3: adelantamientos).
  // Situación con 3 vehículos para que la respuesta dependa realmente de
  // la imagen, no de conocer una regla aislada: A no puede completar el
  // adelantamiento a tiempo con C ya tan cerca en sentido contrario.
  q({
    id: 'NOR-ADE-10',
    categoryId: 'normas',
    subcategoryId: 'adelantamientos',
    question: 'Circulas detrás de un vehículo lento en una carretera de doble sentido y quieres adelantarlo. En ese momento aparece otro vehículo de frente, ya relativamente cerca. ¿Debes iniciar el adelantamiento?',
    image: 'diagram:adelantamiento-tres-vehiculos-sin-espacio',
    options: [
      'No: con un vehículo en sentido contrario tan cerca, no hay espacio ni tiempo para completar la maniobra con seguridad',
      'Sí, siempre que aceleres con decisión en cuanto empieces a adelantar',
      'Sí, porque el vehículo que viene de frente tiene la obligación de reducir la velocidad para dejarte sitio',
    ],
    correctAnswer: 0,
    explanation:
      'Antes de adelantar hay que comprobar que se dispone de espacio y tiempo suficientes para completar la maniobra y volver al carril propio sin obligar a maniobrar bruscamente al vehículo que viene de frente; si este ya está relativamente cerca, la distancia no es suficiente y no debe iniciarse el adelantamiento.',
    difficulty: 'medium',
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
  // 2026-09-02, imágenes de situaciones reales (Lote 4: cambios de
  // carril). Verificado contra un reportaje oficial de la revista de la
  // DGT que lo dice explícitamente: el intermitente es una "declaración
  // de intenciones" y nunca otorga prioridad por sí solo (salvo una
  // única excepción, no representada aquí: dos vehículos en el mismo
  // carril señalizando un adelantamiento).
  q({
    id: 'NOR-INC-03',
    categoryId: 'normas',
    subcategoryId: 'incorporaciones',
    question: 'Quieres cambiar al carril izquierdo y activas el intermitente, pero en ese carril ya circula otro vehículo a tu altura. ¿Tiene tu intermitente activado prioridad sobre ese vehículo?',
    image: 'diagram:cambio-carril-intermitente-no-prioridad',
    options: [
      'No: el intermitente solo avisa de tu intención, pero quien ya circula por ese carril mantiene la prioridad',
      'Sí, activar el intermitente con antelación suficiente da prioridad automática para el cambio',
      'Sí, pero solo si lo activas más de 5 segundos antes de moverte',
    ],
    correctAnswer: 0,
    explanation:
      'El intermitente es solo una señal de aviso: informa de tu intención, pero nunca otorga prioridad por sí mismo (salvo un supuesto muy concreto ajeno a este caso). El vehículo que ya circula por el carril de destino mantiene la prioridad, y quien quiere cambiarse debe cederle el paso.',
    difficulty: 'medium',
    tags: ['normas', 'cambio de carril', 'intermitente'],
    sourceUrl: SRC_INTERMITENTE,
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
