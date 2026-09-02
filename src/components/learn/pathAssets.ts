import type { PathIconName } from './pathVisuals';

/**
 * PNG de producción para el camino (public/learn-path/) — botones ya
 * renderizados en 3D, no hay que recrearlos con CSS. Solo cubren un
 * subconjunto de los PathIconName; para el resto, LearnPath sigue usando
 * el botón 3D en CSS + PathIcon (ver pathVisuals.tsx) como venía haciendo.
 */
export const NODE_ASSET: Partial<Record<PathIconName, string>> = {
  signTriangle: '/learn-path/warning_button.png',
  signPriority: '/learn-path/priority_button.png',
  signProhibition: '/learn-path/prohibition_button.png',
  signObligation: '/learn-path/obligation_button.png',
  signIndication: '/learn-path/information_button.png',
  roundabout: '/learn-path/roundabout_button.png',
};

export const DAILY_CHALLENGE_ASSET = '/learn-path/daily_challenge.png';
export const REWARD_CHEST_ASSET = '/learn-path/reward_chest.png';

export type EnvPropKind =
  | 'tree'
  | 'bushSmall'
  | 'bushLarge'
  | 'grassSmall'
  | 'grassTall'
  | 'rocksGrass'
  | 'cone'
  | 'yield'
  | 'lamp'
  | 'barrier'
  | 'directionBarrier'
  | 'car';

/** Ancho objetivo (px) por tipo de decorado — el alto sale solo, respetando el aspect ratio real del PNG. */
export const ENV_PROP: Record<EnvPropKind, { src: string; width: number }> = {
  tree: { src: '/learn-path/tree.png', width: 62 },
  bushSmall: { src: '/learn-path/bush_rock.png', width: 50 },
  bushLarge: { src: '/learn-path/bush_rocks_large.png', width: 66 },
  grassSmall: { src: '/learn-path/grass_rocks_small.png', width: 34 },
  grassTall: { src: '/learn-path/grass_rocks_tall.png', width: 38 },
  rocksGrass: { src: '/learn-path/rocks_grass.png', width: 32 },
  cone: { src: '/learn-path/traffic_cone.png', width: 30 },
  yield: { src: '/learn-path/yield_sign.png', width: 44 },
  lamp: { src: '/learn-path/street_lamp.png', width: 48 },
  barrier: { src: '/learn-path/road_barrier.png', width: 56 },
  directionBarrier: { src: '/learn-path/direction_barrier.png', width: 56 },
  car: { src: '/learn-path/purple_car.png', width: 72 },
};
