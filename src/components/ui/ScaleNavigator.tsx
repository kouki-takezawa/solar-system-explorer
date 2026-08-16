import { useSelectionStore } from '../../store/selectionStore';
import type { ScaleLevel } from '../../types';

const LEVELS: { key: ScaleLevel; label: string; hint: string }[] = [
  { key: 'solar', label: '太陽系', hint: '~60億km' },
  { key: 'stellar', label: '恒星近傍', hint: '~12光年' },
  { key: 'galaxy', label: '銀河系', hint: '~10万光年' },
  { key: 'universe', label: '観測可能な宇宙', hint: '~465億光年' },
];

export function ScaleNavigator() {
  const scaleLevel = useSelectionStore((s) => s.scaleLevel);
  const setScaleLevel = useSelectionStore((s) => s.setScaleLevel);

  return (
    <div className="pointer-events-auto absolute left-1/2 top-[52px] z-20 flex -translate-x-1/2 gap-0.5 overflow-x-auto rounded-full border border-offwhite/10 bg-space-raised/80 p-1 backdrop-blur-md md:top-[60px] md:gap-1">
      {LEVELS.map((level) => {
        const active = scaleLevel === level.key;
        return (
          <button
            key={level.key}
            onClick={() => setScaleLevel(level.key)}
            className={`flex shrink-0 flex-col items-center rounded-full px-2.5 py-1 transition-colors md:px-3.5 md:py-1.5 ${
              active ? 'bg-cyan/15 shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'hover:bg-offwhite/5'
            }`}
          >
            <span className={`font-mono text-[10px] tracking-wide md:text-[11px] ${active ? 'text-cyan' : 'text-offwhite/60'}`}>
              {level.label}
            </span>
            <span className="hidden font-mono text-[8px] text-offwhite/30 sm:block">{level.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
