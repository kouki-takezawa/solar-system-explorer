import type { ScaleLevel } from '../../types';

const CAPTIONS: Record<Exclude<ScaleLevel, 'solar'>, string> = {
  stellar:
    '恒星近傍ビュー — 太陽から約12光年以内にある恒星を表示。距離は実測値、天球上の方向は模式的な配置です。',
  galaxy:
    '銀河系ビュー — 天の川銀河を模式的に生成した渦状腕モデル。太陽系の位置・銀河中心までの距離は実測値に基づきます。',
  universe:
    '観測可能な宇宙ビュー — 局部銀河群から宇宙の果てまでを対数スケールで表示した模式図。殻の半径は実測/推定値、内部の粒子分布は模式的な演出です。',
};

export function LevelCaption({ level }: { level: Exclude<ScaleLevel, 'solar'> }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 border-t border-offwhite/10 bg-space-raised/85 px-4 py-3 backdrop-blur-md md:px-6">
      <p className="mx-auto max-w-3xl text-center font-mono text-[10px] leading-relaxed text-offwhite/45 md:text-[11px]">
        {CAPTIONS[level]}
      </p>
    </div>
  );
}
