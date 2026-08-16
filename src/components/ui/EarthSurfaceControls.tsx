import { useState } from 'react';
import { useSelectionStore } from '../../store/selectionStore';

/** Replaces CameraModeSwitch's screen slot while the 2D surface map is open. */
export function EarthSurfaceControls() {
  const setEarthSurfaceOpen = useSelectionStore((s) => s.setEarthSurfaceOpen);
  const setEarthSurfaceLatLng = useSelectionStore((s) => s.setEarthSurfaceLatLng);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError('この端末では現在地を取得できません');
      return;
    }
    setError(null);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setEarthSurfaceLatLng([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => {
        setError('現在地を取得できませんでした（位置情報の許可を確認してください）');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="pointer-events-auto absolute right-2 top-1/2 z-10 flex -translate-y-1/2 flex-col items-end gap-1.5 md:right-5 md:gap-2">
      <button
        onClick={() => setEarthSurfaceOpen(false)}
        className="flex w-[92px] flex-col items-end rounded-lg border border-offwhite/12 bg-space-raised/70 px-2 py-1.5 text-right transition-all hover:border-cyan/50 md:w-[128px] md:px-3 md:py-2"
      >
        <span className="font-mono text-[10px] tracking-wide text-offwhite/75 md:text-[11px]">← 宇宙へ</span>
        <span className="hidden font-mono text-[9px] text-offwhite/35 sm:block">3Dビューに戻る</span>
      </button>
      <button
        onClick={handleLocate}
        disabled={locating}
        className="flex w-[92px] flex-col items-end rounded-lg border border-cyan/40 bg-cyan/10 px-2 py-1.5 text-right shadow-[0_0_16px_rgba(0,240,255,0.25)] transition-all hover:bg-cyan/15 disabled:opacity-50 md:w-[128px] md:px-3 md:py-2"
      >
        <span className="font-mono text-[10px] tracking-wide text-cyan md:text-[11px]">
          {locating ? '取得中...' : '📍 現在地へ'}
        </span>
        <span className="hidden font-mono text-[9px] text-offwhite/35 sm:block">位置情報を使用</span>
      </button>
      {error && (
        <span className="max-w-[160px] rounded-md bg-space-raised/95 px-2 py-1.5 text-right font-mono text-[9px] leading-relaxed text-alert md:max-w-[220px] md:text-[10px]">
          {error}
        </span>
      )}
    </div>
  );
}
