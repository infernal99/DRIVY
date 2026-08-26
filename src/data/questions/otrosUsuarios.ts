import { q } from './helpers';

const SRC = 'https://www.dgt.es/muevete-con-seguridad/conoce-las-normas-de-trafico/normativa-para-la-circulacion/';

export const otrosUsuariosQuestions = [
  q({
    id: 'OTR-PEA-01',
    categoryId: 'otros-usuarios',
    subcategoryId: 'peatones',
    question: 'En un paso de peatones sin semáforo, un peatón que ya ha iniciado el cruce tiene:',
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
  }),
  q({
    id: 'OTR-CIC-01',
    categoryId: 'otros-usuarios',
    subcategoryId: 'ciclistas',
    question: 'Al adelantar a un ciclista, un turismo debe dejar una separación lateral mínima de:',
    options: ['1,5 metros', '0,5 metros', 'No hay una distancia mínima regulada'],
    correctAnswer: 0,
    explanation:
      'La normativa exige respetar una distancia lateral mínima de 1,5 metros al adelantar a un ciclista, tanto dentro como fuera de poblado.',
    difficulty: 'medium',
    tags: ['otros usuarios', 'ciclistas'],
    sourceUrl: SRC,
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
  }),
];
