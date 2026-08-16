import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import type { Mesh } from 'three';
import { SUN } from '../../data/planets';
import { setBodyRadius } from '../../lib/radiusRegistry';
import { getBodyPosition } from '../../lib/positionsRegistry';
import { useSelectionStore } from '../../store/selectionStore';

export function SunMesh() {
  const meshRef = useRef<Mesh>(null);
  const select = useSelectionStore((s) => s.select);
  const selectedId = useSelectionStore((s) => s.selectedId);
  const isSelected = selectedId === 'sun';

  useEffect(() => {
    setBodyRadius('sun', SUN.sceneRadius);
    getBodyPosition('sun').set(0, 0, 0);
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.04;
  });

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        select('sun');
      }}
    >
      <mesh ref={meshRef}>
        <sphereGeometry args={[SUN.sceneRadius, 48, 48]} />
        <meshBasicMaterial color={SUN.color} toneMapped={false} />
      </mesh>
      {/* soft glow halo */}
      <mesh scale={1.35}>
        <sphereGeometry args={[SUN.sceneRadius, 32, 32]} />
        <meshBasicMaterial color={SUN.color} transparent opacity={0.18} toneMapped={false} />
      </mesh>
      <mesh scale={1.8}>
        <sphereGeometry args={[SUN.sceneRadius, 32, 32]} />
        <meshBasicMaterial color={SUN.color} transparent opacity={0.06} toneMapped={false} />
      </mesh>
      {isSelected && (
        <Billboard>
          <mesh>
            <ringGeometry args={[SUN.sceneRadius * 1.5, SUN.sceneRadius * 1.58, 64]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} toneMapped={false} />
          </mesh>
        </Billboard>
      )}
      <pointLight color="#fff4e0" intensity={220} distance={0} decay={2} />
    </group>
  );
}
