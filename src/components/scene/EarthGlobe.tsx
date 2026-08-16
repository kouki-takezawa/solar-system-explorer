import { forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import type { Mesh } from 'three';

const EARTH_DAY_MAP = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg';
const EARTH_NORMAL_MAP = 'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg';
const EARTH_CLOUDS_MAP = 'https://threejs.org/examples/textures/planets/earth_clouds_1024.png';

interface EarthGlobeProps {
  radius: number;
  isSelected: boolean;
  isHovered: boolean;
}

/** Textured Earth (real NASA day map + normal map + cloud layer) instead of a flat colored sphere. */
export const EarthGlobe = forwardRef<Mesh, EarthGlobeProps>(function EarthGlobe(
  { radius, isSelected, isHovered },
  ref,
) {
  const [dayMap, normalMap, cloudsMap] = useTexture([EARTH_DAY_MAP, EARTH_NORMAL_MAP, EARTH_CLOUDS_MAP]);
  const cloudsRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.018;
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={dayMap}
          normalMap={normalMap}
          normalScale={[0.6, 0.6]}
          roughness={0.75}
          metalness={0.05}
          emissive={isSelected || isHovered ? '#00f0ff' : '#000000'}
          emissiveIntensity={isSelected ? 0.18 : isHovered ? 0.08 : 0}
        />
      </mesh>
      <mesh ref={cloudsRef} scale={1.012}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial map={cloudsMap} transparent opacity={0.55} depthWrite={false} />
      </mesh>
    </group>
  );
});
