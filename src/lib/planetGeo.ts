import { Vector3 } from 'three';

/**
 * Approximates the lat/lng under a world-space direction from a planet's
 * center, given its current Y-axis day/night rotation, assuming the
 * standard equirectangular day-texture convention (longitude 0 at the
 * texture's horizontal center). This is a best-effort continuity aid for
 * the globe->map dive transition, not survey-grade -- there may be a
 * constant calibration offset against the true prime meridian, but the
 * same viewing angle always maps to the same spot and rotating the view
 * shifts longitude in the correct direction.
 */
export function worldDirectionToLatLng(worldDir: Vector3, planetRotationY: number): [number, number] {
  const cosA = Math.cos(-planetRotationY);
  const sinA = Math.sin(-planetRotationY);
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

/** Inverse of worldDirectionToLatLng: a fixed surface point's current world-space direction from the planet's center. */
export function latLngToWorldDirection(latDeg: number, lngDeg: number, planetRotationY: number, out = new Vector3()): Vector3 {
  const theta = ((90 - latDeg) * Math.PI) / 180;
  const phi = (lngDeg * Math.PI) / 180 + Math.PI;

  const ly = Math.cos(theta);
  const lx = -Math.sin(theta) * Math.cos(phi);
  const lz = Math.sin(theta) * Math.sin(phi);

  const cosA = Math.cos(planetRotationY);
  const sinA = Math.sin(planetRotationY);
  out.x = lx * cosA + lz * sinA;
  out.z = -lx * sinA + lz * cosA;
  out.y = ly;
  return out;
}
