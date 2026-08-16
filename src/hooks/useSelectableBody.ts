import { useEffect } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useSelectionStore } from '../store/selectionStore';
import { setBodyRadius } from '../lib/radiusRegistry';

/**
 * Shared click/hover/selection wiring for anything clickable in the 3D
 * scene (planets, the Moon, probes, generic markers). Registers the body's
 * camera-framing radius once and returns selection state + event handlers
 * to spread onto the body's root group.
 */
export function useSelectableBody(id: string, radius: number) {
  const select = useSelectionStore((s) => s.select);
  const setHovered = useSelectionStore((s) => s.setHovered);
  const isSelected = useSelectionStore((s) => s.selectedId === id);
  const isHovered = useSelectionStore((s) => s.hoveredId === id);

  useEffect(() => {
    setBodyRadius(id, radius);
  }, [id, radius]);

  const handlers = {
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      select(id);
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(id);
      document.body.style.cursor = 'pointer';
    },
    onPointerOut: () => {
      setHovered(null);
      document.body.style.cursor = 'auto';
    },
  };

  return { isSelected, isHovered, handlers };
}
