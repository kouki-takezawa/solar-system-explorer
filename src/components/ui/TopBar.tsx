import { useSelectionStore } from '../../store/selectionStore';

export function TopBar() {
  const distanceScale = useSelectionStore((s) => s.distanceScale);
  const setDistanceScale = useSelectionStore((s) => s.setDistanceScale);
  const setSidebarOpen = useSelectionStore((s) => s.setSidebarOpen);
  const scaleLevel = useSelectionStore((s) => s.scaleLevel);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3 md:p-5">
      <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-[3px] rounded-full border border-offwhite/15 bg-space-raised/70 md:hidden"
          aria-label="メニューを開く"
        >
          <span className="h-[1.5px] w-4 bg-offwhite/70" />
          <span className="h-[1.5px] w-4 bg-offwhite/70" />
          <span className="h-[1.5px] w-4 bg-offwhite/70" />
        </button>
        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan/50 shadow-[0_0_14px_rgba(0,240,255,0.45)] sm:flex">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_8px_2px_rgba(0,240,255,0.9)]" />
        </div>
        <div>
          <h1 className="whitespace-nowrap text-xs font-semibold tracking-[0.2em] text-offwhite md:text-base md:tracking-[0.25em]">
            SOLAR EXPLORER
          </h1>
          <p className="hidden font-mono text-[10px] tracking-widest text-offwhite/40 sm:block">
            TIME-TRAVEL ORBITAL VISUALIZER
          </p>
        </div>
        <span className="ml-2 hidden rounded-full border border-violet/50 bg-violet/10 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-violet md:inline-block">
          PHASE 1-2 DEMO
        </span>
      </div>

      <div
        className={`pointer-events-auto items-center gap-1 rounded-full border border-offwhite/10 bg-space-raised/70 p-1 backdrop-blur-md md:gap-2 ${
          scaleLevel === 'solar' ? 'flex' : 'hidden'
        }`}
      >
        {(
          [
            { key: 'log', label: 'LOG SCALE', short: 'LOG' },
            { key: 'true', label: 'TRUE SCALE', short: 'TRUE' },
          ] as const
        ).map((opt) => (
          <button
            key={opt.key}
            onClick={() => setDistanceScale(opt.key)}
            className={`rounded-full px-2.5 py-1.5 font-mono text-[10px] tracking-wider transition-colors md:px-3 ${
              distanceScale === opt.key
                ? 'bg-cyan/15 text-cyan shadow-[0_0_10px_rgba(0,240,255,0.35)]'
                : 'text-offwhite/45 hover:text-offwhite/80'
            }`}
          >
            <span className="md:hidden">{opt.short}</span>
            <span className="hidden md:inline">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
