import type { OrbitalElements } from '../lib/orbitalMechanics';

// Wikimedia Commons mirrors of the Solar System Scope CC BY 4.0 texture set
// (the original solarsystemscope.com host does not send CORS headers, which
// silently crashes WebGL texture loads in the browser).
const WM = 'https://upload.wikimedia.org/wikipedia/commons';
const TEX_MERCURY = `${WM}/9/92/Solarsystemscope_texture_2k_mercury.jpg`;
const TEX_VENUS = `${WM}/4/40/Solarsystemscope_texture_2k_venus_surface.jpg`;
const TEX_MARS = `${WM}/4/46/Solarsystemscope_texture_2k_mars.jpg`;
const TEX_JUPITER = `${WM}/b/be/Solarsystemscope_texture_2k_jupiter.jpg`;
const TEX_SATURN = `${WM}/e/ea/Solarsystemscope_texture_2k_saturn.jpg`;
const TEX_SATURN_RING = `${WM}/7/7d/Solarsystemscope_texture_2k_saturn_ring_alpha.png`;
const TEX_URANUS = `${WM}/9/95/Solarsystemscope_texture_2k_uranus.jpg`;
const TEX_NEPTUNE = `${WM}/1/1e/Solarsystemscope_texture_2k_neptune.jpg`;
const TEX_SUN = `${WM}/c/cb/Solarsystemscope_texture_2k_sun.jpg`;

export interface PlanetData {
  id: string;
  nameJa: string;
  nameEn: string;
  color: string;
  sceneRadius: number; // visual radius, scene units (exaggerated for legibility)
  realRadiusKm: number;
  rotationPeriodHours: number;
  hasRings?: boolean;
  ringTextureUrl?: string;
  textureUrl?: string;
  elements: OrbitalElements;
  description: string;
  discovered: string;
  moons: number;
  missions: string[];
}

export const SUN = {
  id: 'sun',
  nameJa: '太陽',
  nameEn: 'Sun',
  color: '#ffd27a',
  sceneRadius: 3.2,
  realRadiusKm: 696000,
  textureUrl: TEX_SUN,
};

