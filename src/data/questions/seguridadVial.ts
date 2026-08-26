import { q } from './helpers';

const SRC = 'https://www.dgt.es/muevete-con-seguridad/evita-conductas-de-riesgo/';

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
  }),
];
