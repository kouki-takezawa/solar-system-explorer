import { Billboard } from '@react-three/drei';

interface SelectionRingProps {
  innerRadius: number;
  outerRadius: number;
  segments?: number;
  /** Extra diamond accent ring (planets only). */
  diamond?: { innerRadius: number; outerRadius: number };
}

/** The camera-facing cyan "targeting" ring shown around whatever is currently selected. */
export function SelectionRing({ innerRadius, outerRadius, segments = 40, diamond }: SelectionRingProps) {
  return (
    <Billboard>
      <mesh>
        <ringGeometry args={[innerRadius, outerRadius, segments]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} toneMapped={false} />
      </mesh>
      {diamond && (
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <ringGeometry args={[diamond.innerRadius, diamond.outerRadius, 4, 1]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} toneMapped={false} />
        </mesh>
      )}
    </Billboard>
  );
}
