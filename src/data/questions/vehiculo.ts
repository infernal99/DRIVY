import { q } from './helpers';

const SRC = 'https://www.dgt.es/muevete-con-seguridad/conoce-las-normas-de-trafico/normativa-para-conductores/';

export const vehiculoQuestions = [
  q({
    id: 'VEH-NEU-01',
    categoryId: 'vehiculo',
    subcategoryId: 'neumaticos',
    question: 'La profundidad mínima legal del dibujo de un neumático es de:',
    options: ['1,6 mm', '1 cm', '5 mm'],
    correctAnswer: 0,
    explanation:
      'La normativa exige una profundidad mínima de dibujo de 1,6 mm en el neumático; por debajo de esa medida se pierde adherencia de forma peligrosa, especialmente en mojado.',
    difficulty: 'easy',
    tags: ['vehículo', 'neumáticos'],
    sourceUrl: SRC,
  }),
  q({
    id: 'VEH-NEU-02',
    categoryId: 'vehiculo',
    subcategoryId: 'neumaticos',
    question: 'Una presión de inflado inadecuada en los neumáticos provoca:',
    options: [
      'Peor adherencia, mayor desgaste irregular y más consumo de combustible',
      'Ningún efecto relevante en la conducción',
      'Solo un problema estético',
    ],
    correctAnswer: 0,
    explanation:
      'Circular con una presión de neumáticos incorrecta (por exceso o por defecto) empeora la adherencia y el comportamiento del vehículo, provoca un desgaste irregular y aumenta el consumo de combustible.',
    difficulty: 'easy',
    tags: ['vehículo', 'neumáticos'],
    sourceUrl: SRC,
  }),
  q({
    id: 'VEH-NEU-03',
    categoryId: 'vehiculo',
    subcategoryId: 'neumaticos',
    question: 'Los neumáticos de un mismo eje deben tener:',
    options: [
      'El mismo dibujo y una profundidad similar',
      'Marcas y modelos distintos para mayor tracción',
      'No importa que sean diferentes tamaños',
    ],
    correctAnswer: 0,
    explanation:
      'Por seguridad, los dos neumáticos de un mismo eje deben ser del mismo tipo y con un desgaste similar, para no comprometer la estabilidad del vehículo, especialmente al frenar.',
    tags: ['vehículo', 'neumáticos'],
    sourceUrl: SRC,
  }),
  q({
    id: 'VEH-FRE-01',
    categoryId: 'vehiculo',
    subcategoryId: 'frenos',
    question: 'El sistema ABS de frenado tiene como función principal:',
    options: [
      'Evitar el bloqueo de las ruedas al frenar, manteniendo la capacidad de dirección',
      'Aumentar la velocidad máxima del vehículo',
      'Reducir el consumo de combustible',
    ],
    correctAnswer: 0,
    explanation:
      'El ABS (sistema antibloqueo de frenos) evita que las ruedas se bloqueen durante una frenada brusca, lo que permite seguir controlando la dirección del vehículo mientras se frena.',
    difficulty: 'easy',
    tags: ['vehículo', 'frenos', 'ABS'],
    sourceUrl: SRC,
  }),
  q({
    id: 'VEH-FRE-02',
    categoryId: 'vehiculo',
    subcategoryId: 'frenos',
    question: 'Si notas que el pedal de freno "se hunde" más de lo normal, es un indicio de:',
    options: [
      'Posible avería en el sistema de frenos que requiere revisión inmediata',
      'Que el motor necesita más aceite',
      'Un problema sin importancia',
    ],
    correctAnswer: 0,
    explanation:
      'Un pedal de freno blando o que se hunde en exceso puede indicar aire en el circuito hidráulico, fuga de líquido de frenos u otra avería grave; debe revisarse de inmediato antes de seguir circulando.',
    tags: ['vehículo', 'frenos'],
    sourceUrl: SRC,
  }),
  q({
    id: 'VEH-ALU-01',
    categoryId: 'vehiculo',
    subcategoryId: 'alumbrado',
    question: '¿Cuándo es obligatorio usar el alumbrado del vehículo?',
    options: [
      'Entre el ocaso y la orto, y siempre que la visibilidad sea insuficiente (túneles, niebla, lluvia intensa)',
      'Solo de noche en carretera, nunca en ciudad',
      'Solo cuando lo indique un agente',
    ],
    correctAnswer: 0,
    explanation:
      'El alumbrado es obligatorio durante la noche (entre el ocaso y la orto) y en cualquier momento en que la visibilidad sea insuficiente, como en túneles, con niebla densa o lluvia intensa.',
    difficulty: 'easy',
    tags: ['vehículo', 'alumbrado'],
    sourceUrl: SRC,
  }),
  q({
    id: 'VEH-ALU-02',
    categoryId: 'vehiculo',
    subcategoryId: 'alumbrado',
    question: 'Las luces antiniebla traseras deben usarse:',
    options: [
      'Solo cuando la visibilidad sea muy reducida por niebla, nieve o lluvia intensa',
      'Siempre que se circule de noche',
      'De forma permanente en autopista',
    ],
    correctAnswer: 0,
    explanation:
      'Las luces antiniebla, especialmente las traseras, deben reservarse para situaciones de visibilidad muy reducida, ya que su uso continuo puede deslumbrar y confundir a quien circula detrás.',
    tags: ['vehículo', 'alumbrado'],
    sourceUrl: SRC,
  }),
  q({
    id: 'VEH-ITV-01',
    categoryId: 'vehiculo',
    subcategoryId: 'itv',
    question: 'Un turismo nuevo debe pasar su primera Inspección Técnica de Vehículos (ITV) a los:',
    options: ['4 años', '1 año', '10 años'],
    correctAnswer: 0,
    explanation:
      'Con carácter general, un turismo pasa su primera ITV a los 4 años desde su matriculación; después, cada 2 años hasta los 10 años de antigüedad, y anualmente a partir de entonces.',
    difficulty: 'easy',
    tags: ['vehículo', 'ITV'],
    sourceUrl: SRC,
  }),
  q({
    id: 'VEH-ITV-02',
    categoryId: 'vehiculo',
    subcategoryId: 'itv',
    question: 'Circular con la ITV caducada supone:',
    options: [
      'Una infracción sancionable, y el vehículo puede ser inmovilizado',
      'Ninguna consecuencia si el coche está en buen estado',
      'Solo un aviso verbal la primera vez',
    ],
    correctAnswer: 0,
    explanation:
      'Circular con la ITV caducada es una infracción de tráfico; además, un agente puede inmovilizar el vehículo si aprecia que su estado supone un riesgo para la circulación.',
    tags: ['vehículo', 'ITV'],
    sourceUrl: SRC,
  }),
  q({
    id: 'VEH-MAN-01',
    categoryId: 'vehiculo',
    subcategoryId: 'mantenimiento',
    question: 'Un mantenimiento preventivo adecuado del vehículo contribuye a:',
    options: [
      'Reducir el riesgo de averías y accidentes derivados de fallos mecánicos',
      'No tiene relación con la seguridad vial',
      'Aumentar la velocidad máxima autorizada',
    ],
    correctAnswer: 0,
    explanation:
      'Revisar periódicamente niveles de líquidos, frenos, neumáticos y luces reduce significativamente la probabilidad de sufrir una avería o un accidente por fallo mecánico.',
    difficulty: 'easy',
    tags: ['vehículo', 'mantenimiento'],
    sourceUrl: SRC,
  }),
  q({
    id: 'VEH-SAC-01',
    categoryId: 'vehiculo',
    subcategoryId: 'seguridad-activa',
    question: '¿Qué son los elementos de "seguridad activa" de un vehículo?',
    options: [
      'Los que ayudan a evitar el accidente, como los frenos, el ABS o el control de estabilidad',
      'Los que solo actúan una vez ya se ha producido el accidente',
      'Los adornos y accesorios estéticos',
    ],
    correctAnswer: 0,
    explanation:
      'La seguridad activa engloba los elementos que ayudan a evitar que se produzca el accidente: frenos, ABS, control de estabilidad, neumáticos, dirección, etc.',
    difficulty: 'easy',
    tags: ['vehículo', 'seguridad activa'],
    sourceUrl: SRC,
  }),
  q({
    id: 'VEH-SPA-01',
    categoryId: 'vehiculo',
    subcategoryId: 'seguridad-pasiva',
    question: '¿Qué son los elementos de "seguridad pasiva"?',
    options: [
      'Los que reducen las consecuencias del accidente una vez que se ha producido, como el airbag o el cinturón',
      'Los que impiden que el vehículo arranque',
      'Los que mejoran el consumo de combustible',
    ],
    correctAnswer: 0,
    explanation:
      'La seguridad pasiva incluye elementos como el cinturón de seguridad, el airbag, los reposacabezas o la carrocería deformable, diseñados para minimizar las lesiones cuando el accidente ya es inevitable.',
    difficulty: 'easy',
    tags: ['vehículo', 'seguridad pasiva'],
    sourceUrl: SRC,
  }),
  q({
    id: 'VEH-SPA-02',
    categoryId: 'vehiculo',
    subcategoryId: 'seguridad-pasiva',
    question: 'El uso del cinturón de seguridad es obligatorio:',
    options: [
      'Para todos los ocupantes, en todas las plazas que dispongan de él',
      'Solo para el conductor',
      'Solo en carretera, no en ciudad',
    ],
    correctAnswer: 0,
    explanation:
      'El cinturón de seguridad es obligatorio para el conductor y todos los pasajeros, en cualquier plaza que esté equipada con él, tanto en ciudad como en carretera.',
    difficulty: 'easy',
    tags: ['vehículo', 'cinturón'],
    sourceUrl: SRC,
  }),
];
