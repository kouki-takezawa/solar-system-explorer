import { Suspense, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import type { Mesh } from 'three';
import { SUN } from '../../data/planets';
import { getBodyPosition } from '../../lib/positionsRegistry';
import { useSelectableBody } from '../../hooks/useSelectableBody';
import { SelectionRing } from './SelectionRing';
import { BodyLabel } from './BodyLabel';

function SunSurface({ meshRef }: { meshRef: React.RefObject<Mesh | null> }) {
  const map = useTexture(SUN.textureUrl);
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[SUN.sceneRadius, 48, 48]} />
      <meshBasicMaterial map={map} toneMapped={false} />
    </mesh>
  );
}

export function SunMesh() {
  const meshRef = useRef<Mesh>(null);
  const { isSelected, isHovered, handlers } = useSelectableBody('sun', SUN.sceneRadius);

  useEffect(() => {
    getBodyPosition('sun').set(0, 0, 0);
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.04;
  });

  return (
    <group {...handlers}>
      <Suspense
        fallback={
          <mesh ref={meshRef}>
            <sphereGeometry args={[SUN.sceneRadius, 48, 48]} />
            <meshBasicMaterial color={SUN.color} toneMapped={false} />
          </mesh>
        }
      >
        <SunSurface meshRef={meshRef} />
      </Suspense>
      {/* soft glow halo */}
      <mesh scale={1.35}>
        <sphereGeometry args={[SUN.sceneRadius, 32, 32]} />
        <meshBasicMaterial color={SUN.color} transparent opacity={0.18} toneMapped={false} />
      </mesh>
      <mesh scale={1.8}>
        <sphereGeometry args={[SUN.sceneRadius, 32, 32]} />
        <meshBasicMaterial color={SUN.color} transparent opacity={0.06} toneMapped={false} />
      </mesh>
      {isSelected && <SelectionRing innerRadius={SUN.sceneRadius * 1.5} outerRadius={SUN.sceneRadius * 1.58} segments={64} />}
      <BodyLabel name={SUN.nameJa} yOffset={SUN.sceneRadius + 0.6} active={isSelected || isHovered} />
      <pointLight color="#fff4e0" intensity={220} distance={0} decay={2} />
    </group>
  );
}
