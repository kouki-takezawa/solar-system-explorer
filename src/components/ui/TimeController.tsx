import { useTimeStore, SPEED_PRESETS, TIMELINE_MIN_YEAR, TIMELINE_MAX_YEAR } from '../../store/timeStore';
import { dateToYearFraction, yearFractionToDate, formatDate, formatTime, toDateTimeLocalValue, fromDateTimeLocalValue } from '../../lib/timeUtils';

export function TimeController() {
  const currentTimeMs = useTimeStore((s) => s.currentTimeMs);
  const isPlaying = useTimeStore((s) => s.isPlaying);
  const speedIndex = useTimeStore((s) => s.speedIndex);
  const togglePlaying = useTimeStore((s) => s.togglePlaying);
  const setSpeedIndex = useTimeStore((s) => s.setSpeedIndex);
  const setCurrentTimeMs = useTimeStore((s) => s.setCurrentTimeMs);
  const jumpToNow = useTimeStore((s) => s.jumpToNow);

  const date = new Date(currentTimeMs);
  const yearFraction = dateToYearFraction(date);

  const step = (days: number) => setCurrentTimeMs(currentTimeMs + days * 86400000);

  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-10 border-t border-offwhite/10 bg-space-raised/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:px-6">
        {/* readout + direct date input */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xl tracking-wider text-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] md:text-2xl">
              {formatDate(date)}
            </span>
            <span className="font-mono text-sm text-offwhite/50">{formatTime(date)} UTC</span>
            {isPlaying && <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-alert" />}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="datetime-local"
              value={toDateTimeLocalValue(date)}
              onChange={(e) => {
                const ms = fromDateTimeLocalValue(e.target.value);
                if (!Number.isNaN(ms)) setCurrentTimeMs(ms);
              }}
              className="rounded-md border border-offwhite/15 bg-space px-2 py-1 font-mono text-[11px] text-offwhite/80 focus:border-cyan/60 focus:outline-none"
            />
            <button
              onClick={jumpToNow}
              className="rounded-md border border-offwhite/15 px-2.5 py-1 font-mono text-[10px] tracking-wide text-offwhite/60 hover:border-cyan/50 hover:text-cyan"
            >
              NOW
            </button>
          </div>
        </div>

        {/* transport controls + speed presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => step(-30)}
            className="rounded-md border border-offwhite/15 px-2.5 py-1.5 font-mono text-xs text-offwhite/60 hover:border-cyan/50 hover:text-cyan"
            title="30日 戻す"
          >
            «
          </button>
          <button
            onClick={togglePlaying}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan/60 bg-cyan/10 text-cyan shadow-[0_0_12px_rgba(0,240,255,0.35)] transition-transform hover:scale-105"
          >
            {isPlaying ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <rect x="1.5" y="1" width="3" height="10" />
                <rect x="7.5" y="1" width="3" height="10" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M2 1 L11 6 L2 11 Z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => step(30)}
            className="rounded-md border border-offwhite/15 px-2.5 py-1.5 font-mono text-xs text-offwhite/60 hover:border-cyan/50 hover:text-cyan"
            title="30日 進める"
          >
            »
          </button>

          <div className="mx-1 h-5 w-px bg-offwhite/10" />

          <div className="flex flex-wrap gap-1">
            {SPEED_PRESETS.map((preset, idx) => (
              <button
                key={preset.label}
                onClick={() => setSpeedIndex(idx)}
                className={`rounded-full border px-2.5 py-1 font-mono text-[10px] transition-colors ${
                  speedIndex === idx
                    ? 'border-cyan/70 bg-cyan/15 text-cyan'
                    : 'border-offwhite/12 text-offwhite/45 hover:border-offwhite/30 hover:text-offwhite/80'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* broad year timeline */}
        <div className="flex items-center gap-3">
          <span className="w-10 shrink-0 font-mono text-[10px] text-offwhite/35">{TIMELINE_MIN_YEAR}</span>
          <input
            type="range"
            min={TIMELINE_MIN_YEAR}
            max={TIMELINE_MAX_YEAR}
            step={0.01}
            value={yearFraction}
            onChange={(e) => setCurrentTimeMs(yearFractionToDate(Number(e.target.value)).getTime())}
            className="h-1 flex-1 cursor-pointer"
          />
          <span className="w-10 shrink-0 text-right font-mono text-[10px] text-offwhite/35">{TIMELINE_MAX_YEAR}</span>
        </div>
      </div>
    </div>
  );
}
