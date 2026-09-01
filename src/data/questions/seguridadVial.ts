import { q } from './helpers';

const SRC = 'https://www.dgt.es/muevete-con-seguridad/evita-conductas-de-riesgo/';
const SRC_ACCIDENTE = 'https://www.dgt.es/muevete-con-seguridad/que-hacer-ante-un-accidente-de-trafico/';
const SRC_ECO = 'https://www.dgt.es/muevete-con-seguridad/conviertete-en-un-buen-conductor/consejos-generales/conduccion-eficiente/';
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
];
