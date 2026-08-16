import { daysSinceJ2000 } from './julianDate';

/** Keplerian orbital elements at epoch J2000.0 (approximate, degrees / AU / days). */
export interface OrbitalElements {
  /** semi-major axis, AU */
  a: number;
  /** eccentricity */
  e: number;
  /** inclination, deg */
  i: number;
  /** longitude of ascending node, deg */
  om: number;
  /** argument of periapsis, deg */
  w: number;
  /** mean anomaly at epoch, deg */
  m0: number;
  /** sidereal orbital period, days */
  periodDays: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const DEG2RAD = Math.PI / 180;

function solveKepler(mRad: number, e: number): number {
  let E = e < 0.8 ? mRad : Math.PI;
  for (let iter = 0; iter < 8; iter++) {
    const dE = (E - e * Math.sin(E) - mRad) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-8) break;
  }
  return E;
}

/**
 * Heliocentric ecliptic position (AU) of a body at a given date, from mean
 * Keplerian elements. Accurate to a fraction of a degree over multi-decade
 * spans -- good enough for visualization, not for spacecraft navigation.
 */
export function heliocentricPosition(elements: OrbitalElements, date: Date): Vec3 {
  const t = daysSinceJ2000(date);
  const n = 360 / elements.periodDays; // deg/day mean motion
  const mDeg = (((elements.m0 + n * t) % 360) + 360) % 360;
  const mRad = mDeg * DEG2RAD;

  const E = solveKepler(mRad, elements.e);
  const { a, e } = elements;

  const xOrb = a * (Math.cos(E) - e);
  const yOrb = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const w = elements.w * DEG2RAD;
  const om = elements.om * DEG2RAD;
  const i = elements.i * DEG2RAD;

  const cosW = Math.cos(w);
  const sinW = Math.sin(w);
  const cosOm = Math.cos(om);
  const sinOm = Math.sin(om);
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);

  const x =
    (cosOm * cosW - sinOm * sinW * cosI) * xOrb +
    (-cosOm * sinW - sinOm * cosW * cosI) * yOrb;
  const y =
    (sinOm * cosW + cosOm * sinW * cosI) * xOrb +
    (-sinOm * sinW + cosOm * cosW * cosI) * yOrb;
  const z = sinW * sinI * xOrb + cosW * sinI * yOrb;

  return { x, y, z };
}

/** Approximate heliocentric orbital speed (km/s) via the vis-viva equation. */
export function orbitalSpeedKmS(elements: OrbitalElements, distanceAU: number): number {
  const GM_SUN = 1.32712440018e11; // km^3/s^2
  const AU_KM = 1.495978707e8;
  const rKm = distanceAU * AU_KM;
  const aKm = elements.a * AU_KM;
  const v2 = GM_SUN * (2 / rKm - 1 / aKm);
  return Math.sqrt(Math.max(v2, 0));
}

/** Sample points (AU) along the full ellipse, for drawing the orbit path. */
export function orbitPathPoints(elements: OrbitalElements, segments = 256): Vec3[] {
  const points: Vec3[] = [];
  const { a, e } = elements;
  const w = elements.w * DEG2RAD;
  const om = elements.om * DEG2RAD;
  const i = elements.i * DEG2RAD;
  const cosW = Math.cos(w);
  const sinW = Math.sin(w);
  const cosOm = Math.cos(om);
  const sinOm = Math.sin(om);
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);

  for (let s = 0; s <= segments; s++) {
    const E = (s / segments) * Math.PI * 2;
    const xOrb = a * (Math.cos(E) - e);
    const yOrb = a * Math.sqrt(1 - e * e) * Math.sin(E);
    const x =
      (cosOm * cosW - sinOm * sinW * cosI) * xOrb +
      (-cosOm * sinW - sinOm * cosW * cosI) * yOrb;
    const y =
      (sinOm * cosW + cosOm * sinW * cosI) * xOrb +
      (-sinOm * sinW + cosOm * cosW * cosI) * yOrb;
    const z = sinW * sinI * xOrb + cosW * sinI * yOrb;
    points.push({ x, y, z });
  }
  return points;
}

export function vecLength(v: Vec3): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}