export const PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    nameJa: '水星',
    nameEn: 'Mercury',
    color: '#9c9691',
    sceneRadius: 0.34,
    realRadiusKm: 2439.7,
    rotationPeriodHours: 1407.6,
    textureUrl: TEX_MERCURY,
    elements: { a: 0.387098, e: 0.20563, i: 7.005, om: 48.331, w: 29.124, m0: 174.796, periodDays: 87.9691 },
    description: '太陽に最も近い惑星。大気がほとんどなく、昼夜の温度差が430℃にも達する灼熱と極寒の世界。',
    discovered: '有史以前より観測',
    moons: 0,
    missions: ['Mariner 10 (1974 フライバイ)', 'MESSENGER (2011-2015 周回)', 'BepiColombo (2025 到着予定)'],
  },
  {
    id: 'venus',
    nameJa: '金星',
    nameEn: 'Venus',
    color: '#e8c27a',
    sceneRadius: 0.58,
    realRadiusKm: 6051.8,
    rotationPeriodHours: -5832.5,
    textureUrl: TEX_VENUS,
    elements: { a: 0.723332, e: 0.006772, i: 3.39458, om: 76.68, w: 54.884, m0: 50.115, periodDays: 224.701 },
    description: '濃硫酸の雲と暴走温室効果により、表面温度は460℃を超える太陽系最高温の惑星。自転は他惑星と逆向き。',
    discovered: '有史以前より観測',
    moons: 0,
    missions: ['Venera計画 (1961-1984 着陸)', 'Magellan (1990 マッピング)', 'Akatsuki (2015 周回)'],
  },
  {
    id: 'earth',
    nameJa: '地球',
    nameEn: 'Earth',
    color: '#2f7bff',
    sceneRadius: 0.62,
    realRadiusKm: 6371,
    rotationPeriodHours: 23.934,
    elements: { a: 1.0, e: 0.016710, i: 0.00005, om: -11.26064, w: 114.20783, m0: 358.617, periodDays: 365.256 },
    description: '液体の水と生命が存在することが確認されている唯一の惑星。私たちの故郷。',
    discovered: '—',
    moons: 1,
    missions: ['ISS (1998- 常時運用)', 'ランドサット地球観測衛星群'],
  },
  {
    id: 'mars',
    nameJa: '火星',
    nameEn: 'Mars',
    color: '#c1440e',
    sceneRadius: 0.44,
    realRadiusKm: 3389.5,
    rotationPeriodHours: 24.623,
    textureUrl: TEX_MARS,
    elements: { a: 1.523679, e: 0.0934, i: 1.85, om: 49.558, w: 286.502, m0: 19.412, periodDays: 686.98 },
    description: '酸化鉄を含む地表が赤く見える「赤い惑星」。太陽系最大級の峡谷マリネリス峡谷を持つ。',
    discovered: '有史以前より観測',
    moons: 2,
    missions: ['Perseverance (2021- 探査中)', 'Curiosity (2012- 探査中)', 'Mars Express (2003- 周回)'],
  },
  {
    id: 'jupiter',
    nameJa: '木星',
    nameEn: 'Jupiter',
    color: '#d9b28c',
    sceneRadius: 1.8,
    realRadiusKm: 69911,
    rotationPeriodHours: 9.925,
    textureUrl: TEX_JUPITER,
    elements: { a: 5.204267, e: 0.048498, i: 1.303, om: 100.464, w: 273.867, m0: 20.02, periodDays: 4332.589 },
    description: '太陽系最大のガス惑星。400年以上続く巨大な嵐「大赤斑」と、79個以上の衛星を持つ。',
    discovered: '有史以前より観測',
    moons: 95,
    missions: ['Voyager 1/2 (1979 フライバイ)', 'Galileo (1995-2003 周回)', 'Juno (2016- 周回中)'],
  },
  {
    id: 'saturn',
    nameJa: '土星',
    nameEn: 'Saturn',
    color: '#e3c27a',
    sceneRadius: 1.55,
    realRadiusKm: 58232,
    rotationPeriodHours: 10.656,
    hasRings: true,
    textureUrl: TEX_SATURN,
    ringTextureUrl: TEX_SATURN_RING,
    elements: { a: 9.582017, e: 0.055546, i: 2.485, om: 113.665, w: 339.392, m0: 317.021, periodDays: 10759.22 },
    description: '氷と岩石の粒子からなる壮麗な環を持つガス惑星。密度は水より小さく、水に浮くほど軽い。',
    discovered: '有史以前より観測',
    moons: 146,
    missions: ['Voyager 1/2 (1980-81 フライバイ)', 'Cassini-Huygens (2004-2017 周回)'],
  },
  {
    id: 'uranus',
    nameJa: '天王星',
    nameEn: 'Uranus',
    color: '#9fe8e0',
    sceneRadius: 1.1,
    realRadiusKm: 25362,
    rotationPeriodHours: -17.24,
    textureUrl: TEX_URANUS,
    elements: { a: 19.229411, e: 0.047318, i: 0.773, om: 74.006, w: 96.998857, m0: 142.2386, periodDays: 30688.5 },
    description: '自転軸が98度傾いており、横倒しで公転する氷の巨大惑星。淡い青緑色はメタンガスによるもの。',
    discovered: '1781年 W. Herschel',
    moons: 28,
    missions: ['Voyager 2 (1986 フライバイ、唯一の探査)'],
  },
  {
    id: 'neptune',
    nameJa: '海王星',
    nameEn: 'Neptune',
    color: '#4166f5',
    sceneRadius: 1.05,
    realRadiusKm: 24622,
    rotationPeriodHours: 16.11,
    textureUrl: TEX_NEPTUNE,
    elements: { a: 30.103658, e: 0.008859, i: 1.77, om: 131.784, w: 273.187, m0: 256.228, periodDays: 60182 },
    description: '太陽系最遠の惑星。太陽系最速となる秒速2100kmもの暴風が吹き荒れる、濃い青の氷惑星。',
    discovered: '1846年 J. Galle（数学的予測により発見）',
    moons: 16,
    missions: ['Voyager 2 (1989 フライバイ、唯一の探査)'],
  },
];

export const ALL_BODIES = [SUN, ...PLANETS];
