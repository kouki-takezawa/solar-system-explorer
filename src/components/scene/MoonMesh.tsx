import { Suspense, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard, useTexture } from '@react-three/drei';
import { Group, Mesh, Vector3 } from 'three';
import { heliocentricPosition } from '../../lib/orbitalMechanics';
import { MOON_ELEMENTS, MOON_SCENE_RADIUS, MOON_VISUAL_ORBIT_RADIUS, MOON_TEXTURE_URL, MOON_ENTITY } from '../../data/moon';
import { getBodyPosition } from '../../lib/positionsRegistry';
import { setBodyRadius } from '../../lib/radiusRegistry';
import { useSelectionStore } from '../../store/selectionStore';
import { useTimeStore } from '../../store/timeStore';

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

  const select = useSelectionStore((s) => s.select);
  const setHovered = useSelectionStore((s) => s.setHovered);
  const isSelected = useSelectionStore((s) => s.selectedId === 'moon');
  const isHovered = useSelectionStore((s) => s.hoveredId === 'moon');

  useEffect(() => {
    setBodyRadius('moon', MOON_SCENE_RADIUS);
  }, []);

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
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        select('moon');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered('moon');
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(null);
        document.body.style.cursor = 'auto';
      }}
    >
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

      {isSelected && (
        <Billboard>
          <mesh>
            <ringGeometry args={[MOON_SCENE_RADIUS * 1.8, MOON_SCENE_RADIUS * 1.95, 40]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} toneMapped={false} />
          </mesh>
        </Billboard>
      )}

      <Html position={[0, MOON_SCENE_RADIUS + 0.3, 0]} center style={{ pointerEvents: 'none' }} occlude={false} zIndexRange={[10, 0]}>
        <div
          className="font-mono"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            whiteSpace: 'nowrap',
            color: isSelected || isHovered ? '#00f0ff' : 'rgba(240,244,248,0.5)',
            textShadow: isSelected || isHovered ? '0 0 8px rgba(0,240,255,0.8)' : 'none',
            letterSpacing: 0.4,
          }}
        >
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'currentColor',
              boxShadow: '0 0 6px currentColor',
            }}
          />
          {MOON_ENTITY.nameJa}
        </div>
      </Html>
    </group>
  );
}
