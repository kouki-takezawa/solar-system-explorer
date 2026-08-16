import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Vector3 } from 'three';
import type { PlanetData } from '../../data/planets';
import { heliocentricPosition } from '../../lib/orbitalMechanics';
import { daysSinceJ2000 } from '../../lib/julianDate';
import { auToScene } from '../../lib/scale';
import { getBodyPosition } from '../../lib/positionsRegistry';
import { useSelectionStore } from '../../store/selectionStore';
import { useTimeStore } from '../../store/timeStore';
import { useSelectableBody } from '../../hooks/useSelectableBody';
import { EarthGlobe } from './EarthGlobe';
import { PlanetSurface } from './PlanetSurface';
import { SaturnRing } from './SaturnRing';
import { SelectionRing } from './SelectionRing';
import { BodyLabel } from './BodyLabel';

export function PlanetMesh({ planet }: { planet: PlanetData }) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const scratch = useRef(new Vector3());

  const { isSelected, isHovered, handlers } = useSelectableBody(planet.id, planet.sceneRadius);

  useFrame(() => {
    const { currentTimeMs } = useTimeStore.getState();
    const { distanceScale } = useSelectionStore.getState();
    const date = new Date(currentTimeMs);

    const helio = heliocentricPosition(planet.elements, date);
    auToScene(helio, distanceScale, scratch.current);
    groupRef.current?.position.copy(scratch.current);
    getBodyPosition(planet.id).copy(scratch.current);

    if (meshRef.current) {
      const hours = daysSinceJ2000(date) * 24;
      const rotations = hours / planet.rotationPeriodHours;
      meshRef.current.rotation.y = rotations * Math.PI * 2;
    }
  });

  return (
    <group ref={groupRef} {...handlers}>
      {(() => {
        const fallback = (
          <mesh ref={meshRef}>
            <sphereGeometry args={[planet.sceneRadius, 40, 40]} />
            <meshStandardMaterial
              color={planet.color}
              roughness={0.85}
              metalness={0.05}
              emissive={isSelected || isHovered ? '#00f0ff' : '#000000'}
              emissiveIntensity={isSelected ? 0.25 : isHovered ? 0.12 : 0}
            />
          </mesh>
        );
        if (planet.id === 'earth') {
          return (
            <Suspense fallback={fallback}>
              <EarthGlobe ref={meshRef} radius={planet.sceneRadius} isSelected={isSelected} isHovered={isHovered} />
            </Suspense>
          );
        }
        if (planet.textureUrl) {
          return (
            <Suspense fallback={fallback}>
              <PlanetSurface
                ref={meshRef}
                radius={planet.sceneRadius}
                textureUrl={planet.textureUrl}
                isSelected={isSelected}
                isHovered={isHovered}
              />
            </Suspense>
          );
        }
        return fallback;
      })()}

      {planet.hasRings && planet.ringTextureUrl && (
        <Suspense fallback={null}>
          <SaturnRing
            innerRadius={planet.sceneRadius * 1.4}
            outerRadius={planet.sceneRadius * 2.3}
            textureUrl={planet.ringTextureUrl}
          />
        </Suspense>
      )}

      {isSelected && (
        <SelectionRing
          innerRadius={planet.sceneRadius * 1.7}
          outerRadius={planet.sceneRadius * 1.82}
          segments={48}
          diamond={{ innerRadius: planet.sceneRadius * 2.1, outerRadius: planet.sceneRadius * 2.14 }}
        />
      )}

      <BodyLabel name={planet.nameJa} yOffset={planet.sceneRadius + 0.55} active={isSelected || isHovered} />
    </group>
  );
}
