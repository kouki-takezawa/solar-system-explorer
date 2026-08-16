import { forwardRef } from 'react';
import { useTexture } from '@react-three/drei';
import type { Mesh } from 'three';

interface PlanetSurfaceProps {
  radius: number;
  textureUrl: string;
  isSelected: boolean;
  isHovered: boolean;
}

/** A sphere textured with a real planet map (Suspense-wrapped by the caller). */
export const PlanetSurface = forwardRef<Mesh, PlanetSurfaceProps>(function PlanetSurface(
  { radius, textureUrl, isSelected, isHovered },
  ref,
) {
  const map = useTexture(textureUrl);
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshStandardMaterial
        map={map}
        roughness={0.9}
        metalness={0.05}
        emissive={isSelected || isHovered ? '#00f0ff' : '#000000'}
        emissiveIntensity={isSelected ? 0.22 : isHovered ? 0.1 : 0}
      />
    </mesh>
  );
});
