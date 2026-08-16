import { useSelectionStore, type CameraMode } from '../../store/selectionStore';

const MODES: { key: CameraMode; label: string; hint: string; disabled?: boolean }[] = [
  { key: 'free', label: 'フリーカメラ', hint: '自由移動' },
  { key: 'follow', label: '天体追従', hint: '対象を中心に固定' },
  { key: 'jump', label: '探査機視点', hint: 'Phase 3 実装予定', disabled: true },
];

export function CameraModeSwitch() {
  const cameraMode = useSelectionStore((s) => s.cameraMode);
  const setCameraMode = useSelectionStore((s) => s.setCameraMode);

  return (
    <div className="pointer-events-auto absolute right-2 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-1.5 md:right-5 md:gap-2">
      {MODES.map((mode) => {
        const active = cameraMode === mode.key;
        return (
          <button
            key={mode.key}
            disabled={mode.disabled}
            onClick={() => !mode.disabled && setCameraMode(mode.key)}
            title={mode.hint}
            className={`group flex w-[92px] flex-col items-end rounded-lg border px-2 py-1.5 text-right transition-all md:w-[128px] md:px-3 md:py-2 ${
              mode.disabled
                ? 'cursor-not-allowed border-offwhite/8 bg-space-raised/50 opacity-40'
                : active
                  ? 'border-cyan/60 bg-cyan/10 shadow-[0_0_16px_rgba(0,240,255,0.25)]'
                  : 'border-offwhite/12 bg-space-raised/70 hover:border-offwhite/30'
            }`}
          >
            <span className={`font-mono text-[10px] tracking-wide md:text-[11px] ${active ? 'text-cyan' : 'text-offwhite/75'}`}>
              {mode.label}
            </span>
            <span className="hidden font-mono text-[9px] text-offwhite/35 sm:block">{mode.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
