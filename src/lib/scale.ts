import { Vector3 } from 'three';
import type { DistanceScaleMode } from '../store/selectionStore';
import type { Vec3 } from './orbitalMechanics';

const TRUE_UNITS_PER_AU = 9;
const LOG_MIN = 4;
const LOG_K = 16;

/** Maps a real heliocentric distance (AU) to a scene-space distance (units). */
export function scaleDistanceAU(distanceAU: number, mode: DistanceScaleMode): number {
  if (distanceAU <= 0) return 0;
  if (mode === 'true') return distanceAU * TRUE_UNITS_PER_AU;
  return LOG_MIN + LOG_K * Math.log(1 + distanceAU);
}

/**
 * Converts a heliocentric ecliptic AU position into scene space (Y-up),
 * preserving direction while remapping magnitude through the active
 * distance-scale mode.
 */
export function auToScene(au: Vec3, mode: DistanceScaleMode, out = new Vector3()): Vector3 {
  const realDist = Math.sqrt(au.x * au.x + au.y * au.y + au.z * au.z);
  if (realDist < 1e-9) return out.set(0, 0, 0);
  const sceneDist = scaleDistanceAU(realDist, mode);
  const k = sceneDist / realDist;
  // ecliptic (x, y) is the reference plane; ecliptic z is "up" in the scene
  return out.set(au.x * k, au.z * k, au.y * k);
}
