import type { Entity } from '../types';

export interface StarData extends Entity {
  distanceLy: number;
  spectralType: string;
}

export const SUN_AS_STAR: StarData = {
  id: 'sun',
  nameJa: '太陽（Sol）',
  nameEn: 'The Sun',
  color: '#ffd27a',
  distanceLy: 0,
  spectralType: 'G2V型主系列星',
  description: '私たちの太陽系の中心にある恒星。この恒星近傍マップでは全ての距離の基準点になっている。',
  facts: [
    { label: '距離', value: '0 光年（基準点）' },
    { label: 'スペクトル型', value: 'G2V型主系列星' },
  ],
  drillTarget: 'solar',
};

/**
 * The ~16 nearest star systems to the Sun. Distances and spectral types are
 * real published figures; sky *directions* are laid out schematically
 * (evenly distributed) rather than from precise catalog coordinates -- see
 * the caption shown in the Stellar Neighborhood view.
 */
export const NEARBY_STARS: StarData[] = [
  {
    id: 'proxima-centauri',
    nameJa: 'プロキシマ・ケンタウリ',
    nameEn: 'Proxima Centauri',
    color: '#ff6b4a',
    distanceLy: 4.25,
    spectralType: 'M型 赤色矮星',
    description: '太陽に最も近い恒星。ハビタブルゾーンに地球型惑星プロキシマbを持つことが確認されている。',
    facts: [
      { label: '距離', value: '4.25 光年' },
      { label: 'スペクトル型', value: 'M型 赤色矮星' },
      { label: '既知の惑星', value: 'あり（プロキシマb 他）' },
    ],
  },
  {
    id: 'alpha-centauri',
    nameJa: 'アルファ・ケンタウリ A/B',
    nameEn: 'Alpha Centauri A/B',
    color: '#ffe9b0',
    distanceLy: 4.37,
    spectralType: 'G型 + K型 連星',
    description: '太陽系から2番目に近い恒星系。互いを約80年周期で公転する連星。Aは太陽とよく似たG型星。',
    facts: [
      { label: '距離', value: '4.37 光年' },
      { label: 'スペクトル型', value: 'G型 + K型 連星' },
      { label: '公転周期', value: '約80年（相互）' },
    ],
  },
  {
    id: 'barnards-star',
    nameJa: 'バーナード星',
    nameEn: "Barnard's Star",
    color: '#ff9466',
    distanceLy: 5.96,
    spectralType: 'M型 赤色矮星',
    description: '全天で最大の固有運動を持つ恒星。約1万年でおよそ満月1個分、天球上を移動する。',
    facts: [
      { label: '距離', value: '5.96 光年' },
      { label: 'スペクトル型', value: 'M型 赤色矮星' },
      { label: '特徴', value: '史上最大の固有運動' },
    ],
  },
  {
    id: 'wolf-359',
    nameJa: 'ウォルフ359',
    nameEn: 'Wolf 359',
    color: '#ff7a52',
    distanceLy: 7.86,
    spectralType: 'M型 赤色矮星',
    description: '非常に暗い赤色矮星。フレア（閃光）活動が活発なことで知られる。',
    facts: [
      { label: '距離', value: '7.86 光年' },
      { label: 'スペクトル型', value: 'M型 赤色矮星' },
    ],
  },
  {
    id: 'lalande-21185',
    nameJa: 'ラランド21185',
    nameEn: 'Lalande 21185',
    color: '#ff8f5e',
    distanceLy: 8.31,
    spectralType: 'M型 赤色矮星',
    description: '北天で見える恒星の中で、太陽に最も近い部類に入る赤色矮星。',
    facts: [
      { label: '距離', value: '8.31 光年' },
      { label: 'スペクトル型', value: 'M型 赤色矮星' },
    ],
  },
  {
    id: 'sirius',
    nameJa: 'シリウス A/B',
    nameEn: 'Sirius A/B',
    color: '#bfe2ff',
    distanceLy: 8.66,
    spectralType: 'A型主系列星 + 白色矮星',
    description: '地球から見た夜空で最も明るい恒星。伴星シリウスBは燃え尽きた恒星の芯、白色矮星。',
    facts: [
      { label: '距離', value: '8.66 光年' },
      { label: 'スペクトル型', value: 'A型 + 白色矮星' },
      { label: '特徴', value: '夜空で最も明るい恒星' },
    ],
  },
  {
    id: 'luyten-726-8',
    nameJa: 'ルイテン726-8',
    nameEn: 'Luyten 726-8',
    color: '#ff8259',
    distanceLy: 8.73,
    spectralType: 'M型 閃光星（連星）',
    description: '突発的に増光する「閃光星（フレア星）」として知られる、近接連星系。',
    facts: [
      { label: '距離', value: '8.73 光年' },
      { label: 'スペクトル型', value: 'M型 閃光星' },
    ],
  },
  {
    id: 'ross-154',
    nameJa: 'ロス154',
    nameEn: 'Ross 154',
    color: '#ff8c5c',
    distanceLy: 9.68,
    spectralType: 'M型 赤色矮星',
    description: 'いて座の方向にある閃光星。太陽の1000分の1未満の光度しかない。',
    facts: [{ label: '距離', value: '9.68 光年' }, { label: 'スペクトル型', value: 'M型 赤色矮星' }],
  },
  {
    id: 'epsilon-eridani',
    nameJa: 'エプシロン・エリダニ',
    nameEn: 'Epsilon Eridani',
    color: '#ffdca0',
    distanceLy: 10.5,
    spectralType: 'K型主系列星',
    description: '太陽より若く、惑星系とデブリ円盤を持つことが確認されている、太陽に似た恒星。',
    facts: [
      { label: '距離', value: '10.5 光年' },
      { label: 'スペクトル型', value: 'K型主系列星' },
      { label: '既知の惑星', value: 'あり' },
    ],
  },
  {
    id: 'lacaille-9352',
    nameJa: 'ラカイユ9352',
    nameEn: 'Lacaille 9352',
    color: '#ffab7a',
    distanceLy: 10.7,
    spectralType: 'M型 赤色矮星',
    description: 'みなみのうお座方向にある、比較的近い赤色矮星。',
    facts: [{ label: '距離', value: '10.7 光年' }, { label: 'スペクトル型', value: 'M型 赤色矮星' }],
  },
  {
    id: 'ross-128',
    nameJa: 'ロス128',
    nameEn: 'Ross 128',
    color: '#ff8c5c',
    distanceLy: 11.0,
    spectralType: 'M型 赤色矮星',
    description: '地球サイズの系外惑星 Ross 128 b を持つ、フレア活動が穏やかな赤色矮星。',
    facts: [
      { label: '距離', value: '11.0 光年' },
      { label: 'スペクトル型', value: 'M型 赤色矮星' },
      { label: '既知の惑星', value: 'あり（Ross 128 b）' },
    ],
  },
  {
    id: 'procyon',
    nameJa: 'プロキオン',
    nameEn: 'Procyon',
    color: '#fff3d6',
    distanceLy: 11.5,
    spectralType: 'F型主系列星 + 白色矮星',
    description: 'こいぬ座の主星で、冬の大三角を構成する明るい恒星。白色矮星の伴星を持つ。',
    facts: [
      { label: '距離', value: '11.5 光年' },
      { label: 'スペクトル型', value: 'F型 + 白色矮星' },
    ],
  },
  {
    id: '61-cygni',
    nameJa: 'はくちょう座61番星',
    nameEn: '61 Cygni',
    color: '#ffb27a',
    distanceLy: 11.4,
    spectralType: 'K型 連星',
    description: '1838年、ベッセルが史上初めて年周視差を測定した記念碑的な恒星系。',
    facts: [
      { label: '距離', value: '11.4 光年' },
      { label: 'スペクトル型', value: 'K型 連星' },
      { label: '特徴', value: '初めて視差測定された恒星' },
    ],
  },
  {
    id: 'struve-2398',
    nameJa: 'ストルーベ2398',
    nameEn: 'Struve 2398',
    color: '#ff9a68',
    distanceLy: 11.5,
    spectralType: 'M型 連星',
    description: 'りゅう座の方向にある、赤色矮星どうしの連星系。',
    facts: [{ label: '距離', value: '11.5 光年' }, { label: 'スペクトル型', value: 'M型 連星' }],
  },
  {
    id: 'epsilon-indi',
    nameJa: 'エプシロン・インディ',
    nameEn: 'Epsilon Indi',
    color: '#ffd9a0',
    distanceLy: 11.8,
    spectralType: 'K型主系列星',
    description: '褐色矮星の伴星を持つことが確認されている、インディアン座の恒星。',
    facts: [
      { label: '距離', value: '11.8 光年' },
      { label: 'スペクトル型', value: 'K型主系列星' },
    ],
  },
  {
    id: 'tau-ceti',
    nameJa: 'タウ・セティ',
    nameEn: 'Tau Ceti',
    color: '#fff0c8',
    distanceLy: 11.9,
    spectralType: 'G型主系列星',
    description: '太陽に似たスペクトル型を持ち、地球外知的生命探査（SETI）で古くから注目されてきた恒星。',
    facts: [
      { label: '距離', value: '11.9 光年' },
      { label: 'スペクトル型', value: 'G型主系列星' },
    ],
  },
];
