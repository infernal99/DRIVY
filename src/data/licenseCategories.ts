import type { IconName } from '../types';

export interface LicenseCategory {
  id: string;
  /** Letra oficial de la categoría (UE/DGT) — no un nombre inventado. */
  code: string;
  name: string;
  description: string;
  icon: IconName;
  /** Solo `false` para B: es el único carné con contenido real hoy. */
  available: boolean;
}

/**
 * Catálogo real de categorías de permiso de conducir español (DGT / normativa
 * armonizada UE), no una lista inventada para la maqueta — cilindradas, kW y
 * edades mínimas verificados en dgt.es en 2026-08. Roady solo tiene banco de
 * preguntas para B (turismos); el resto se muestra con candado ("Próximamente")
 * en vez de ocultarse, para dejar claro hacia dónde crece la app sin fingir
 * contenido que no existe.
 */
export const LICENSE_CATEGORIES: LicenseCategory[] = [
  {
    id: 'am',
    code: 'AM',
    name: 'Ciclomotor',
    description: 'Hasta 50 cc y 45 km/h. Desde los 15 años.',
    icon: 'motorcycle',
    available: false,
  },
  {
    id: 'a1',
    code: 'A1',
    name: 'Moto pequeña',
    description: 'Hasta 125 cc y 11 kW. Desde los 16 años.',
    icon: 'motorcycle',
    available: false,
  },
  {
    id: 'a2',
    code: 'A2',
    name: 'Moto media',
    description: 'Hasta 35 kW de potencia. Desde los 18 años.',
    icon: 'motorcycle',
    available: false,
  },
  {
    id: 'a',
    code: 'A',
    name: 'Moto sin límite',
    description: 'Sin límite de potencia. Requiere 2 años con A2.',
    icon: 'motorcycle',
    available: false,
  },
  {
    id: 'b',
    code: 'B',
    name: 'Coche',
    description: 'Turismos y furgonetas hasta 3.500 kg. Desde los 18 años.',
    icon: 'car',
    available: true,
  },
  {
    id: 'c',
    code: 'C',
    name: 'Camión',
    description: 'Vehículos de más de 3.500 kg. Desde los 21 años.',
    icon: 'truck',
    available: false,
  },
  {
    id: 'd',
    code: 'D',
    name: 'Autobús',
    description: 'Transporte de más de 8 pasajeros. Desde los 24 años.',
    icon: 'bus',
    available: false,
  },
];
