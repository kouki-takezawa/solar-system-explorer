import { DoubleSide } from 'three';

interface ProbeModelProps {
  size: number;
  color: string;
  isRover?: boolean;
}

/**
 * A small stylized probe -- body + solar panel wings (or, for rovers, a
 * flatter chassis + wheels). Procedural rather than a loaded glTF: no
 * external asset host to depend on (see the texture-CORS incident this
 * project already hit once), and it stays legible at the tiny scene scale
 * these are rendered at.
 */
export function ProbeModel({ size, color, isRover }: ProbeModelProps) {
  if (isRover) {
    return (
      <group>
        <mesh position={[0, size * 0.3, 0]}>
          <boxGeometry args={[size * 1.6, size * 0.6, size * 1.1]} />
          <meshStandardMaterial color={color} roughness={0.75} metalness={0.3} />
        </mesh>
        {[
          [-size * 0.7, -size * 0.5],
          [size * 0.7, -size * 0.5],
        ].map(([x, z]) => (
          <mesh key={`${x}-${z}`} position={[x, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[size * 0.35, size * 0.35, size * 0.3, 10]} />
            <meshStandardMaterial color="#3a3a3a" roughness={0.9} metalness={0.1} />
          </mesh>
        ))}
        {[
          [-size * 0.7, size * 0.5],
          [size * 0.7, size * 0.5],
        ].map(([x, z]) => (
          <mesh key={`${x}-${z}`} position={[x, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[size * 0.35, size * 0.35, size * 0.3, 10]} />
            <meshStandardMaterial color="#3a3a3a" roughness={0.9} metalness={0.1} />
          </mesh>
        ))}
        <mesh position={[0, size * 0.75, 0]}>
          <cylinderGeometry args={[size * 0.15, size * 0.15, size * 0.6, 8]} />
          <meshStandardMaterial color="#c9c9c9" roughness={0.5} metalness={0.6} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh>
        <boxGeometry args={[size * 0.9, size * 0.9, size * 0.9]} />
        <meshStandardMaterial color="#c9c9c9" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0, size * 0.7]}>
        <coneGeometry args={[size * 0.5, size * 0.7, 16]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.3} metalness={0.5} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * size * 1.6, 0, 0]}>
          <boxGeometry args={[size * 2, size * 0.06, size * 0.8]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.6} side={DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
