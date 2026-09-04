import { q } from './helpers';

const SRC = 'https://www.dgt.es/muevete-con-seguridad/conoce-las-normas-de-trafico/normativa-para-conductores/';
const SRC_SRI = 'https://www.dgt.es/muevete-con-seguridad/viaja-seguro/con-ninos/';
const SRC_AMBIENTAL = 'https://www.dgt.es/nuestros-servicios/tu-vehiculo/tus-vehiculos/distintivo-ambiental/';
const SRC_ADAS = 'https://www.dgt.es/muevete-con-seguridad/sistemas-avanzados-ayuda-conduccion/Sistemas-avanzados-de-ayuda-a-la-conduccion-ADAS-/';
const SRC_AGRICOLA = 'https://www.dgt.es/muevete-con-seguridad/viaja-seguro/tractor/';
const SRC_REMOLQUE = 'https://revista.dgt.es/es/reportajes/2017/07JULIO/Reportaje-remolques.shtml';
const RGC_BASE = 'https://www.boe.es/buscar/act.php?id=BOE-A-2003-23514';
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
    id: 'VEH-MAN-02',
    categoryId: 'vehiculo',
    subcategoryId: 'mantenimiento',
    question: '¿Quién es el responsable de mantener el vehículo en condiciones de seguridad para circular?',
    options: [
      'El conductor o titular del vehículo, en todo momento, no solo cuando toca pasar la ITV',
      'Únicamente el taller que hizo la última revisión',
      'Solo la ITV, que es quien certifica que el vehículo está en condiciones',
    ],
    correctAnswer: 0,
    explanation:
      'La ITV es una revisión periódica puntual, pero la obligación de mantener el vehículo en condiciones de seguridad (frenos, neumáticos, luces, etc.) recae en todo momento sobre su conductor o titular, no solo el día de la inspección.',
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
    id: 'VEH-SAC-02',
    categoryId: 'vehiculo',
    subcategoryId: 'seguridad-activa',
    question: 'El sistema ABS (antibloqueo de frenos) es un ejemplo de seguridad activa porque:',
    options: [
      'Evita que las ruedas se bloqueen al frenar, permitiendo seguir dirigiendo el vehículo mientras se frena',
      'Reduce las lesiones de los ocupantes una vez ya se ha producido la colisión',
      'Aumenta automáticamente la velocidad máxima permitida en la vía',
    ],
    correctAnswer: 0,
    explanation:
      'El ABS impide que las ruedas se bloqueen durante una frenada brusca, lo que permite mantener la capacidad de dirección y esquivar un obstáculo mientras se frena: ayuda a evitar el accidente, la definición misma de seguridad activa.',
    difficulty: 'medium',
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
  // --- 2026-09-01, ampliación del banco (Fase 1, bloque 6) -----------------
  // Distintivo ambiental, carga, visibilidad/lunas y ADAS: huecos
  // detectados comparando el índice temático (solo los títulos de los 38
  // temas oficiales, nunca preguntas) de un test público de terceros contra
  // nuestra propia cobertura — la respuesta y la normativa de cada
  // pregunta se verificaron después contra DGT/BOE, nunca contra ese test.
  q({
    id: 'VEH-AMB-01',
    categoryId: 'vehiculo',
    subcategoryId: 'distintivo-ambiental',
    question: '¿Qué distintivo ambiental de la DGT identifica a los vehículos sin ningún tipo de emisión (eléctricos de batería, de autonomía extendida o de pila de combustible)?',
    options: ['El distintivo 0', 'El distintivo ECO', 'El distintivo B'],
    correctAnswer: 0,
    explanation:
      'El distintivo 0 identifica a los vehículos más eficientes: eléctricos de batería, de autonomía extendida, híbridos enchufables con más de 40 km de autonomía y de pila de combustible; el ECO, en cambio, incluye híbridos e híbridos enchufables de menor autonomía, entre otros.',
    difficulty: 'easy',
    tags: ['vehículo', 'distintivo ambiental'],
    sourceUrl: SRC_AMBIENTAL,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-AMB-02',
    categoryId: 'vehiculo',
    subcategoryId: 'distintivo-ambiental',
    question: 'Los distintivos ambientales de la DGT (0, ECO, C, B) se utilizan principalmente para:',
    options: [
      'Regular el acceso a zonas de bajas emisiones y restringir la circulación en episodios de alta contaminación',
      'Calcular el importe del impuesto de circulación',
      'Determinar la velocidad máxima permitida a cada vehículo',
    ],
    correctAnswer: 0,
    explanation:
      'Los ayuntamientos usan los distintivos ambientales para regular el acceso a las zonas de bajas emisiones (ZBE) y para restringir la circulación de los vehículos más contaminantes durante episodios de alta contaminación.',
    tags: ['vehículo', 'distintivo ambiental'],
    sourceUrl: SRC_AMBIENTAL,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-AMB-03',
    categoryId: 'vehiculo',
    subcategoryId: 'distintivo-ambiental',
    question: 'Un vehículo de combustión antiguo que no cumple los requisitos mínimos de ninguna de las categorías (0, ECO, C, B):',
    options: [
      'No recibe ningún distintivo ambiental',
      'Recibe automáticamente el distintivo B, por defecto',
      'Recibe un distintivo especial de "vehículo histórico" que lo exime de restricciones',
    ],
    correctAnswer: 0,
    explanation:
      'Aproximadamente la mitad del parque de vehículos en España no cumple los requisitos mínimos de ninguna categoría y, por tanto, no recibe ningún distintivo ambiental, lo que lo hace especialmente vulnerable a las restricciones de las ZBE.',
    difficulty: 'medium',
    tags: ['vehículo', 'distintivo ambiental'],
    sourceUrl: SRC_AMBIENTAL,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-CAR-01',
    categoryId: 'vehiculo',
    subcategoryId: 'carga',
    question: 'La carga transportada en un vehículo debe ir dispuesta y sujeta de tal forma que:',
    options: [
      'No pueda arrastrar, caer total o parcialmente, ni desplazarse de forma peligrosa',
      'Ocupe el máximo espacio posible, sin más condiciones',
      'Solo necesite sujeción si supera los 100 kg',
    ],
    correctAnswer: 0,
    explanation:
      'La normativa exige que la carga y los elementos usados para acondicionarla o protegerla estén dispuestos y sujetos de forma que no puedan arrastrar, caer ni desplazarse peligrosamente durante la marcha, sea cual sea su peso.',
    difficulty: 'easy',
    tags: ['vehículo', 'carga'],
    sourceUrl: RGC_BASE,
    legalReference: 'Reglamento General de Circulación, artículo 14',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-CAR-02',
    categoryId: 'vehiculo',
    subcategoryId: 'carga',
    question: 'Como norma general, ¿puede la carga de un vehículo sobresalir de su proyección en planta (del contorno del propio vehículo)?',
    options: [
      'No, salvo en los casos y condiciones concretas que fija el reglamento, como ciertas cargas indivisibles de gran longitud',
      'Sí, sin ninguna restricción, siempre que esté bien sujeta',
      'Solo está permitido en motocicletas, nunca en turismos o furgonetas',
    ],
    correctAnswer: 0,
    explanation:
      'La regla general es que la carga no sobresalga del contorno del vehículo; solo se permite en supuestos concretos y con límites de longitud, por ejemplo en vehículos de mercancías que transporten cargas indivisibles largas como vigas o tubos.',
    difficulty: 'hard',
    tags: ['vehículo', 'carga'],
    sourceUrl: RGC_BASE,
    legalReference: 'Reglamento General de Circulación, artículo 15',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-VIS-01',
    categoryId: 'vehiculo',
    subcategoryId: 'visibilidad',
    question: '¿Está permitido tintar u oscurecer con láminas no homologadas de fábrica el parabrisas y las lunas delanteras (conductor y copiloto) de un turismo?',
    options: [
      'No: esas lunas deben mantener un nivel mínimo de transparencia para no comprometer la visibilidad',
      'Sí, sin ninguna restricción, igual que las lunas traseras',
      'Solo está prohibido de noche',
    ],
    correctAnswer: 0,
    explanation:
      'El parabrisas y las lunas delanteras deben mantener un nivel mínimo de transmisión de luz para garantizar una visibilidad adecuada; oscurecerlas con láminas no homologadas es un defecto que puede impedir superar la ITV.',
    difficulty: 'medium',
    tags: ['vehículo', 'visibilidad'],
    sourceUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-1999-1826',
    legalReference: 'Reglamento General de Vehículos (RD 2822/1998) y normativa de inspección técnica (ITV)',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-VIS-02',
    categoryId: 'vehiculo',
    subcategoryId: 'visibilidad',
    question: 'A diferencia del parabrisas y las lunas delanteras, las lunas traseras de un turismo:',
    options: [
      'Sí pueden tintarse con láminas, siempre que estén homologadas conforme a la normativa',
      'Nunca pueden tintarse, bajo ningún concepto',
      'Solo pueden tintarse si el vehículo es descapotable',
    ],
    correctAnswer: 0,
    explanation:
      'Las lunas traseras admiten un tintado mayor que las delanteras, siempre que las láminas empleadas estén homologadas conforme a la normativa, ya que la visibilidad crítica del conductor depende sobre todo del parabrisas y las lunas delanteras.',
    tags: ['vehículo', 'visibilidad'],
    sourceUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-1999-1826',
    legalReference: 'Reglamento General de Vehículos (RD 2822/1998) y normativa de inspección técnica (ITV)',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-ADA-01',
    categoryId: 'vehiculo',
    subcategoryId: 'adas',
    question: 'Desde julio de 2022, los vehículos de nueva homologación en España deben incorporar de serie al menos ocho sistemas ADAS, entre ellos:',
    options: [
      'Un inhibidor de arranque con alcoholímetro y un detector de somnolencia',
      'Un sistema de conducción totalmente autónoma',
      'Un limitador que impide superar nunca los 100 km/h',
    ],
    correctAnswer: 0,
    explanation:
      'Entre los ocho sistemas ADAS obligatorios en los vehículos de nueva homologación están el inhibidor de arranque con alcoholímetro y el detector de somnolencia (DDR), junto con otros como el asistente inteligente de velocidad o la alerta de uso del cinturón.',
    difficulty: 'medium',
    tags: ['vehículo', 'adas'],
    sourceUrl: SRC_ADAS,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-ADA-02',
    categoryId: 'vehiculo',
    subcategoryId: 'adas',
    question: 'Vas circulando y, al cambiar de carril sin haber puesto el intermitente, el vehículo emite un aviso. ¿Qué sistema ADAS ha actuado?',
    options: [
      'El LDW, alerta de cambio de carril involuntario',
      'El ISA, asistente inteligente de velocidad',
      'El RCTA, alerta de tráfico cruzado',
    ],
    correctAnswer: 0,
    explanation:
      'El LDW (Lane Departure Warning) detecta cuándo el vehículo abandona su carril sin que se haya activado el intermitente y avisa al conductor; el ISA regula la velocidad y el RCTA avisa de tráfico que cruza por detrás al hacer marcha atrás.',
    difficulty: 'hard',
    tags: ['vehículo', 'adas'],
    sourceUrl: SRC_ADAS,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-ADA-03',
    categoryId: 'vehiculo',
    subcategoryId: 'adas',
    question: 'Los sistemas ADAS de un vehículo actúan sobre:',
    options: [
      'El freno o el acelerador, la dirección o la señalización, con distinto grado de autonomía respecto al conductor',
      'Únicamente la climatización y el entretenimiento a bordo',
      'Solo el sistema de infoentretenimiento, nunca elementos mecánicos del vehículo',
    ],
    correctAnswer: 0,
    explanation:
      'Los ADAS son tecnologías que pueden intervenir en el frenado, la aceleración, la dirección o la señalización del vehículo, con distintos grados de autonomía respecto al conductor, para mejorar la seguridad propia y de otros usuarios de la vía.',
    tags: ['vehículo', 'adas'],
    sourceUrl: SRC_ADAS,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  // 2026-09-01, ampliación del banco (Fase 1, bloque 9): vehículos
  // especiales y maquinaria agrícola, hueco detectado en el índice
  // temático de un test público de terceros (solo títulos). Verificado
  // contra la página oficial "DGT - En tractor y vehículo agrícola".
  q({
    id: 'VEH-ESP-01',
    categoryId: 'vehiculo',
    subcategoryId: 'vehiculos-especiales',
    question: '¿Qué es, según la normativa, un "vehículo especial"?',
    options: [
      'Uno concebido para obras o servicios determinados, exceptuado de ciertas condiciones técnicas o que supera permanentemente los límites de masa o dimensiones, como la maquinaria agrícola',
      'Cualquier vehículo con más de 20 años de antigüedad',
      'Únicamente los vehículos de emergencia como ambulancias o bomberos',
    ],
    correctAnswer: 0,
    explanation:
      'Un vehículo especial es aquel concebido y construido para realizar obras o servicios determinados, que por ello está exceptuado de cumplir alguna condición técnica exigida con carácter general o supera permanentemente los límites de masa o dimensiones; la maquinaria agrícola se incluye expresamente en esta categoría.',
    difficulty: 'medium',
    tags: ['vehículo', 'vehículos especiales'],
    sourceUrl: SRC_AGRICOLA,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-ESP-02',
    categoryId: 'vehiculo',
    subcategoryId: 'vehiculos-especiales',
    question: 'Un tractor agrícola capaz de superar los 60 km/h en llano tiene, como máximo, una velocidad autorizada de:',
    options: ['70 km/h', '40 km/h', '90 km/h, igual que un turismo'],
    correctAnswer: 0,
    explanation:
      'Los vehículos agrícolas se dividen en varios grupos según su velocidad: 25 km/h los que no llevan señalización de frenado o van remolcados, 40 km/h el resto con carácter general, y 70 km/h como máximo los capaces de superar los 60 km/h en llano.',
    difficulty: 'hard',
    tags: ['vehículo', 'vehículos especiales'],
    sourceUrl: SRC_AGRICOLA,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-ESP-03',
    categoryId: 'vehiculo',
    subcategoryId: 'vehiculos-especiales',
    question: 'Los tractores y vehículos agrícolas que circulan a un máximo de 40 km/h deben llevar obligatoriamente:',
    options: [
      'Una luz rotativa amarilla (señal V-2)',
      'Una sirena, igual que un vehículo de emergencia',
      'Ninguna señalización adicional, basta con las luces de un turismo',
    ],
    correctAnswer: 0,
    explanation:
      'Los vehículos agrícolas que no superan los 40 km/h deben llevar una luz rotativa amarilla (señal V-2), que avisa al resto de usuarios de que se trata de un vehículo lento antes de acercarse a él.',
    tags: ['vehículo', 'vehículos especiales'],
    sourceUrl: SRC_AGRICOLA,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-ESP-04',
    categoryId: 'vehiculo',
    subcategoryId: 'vehiculos-especiales',
    question: 'Como norma general, ¿pueden los vehículos agrícolas circular por autopistas o autovías?',
    options: [
      'No, salvo que cuenten con una autorización especial',
      'Sí, sin ninguna restricción, igual que un turismo',
      'Solo si van remolcando otro vehículo',
    ],
    correctAnswer: 0,
    explanation:
      'Los vehículos agrícolas tienen prohibida, con carácter general, la entrada en autopistas y autovías; solo pueden hacerlo si disponen de una autorización especial para ese trayecto concreto.',
    difficulty: 'medium',
    tags: ['vehículo', 'vehículos especiales'],
    sourceUrl: SRC_AGRICOLA,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  // --- 2026-09-01, ampliación del banco (Fase 1, bloque 10) ----------------
  // Remolques y transporte de personas: huecos detectados en el índice
  // temático de un test público de terceros (solo títulos). Verificado
  // contra un reportaje oficial de la revista de la DGT, contrastado
  // además con RACE para el límite de velocidad — que resultó ser el
  // MISMO (90 km/h) para remolque ligero y pesado en autopista/autovía,
  // corrigiendo un dato que un resumen agregado había dado como distinto
  // (80 km/h para el pesado) sin que ninguna fuente primaria lo respaldara.
  q({
    id: 'VEH-REM-01',
    categoryId: 'vehiculo',
    subcategoryId: 'remolques',
    question: 'Un remolque se considera "ligero" cuando su masa máxima autorizada (MMA) no supera:',
    options: ['750 kg', '1.500 kg', '3.500 kg'],
    correctAnswer: 0,
    explanation:
      'Los remolques ligeros son aquellos con una MMA de hasta 750 kg; por encima de esa cifra se consideran remolques no ligeros, con requisitos administrativos distintos.',
    difficulty: 'easy',
    tags: ['vehículo', 'remolques'],
    sourceUrl: SRC_REMOLQUE,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-REM-02',
    categoryId: 'vehiculo',
    subcategoryId: 'remolques',
    question: 'En autopista o autovía, la velocidad máxima circulando con remolque es de:',
    options: [
      '90 km/h, la misma tanto para remolque ligero como para uno de mayor MMA',
      '90 km/h para el remolque ligero, pero solo 80 km/h para uno más pesado',
      '70 km/h en cualquier caso, por llevar remolque',
    ],
    correctAnswer: 0,
    explanation:
      'El límite de 90 km/h en autopista y autovía se aplica por igual a remolques ligeros y no ligeros; lo que cambia según el peso del remolque son los requisitos administrativos (matrícula, seguro propio), no la velocidad máxima permitida.',
    difficulty: 'hard',
    tags: ['vehículo', 'remolques'],
    sourceUrl: SRC_REMOLQUE,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-REM-03',
    categoryId: 'vehiculo',
    subcategoryId: 'remolques',
    question: 'A diferencia de un remolque ligero, uno con MMA superior a 750 kg:',
    options: [
      'Necesita permiso de circulación propio, matrícula específica y seguro obligatorio independiente',
      'No necesita ningún trámite adicional, basta con el seguro del vehículo tractor',
      'Solo puede circular de noche',
    ],
    correctAnswer: 0,
    explanation:
      'Un remolque de más de 750 kg de MMA deja de ser "ligero" y pasa a necesitar su propio permiso de circulación, matrícula específica y seguro obligatorio independiente del vehículo que lo arrastra.',
    tags: ['vehículo', 'remolques'],
    sourceUrl: SRC_REMOLQUE,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-REM-04',
    categoryId: 'vehiculo',
    subcategoryId: 'remolques',
    question: 'Para arrastrar con un turismo de hasta 3.500 kg un remolque de MMA superior a 750 kg, sin que el conjunto supere los 4.250 kg, el titular de un permiso B necesita:',
    options: [
      'Ampliar su permiso con la autorización B-96',
      'Nada más, el permiso B ya lo permite sin ningún trámite adicional',
      'Sacarse directamente el permiso C',
    ],
    correctAnswer: 0,
    explanation:
      'La autorización B-96 amplía el permiso B para poder arrastrar un remolque de MMA superior a 750 kg con un vehículo de hasta 3.500 kg, siempre que el conjunto no supere los 4.250 kg; por encima de esas cifras haría falta el permiso B+E.',
    difficulty: 'hard',
    tags: ['vehículo', 'remolques'],
    sourceUrl: SRC_REMOLQUE,
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-CAR-03',
    categoryId: 'vehiculo',
    subcategoryId: 'carga',
    question: 'El número de personas transportadas en un vehículo no puede superar:',
    options: [
      'El número de plazas autorizadas, sin superar tampoco la masa máxima autorizada del vehículo',
      'El número de plazas autorizadas, aunque se supere la masa máxima autorizada',
      'No hay límite si los ocupantes son menores de edad',
    ],
    correctAnswer: 0,
    explanation:
      'La normativa limita el transporte de personas al número de plazas autorizadas del vehículo, con el límite adicional de no poder superar en ningún caso la masa máxima autorizada, sea cual sea la edad de los ocupantes.',
    difficulty: 'medium',
    tags: ['vehículo', 'carga', 'ocupación'],
    sourceUrl: RGC_BASE,
    legalReference: 'Reglamento General de Circulación, artículo 9',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-CAR-04',
    categoryId: 'vehiculo',
    subcategoryId: 'carga',
    question: 'En un turismo homologado para 5 plazas (conductor y 4 pasajeros), circular con 7 o más personas en total:',
    options: [
      'Es una infracción grave, y además permite a los agentes inmovilizar el vehículo',
      'Es una infracción leve, igual que llevar 6 personas',
      'No tiene ninguna consecuencia si el trayecto es corto',
    ],
    correctAnswer: 0,
    explanation:
      'Superar en un 50% el número de plazas de pasajeros autorizadas (en un 5 plazas, viajar con 7 o más personas en total) se considera infracción grave y faculta a los agentes para inmovilizar el vehículo mientras se mantenga esa situación.',
    difficulty: 'hard',
    tags: ['vehículo', 'carga', 'ocupación'],
    sourceUrl: RGC_BASE,
    legalReference: 'Reglamento General de Circulación, artículo 9',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  // --- 2026-09-01, ampliación del banco (Fase 1, bloque 12) ----------------
  // Matrícula: hueco detectado en el índice temático de un test público de
  // terceros (solo títulos). Verificado contra el Reglamento General de
  // Vehículos (RD 2822/1998, Anexo XVIII) y contrastado el dato de la
  // exención de matrícula delantera en moto con dos fuentes independientes
  // tras encontrar una fuente inicial que lo afirmaba justo al revés.
  q({
    id: 'VEH-MAT-01',
    categoryId: 'vehiculo',
    subcategoryId: 'matricula',
    question: 'Como norma general, un turismo debe circular con:',
    options: [
      'Dos placas de matrícula homologadas, una delantera y otra trasera',
      'Solo la placa trasera; la delantera es opcional en cualquier vehículo',
      'Una única placa, colocada donde el propietario prefiera',
    ],
    correctAnswer: 0,
    explanation:
      'La normativa exige que los turismos lleven dos placas de matrícula homologadas, delantera y trasera; circular sin la placa delantera es una infracción grave.',
    difficulty: 'easy',
    tags: ['vehículo', 'matrícula'],
    sourceUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-1999-1826',
    legalReference: 'Reglamento General de Vehículos (RD 2822/1998), Anexo XVIII',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-MAT-02',
    categoryId: 'vehiculo',
    subcategoryId: 'matricula',
    question: 'A diferencia de un turismo, una motocicleta:',
    options: [
      'Está exenta de llevar matrícula delantera; solo necesita la trasera',
      'Necesita tres placas de matrícula en lugar de dos',
      'No necesita matrícula de ningún tipo',
    ],
    correctAnswer: 0,
    explanation:
      'Las motocicletas están exentas de la obligación general de llevar matrícula delantera: solo deben llevar la placa trasera, colocada en el plano longitudinal medio del vehículo, por encima del guardabarros posterior.',
    tags: ['vehículo', 'matrícula'],
    sourceUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-1999-1826',
    legalReference: 'Reglamento General de Vehículos (RD 2822/1998), artículo 49',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
  q({
    id: 'VEH-MAT-03',
    categoryId: 'vehiculo',
    subcategoryId: 'matricula',
    question: '¿Está permitido colocar adornos, marcos o pegatinas sobre la matrícula que dificulten su lectura?',
    options: [
      'No, la matrícula debe mantenerse legible y sin elementos que dificulten su identificación',
      'Sí, siempre que no la tapen por completo',
      'Sí, siempre que sea un adorno homologado por el fabricante del vehículo',
    ],
    correctAnswer: 0,
    explanation:
      'La normativa prohíbe fijar o pintar marcas, marcos o distintivos que por su forma, color o disposición dificulten la legibilidad de la matrícula o puedan inducir a confusión con sus caracteres.',
    difficulty: 'medium',
    tags: ['vehículo', 'matrícula'],
    sourceUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-1999-1826',
    legalReference: 'Reglamento General de Vehículos (RD 2822/1998), Anexo XVIII',
    verificationStatus: 'verified',
    lastVerifiedAt: VERIFIED_AT,
  }),
];
