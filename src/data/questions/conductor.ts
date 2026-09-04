import { q } from './helpers';

const SRC = 'https://www.dgt.es/nuestros-servicios/permisos-de-conducir/tus-puntos-y-tus-permisos/como-funciona-el-permiso-por-puntos/';
const DOC_SRC = 'https://www.dgt.es/nuestros-servicios/permisos-de-conducir/';
const LEY_TRAFICO = 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11722';
const SRC_65 = 'https://www.dgt.es/nuestros-servicios/permisos-de-conducir/permiso-de-conducir-para-mayores-de-65-anos/';
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
  // 2026-09-01, ampliación del banco (Fase 1, bloque 7): vigencia del
  // permiso de conducir según la edad, hueco detectado comparando el
  // índice temático de un test público de terceros (solo títulos de tema)
  // contra nuestra cobertura. Verificado contra la página oficial "DGT -
  // Permiso de conducir para mayores de 65 años".
  q({
    id: 'CON-DOC-03',
    categoryId: 'conductor',
    subcategoryId: 'documentacion',
    question: 'Con carácter general, y hasta los 65 años, ¿cada cuánto tiempo hay que renovar el permiso de conducir clase B?',
    options: ['Cada 10 años', 'Cada 5 años', 'Cada 15 años'],
    correctAnswer: 0,
    explanation:
      'Hasta los 65 años, el permiso de conducir clase B tiene una vigencia general de 10 años, tras los cuales debe renovarse superando el reconocimiento médico correspondiente.',
    difficulty: 'easy',
    tags: ['conductor', 'documentación', 'vigencia'],
    sourceUrl: SRC_65,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-DOC-04',
    categoryId: 'conductor',
    subcategoryId: 'documentacion',
    question: 'A partir de los 65 años, la vigencia del permiso de conducir clase B se reduce a:',
    options: ['5 años', '10 años, igual que antes', '2 años'],
    correctAnswer: 0,
    explanation:
      'Para asegurar que se mantiene intacta la capacidad de conducir, a partir de los 65 años el permiso clase B (y otros permisos generales) pasa a renovarse cada 5 años, en lugar de cada 10.',
    difficulty: 'medium',
    tags: ['conductor', 'documentación', 'vigencia'],
    sourceUrl: SRC_65,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-DOC-05',
    categoryId: 'conductor',
    subcategoryId: 'documentacion',
    question: '¿Existe en España una edad máxima a partir de la cual ya no se puede conducir?',
    options: [
      'No, no existe límite de edad; lo que cambia con la edad es la frecuencia de las revisiones médicas',
      'Sí, a partir de los 80 años se retira el permiso automáticamente',
      'Sí, a partir de los 70 años solo se puede conducir en vías urbanas',
    ],
    correctAnswer: 0,
    explanation:
      'En España no existe un límite de edad para seguir conduciendo; el reconocimiento médico y los criterios que evalúa son los mismos a cualquier edad, aunque la frecuencia de esas revisiones aumenta según se cumplen años.',
    difficulty: 'medium',
    tags: ['conductor', 'documentación', 'vigencia'],
    sourceUrl: SRC_65,
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
  // 2026-09-01, ampliación del banco (Fase 1, bloque 6): inmovilización del
  // vehículo por agentes de la autoridad — hueco detectado comparando el
  // índice temático de un test público de terceros (solo títulos de tema)
  // contra nuestra cobertura. Verificado contra el art. 104 de la Ley de
  // Tráfico (RDL 6/2015), que lista los supuestos tasados de inmovilización.
  q({
    id: 'CON-INM-01',
    categoryId: 'conductor',
    subcategoryId: 'inmovilizacion',
    question: 'Si dan positivo en un control de alcoholemia, los agentes de la autoridad pueden:',
    options: [
      'Inmovilizar el vehículo de inmediato, salvo que otra persona autorizada pueda hacerse cargo de la conducción',
      'Solo pueden multar, nunca inmovilizar el vehículo en el momento',
      'Únicamente pueden retirar el permiso de conducir, no inmovilizar el vehículo',
    ],
    correctAnswer: 0,
    explanation:
      'Un resultado positivo en alcoholemia (o la negativa a hacer la prueba) es una de las causas legales de inmovilización inmediata del vehículo, que solo se evita si otra persona debidamente autorizada puede asumir la conducción.',
    difficulty: 'medium',
    tags: ['conductor', 'inmovilización'],
    sourceUrl: LEY_TRAFICO,
    legalReference: 'Real Decreto Legislativo 6/2015 (Ley de Tráfico), artículo 104',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-INM-02',
    categoryId: 'conductor',
    subcategoryId: 'inmovilizacion',
    question: 'Un vehículo que circula sin el seguro obligatorio en vigor:',
    options: [
      'Puede ser inmovilizado por los agentes, al ser una de las causas legales previstas',
      'Solo puede ser multado; la falta de seguro nunca es causa de inmovilización',
      'Solo se sanciona si además ha tenido un accidente',
    ],
    correctAnswer: 0,
    explanation:
      'La carencia del seguro obligatorio es, por sí sola, una de las causas legales que permite a los agentes inmovilizar el vehículo, sin necesidad de que se haya producido ningún accidente.',
    difficulty: 'medium',
    tags: ['conductor', 'inmovilización'],
    sourceUrl: LEY_TRAFICO,
    legalReference: 'Real Decreto Legislativo 6/2015 (Ley de Tráfico), artículo 104',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'CON-INM-03',
    categoryId: 'conductor',
    subcategoryId: 'inmovilizacion',
    question: '¿Puede un agente inmovilizar un vehículo por presentar deficiencias que supongan un riesgo especialmente grave para la seguridad vial?',
    options: [
      'Sí, es una de las causas legales previstas para la inmovilización',
      'No, las deficiencias mecánicas solo pueden dar lugar a un suspenso en la ITV, nunca a una inmovilización inmediata',
      'Solo si el vehículo tiene más de 10 años de antigüedad',
    ],
    correctAnswer: 0,
    explanation:
      'Cuando un vehículo presenta deficiencias que constituyen un riesgo especialmente grave para la seguridad vial, los agentes están facultados para inmovilizarlo en el acto, sin esperar a una revisión posterior en la ITV.',
    difficulty: 'hard',
    tags: ['conductor', 'inmovilización'],
    sourceUrl: LEY_TRAFICO,
    legalReference: 'Real Decreto Legislativo 6/2015 (Ley de Tráfico), artículo 104',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
];
