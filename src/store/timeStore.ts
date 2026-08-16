import { create } from 'zustand';

export interface SpeedPreset {
  label: string;
  /** simulated seconds advanced per one real second */
  secondsPerSecond: number;
}

export const SPEED_PRESETS: SpeedPreset[] = [
  { label: '0.5×', secondsPerSecond: 0.5 },
  { label: '1× (実時間)', secondsPerSecond: 1 },
  { label: '1時間/秒', secondsPerSecond: 3600 },
  { label: '1日/秒', secondsPerSecond: 86400 },
  { label: '1週間/秒', secondsPerSecond: 604800 },
  { label: '1ヶ月/秒', secondsPerSecond: 2629800 },
  { label: '1年/秒', secondsPerSecond: 31557600 },
];

export const TIMELINE_MIN_YEAR = 1970;
export const TIMELINE_MAX_YEAR = 2050;

interface TimeState {
  currentTimeMs: number;
  isPlaying: boolean;
  speedIndex: number;
  setPlaying: (playing: boolean) => void;
  togglePlaying: () => void;
  setSpeedIndex: (index: number) => void;
  setCurrentTimeMs: (ms: number) => void;
  advance: (realDeltaSeconds: number) => void;
  jumpToNow: () => void;
}

export const useTimeStore = create<TimeState>((set, get) => ({
  currentTimeMs: Date.now(),
  // Plays by default at a visibly fast rate -- at 1x real-time, orbital
  // motion is imperceptible to the eye, which reads as "nothing moves".
  isPlaying: true,
  speedIndex: 3,
  setPlaying: (playing) => set({ isPlaying: playing }),
  togglePlaying: () => set({ isPlaying: !get().isPlaying }),
  setSpeedIndex: (index) => set({ speedIndex: index }),
  setCurrentTimeMs: (ms) => set({ currentTimeMs: ms }),
  advance: (realDeltaSeconds) => {
    const { isPlaying, speedIndex, currentTimeMs } = get();
    if (!isPlaying) return;
    const preset = SPEED_PRESETS[speedIndex];
    set({ currentTimeMs: currentTimeMs + realDeltaSeconds * preset.secondsPerSecond * 1000 });
  },
  jumpToNow: () => set({ currentTimeMs: Date.now() }),
}));
