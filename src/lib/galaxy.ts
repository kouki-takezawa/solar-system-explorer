import { Vector3 } from 'three';
import type { Entity } from '../types';

/** Milky Way disk radius, light-years (real, approximate). */
export const GALAXY_RADIUS_LY = 50000;
/** Scene units per light-year in the Galaxy view (independent scale from the Solar System view). */
export const LY_TO_GALAXY_UNIT = 150 / GALAXY_RADIUS_LY;

const ARM_TIGHTNESS = 0.00013; // rad per ly of outward radius

/** Angle (rad) of the spiral arm centerline at a given radius, for a chosen arm base angle. */
export function armAngle(radiusLy: number, armBaseAngle: number): number {
  return armBaseAngle + radiusLy * ARM_TIGHTNESS;
}

export function galaxyLyToScene([radiusLy, angleRad, heightLy]: [number, number, number]): Vector3 {
  const x = Math.cos(angleRad) * radiusLy * LY_TO_GALAXY_UNIT;
  const z = Math.sin(angleRad) * radiusLy * LY_TO_GALAXY_UNIT;
  const y = heightLy * LY_TO_GALAXY_UNIT;
  return new Vector3(x, y, z);
}

export interface GalaxyLandmark extends Entity {
  radiusLy: number;
  armBaseAngle: number;
}

export const SUN_RADIUS_LY = 27000;
export const SUN_ARM_BASE_ANGLE = 2.1;

export const GALAXY_LANDMARKS: GalaxyLandmark[] = [
  {
    id: 'galactic-center',
    nameJa: '銀河系中心（いて座A*）',
    nameEn: 'Galactic Center (Sagittarius A*)',
    color: '#ffd27a',
    radiusLy: 0,
    armBaseAngle: 0,
    description:
      '天の川銀河の中心には、太陽の約430万倍の質量を持つ超大質量ブラックホール「いて座A*」が存在する。',
    facts: [
      { label: '中心からの距離', value: '0 光年（基準点）' },
      { label: '中心天体', value: 'いて座A*（超大質量BH）' },
    ],
  },
  {
    id: 'sun-position',
    nameJa: '太陽系の位置',
    nameEn: 'Position of the Solar System',
    color: '#00f0ff',
    radiusLy: SUN_RADIUS_LY,
    armBaseAngle: SUN_ARM_BASE_ANGLE,
    description: '私たちの太陽系は銀河中心から約2.6万光年離れた、オリオン腕（オリオンの支腕）に位置している。',
    facts: [
      { label: '銀河中心からの距離', value: '約 26,000 光年' },
      { label: '所属', value: 'オリオン腕' },
      { label: '銀河公転周期', value: '約 2億3千万年' },
    ],
    drillTarget: 'solar',
  },
  {
    id: 'orion-arm',
    nameJa: 'オリオン腕',
    nameEn: 'Orion Arm',
    color: '#7cd9ff',
    radiusLy: SUN_RADIUS_LY,
    armBaseAngle: SUN_ARM_BASE_ANGLE + 0.55,
    description: '太陽系が位置する、いて座腕とペルセウス腕の間にある比較的小さな腕（支腕）。',
    facts: [{ label: '種別', value: '支腕（マイナーアーム）' }],
  },
  {
    id: 'sagittarius-arm',
    nameJa: 'いて座腕',
    nameEn: 'Sagittarius Arm',
    color: '#7000ff',
    radiusLy: SUN_RADIUS_LY - 12000,
    armBaseAngle: SUN_ARM_BASE_ANGLE - 1.35,
    description: '太陽系より銀河中心に近い、主要な渦状腕のひとつ。活発な星形成領域として知られる。',
    facts: [{ label: '種別', value: '主要な渦状腕' }],
  },
  {
    id: 'perseus-arm',
    nameJa: 'ペルセウス腕',
    nameEn: 'Perseus Arm',
    color: '#4166f5',
    radiusLy: SUN_RADIUS_LY + 13000,
    armBaseAngle: SUN_ARM_BASE_ANGLE + 1.1,
    description: '太陽系より外側にある、天の川銀河最大級の渦状腕のひとつ。',
    facts: [{ label: '種別', value: '主要な渦状腕' }],
  },
];

/** Procedural spiral-arm star field (positions + colors, scene units). */
export function generateGalaxyPoints(seededRandom: () => number, count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const armCount = 3;

  for (let i = 0; i < count; i++) {
    const armIndex = i % armCount;
    const t = Math.pow(seededRandom(), 0.7); // bias toward center for realistic density falloff
    const radiusLy = t * GALAXY_RADIUS_LY;
    const scatter = (seededRandom() - 0.5) * 0.5 * (1 - t * 0.5);
    const angle = armAngle(radiusLy, (armIndex / armCount) * Math.PI * 2) + scatter;

    const heightFalloff = (1 - t) * 1800 + 200;
    const heightLy = (seededRandom() - 0.5) * heightFalloff;

    const v = galaxyLyToScene([radiusLy, angle, heightLy]);
    positions[i * 3] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;

    // color: warm white core -> pale blue mid-disk -> dim blue edge
    const core = Math.max(0, 1 - t * 2.2);
    const r = 1.0;
    const g = 0.85 + core * 0.1;
    const b = 0.65 + (1 - core) * 0.35;
    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
  }

  return { positions, colors };
}
