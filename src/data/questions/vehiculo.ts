import { q } from './helpers';

const SRC = 'https://www.dgt.es/muevete-con-seguridad/conoce-las-normas-de-trafico/normativa-para-conductores/';
const SRC_SRI = 'https://www.dgt.es/muevete-con-seguridad/viaja-seguro/con-ninos/';
const VERIFIED_AT = '2026-09-01';

// --- 2026-09-01 audit pass (content-quality initiative, Fase 2) ---------
// Re-checked the one hard numeric/regulatory schedule in this file
// (VEH-ITV-01's 4 años / cada 2 años hasta 10 / anual después) against
// current sources citing RD 920/2017 — unchanged. The rest (1,6 mm de
// dibujo, ABS, alumbrado obligatorio, cinturón, seguridad activa/pasiva)
// are stable technical/legal facts not subject to recent reform; reviewed
// each for correctness and ambiguity. No corrections needed in this file.
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
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
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
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
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
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
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
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
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
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
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
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
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
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
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
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
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
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
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
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
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
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
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
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
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
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  // --- 2026-09-01, ampliación del banco (Fase 1, bloque 2) -----------------
  // Retención infantil: tema muy examinado y hasta ahora ausente del banco.
  // Verificado contra el art. 117 RGC (cinturones y SRI homologados) y la
  // página oficial "DGT - Con niños". NO se pregunta por la excepción de
  // taxi (135 cm sin SRI en tráfico urbano): el RD 518/2026, que entra en
  // vigor el 2026-10-01 (todavía no vigente hoy), reforma precisamente el
  // bloque de protección a usuarios vulnerables donde vive esa excepción, y
  // las fuentes consultadas no coinciden en si se mantiene igual — mejor
  // no preguntar que preguntar con una cifra a punto de cambiar. Revisar
  // este archivo después del 2026-10-01 para añadirla si procede.
  q({
    id: 'VEH-SRI-01',
    categoryId: 'vehiculo',
    subcategoryId: 'retencion-infantil',
    question: '¿Hasta qué altura es obligatorio el uso de un sistema de retención infantil (SRI) homologado en el coche?',
    options: ['135 cm', '150 cm', 'Hasta los 8 años, independientemente de la altura'],
    correctAnswer: 0,
    explanation:
      'La normativa fija el umbral en la altura del menor, no en su edad: hasta 135 cm es obligatorio un SRI homologado adaptado a su peso y talla; a partir de esa altura ya puede usarse el cinturón de seguridad directamente.',
    difficulty: 'easy',
    tags: ['vehículo', 'retención infantil'],
    sourceUrl: SRC_SRI,
    legalReference: 'Reglamento General de Circulación, artículo 117',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-SRI-02',
    categoryId: 'vehiculo',
    subcategoryId: 'retencion-infantil',
    question: 'Como norma general, ¿en qué asientos debe viajar un menor sujeto a la obligación de usar SRI?',
    options: [
      'En los asientos traseros, salvo alguna de las excepciones tasadas por la norma',
      'Siempre en el asiento delantero, para vigilarlo mejor',
      'Indistintamente delante o detrás, sin ninguna preferencia',
    ],
    correctAnswer: 0,
    explanation:
      'La norma general es que los menores viajen en los asientos traseros; solo pueden ir delante en casos excepcionales: que el vehículo no tenga asientos traseros, que ya estén todos ocupados por otros menores, o que no quepan allí todos los SRI necesarios.',
    difficulty: 'medium',
    tags: ['vehículo', 'retención infantil'],
    sourceUrl: SRC_SRI,
    legalReference: 'Reglamento General de Circulación, artículo 117',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-SRI-03',
    categoryId: 'vehiculo',
    subcategoryId: 'retencion-infantil',
    question: 'Si por alguna de las excepciones permitidas un SRI a contramarcha se instala en el asiento delantero, el airbag frontal de ese asiento debe estar:',
    options: [
      'Desconectado; nunca se instala una silla a contramarcha con el airbag frontal activo',
      'Activado siempre, para mayor protección',
      'Da igual, el airbag no afecta a los SRI',
    ],
    correctAnswer: 0,
    explanation:
      'Un airbag frontal se despliega con fuerza hacia el respaldo del asiento; con una silla a contramarcha, esa fuerza golpearía directamente al menor, por lo que la norma exige desconectar el airbag antes de instalar un SRI a contramarcha en esa plaza.',
    difficulty: 'hard',
    tags: ['vehículo', 'retención infantil', 'airbag'],
    sourceUrl: SRC_SRI,
    legalReference: 'Reglamento General de Circulación, artículo 117',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-SRI-04',
    categoryId: 'vehiculo',
    subcategoryId: 'retencion-infantil',
    question: 'La normativa i-Size (R129), frente a los grupos clásicos 0/0+/I/II/III, clasifica los sistemas de retención infantil principalmente según:',
    options: [
      'La altura del menor, en lugar de su peso',
      'El precio del sistema de retención',
      'La marca del vehículo en el que se instala',
    ],
    correctAnswer: 0,
    explanation:
      'Mientras los grupos clásicos (0, 0+, I, II/III) clasifican los SRI por el peso del menor, la normativa i-Size (reglamento UNECE R129) los clasifica por su altura, un criterio que se ajusta mejor a las proporciones reales del cuerpo infantil.',
    tags: ['vehículo', 'retención infantil'],
    sourceUrl: SRC_SRI,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-SRI-05',
    categoryId: 'vehiculo',
    subcategoryId: 'retencion-infantil',
    question: 'Un menor que ya ha superado los 135 cm y viaja con el cinturón de seguridad directamente, sin elevador:',
    options: [
      'Cumple la norma, aunque se recomienda seguir usando elevador hasta los 150 cm para que el cinturón ajuste mejor',
      'Incumple siempre la norma hasta los 18 años',
      'Solo puede hacerlo si viaja en el asiento delantero',
    ],
    correctAnswer: 0,
    explanation:
      'A partir de 135 cm ya no es obligatorio el SRI y puede usarse el cinturón directamente, pero la DGT recomienda mantener un elevador hasta los 150 cm, porque por debajo de esa altura el cinturón de adulto no suele ajustar correctamente sobre el cuerpo del menor.',
    difficulty: 'medium',
    tags: ['vehículo', 'retención infantil'],
    sourceUrl: SRC_SRI,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-SRI-06',
    categoryId: 'vehiculo',
    subcategoryId: 'retencion-infantil',
    question: 'Según datos que cita la propia DGT, el uso correcto de un sistema de retención infantil, en caso de accidente, puede evitar:',
    options: [
      'Hasta el 75% de las muertes infantiles y el 90% de las lesiones graves',
      'Solo golpes leves, no tiene impacto real en accidentes graves',
      'Únicamente lesiones en la cabeza, no en el resto del cuerpo',
    ],
    correctAnswer: 0,
    explanation:
      'La DGT cifra en un 75% la reducción de muertes infantiles y en un 90% la de lesiones graves cuando se usa correctamente un sistema de retención infantil adaptado al menor, frente a viajar sin él o mal sujeto.',
    difficulty: 'medium',
    tags: ['vehículo', 'retención infantil'],
    sourceUrl: SRC_SRI,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
];
