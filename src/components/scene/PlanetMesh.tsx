import { Suspense, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import { DoubleSide, Group, Mesh, Vector3 } from 'three';
import type { PlanetData } from '../../data/planets';
import { heliocentricPosition } from '../../lib/orbitalMechanics';
import { daysSinceJ2000 } from '../../lib/julianDate';
import { auToScene } from '../../lib/scale';
import { getBodyPosition } from '../../lib/positionsRegistry';
import { setBodyRadius } from '../../lib/radiusRegistry';
import { useSelectionStore } from '../../store/selectionStore';
import { useTimeStore } from '../../store/timeStore';
import { EarthGlobe } from './EarthGlobe';

export function PlanetMesh({ planet }: { planet: PlanetData }) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const scratch = useRef(new Vector3());

  useEffect(() => {
    setBodyRadius(planet.id, planet.sceneRadius);
  }, [planet.id, planet.sceneRadius]);

  const select = useSelectionStore((s) => s.select);
  const setHovered = useSelectionStore((s) => s.setHovered);
  const isSelected = useSelectionStore((s) => s.selectedId === planet.id);
  const isHovered = useSelectionStore((s) => s.hoveredId === planet.id);

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
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        select(planet.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(planet.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {planet.id === 'earth' ? (
        <Suspense
          fallback={
            <mesh ref={meshRef}>
              <sphereGeometry args={[planet.sceneRadius, 40, 40]} />
              <meshStandardMaterial color={planet.color} roughness={0.85} metalness={0.05} />
            </mesh>
          }
        >
          <EarthGlobe ref={meshRef} radius={planet.sceneRadius} isSelected={isSelected} isHovered={isHovered} />
        </Suspense>
      ) : (
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
      )}

      {planet.hasRings && (
        <mesh rotation={[Math.PI / 2 - 0.2, 0, 0]}>
          <ringGeometry args={[planet.sceneRadius * 1.4, planet.sceneRadius * 2.3, 64]} />
          <meshBasicMaterial color="#d9c9a3" transparent opacity={0.5} side={DoubleSide} toneMapped={false} />
        </mesh>
      )}

      {isSelected && (
        <Billboard>
          <mesh>
            <ringGeometry args={[planet.sceneRadius * 1.7, planet.sceneRadius * 1.82, 48]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} toneMapped={false} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <ringGeometry args={[planet.sceneRadius * 2.1, planet.sceneRadius * 2.14, 4, 1]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} toneMapped={false} />
          </mesh>
        </Billboard>
      )}

      <Html position={[0, planet.sceneRadius + 0.55, 0]} center style={{ pointerEvents: 'none' }} occlude={false} zIndexRange={[10, 0]}>
        <div
          className="font-mono"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            whiteSpace: 'nowrap',
            color: isSelected || isHovered ? '#00f0ff' : 'rgba(240,244,248,0.55)',
            textShadow: isSelected || isHovered ? '0 0 8px rgba(0,240,255,0.8)' : 'none',
            transition: 'color 0.2s',
            letterSpacing: 0.4,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'currentColor',
              boxShadow: '0 0 6px currentColor',
            }}
          />
          {planet.nameJa}
        </div>
      </Html>
    </group>
  );
}
