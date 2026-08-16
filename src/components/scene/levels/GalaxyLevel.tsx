import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { GALAXY_LANDMARKS, galaxyLyToScene, generateGalaxyPoints } from '../../../lib/galaxy';
import { mulberry32 } from '../../../lib/rng';
import { GenericMarker } from '../GenericMarker';

export function GalaxyLevel() {
  // Particles, bulge, and landmark labels all share one rotating group so the
  // labels stay locked onto their spiral arms as the galaxy slowly turns.
  const rotatingRef = useRef<Group>(null);

  const { positions, colors } = useMemo(() => {
    const rng = mulberry32(20260816);
    return generateGalaxyPoints(rng, 9000);
  }, []);

  useFrame((_, delta) => {
    if (rotatingRef.current) rotatingRef.current.rotation.y += delta * 0.003;
  });

  return (
    <group ref={rotatingRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.55} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} />
      </points>

      {/* central bulge glow */}
      <mesh>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial color="#ffe3b0" transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <mesh scale={2.2}>
        <sphereGeometry args={[6, 24, 24]} />
        <meshBasicMaterial color="#ffe3b0" transparent opacity={0.12} toneMapped={false} />
      </mesh>
      <pointLight color="#ffe3b0" intensity={60} distance={0} decay={2} />

      {GALAXY_LANDMARKS.map((landmark) => (
        <GenericMarker
          key={landmark.id}
          id={landmark.id}
          position={galaxyLyToScene([landmark.radiusLy, landmark.armBaseAngle, 0])}
          color={landmark.color}
          label={landmark.nameJa}
          radius={landmark.id === 'galactic-center' ? 1.2 : 0.7}
          glow={landmark.id !== 'galactic-center'}
        />
      ))}
    </group>
  );
}
