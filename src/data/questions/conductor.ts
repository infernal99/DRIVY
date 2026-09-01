import { q } from './helpers';

const SRC = 'https://www.dgt.es/nuestros-servicios/permisos-de-conducir/tus-puntos-y-tus-permisos/como-funciona-el-permiso-por-puntos/';
const DOC_SRC = 'https://www.dgt.es/nuestros-servicios/permisos-de-conducir/';
const VERIFIED_AT = '2026-09-01';

// --- 2026-09-01 audit pass (content-quality initiative, Fase 2) ---------
// Points-system numbers are exactly the kind of thing that can drift, so
// checked the specific figures rather than assuming: 12 puntos generales,
// 8 para noveles/recuperación, escalera de bonificación 12→14 (3 años sin
// perder puntos)→15 (otros 3 años) — all confirmed current against a DGT
// article from mid-2026 (revista.dgt.es/.../ppp-como-funciona). CON-PTO-04
// (6 puntos por sujetar el móvil) was already correctly stating the
// doubled 2026 penalty — no correction needed anywhere in this file.
export const conductorQuestions = [
  q({
    id: 'CON-DOC-01',
    categoryId: 'conductor',
    subcategoryId: 'documentacion',
    question: '¿Qué documentación debe llevar un conductor mientras circula?',
    options: [
      'El permiso de conducir en vigor; el resto de documentos del vehículo pueden consultarse por medios telemáticos',
      'Ningún documento es necesario si el coche está a su nombre',
      'Solo el DNI, no hace falta el permiso de conducir',
    ],
    correctAnswer: 0,
    explanation:
      'El conductor debe llevar consigo el permiso de conducir en vigor. La documentación del vehículo (ficha técnica, seguro) puede verificarse por los cuerpos policiales a través de las bases de datos, aunque es recomendable llevarla también.',
    difficulty: 'medium',
    tags: ['conductor', 'documentación'],
    sourceUrl: DOC_SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-DOC-02',
    categoryId: 'conductor',
    subcategoryId: 'documentacion',
    question: 'Circular sin el seguro obligatorio en vigor:',
    options: [
      'Es una infracción muy grave, además del riesgo económico ante un accidente',
      'Es solo una recomendación, no una obligación legal',
      'No tiene consecuencias si no ocurre ningún accidente',
    ],
    correctAnswer: 0,
    explanation:
      'Todo vehículo a motor debe contar con seguro obligatorio en vigor; circular sin él constituye una infracción muy grave y deja al conductor expuesto a responder personalmente de los daños causados.',
    tags: ['conductor', 'documentación', 'seguro'],
    sourceUrl: DOC_SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-PER-01',
    categoryId: 'conductor',
    subcategoryId: 'permiso-conducir',
    question: '¿A partir de qué edad se puede obtener el permiso de conducir clase B en España?',
    options: ['18 años', '16 años', '21 años'],
    correctAnswer: 0,
    explanation:
      'La normativa fija en 18 años la edad mínima para el permiso B, un umbral más alto que el de otros permisos (como el AM para ciclomotores, a partir de los 15) porque exige un mayor grado de madurez para circular con un vehículo de mayor masa y velocidad.',
    difficulty: 'easy',
    tags: ['conductor', 'permiso de conducir'],
    sourceUrl: DOC_SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-PER-02',
    categoryId: 'conductor',
    subcategoryId: 'permiso-conducir',
    question: 'Un conductor se considera "novel" durante:',
    options: [
      'Los 2 primeros años tras obtener el permiso',
      'El primer mes',
      'Los 5 primeros años',
    ],
    correctAnswer: 0,
    explanation:
      'Se considera conductor novel a quien lleva menos de 2 años desde la obtención del permiso; durante ese periodo se le aplican límites más estrictos, como la tasa de alcoholemia reducida.',
    tags: ['conductor', 'permiso de conducir', 'noveles'],
    sourceUrl: DOC_SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-PTO-01',
    categoryId: 'conductor',
    subcategoryId: 'puntos',
    question: 'Un conductor con experiencia (no novel) que obtiene el permiso por primera vez comienza con:',
    options: ['12 puntos', '8 puntos', '20 puntos'],
    correctAnswer: 0,
    explanation:
      'Con carácter general, el saldo inicial de puntos es de 12. Los conductores noveles, o quienes recuperan el permiso tras habérselo retirado, comienzan con 8 puntos.',
    difficulty: 'easy',
    tags: ['conductor', 'puntos'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-PTO-02',
    categoryId: 'conductor',
    subcategoryId: 'puntos',
    question: 'Los conductores noveles comienzan el permiso por puntos con:',
    options: ['8 puntos', '12 puntos', '4 puntos'],
    correctAnswer: 0,
    explanation:
      'Los conductores noveles, así como quienes recuperan el permiso tras una pérdida total de puntos, inician el sistema con 8 puntos en lugar de los 12 habituales.',
    tags: ['conductor', 'puntos', 'noveles'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-PTO-03',
    categoryId: 'conductor',
    subcategoryId: 'puntos',
    question: '¿Cuál es el número máximo de puntos que puede alcanzar un conductor con una conducción responsable prolongada?',
    options: ['15 puntos', '12 puntos', '20 puntos'],
    correctAnswer: 0,
    explanation:
      'El sistema premia la conducción sin infracciones: tras 3 años sin perder puntos se pueden alcanzar 14 puntos, y tras otros 3 años más, hasta un máximo de 15 puntos.',
    difficulty: 'hard',
    tags: ['conductor', 'puntos'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-PTO-04',
    categoryId: 'conductor',
    subcategoryId: 'puntos',
    question: 'Usar el teléfono móvil sujeto con la mano mientras se conduce conlleva actualmente la pérdida de:',
    options: ['6 puntos', '2 puntos', '1 punto'],
    correctAnswer: 0,
    explanation:
      'Tras la reforma del reglamento de circulación, sujetar y usar el teléfono móvil con la mano mientras se conduce supone la pérdida de 6 puntos del permiso, además de la sanción económica correspondiente.',
    difficulty: 'medium',
    tags: ['conductor', 'puntos', 'móvil'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-PTO-05',
    categoryId: 'conductor',
    subcategoryId: 'puntos',
    question: 'Si un conductor se queda a 0 puntos, ¿qué ocurre con su permiso?',
    options: [
      'Pierde la vigencia del permiso y debe recuperarlo realizando un curso y superando de nuevo las pruebas',
      'No pasa nada mientras no reincida',
      'Se le añaden automáticamente 4 puntos de cortesía',
    ],
    correctAnswer: 0,
    explanation:
      'Al perder la totalidad de los puntos, el permiso pierde su vigencia. Para recuperarlo es necesario realizar un curso de sensibilización y reeducación vial y, en general, superar de nuevo las pruebas correspondientes.',
    tags: ['conductor', 'puntos'],
    sourceUrl: SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-APT-01',
    categoryId: 'conductor',
    subcategoryId: 'aptitudes',
    question: 'Las aptitudes psicofísicas necesarias para conducir (vista, oído, reflejos) se comprueban:',
    options: [
      'En el centro de reconocimiento de conductores, al obtener y renovar el permiso',
      'Solo una vez, al sacar el carné por primera vez',
      'Nunca se comprueban de forma oficial',
    ],
    correctAnswer: 0,
    explanation:
      'Antes de obtener el permiso, y periódicamente al renovarlo, es obligatorio pasar un reconocimiento en un centro autorizado que evalúa la vista, el oído y otras aptitudes necesarias para conducir con seguridad.',
    difficulty: 'easy',
    tags: ['conductor', 'aptitudes'],
    sourceUrl: DOC_SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-APT-02',
    categoryId: 'conductor',
    subcategoryId: 'aptitudes',
    question: 'Un estado emocional alterado (ira, estrés intenso, tristeza profunda) puede:',
    options: [
      'Afectar a la capacidad de conducir con seguridad, igual que otros factores de riesgo',
      'No tiene ninguna influencia en la conducción',
      'Solo afecta si se conduce de noche',
    ],
    correctAnswer: 0,
    explanation:
      'Los estados emocionales intensos pueden alterar la capacidad de concentración, la percepción del riesgo y el autocontrol al volante, aumentando la probabilidad de cometer errores.',
    tags: ['conductor', 'aptitudes'],
    sourceUrl: DOC_SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-COM-01',
    categoryId: 'conductor',
    subcategoryId: 'comportamiento',
    question: 'La conducción defensiva se basa en:',
    options: [
      'Anticiparse a los posibles errores de otros usuarios de la vía y actuar con prudencia',
      'Circular siempre por el carril izquierdo',
      'Ir siempre al límite de velocidad permitido',
    ],
    correctAnswer: 0,
    explanation:
      'La conducción defensiva consiste en anticipar los posibles errores o imprudencias de otros usuarios y adaptar la propia conducción para reducir el riesgo, sin depender de que los demás actúen correctamente.',
    difficulty: 'easy',
    tags: ['conductor', 'comportamiento'],
    sourceUrl: DOC_SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-COM-02',
    categoryId: 'conductor',
    subcategoryId: 'comportamiento',
    question: 'Ante la actitud incorrecta de otro conductor (pitidos, adelantamientos bruscos), lo más seguro es:',
    options: [
      'Mantener la calma y no entrar en una escalada de tensión ("conducción agresiva")',
      'Responder de la misma manera para que aprenda',
      'Frenar bruscamente delante de él',
    ],
    correctAnswer: 0,
    explanation:
      'Responder con agresividad ante la provocación de otro conductor aumenta el riesgo para todos; lo más seguro es mantener la calma, ceder espacio si es necesario y evitar entrar en una dinámica de conducción agresiva.',
    tags: ['conductor', 'comportamiento'],
    sourceUrl: DOC_SRC,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
];
