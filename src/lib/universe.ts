import type { Entity } from '../types';

/** Maps a real radius (light-years) to a scene-space shell radius via log scaling. */
export function radiusLyToSceneUnits(radiusLy: number): number {
  if (radiusLy <= 0) return 3;
  const LOG_MIN = 20;
  const LOG_K = 32.7;
  const LOG_REF = 7; // log10(10,000,000 ly)
  return LOG_MIN + LOG_K * (Math.log10(radiusLy) - LOG_REF);
}

export interface UniverseShell extends Entity {
  radiusLy: number;
}

export const UNIVERSE_SHELLS: UniverseShell[] = [
  {
    id: 'us',
    nameJa: '太陽系（現在地）',
    nameEn: 'The Solar System (you are here)',
    color: '#00f0ff',
    radiusLy: 0,
    description: 'このデモの「太陽系ビュー」で見ていた場所。宇宙全体のスケールでは、これは事実上ただの一点に過ぎない。',
    facts: [{ label: '天の川銀河内での位置', value: '中心から約2.6万光年' }],
    drillTarget: 'solar',
  },
  {
    id: 'milky-way',
    nameJa: '天の川銀河',
    nameEn: 'The Milky Way',
    color: '#7cd9ff',
    radiusLy: 50000,
    description: '私たちが属する棒渦巻銀河。直径は約10万光年、恒星の数は1000億〜4000億個と推定される。',
    facts: [
      { label: '直径', value: '約 10万 光年' },
      { label: '推定恒星数', value: '1000億〜4000億個' },
    ],
    drillTarget: 'galaxy',
  },
  {
    id: 'local-group',
    nameJa: '局部銀河群',
    nameEn: 'The Local Group',
    color: '#9adfff',
    radiusLy: 10000000,
    description: '天の川銀河・アンドロメダ銀河を含む、80個以上の銀河からなる銀河群。',
    facts: [
      { label: '半径（目安）', value: '約 1000万 光年' },
      { label: '主なメンバー', value: '天の川銀河、アンドロメダ銀河 他' },
    ],
  },
  {
    id: 'virgo-supercluster',
    nameJa: 'おとめ座超銀河団',
    nameEn: 'Virgo Supercluster',
    color: '#8fa0ff',
    radiusLy: 110000000,
    description: '局部銀河群を含む、数千の銀河からなる超銀河団。かつては宇宙の大構造の基本単位と考えられていた。',
    facts: [{ label: '半径（目安）', value: '約 1.1億 光年' }],
  },
  {
    id: 'laniakea',
    nameJa: 'ラニアケア超銀河団',
    nameEn: 'Laniakea Supercluster',
    color: '#a884ff',
    radiusLy: 520000000,
    description: '2014年に提唱された、おとめ座超銀河団を含むさらに大きな超銀河団。ハワイ語で「measureless heaven（計り知れない天）」を意味する。',
    facts: [{ label: '半径（目安）', value: '約 5.2億 光年' }],
  },
  {
    id: 'observable-universe',
    nameJa: '観測可能な宇宙の果て',
    nameEn: 'Edge of the Observable Universe',
    color: '#ff3366',
    radiusLy: 46500000000,
    description:
      '宇宙誕生から138億年の間に光が届く限界の距離。宇宙膨張の影響で、実際の共動距離は約465億光年に達する。この先は現在の科学では観測不可能。',
    facts: [
      { label: '半径', value: '約 465億 光年' },
      { label: '宇宙年齢', value: '約 138億 年' },
    ],
  },
];
