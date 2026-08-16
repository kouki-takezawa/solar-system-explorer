import type { OrbitalElements } from '../lib/orbitalMechanics';
import type { Entity } from '../types';

export interface OrbitMotion {
  type: 'orbit';
  parentId: string;
  elements: OrbitalElements; // only shape/timing matter -- magnitude is replaced by visualOrbitRadius
  visualOrbitRadius: number;
}

export interface SurfaceMotion {
  type: 'surface';
  parentId: string;
  latDeg: number;
  lngDeg: number;
}

export interface EscapeMotion {
  type: 'escape';
  /** Real heliocentric distance (AU) at referenceDateMs, extrapolated linearly onward -- these trajectories are decades past their last gravity assist and now travel in very nearly straight lines. */
  referenceDistanceAU: number;
  referenceDateMs: number;
  speedAUPerYear: number;
  directionLonDeg: number;
  directionLatDeg: number;
}

export type ProbeMotion = OrbitMotion | SurfaceMotion | EscapeMotion;

export interface ProbeData extends Entity {
  motion: ProbeMotion;
  launchDateMs: number;
  sceneSize: number;
  status: 'active' | 'historical';
}

const d = (iso: string) => Date.parse(iso + 'T00:00:00Z');

export const PROBES: ProbeData[] = [
  {
    id: 'iss',
    nameJa: '国際宇宙ステーション',
    nameEn: 'International Space Station',
    color: '#e8e8e8',
    status: 'active',
    launchDateMs: d('1998-11-20'),
    sceneSize: 0.05,
    description: '地球低軌道を周回する有人実験施設。15か国が参加する国際協力プロジェクトで、1998年の最初のモジュール打ち上げ以来、常時運用が続いている。',
    facts: [
      { label: '軌道高度', value: '約 400 km' },
      { label: '軌道周期', value: '約 92.7 分' },
      { label: '打ち上げ', value: '1998年11月20日（最初のモジュール）' },
    ],
    motion: {
      type: 'orbit',
      parentId: 'earth',
      elements: { a: 1, e: 0.0003, i: 51.6, om: 0, w: 0, m0: 0, periodDays: 92.68 / 1440 },
      visualOrbitRadius: 0.62 * 1.15,
    },
  },
  {
    id: 'hubble',
    nameJa: 'ハッブル宇宙望遠鏡',
    nameEn: 'Hubble Space Telescope',
    color: '#d4af6a',
    status: 'active',
    launchDateMs: d('1990-04-24'),
    sceneSize: 0.05,
    description: '1990年に打ち上げられた光学宇宙望遠鏡。大気のゆらぎの影響を受けない鮮明な観測により、天文学に革命をもたらした。',
    facts: [
      { label: '軌道高度', value: '約 535 km' },
      { label: '軌道周期', value: '約 95 分' },
      { label: '打ち上げ', value: '1990年4月24日' },
    ],
    motion: {
      type: 'orbit',
      parentId: 'earth',
      elements: { a: 1, e: 0.0002, i: 28.5, om: 60, w: 0, m0: 140, periodDays: 95 / 1440 },
      visualOrbitRadius: 0.62 * 1.22,
    },
  },
  {
    id: 'juno',
    nameJa: 'ジュノー',
    nameEn: 'Juno',
    color: '#4a7fc9',
    status: 'active',
    launchDateMs: d('2016-07-05'), // shown from Jupiter orbit insertion, not the 2011 launch
    sceneSize: 0.045,
    description: '木星の極軌道を周回する探査機。木星の内部構造・磁場・組成を調べ、巨大ガス惑星の起源に迫る。放射線帯を避けるため楕円形の極軌道を取る。',
    facts: [
      { label: '木星到着', value: '2016年7月5日' },
      { label: '軌道周期', value: '約 43 日（拡張ミッション）' },
      { label: '軌道傾斜', value: '約 90°（極軌道）' },
    ],
    motion: {
      type: 'orbit',
      parentId: 'jupiter',
      elements: { a: 1, e: 0.6, i: 90, om: 0, w: 20, m0: 0, periodDays: 43 },
      visualOrbitRadius: 1.8 * 1.7,
    },
  },
  {
    id: 'perseverance',
    nameJa: 'パーサヴィアランス',
    nameEn: 'Perseverance Rover',
    color: '#c1682e',
    status: 'active',
    launchDateMs: d('2021-02-18'),
    sceneSize: 0.04,
    description: '火星のジェゼロ・クレーターに着陸した探査車。かつて湖だった地形で過去の生命の痕跡を探し、将来の地球帰還に向けたサンプル採取を行っている。',
    facts: [
      { label: '着陸', value: '2021年2月18日' },
      { label: '着陸地点', value: 'ジェゼロ・クレーター' },
      { label: '相棒', value: '小型ヘリコプター Ingenuity' },
    ],
    motion: { type: 'surface', parentId: 'mars', latDeg: 18.4, lngDeg: 77.5 },
  },
  {
    id: 'curiosity',
    nameJa: 'キュリオシティ',
    nameEn: 'Curiosity Rover',
    color: '#a89a8a',
    status: 'active',
    launchDateMs: d('2012-08-06'),
    sceneSize: 0.04,
    description: '火星のゲイル・クレーターで活動する探査車。かつて水が存在した証拠を数多く発見し、火星がかつて生命を育める環境だった可能性を示した。',
    facts: [
      { label: '着陸', value: '2012年8月6日' },
      { label: '着陸地点', value: 'ゲイル・クレーター' },
      { label: '動力源', value: '原子力電池（RTG）' },
    ],
    motion: { type: 'surface', parentId: 'mars', latDeg: -4.6, lngDeg: 137.4 },
  },
  {
    id: 'voyager1',
    nameJa: 'ボイジャー1号',
    nameEn: 'Voyager 1',
    color: '#e0c068',
    status: 'active',
    launchDateMs: d('1977-09-05'),
    sceneSize: 0.045,
    description:
      '木星・土星をフライバイした後、人類史上最も遠くへ到達した探査機。2012年に太陽圏を離脱し、現在は恒星間空間を航行中。ゴールデンレコードを搭載する。',
    facts: [
      { label: '打ち上げ', value: '1977年9月5日' },
      { label: '太陽圏離脱', value: '2012年（史上初）' },
      { label: '現在の速度', value: '約 3.6 AU/年' },
    ],
    motion: {
      type: 'escape',
      referenceDistanceAU: 163,
      referenceDateMs: d('2024-01-01'),
      speedAUPerYear: 3.58,
      directionLonDeg: 255,
      directionLatDeg: 35,
    },
  },
  {
    id: 'voyager2',
    nameJa: 'ボイジャー2号',
    nameEn: 'Voyager 2',
    color: '#d4a843',
    status: 'active',
    launchDateMs: d('1977-08-20'),
    sceneSize: 0.045,
    description:
      '木星・土星・天王星・海王星のすべてをフライバイした唯一の探査機（グランドツアー）。2018年に太陽圏を離脱し、ボイジャー1号とは反対方向へ航行中。',
    facts: [
      { label: '打ち上げ', value: '1977年8月20日' },
      { label: '太陽圏離脱', value: '2018年' },
      { label: '現在の速度', value: '約 3.3 AU/年' },
    ],
    motion: {
      type: 'escape',
      referenceDistanceAU: 136,
      referenceDateMs: d('2024-01-01'),
      speedAUPerYear: 3.3,
      directionLonDeg: 300,
      directionLatDeg: -48,
    },
  },
];
