import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';
import type { OrbitalElements } from '../../lib/orbitalMechanics';
import { orbitPathPoints } from '../../lib/orbitalMechanics';
import { auToScene } from '../../lib/scale';
import { useSelectionStore } from '../../store/selectionStore';

interface OrbitPathProps {
  id: string;
  elements: OrbitalElements;
  color: string;
}

export function OrbitPath({ id, elements, color }: OrbitPathProps) {
  const distanceScale = useSelectionStore((s) => s.distanceScale);
  const selectedId = useSelectionStore((s) => s.selectedId);
  const hoveredId = useSelectionStore((s) => s.hoveredId);
  const isActive = selectedId === id || hoveredId === id;

  const points = useMemo(() => {
    const raw = orbitPathPoints(elements, 220);
    return raw.map((p) => auToScene(p, distanceScale, new Vector3()));
  }, [elements, distanceScale]);

  return (
    <Line
      points={points}
      color={isActive ? '#00f0ff' : color}
      transparent
      opacity={isActive ? 0.9 : selectedId ? 0.07 : 0.28}
      lineWidth={isActive ? 1.6 : 1}
      toneMapped={false}
    />
  );
}
