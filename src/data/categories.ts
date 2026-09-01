import type { Category } from '../types';

// Category structure follows the syllabus breakdown used to prepare the
// Spanish permiso B theory exam. Content itself lives in src/data/questions/*
// and is grounded in DGT sources — see src/data/sources.ts.
export const CATEGORIES: Category[] = [
  {
    id: 'senales',
    name: 'Señales',
    emoji: '🚦',
    icon: 'sign',
    description: 'Aprende a reconocer las señales y qué significa cada una.',
    subcategories: [
      { id: 'senales-peligro', name: 'Señales de peligro' },
      { id: 'senales-prioridad', name: 'Señales de prioridad' },
      { id: 'senales-prohibicion', name: 'Señales de prohibición' },
      { id: 'senales-obligacion', name: 'Señales de obligación' },
      { id: 'senales-indicacion', name: 'Señales de indicación' },
      { id: 'senales-circunstancial', name: 'Señalización circunstancial' },
      { id: 'marcas-viales', name: 'Marcas viales' },
      { id: 'semaforos', name: 'Semáforos' },
      { id: 'senales-agentes', name: 'Señales de agentes' },
    ],
  },
  {
    id: 'normas',
    name: 'Normas de circulación',
    emoji: '🚗',
    icon: 'rules',
    description: 'Prioridad, adelantamientos, cambios de dirección y más.',
    subcategories: [
      { id: 'prioridad', name: 'Prioridad' },
      { id: 'adelantamientos', name: 'Adelantamientos' },
      { id: 'cambios-direccion', name: 'Cambios de dirección' },
      { id: 'cambios-sentido', name: 'Cambios de sentido' },
      { id: 'incorporaciones', name: 'Incorporaciones' },
      { id: 'paradas', name: 'Paradas' },
      { id: 'estacionamiento-normas', name: 'Estacionamiento' },
      { id: 'circulacion-vias', name: 'Circulación en vías' },
    ],
  },
  {
    id: 'vias',
    name: 'Vías',
    emoji: '🛣️',
    icon: 'road',
    description: 'Autopistas, autovías, carreteras y vías urbanas.',
    subcategories: [
      { id: 'autopistas', name: 'Autopistas' },
      { id: 'autovias', name: 'Autovías' },
      { id: 'carreteras-convencionales', name: 'Carreteras convencionales' },
      { id: 'vias-urbanas', name: 'Vías urbanas' },
      { id: 'carriles', name: 'Carriles' },
      { id: 'arcenes', name: 'Arcenes' },
    ],
  },
  {
    id: 'seguridad-vial',
    name: 'Seguridad vial',
    emoji: '⚠️',
    icon: 'shield',
    description: 'Distancia de seguridad, velocidad, frenado y riesgos.',
    subcategories: [
      { id: 'distancia-seguridad', name: 'Distancia de seguridad' },
      { id: 'velocidad', name: 'Velocidad' },
      { id: 'frenado', name: 'Frenado' },
      { id: 'riesgos', name: 'Riesgos' },
      { id: 'fatiga', name: 'Fatiga' },
      { id: 'somnolencia', name: 'Somnolencia' },
      { id: 'distracciones', name: 'Distracciones' },
      { id: 'telefono-movil', name: 'Teléfono móvil' },
      { id: 'primeros-auxilios', name: 'Primeros auxilios' },
      { id: 'conduccion-eficiente', name: 'Conducción eficiente' },
    ],
  },
  {
    id: 'alcohol-drogas',
    name: 'Alcohol y drogas',
    emoji: '🍺',
    icon: 'alcohol',
    description: 'Alcoholemia, efectos, drogas y medicamentos.',
    subcategories: [
      { id: 'alcoholemia', name: 'Alcoholemia' },
      { id: 'efectos-alcohol', name: 'Efectos del alcohol' },
      { id: 'drogas', name: 'Drogas' },
      { id: 'medicamentos', name: 'Medicamentos' },
      { id: 'tiempos-reaccion', name: 'Tiempos de reacción' },
    ],
  },
  {
    id: 'vehiculo',
    name: 'El vehículo',
    emoji: '🚘',
    icon: 'car',
    description: 'Neumáticos, frenos, alumbrado, ITV y mantenimiento.',
    subcategories: [
      { id: 'neumaticos', name: 'Neumáticos' },
      { id: 'frenos', name: 'Frenos' },
      { id: 'alumbrado', name: 'Alumbrado' },
      { id: 'itv', name: 'ITV' },
      { id: 'mantenimiento', name: 'Mantenimiento' },
      { id: 'seguridad-activa', name: 'Seguridad activa' },
      { id: 'seguridad-pasiva', name: 'Seguridad pasiva' },
      { id: 'retencion-infantil', name: 'Retención infantil' },
    ],
  },
  {
    id: 'conductor',
    name: 'El conductor',
    emoji: '👤',
    icon: 'user',
    description: 'Documentación, permiso de conducir, puntos y aptitudes.',
    subcategories: [
      { id: 'documentacion', name: 'Documentación' },
      { id: 'permiso-conducir', name: 'Permiso de conducir' },
      { id: 'puntos', name: 'Puntos' },
      { id: 'aptitudes', name: 'Aptitudes' },
      { id: 'comportamiento', name: 'Comportamiento' },
    ],
  },
  {
    id: 'otros-usuarios',
    name: 'Otros usuarios',
    emoji: '🏍️',
    icon: 'pedestrian',
    description: 'Peatones, ciclistas, motocicletas y vehículos prioritarios.',
    subcategories: [
      { id: 'peatones', name: 'Peatones' },
      { id: 'ciclistas', name: 'Ciclistas' },
      { id: 'motocicletas', name: 'Motocicletas' },
      { id: 'vehiculos-prioritarios', name: 'Vehículos prioritarios' },
      { id: 'transporte-publico', name: 'Transporte público' },
      { id: 'vmp', name: 'VMP y patinetes eléctricos' },
    ],
  },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getSubcategoryName(categoryId: string, subcategoryId: string): string {
  const cat = getCategoryById(categoryId);
  return cat?.subcategories.find((s) => s.id === subcategoryId)?.name ?? subcategoryId;
}
