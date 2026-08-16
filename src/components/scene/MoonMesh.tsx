import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Group, Mesh, Vector3 } from 'three';
import { heliocentricPosition } from '../../lib/orbitalMechanics';
import { MOON_ELEMENTS, MOON_SCENE_RADIUS, MOON_VISUAL_ORBIT_RADIUS, MOON_TEXTURE_URL, MOON_ENTITY } from '../../data/moon';
import { getBodyPosition } from '../../lib/positionsRegistry';
import { useTimeStore } from '../../store/timeStore';
import { useSelectableBody } from '../../hooks/useSelectableBody';
import { SelectionRing } from './SelectionRing';
import { BodyLabel } from './BodyLabel';

function MoonSurface({ meshRef }: { meshRef: React.RefObject<Mesh | null> }) {
  const map = useTexture(MOON_TEXTURE_URL);
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[MOON_SCENE_RADIUS, 32, 32]} />
      <meshStandardMaterial map={map} roughness={0.95} metalness={0} />
    </mesh>
  );
}

export function MoonMesh() {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const dirScratch = useRef(new Vector3());
  const posScratch = useRef(new Vector3());

  const { isSelected, isHovered, handlers } = useSelectableBody('moon', MOON_SCENE_RADIUS);

  useFrame(() => {
    const { currentTimeMs } = useTimeStore.getState();
    const date = new Date(currentTimeMs);

    // Real Kepler motion around Earth for the angular position/phase; the
    // orbit radius itself is exaggerated (MOON_VISUAL_ORBIT_RADIUS) since the
    // Moon's true ~384,000km distance would render imperceptibly close to
    // Earth's already-exaggerated scene radius.
    const rel = heliocentricPosition(MOON_ELEMENTS, date);
    const dir = dirScratch.current.set(rel.x, rel.z, rel.y).normalize();
    const earthPos = getBodyPosition('earth');
    const moonPos = posScratch.current.copy(earthPos).addScaledVector(dir, MOON_VISUAL_ORBIT_RADIUS);

    groupRef.current?.position.copy(moonPos);
    getBodyPosition('moon').copy(moonPos);

    if (meshRef.current) {
      meshRef.current.lookAt(earthPos); // tidally locked: same face always toward Earth
    }
  });

  return (
    <group ref={groupRef} {...handlers}>
      <Suspense
        fallback={
          <mesh ref={meshRef}>
            <sphereGeometry args={[MOON_SCENE_RADIUS, 32, 32]} />
            <meshStandardMaterial color={MOON_ENTITY.color} roughness={0.95} />
          </mesh>
        }
      >
        <MoonSurface meshRef={meshRef} />
      </Suspense>

      {isSelected && <SelectionRing innerRadius={MOON_SCENE_RADIUS * 1.8} outerRadius={MOON_SCENE_RADIUS * 1.95} />}

      <BodyLabel name={MOON_ENTITY.nameJa} yOffset={MOON_SCENE_RADIUS + 0.3} active={isSelected || isHovered} dotSize={4} />
    </group>
  );
}
