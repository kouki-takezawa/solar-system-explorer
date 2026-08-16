import type { Vector3 } from 'three';

/**
 * Approximates the lat/lng under a world-space direction from Earth's
 * center, given Earth's current Y-axis day/night rotation, assuming the
 * standard equirectangular day-texture convention (longitude 0 at the
 * texture's horizontal center). This is a best-effort continuity aid for
 * the globe->map dive transition, not survey-grade -- there may be a
 * constant calibration offset against the true prime meridian, but the
 * same viewing angle always maps to the same spot and rotating the view
 * shifts longitude in the correct direction.
 */
export function worldDirectionToLatLng(worldDir: Vector3, earthRotationY: number): [number, number] {
  const cosA = Math.cos(-earthRotationY);
  const sinA = Math.sin(-earthRotationY);
  const lx = worldDir.x * cosA + worldDir.z * sinA;
  const lz = -worldDir.x * sinA + worldDir.z * cosA;
  const ly = Math.max(-1, Math.min(1, worldDir.y));

  const theta = Math.acos(ly); // 0 at north pole, PI at south pole
  const lat = 90 - (theta * 180) / Math.PI;

  let phi = Math.atan2(lz, -lx);
  if (phi < 0) phi += Math.PI * 2;
  const u = phi / (Math.PI * 2);
  const lng = (u - 0.5) * 360;

  return [lat, lng];
}
