import type { ScaleLevel } from '../types';

export const LEVEL_ORDER: ScaleLevel[] = ['solar', 'stellar', 'galaxy', 'universe'];

export interface LevelZoomConfig {
  /** Camera distance used when arriving at this level via the tab switcher / a drill-down click. */
  overviewDistance: number;
  /** Zooming in past this distance crosses into the next-smaller level (none for 'solar'). */
  zoomInMin: number;
  /** Zooming out past this distance crosses into the next-larger level (none for 'universe'). */
  zoomOutMax: number;
}

export const LEVEL_ZOOM: Record<ScaleLevel, LevelZoomConfig> = {
  solar: { overviewDistance: 130, zoomInMin: 1.2, zoomOutMax: 600 },
  stellar: { overviewDistance: 190, zoomInMin: 6, zoomOutMax: 1000 },
  galaxy: { overviewDistance: 260, zoomInMin: 15, zoomOutMax: 1300 },
  universe: { overviewDistance: 340, zoomInMin: 15, zoomOutMax: 2400 },
};

export function nextLevel(level: ScaleLevel): ScaleLevel | null {
  const i = LEVEL_ORDER.indexOf(level);
  return i < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[i + 1] : null;
}

export function prevLevel(level: ScaleLevel): ScaleLevel | null {
  const i = LEVEL_ORDER.indexOf(level);
  return i > 0 ? LEVEL_ORDER[i - 1] : null;
}
