import { q } from './helpers';

const SRC = 'https://www.dgt.es/muevete-con-seguridad/evita-conductas-de-riesgo/';
const SRC_ACCIDENTE = 'https://www.dgt.es/muevete-con-seguridad/que-hacer-ante-un-accidente-de-trafico/';
const SRC_ECO = 'https://www.dgt.es/muevete-con-seguridad/conviertete-en-un-buen-conductor/consejos-generales/conduccion-eficiente/';
const SRC_HIELO = 'https://www.dgt.es/comunicacion/noticias/hielo-y-nieve-con-la-adherencia-al-limite/';
const SRC_VIENTO = 'https://www.dgt.es/comunicacion/noticias/conducir-con-el-viento-en-contra/';
const SRC_NOCHE = 'https://www.dgt.es/comunicacion/noticias/consejos-para-conducir-de-noche/';
const VERIFIED_AT = '2026-09-01';

// --- 2026-09-01 audit pass (content-quality initiative, Fase 2) ---------
// Most of this file is safety education (physics of braking/reaction time,
// fatigue/somnolence advice) rather than numeric legal thresholds, so lower
// risk of having gone stale — reviewed each for correctness/ambiguity.
// Actively re-checked the one area known to have tightened recently:
// SEG-TEL-01/02 (mobile phone at the wheel) — confirmed current (a 2026
// reform doubled the point penalty for handling the phone, but neither
// question asserts a specific point count, so no correction was needed).
export const seguridadVialQuestions = [
  q({
    id: 'SEG-DIS-01',
    categoryId: 'seguridad-vial',
    subcategoryId: 'distancia-seguridad',
    question: 'La distancia de seguridad con el vehículo de delante debe permitir:',
    options: [
      'Detenerte a tiempo si el vehículo precedente frena bruscamente',
      'Solo evitar el ruido del motor de delante',
      'Adelantar en cualquier momento sin comprobar nada más',
    ],
    correctAnswer: 0,
    explanation:
      'La distancia de seguridad debe ser suficiente para poder detener el vehículo sin colisionar si el que va delante frena de forma repentina, considerando velocidad, estado de la vía y del vehículo.',
    difficulty: 'easy',
    tags: ['seguridad vial', 'distancia'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-DIS-02',
    categoryId: 'seguridad-vial',
    subcategoryId: 'distancia-seguridad',
    question: 'Una regla práctica para calcular la distancia de seguridad es:',
    options: [
      'La "regla de los dos segundos" respecto al vehículo que te precede',
      'Mantener siempre exactamente 10 metros',
      'Ir pegado al parachoques para no perder el hueco',
    ],
    correctAnswer: 0,
    explanation:
      'Una forma sencilla de estimar la distancia de seguridad es dejar transcurrir al menos dos segundos entre que el vehículo de delante pasa por un punto fijo y tú pasas por el mismo punto.',
    tags: ['seguridad vial', 'distancia'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-DIS-03',
    categoryId: 'seguridad-vial',
    subcategoryId: 'distancia-seguridad',
    question: '¿Qué factores aumentan la distancia de seguridad necesaria?',
    options: [
      'Mayor velocidad, lluvia, niebla o mal estado de los neumáticos',
      'Solo el número de ocupantes del vehículo',
      'El color del vehículo que te precede',
    ],
    correctAnswer: 0,
    explanation:
      'A mayor velocidad, o con condiciones adversas como lluvia, niebla, hielo o neumáticos en mal estado, la distancia de frenado aumenta y por tanto también debe aumentar la distancia de seguridad.',
    tags: ['seguridad vial', 'distancia'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-VEL-01',
    categoryId: 'seguridad-vial',
    subcategoryId: 'velocidad',
    question: 'La velocidad adecuada en cada momento depende de:',
    options: [
      'Las condiciones de la vía, el tráfico, la visibilidad y las características del vehículo, además del límite señalizado',
      'Únicamente del límite máximo indicado en la señal',
      'Solo de la potencia del motor',
    ],
    correctAnswer: 0,
    explanation:
      'Circular al límite legal no siempre es circular a velocidad adecuada: hay que adaptar la velocidad a las condiciones reales de la vía, el tráfico, la meteorología y el propio vehículo.',
    difficulty: 'easy',
    tags: ['seguridad vial', 'velocidad'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  q({
    id: 'SEG-VEL-02',
    categoryId: 'seguridad-vial',
    subcategoryId: 'velocidad',
    question: 'Al duplicarse la velocidad de un vehículo, la energía cinética (y el riesgo en caso de colisión):',
    options: [
      'Se multiplica por cuatro',
      'Se duplica en la misma proporción',
      'Se mantiene igual',
    ],
    correctAnswer: 0,
    explanation:
      'La energía cinética depende del cuadrado de la velocidad, por lo que duplicar la velocidad multiplica por cuatro la energía que hay que disipar en una frenada o un choque.',
    difficulty: 'hard',
    tags: ['seguridad vial', 'velocidad'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-01',
  }),
  q({
    id: 'SEG-FRE-01',
    categoryId: 'seguridad-vial',
    subcategoryId: 'frenado',
    question: 'La distancia total de frenado se compone de:',
    options: [
      'La distancia recorrida durante el tiempo de reacción más la distancia de frenado propiamente dicha',
      'Solo la distancia que recorre el vehículo con el freno pisado',
      'Solo el tiempo que tarda el conductor en ver el peligro',
    ],
    correctAnswer: 0,
    explanation:
      'La distancia total de detención es la suma de la distancia recorrida durante el tiempo de reacción del conductor y la distancia que el vehículo recorre mientras frena hasta detenerse.',
    tags: ['seguridad vial', 'frenado'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-FRE-02',
    categoryId: 'seguridad-vial',
    subcategoryId: 'frenado',
    question: 'El firme mojado, respecto al firme seco, hace que la distancia de frenado sea:',
    options: ['Mayor, por la pérdida de adherencia', 'Menor', 'Exactamente igual'],
    correctAnswer: 0,
    explanation:
      'Con el firme mojado la adherencia de los neumáticos disminuye, por lo que la distancia necesaria para detener el vehículo aumenta respecto al firme seco.',
    difficulty: 'easy',
    tags: ['seguridad vial', 'frenado'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-RIE-01',
    categoryId: 'seguridad-vial',
    subcategoryId: 'riesgos',
    question: '¿Cuál de estas situaciones incrementa claramente el riesgo de accidente?',
    options: [
      'Circular con neumáticos desgastados bajo lluvia intensa',
      'Circular con el depósito de combustible lleno',
      'Llevar el maletero ordenado',
    ],
    correctAnswer: 0,
    explanation:
      'Los neumáticos desgastados reducen mucho la adherencia, especialmente con lluvia, lo que aumenta notablemente el riesgo de pérdida de control o de aumento de la distancia de frenado.',
    difficulty: 'easy',
    tags: ['seguridad vial', 'riesgos'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-FAT-01',
    categoryId: 'seguridad-vial',
    subcategoryId: 'fatiga',
    question: 'En un viaje largo, se recomienda hacer una pausa de al menos:',
    options: [
      '15-20 minutos cada 2 horas de conducción aproximadamente',
      '5 minutos cada 6 horas',
      'No es necesario parar si te sientes bien',
    ],
    correctAnswer: 0,
    explanation:
      'La fatiga reduce la capacidad de reacción de forma progresiva; se recomienda descansar unos 15-20 minutos aproximadamente cada dos horas de conducción para mantener el nivel de atención.',
    tags: ['seguridad vial', 'fatiga'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-SOM-01',
    categoryId: 'seguridad-vial',
    subcategoryId: 'somnolencia',
    question: 'Ante los primeros síntomas de somnolencia al volante debes:',
    options: [
      'Parar en un lugar seguro y descansar, no intentar "aguantar" el sueño',
      'Subir la música y abrir la ventanilla para espabilarte',
      'Aumentar la velocidad para llegar antes',
    ],
    correctAnswer: 0,
    explanation:
      'Los remedios como abrir la ventanilla o subir la música no eliminan la somnolencia real; ante los primeros síntomas lo seguro es detenerse en un lugar apropiado y descansar.',
    difficulty: 'easy',
    tags: ['seguridad vial', 'somnolencia'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-SOM-02',
    categoryId: 'seguridad-vial',
    subcategoryId: 'somnolencia',
    question: 'La somnolencia al volante es especialmente frecuente:',
    options: [
      'A primera hora de la tarde y de madrugada, coincidiendo con los ciclos naturales de sueño',
      'Únicamente si se ha dormido menos de 3 horas la noche anterior',
      'Solo afecta a los conductores profesionales',
    ],
    correctAnswer: 0,
    explanation:
      'Los "bajones" de vigilancia coinciden con los ritmos circadianos del cuerpo, especialmente en las primeras horas de la tarde y durante la madrugada, por lo que el riesgo de somnolencia es mayor en esas franjas.',
    tags: ['seguridad vial', 'somnolencia'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-DIST-01',
    categoryId: 'seguridad-vial',
    subcategoryId: 'distracciones',
    question: '¿Cuál de estas es una distracción que puede comprometer la seguridad al volante?',
    options: [
      'Consultar el navegador o cambiar la música mientras se conduce',
      'Ajustar el retrovisor antes de iniciar la marcha',
      'Ponerse el cinturón antes de arrancar',
    ],
    correctAnswer: 0,
    explanation:
      'Cualquier tarea que desvíe la atención visual, manual o mental de la conducción, como manipular el navegador o el equipo de música en marcha, constituye una distracción de riesgo.',
    difficulty: 'easy',
    tags: ['seguridad vial', 'distracciones'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-DIST-02',
    categoryId: 'seguridad-vial',
    subcategoryId: 'distracciones',
    question: 'Una distracción de apenas 2 segundos a 100 km/h supone circular "a ciegas" durante:',
    options: [
      'Unos 55 metros aproximadamente', '5 metros', '200 metros',
    ],
    correctAnswer: 0,
    explanation:
      'A 100 km/h el vehículo recorre unos 27,7 metros por segundo, por lo que apartar la vista solo 2 segundos supone recorrer más de 55 metros sin control visual de la vía.',
    difficulty: 'hard',
    tags: ['seguridad vial', 'distracciones'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-TEL-01',
    categoryId: 'seguridad-vial',
    subcategoryId: 'telefono-movil',
    question: '¿Está permitido sujetar el teléfono móvil con la mano mientras se conduce, aunque no se esté hablando?',
    options: [
      'No, sujetarlo con la mano está prohibido y conlleva pérdida de puntos',
      'Sí, si el semáforo está en rojo',
      'Sí, siempre que el coche esté circulando despacio',
    ],
    correctAnswer: 0,
    explanation:
      'Está prohibido conducir sujetando con la mano cualquier dispositivo de telefonía móvil o similar, incluso sin usarlo activamente; la normativa vigente sanciona esta conducta con pérdida de puntos.',
    tags: ['seguridad vial', 'móvil'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-TEL-02',
    categoryId: 'seguridad-vial',
    subcategoryId: 'telefono-movil',
    question: '¿Cómo se puede usar el teléfono móvil de forma legal durante la conducción?',
    options: [
      'Mediante un sistema de manos libres que no requiera sujetarlo ni manipularlo',
      'Sujetándolo con una mano mientras se conduce con la otra',
      'Mirándolo brevemente en los semáforos en rojo',
    ],
    correctAnswer: 0,
    explanation:
      'La forma legal de usar el móvil conduciendo es a través de un sistema de manos libres homologado, sin necesidad de sujetarlo, marcarlo o manipularlo con las manos.',
    tags: ['seguridad vial', 'móvil'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  // --- 2026-09-01, cobertura temática (Fase 3) -----------------------------
  // Dos subcategorías nuevas, ausentes por completo del banco hasta ahora:
  // primeros auxilios (protocolo PAS) y conducción eficiente. Contenido
  // derivado directamente de dos páginas oficiales de la DGT consultadas
  // hoy mismo (ver SRC_ACCIDENTE / SRC_ECO), citando datos concretos que sí
  // aparecen en esas páginas (distancias de los triángulos, teléfono 112,
  // umbral de 60 segundos para parar el motor, etc.) en vez de cifras
  // genéricas de memoria.
  q({
    id: 'SEG-PAS-01',
    categoryId: 'seguridad-vial',
    subcategoryId: 'primeros-auxilios',
    question: 'Ante un accidente de tráfico, el protocolo PAS establece que la primera actuación debe ser:',
    options: [
      'Proteger: señalizar y asegurar la zona para que el accidente no vaya a más',
      'Socorrer a los heridos inmediatamente, sea cual sea la situación',
      'Avisar primero a un familiar antes que a emergencias',
    ],
    correctAnswer: 0,
    explanation:
      'El protocolo PAS (Proteger, Alertar, Socorrer) empieza siempre por proteger la zona del accidente, para evitar que se produzcan más víctimas antes de poder atender a las que ya hay.',
    difficulty: 'easy',
    tags: ['seguridad vial', 'primeros auxilios'],
    sourceUrl: SRC_ACCIDENTE,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-PAS-02',
    categoryId: 'seguridad-vial',
    subcategoryId: 'primeros-auxilios',
    question: 'Si tienes que colocar los triángulos de señalización tras un accidente en una vía de doble sentido, debes situarlos:',
    options: [
      'A unos 50 metros del vehículo, en ambos sentidos de circulación',
      'A 5 metros, solo en el sentido de tu marcha',
      'No hace falta colocarlos si hay poco tráfico',
    ],
    correctAnswer: 0,
    explanation:
      'En una vía de doble sentido los triángulos se colocan a unos 50 metros del vehículo en ambos sentidos, para advertir con tiempo suficiente al tráfico que se aproxima desde cualquiera de las dos direcciones.',
    tags: ['seguridad vial', 'primeros auxilios'],
    sourceUrl: SRC_ACCIDENTE,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-PAS-03',
    categoryId: 'seguridad-vial',
    subcategoryId: 'primeros-auxilios',
    question: 'Ante un motociclista accidentado, la actuación correcta respecto a su casco es:',
    options: [
      'No quitárselo, salvo que sea imprescindible para reanimarlo',
      'Quitárselo siempre, para que respire mejor',
      'Quitárselo solo si está consciente y lo pide',
    ],
    correctAnswer: 0,
    explanation:
      'No se debe retirar el casco a un motociclista accidentado, ya que una manipulación incorrecta puede agravar una posible lesión cervical; solo se retira si es imprescindible para maniobras de reanimación.',
    difficulty: 'easy',
    tags: ['seguridad vial', 'primeros auxilios'],
    sourceUrl: SRC_ACCIDENTE,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-PAS-04',
    categoryId: 'seguridad-vial',
    subcategoryId: 'primeros-auxilios',
    question: 'Al llamar al 112 para alertar de un accidente, es especialmente importante:',
    options: [
      'Dar la localización precisa y el número de heridos, siendo breve y conciso',
      'Colgar en cuanto describas los daños del vehículo',
      'Esperar a tener todos los datos médicos de los heridos antes de llamar',
    ],
    correctAnswer: 0,
    explanation:
      'Al alertar al 112 hay que aportar la localización precisa, el número de vehículos y heridos y cualquier riesgo especial, siendo breve y conciso para no demorar la respuesta de emergencias.',
    tags: ['seguridad vial', 'primeros auxilios'],
    sourceUrl: SRC_ACCIDENTE,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  // 2026-09-01, ampliación (Fase 1, bloque 5): estas 4 preguntas amplían
  // primeros auxilios con datos ya verificados en el bloque 1 de la misma
  // fuente (SRC_ACCIDENTE) que no se habían usado todavía — no ha hecho
  // falta investigación nueva, solo aprovechar mejor lo ya comprobado.
  q({
    id: 'SEG-PAS-05',
    categoryId: 'seguridad-vial',
    subcategoryId: 'primeros-auxilios',
    question: 'Ante una víctima de accidente que no reacciona pero respira, dentro de la fase de "Socorrer" del protocolo PAS, una de las primeras comprobaciones es:',
    options: [
      'Abrir la vía aérea si la víctima lo requiere, para asegurar que puede respirar',
      'Darle de beber agua para que se reanime',
      'Trasladarla de inmediato a un lugar más cómodo, sea cual sea su estado',
    ],
    correctAnswer: 0,
    explanation:
      'Dentro de la fase de socorrer, si la víctima no reacciona hay que comprobar y, si es necesario, abrir su vía aérea para asegurar que puede respirar, antes de cualquier otra actuación.',
    difficulty: 'medium',
    tags: ['seguridad vial', 'primeros auxilios'],
    sourceUrl: SRC_ACCIDENTE,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-PAS-06',
    categoryId: 'seguridad-vial',
    subcategoryId: 'primeros-auxilios',
    question: 'Si no tienes conocimientos de primeros auxilios, a una persona accidentada que está consciente pero quejándose de dolor, en principio:',
    options: [
      'No debes movilizarla, salvo riesgo inmediato de incendio o explosión',
      'Debes moverla a la posición que ella misma pida, sin más consideraciones',
      'Debes sentarla, para facilitar que respire mejor',
    ],
    correctAnswer: 0,
    explanation:
      'Sin conocimientos de primeros auxilios no se debe movilizar a una persona accidentada, ya que un movimiento incorrecto puede agravar una lesión no visible, como una fractura o un daño en la columna; la única excepción es un riesgo inmediato como el fuego.',
    difficulty: 'medium',
    tags: ['seguridad vial', 'primeros auxilios'],
    sourceUrl: SRC_ACCIDENTE,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-PAS-07',
    categoryId: 'seguridad-vial',
    subcategoryId: 'primeros-auxilios',
    question: 'Si un vehículo accidentado queda en una posición inestable con una persona atrapada en su interior, sin formación ni equipo de rescate:',
    options: [
      'No debes intentar rescatarla tú mismo, salvo riesgo inmediato para su vida',
      'Debes sacarla cuanto antes, sea como sea, para alejarla del vehículo',
      'Debes esperar sin hacer nada hasta que lleguen los servicios de emergencia, sin llamarlos siquiera',
    ],
    correctAnswer: 0,
    explanation:
      'Rescatar a alguien de un vehículo inestable sin la formación ni el equipo adecuados puede agravar sus lesiones o poner en riesgo a quien intenta ayudar; se recomienda no hacerlo salvo que exista un riesgo inmediato como el fuego, y dejar el rescate a los servicios de emergencia ya alertados.',
    difficulty: 'hard',
    tags: ['seguridad vial', 'primeros auxilios'],
    sourceUrl: SRC_ACCIDENTE,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-PAS-08',
    categoryId: 'seguridad-vial',
    subcategoryId: 'primeros-auxilios',
    question: 'Mientras llega la ayuda a una persona accidentada consciente, entre las actuaciones recomendadas está:',
    options: [
      'Aflojarle las prendas ajustadas y protegerla del frío o el calor',
      'Darle de comer o beber algo para reanimarla',
      'Quitarle cualquier prenda que lleve puesta, por si acaso',
    ],
    correctAnswer: 0,
    explanation:
      'Aflojar las prendas ajustadas facilita la respiración y la circulación, y proteger a la víctima del frío o el calor ayuda a prevenir el shock; en cambio, nunca se le debe dar de comer o beber, por el riesgo de que pierda el conocimiento o necesite ser intervenida.',
    difficulty: 'medium',
    tags: ['seguridad vial', 'primeros auxilios'],
    sourceUrl: SRC_ACCIDENTE,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-ECO-01',
    categoryId: 'seguridad-vial',
    subcategoryId: 'conduccion-eficiente',
    question: 'Para una conducción eficiente, como norma general conviene:',
    options: [
      'Circular en marchas largas y a bajas revoluciones, siempre que la vía lo permita',
      'Circular siempre en marchas cortas para tener más potencia disponible',
      'Mantener el motor a altas revoluciones el mayor tiempo posible',
    ],
    correctAnswer: 0,
    explanation:
      'La conducción eficiente recomienda circular en marchas largas y a bajas revoluciones, y mantener una velocidad uniforme, lo que reduce el consumo de combustible y las emisiones.',
    difficulty: 'easy',
    tags: ['seguridad vial', 'conducción eficiente'],
    sourceUrl: SRC_ECO,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-ECO-02',
    categoryId: 'seguridad-vial',
    subcategoryId: 'conduccion-eficiente',
    question: 'Según las recomendaciones de conducción eficiente de la DGT, en una parada previsible conviene apagar el motor cuando vaya a durar más de:',
    options: ['60 segundos', '10 minutos', 'Nunca conviene apagarlo en una parada corta'],
    correctAnswer: 0,
    explanation:
      'La DGT recomienda apagar el motor en paradas superiores a 60 segundos, ya que mantenerlo en marcha innecesariamente aumenta el consumo de combustible y las emisiones sin ningún beneficio.',
    difficulty: 'hard',
    tags: ['seguridad vial', 'conducción eficiente'],
    sourceUrl: SRC_ECO,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-ECO-03',
    categoryId: 'seguridad-vial',
    subcategoryId: 'conduccion-eficiente',
    question: 'Llevar una baca portaequipajes montada en el vehículo, aunque vaya vacía:',
    options: [
      'Aumenta el consumo de combustible por la resistencia al aire, hasta un 35% según la DGT',
      'No afecta en absoluto al consumo si va vacía',
      'Reduce el consumo al mejorar la aerodinámica',
    ],
    correctAnswer: 0,
    explanation:
      'La baca portaequipajes aumenta considerablemente la resistencia aerodinámica del vehículo; la DGT cifra ese sobreconsumo en hasta un 35%, incluso circulando sin carga sobre ella.',
    tags: ['seguridad vial', 'conducción eficiente'],
    sourceUrl: SRC_ECO,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-ECO-04',
    categoryId: 'seguridad-vial',
    subcategoryId: 'conduccion-eficiente',
    question: 'En un descenso prolongado, para conducir de forma eficiente y segura debes:',
    options: [
      'Levantar el pie del acelerador y aprovechar la inercia, sin poner nunca punto muerto',
      'Poner el punto muerto para ahorrar combustible durante toda la bajada',
      'Mantener el acelerador pisado para no perder velocidad',
    ],
    correctAnswer: 0,
    explanation:
      'En bajadas se recomienda levantar el acelerador y aprovechar la inercia del vehículo; circular en punto muerto cuesta abajo está desaconsejado porque se pierde el freno motor y el control del vehículo.',
    difficulty: 'medium',
    tags: ['seguridad vial', 'conducción eficiente'],
    sourceUrl: SRC_ECO,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  // --- 2026-09-01, ampliación del banco (Fase 1, bloque 4) -----------------
  // Condiciones meteorológicas adversas (hielo, nieve, viento) y conducción
  // nocturna: huecos verificados del análisis de cobertura. La pregunta
  // sobre luces largas (SEG-NOC-01) corrige deliberadamente un mito muy
  // repetido en blogs de autoescuela (una distancia fija de "150 metros"):
  // el articulado real (art. 102 RGC) no fija ninguna distancia, exige
  // cambiar a cruce "tan pronto como se aprecie la posibilidad" de
  // deslumbrar — confirmado citando el propio artículo, no un blog.
  q({
    id: 'SEG-MET-01',
    categoryId: 'seguridad-vial',
    subcategoryId: 'condiciones-meteorologicas',
    question: 'En un día frío y soleado, ¿dónde es más probable encontrar placas de hielo en la calzada, aunque el resto de la vía esté seca?',
    options: [
      'En zonas umbrías sin sol directo y sobre puentes',
      'En las zonas más anchas de la vía',
      'Únicamente en los tramos con más tráfico',
    ],
    correctAnswer: 0,
    explanation:
      'El sol de un día despejado puede transmitir una falsa sensación de seguridad: las zonas umbrías (sin radiación solar directa) y los puentes retienen el hielo con más facilidad que el resto de la calzada, precisamente porque no reciben ese calor.',
    difficulty: 'medium',
    tags: ['seguridad vial', 'meteorología', 'hielo'],
    sourceUrl: SRC_HIELO,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-MET-02',
    categoryId: 'seguridad-vial',
    subcategoryId: 'condiciones-meteorologicas',
    question: 'Si notas que las ruedas pierden adherencia sobre una placa de hielo, debes:',
    options: [
      'Levantar el pie del acelerador y no frenar hasta recuperar la adherencia',
      'Frenar con fuerza de inmediato para detener el vehículo cuanto antes',
      'Acelerar para atravesar la zona helada lo más rápido posible',
    ],
    correctAnswer: 0,
    explanation:
      'Frenar sobre hielo bloquea las ruedas y hace perder por completo el control direccional; lo correcto es levantar el pie del acelerador y esperar, sin frenar, a que el vehículo recupere la adherencia por sí mismo.',
    difficulty: 'medium',
    tags: ['seguridad vial', 'meteorología', 'hielo'],
    sourceUrl: SRC_HIELO,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-MET-03',
    categoryId: 'seguridad-vial',
    subcategoryId: 'condiciones-meteorologicas',
    question: 'Frenando sobre nieve, un neumático de invierno respecto a uno de verano necesita, según datos de la DGT:',
    options: [
      'Menos de la mitad de distancia para detener el vehículo',
      'Prácticamente la misma distancia: el tipo de neumático apenas influye en nieve',
      'El doble de distancia para detener el vehículo',
    ],
    correctAnswer: 0,
    explanation:
      'La DGT cita pruebas de frenada en nieve a 40 km/h en las que un neumático de invierno necesita unos 17,5 metros frente a los cerca de 44,7 metros de uno de verano: menos de la mitad de distancia para detenerse.',
    difficulty: 'hard',
    tags: ['seguridad vial', 'meteorología', 'nieve', 'neumáticos'],
    sourceUrl: SRC_HIELO,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-MET-04',
    categoryId: 'seguridad-vial',
    subcategoryId: 'condiciones-meteorologicas',
    question: 'El llamado "efecto pantalla" al conducir con viento fuerte se produce cuando:',
    options: [
      'Un vehículo grande, como un camión, bloquea el viento momentáneamente, y al superarlo la racha aparece de forma repentina',
      'El parabrisas se empaña por completo y deja de verse la vía',
      'El viento apaga los faros del vehículo',
    ],
    correctAnswer: 0,
    explanation:
      'Al adelantar o cruzarte con un vehículo grande, este actúa de pantalla frente al viento; en cuanto lo superas, la racha lateral aparece de golpe y puede desviar tu trayectoria si no sujetas el volante con firmeza.',
    difficulty: 'medium',
    tags: ['seguridad vial', 'meteorología', 'viento'],
    sourceUrl: SRC_VIENTO,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-MET-05',
    categoryId: 'seguridad-vial',
    subcategoryId: 'condiciones-meteorologicas',
    question: '¿Qué tramos son especialmente peligrosos por la acción del viento lateral?',
    options: [
      'Puentes, viaductos y salidas de túnel, al estar más expuestos y sin barreras naturales',
      'Las rotondas, por la forma circular de la vía',
      'Los tramos con más carriles por sentido',
    ],
    correctAnswer: 0,
    explanation:
      'Los puentes y viaductos están más expuestos al viento al no tener edificios ni vegetación que hagan de barrera, y las salidas de túnel generan un cambio brusco de intensidad del viento; ambos son puntos de especial riesgo.',
    difficulty: 'easy',
    tags: ['seguridad vial', 'meteorología', 'viento'],
    sourceUrl: SRC_VIENTO,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-MET-06',
    categoryId: 'seguridad-vial',
    subcategoryId: 'condiciones-meteorologicas',
    question: '¿Qué vehículos son más vulnerables al viento lateral fuerte?',
    options: [
      'Los que llevan baca, remolque o caravana, y los de carrocería más angulosa',
      'Los vehículos eléctricos, por su mayor peso',
      'Ninguno en particular: el viento afecta igual a todos los vehículos',
    ],
    correctAnswer: 0,
    explanation:
      'Una baca, un remolque o una caravana ofrecen más superficie lateral al viento y empeoran la aerodinámica; las carrocerías de líneas angulosas, además, son menos penetrantes que las aerodinámicas, por lo que sufren más el empuje lateral.',
    tags: ['seguridad vial', 'meteorología', 'viento'],
    sourceUrl: SRC_VIENTO,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-NOC-01',
    categoryId: 'seguridad-vial',
    subcategoryId: 'conduccion-nocturna',
    question: 'Al cruzarte de noche con otro vehículo, la normativa obliga a cambiar de luces largas a luces de cruce:',
    options: [
      'Tan pronto como exista la posibilidad de deslumbrar al otro conductor, sin que la norma fije una distancia concreta',
      'Solo cuando estéis a menos de 150 metros exactos el uno del otro',
      'Solo si el otro conductor te avisa primero con un cambio de luces',
    ],
    correctAnswer: 0,
    explanation:
      'A pesar de que circula la idea de una distancia fija (por ejemplo, "150 metros"), el Reglamento General de Circulación no establece ninguna cifra: exige cambiar a luces de cruce en cuanto se aprecie la posibilidad de deslumbrar a otro usuario, sea cual sea la distancia real.',
    difficulty: 'hard',
    tags: ['seguridad vial', 'conducción nocturna', 'luces'],
    sourceUrl: SRC_NOCHE,
    legalReference: 'Reglamento General de Circulación, artículo 102',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-NOC-02',
    categoryId: 'seguridad-vial',
    subcategoryId: 'conduccion-nocturna',
    question: 'Si te deslumbra de frente otro vehículo por la noche, lo más seguro es:',
    options: [
      'Dirigir la vista hacia la derecha y abajo, guiándote por la marca vial, sin mirar directamente a las luces',
      'Mirar fijamente a las luces contrarias para calcular mejor la distancia',
      'Apagar tus propias luces para no empeorar el deslumbramiento mutuo',
    ],
    correctAnswer: 0,
    explanation:
      'Mirar directamente a unos faros que deslumbran prolonga la pérdida de visión central; lo seguro es desviar la vista hacia la derecha y abajo, usando la marca vial como referencia para mantener la trayectoria hasta recuperar la visión.',
    difficulty: 'medium',
    tags: ['seguridad vial', 'conducción nocturna'],
    sourceUrl: SRC_NOCHE,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-NOC-03',
    categoryId: 'seguridad-vial',
    subcategoryId: 'conduccion-nocturna',
    question: 'Por la noche, la velocidad debe adaptarse de forma que permita:',
    options: [
      'Detener el vehículo dentro del tramo de calzada que iluminan tus propias luces',
      'Circular siempre al límite máximo señalizado, igual que de día',
      'Ir lo más despacio posible, sin relación con lo que ilumines',
    ],
    correctAnswer: 0,
    explanation:
      'De noche solo ves con claridad el tramo de vía que iluminan tus propias luces; la velocidad debe permitir detenerte dentro de ese espacio, ya que más allá no puedes anticipar obstáculos.',
    difficulty: 'easy',
    tags: ['seguridad vial', 'conducción nocturna'],
    sourceUrl: SRC_NOCHE,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'SEG-NOC-04',
    categoryId: 'seguridad-vial',
    subcategoryId: 'conduccion-nocturna',
    question: 'Según datos que cita la DGT, los accidentes nocturnos suponen aproximadamente el 29% del total, pero concentran:',
    options: [
      'En torno al 40% de los fallecidos en accidente de tráfico',
      'Menos del 5% de los fallecidos, al circular menos vehículos',
      'Exactamente el mismo porcentaje de fallecidos que de accidentes',
    ],
    correctAnswer: 0,
    explanation:
      'Pese a representar solo el 29% de los accidentes, los siniestros nocturnos concentran alrededor del 40% de los fallecidos, reflejo de su mayor gravedad media frente a los que ocurren de día.',
    difficulty: 'hard',
    tags: ['seguridad vial', 'conducción nocturna'],
    sourceUrl: SRC_NOCHE,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
];
