import { q } from './helpers';

const SRC = 'https://www.dgt.es/muevete-con-seguridad/evita-conductas-de-riesgo/consumo-de-alcohol/';

export const alcoholDrogasQuestions = [
  q({
    id: 'ALC-TAS-01',
    categoryId: 'alcohol-drogas',
    subcategoryId: 'alcoholemia',
    question: 'La tasa máxima de alcohol permitida para un conductor general en España es de:',
    options: [
      '0,5 g/l en sangre o 0,25 mg/l en aire espirado',
      '0,8 g/l en sangre o 0,40 mg/l en aire espirado',
      '0,2 g/l en sangre en cualquier caso',
    ],
    correctAnswer: 0,
    explanation:
      'Con carácter general, la tasa máxima permitida es de 0,5 gramos de alcohol por litro de sangre, equivalente a 0,25 miligramos por litro de aire espirado.',
    difficulty: 'easy',
    tags: ['alcohol', 'alcoholemia'],
    sourceUrl: SRC,
  }),
  q({
    id: 'ALC-TAS-02',
    categoryId: 'alcohol-drogas',
    subcategoryId: 'alcoholemia',
    question: 'Para conductores noveles (menos de 2 años de carné) y profesionales, la tasa máxima permitida es:',
    options: [
      '0,3 g/l en sangre o 0,15 mg/l en aire espirado',
      '0,5 g/l en sangre, igual que el resto',
      '0,0 g/l en sangre siempre',
    ],
    correctAnswer: 0,
    explanation:
      'Los conductores noveles (menos de dos años de experiencia) y los profesionales tienen un límite más restrictivo: 0,3 g/l en sangre o 0,15 mg/l en aire espirado.',
    difficulty: 'medium',
    tags: ['alcohol', 'alcoholemia', 'noveles'],
    sourceUrl: SRC,
  }),
  q({
    id: 'ALC-TAS-03',
    categoryId: 'alcohol-drogas',
    subcategoryId: 'alcoholemia',
    question: '¿Puede la autoridad someter a una prueba de alcoholemia a cualquier conductor, sin necesidad de haber cometido una infracción?',
    options: [
      'Sí, los agentes pueden someter a controles preventivos aleatorios',
      'No, solo tras un accidente',
      'No, hace falta una orden judicial previa',
    ],
    correctAnswer: 0,
    explanation:
      'Los agentes de tráfico pueden someter a cualquier usuario de la vía a las pruebas para la detección de alcohol como medida preventiva, sin necesidad de que exista un accidente o una infracción previa.',
    tags: ['alcohol', 'alcoholemia'],
    sourceUrl: SRC,
  }),
  q({
    id: 'ALC-EFE-01',
    categoryId: 'alcohol-drogas',
    subcategoryId: 'efectos-alcohol',
    question: '¿Cómo afecta el alcohol a la conducción incluso en cantidades bajas?',
    options: [
      'Reduce el campo visual, aumenta el tiempo de reacción y da una falsa sensación de seguridad',
      'No produce ningún efecto por debajo del límite legal',
      'Solo afecta a la capacidad de hablar, no a la conducción',
    ],
    correctAnswer: 0,
    explanation:
      'Incluso con tasas bajas, el alcohol reduce el campo visual, ralentiza los reflejos, empeora la coordinación y provoca una sensación de seguridad excesiva que lleva a asumir más riesgos.',
    difficulty: 'easy',
    tags: ['alcohol', 'efectos'],
    sourceUrl: SRC,
  }),
  q({
    id: 'ALC-EFE-02',
    categoryId: 'alcohol-drogas',
    subcategoryId: 'efectos-alcohol',
    question: 'El alcohol se elimina del organismo principalmente:',
    options: [
      'Con el tiempo, mediante el metabolismo del hígado; el café o una ducha fría no lo aceleran',
      'Tomando café cargado',
      'Con una ducha fría o haciendo ejercicio intenso',
    ],
    correctAnswer: 0,
    explanation:
      'El hígado metaboliza el alcohol a un ritmo aproximadamente constante; ni el café, ni el ejercicio, ni una ducha fría aceleran ese proceso, solo hacen sentir "más despierto" sin reducir la tasa real.',
    tags: ['alcohol', 'efectos'],
    sourceUrl: SRC,
  }),
  q({
    id: 'ALC-DRO-01',
    categoryId: 'alcohol-drogas',
    subcategoryId: 'drogas',
    question: 'Respecto al consumo de drogas y la conducción, la ley española establece:',
    options: [
      'Tolerancia cero: está prohibido conducir con presencia de determinadas drogas en el organismo',
      'Se permite un nivel bajo, similar al del alcohol',
      'Solo se sanciona si se produce un accidente',
    ],
    correctAnswer: 0,
    explanation:
      'A diferencia del alcohol, para las drogas la normativa aplica un criterio de tolerancia cero: basta con detectar presencia de sustancias en el organismo mediante los test correspondientes para sancionar.',
    difficulty: 'easy',
    tags: ['drogas'],
    sourceUrl: SRC,
  }),
  q({
    id: 'ALC-DRO-02',
    categoryId: 'alcohol-drogas',
    subcategoryId: 'drogas',
    question: 'El consumo combinado de alcohol y otras drogas:',
    options: [
      'Multiplica los efectos negativos sobre la capacidad de conducir',
      'Neutraliza los efectos de ambas sustancias',
      'Solo afecta si se combina con medicamentos',
    ],
    correctAnswer: 0,
    explanation:
      'Combinar alcohol con otras drogas no anula sus efectos, sino que habitualmente los potencia, incrementando de forma notable el deterioro de las capacidades necesarias para conducir con seguridad.',
    tags: ['drogas', 'alcohol'],
    sourceUrl: SRC,
  }),
  q({
    id: 'ALC-MED-01',
    categoryId: 'alcohol-drogas',
    subcategoryId: 'medicamentos',
    question: 'Antes de conducir tras tomar un medicamento nuevo debes:',
    options: [
      'Comprobar el prospecto y el pictograma de advertencia sobre la conducción',
      'No es necesario comprobar nada si te lo ha recetado el médico',
      'Solo hay que tener cuidado con los medicamentos inyectables',
    ],
    correctAnswer: 0,
    explanation:
      'Muchos medicamentos —incluidos algunos de uso común, como ciertos antihistamínicos o ansiolíticos— llevan un pictograma de advertencia que indica que pueden afectar a la capacidad de conducir; conviene revisar el prospecto antes de ponerse al volante.',
    difficulty: 'easy',
    tags: ['medicamentos'],
    sourceUrl: SRC,
  }),
  q({
    id: 'ALC-MED-02',
    categoryId: 'alcohol-drogas',
    subcategoryId: 'medicamentos',
    question: '¿Qué tipo de medicamentos pueden afectar más frecuentemente a la conducción?',
    options: [
      'Ansiolíticos, antihistamínicos sedantes y algunos analgésicos con efecto depresor del sistema nervioso',
      'Los complejos vitamínicos',
      'Los antiácidos para el estómago',
    ],
    correctAnswer: 0,
    explanation:
      'Fármacos como los ansiolíticos, ciertos antihistamínicos con efecto sedante o algunos analgésicos pueden provocar somnolencia o reducir los reflejos, afectando a la seguridad al volante.',
    tags: ['medicamentos'],
    sourceUrl: SRC,
  }),
  q({
    id: 'ALC-TRE-01',
    categoryId: 'alcohol-drogas',
    subcategoryId: 'tiempos-reaccion',
    question: 'El tiempo de reacción medio de un conductor ante un imprevisto suele estimarse en torno a:',
    options: [
      'Entre 0,75 y 1,5 segundos en condiciones normales',
      '5 segundos como mínimo',
      '0 segundos si se está atento',
    ],
    correctAnswer: 0,
    explanation:
      'En condiciones normales, el tiempo de reacción de un conductor —desde que percibe el peligro hasta que actúa sobre los mandos— se sitúa habitualmente entre 0,75 y 1,5 segundos.',
    tags: ['tiempos de reacción'],
    sourceUrl: SRC,
  }),
  q({
    id: 'ALC-TRE-02',
    categoryId: 'alcohol-drogas',
    subcategoryId: 'tiempos-reaccion',
    question: 'El alcohol, el sueño y el uso del móvil tienen en común que:',
    options: [
      'Aumentan el tiempo de reacción ante un imprevisto',
      'Reducen el tiempo de reacción',
      'No afectan al tiempo de reacción, solo a la visión',
    ],
    correctAnswer: 0,
    explanation:
      'Tanto el consumo de alcohol como la fatiga o el uso del teléfono móvil alargan el tiempo que tarda el conductor en percibir y reaccionar ante un peligro, aumentando la distancia total necesaria para detenerse.',
    tags: ['tiempos de reacción'],
    sourceUrl: SRC,
  }),
];
