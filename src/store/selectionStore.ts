import { create } from 'zustand';
import type { ScaleLevel } from '../types';
import { LEVEL_ORDER } from '../lib/levels';

export type CameraMode = 'free' | 'follow' | 'jump';
export type SidebarTab = 'overview' | 'telemetry' | 'missions';
export type DistanceScaleMode = 'log' | 'true';
export type ZoomEntry = 'near' | 'far' | null;

interface SelectionState {
  scaleLevel: ScaleLevel;
  /** How the camera should enter the level that was just switched to. */
  pendingZoomEntry: ZoomEntry;
  selectedId: string | null;
  hoveredId: string | null;
  cameraMode: CameraMode;
  searchQuery: string;
  sidebarTab: SidebarTab;
  distanceScale: DistanceScaleMode;
  sidebarOpen: boolean;
  /** True when the Earth dive-in (2D satellite map) overlay is showing. */
  earthSurfaceOpen: boolean;
  setEarthSurfaceOpen: (open: boolean) => void;
  /**
   * Switches scale level -- from a tab click, a drill-down button, or a
   * scroll-zoom crossing a boundary. The camera always arrives via a short
   * zoom animation whose direction matches whether this is a bigger scale
   * ('near' entry, feels like continuing to zoom out) or a smaller one
   * ('far' entry, feels like continuing to zoom in).
   */
  setScaleLevel: (level: ScaleLevel) => void;
  select: (id: string | null) => void;
  setHovered: (id: string | null) => void;
  setCameraMode: (mode: CameraMode) => void;
  setSearchQuery: (q: string) => void;
  setSidebarTab: (tab: SidebarTab) => void;
  setDistanceScale: (mode: DistanceScaleMode) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  scaleLevel: 'solar',
  pendingZoomEntry: null,
  selectedId: null,
  hoveredId: null,
  cameraMode: 'free',
  searchQuery: '',
  sidebarTab: 'overview',
  distanceScale: 'log',
  sidebarOpen: false,
  earthSurfaceOpen: false,
  setEarthSurfaceOpen: (open) => set({ earthSurfaceOpen: open }),
  setScaleLevel: (level) => {
    const currentIdx = LEVEL_ORDER.indexOf(get().scaleLevel);
    const targetIdx = LEVEL_ORDER.indexOf(level);
    const entry: ZoomEntry = targetIdx > currentIdx ? 'near' : targetIdx < currentIdx ? 'far' : null;
    set({
      scaleLevel: level,
      pendingZoomEntry: entry,
      selectedId: null,
      hoveredId: null,
      sidebarOpen: false,
      searchQuery: '',
      cameraMode: 'free',
    });
  },
  select: (id) => set({ selectedId: id, sidebarOpen: id !== null, sidebarTab: 'overview' }),
  setHovered: (id) => set({ hoveredId: id }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  setDistanceScale: (mode) => set({ distanceScale: mode }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
