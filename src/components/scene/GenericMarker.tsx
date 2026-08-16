import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Html } from '@react-three/drei';
import { AdditiveBlending, Group, Sprite, SpriteMaterial, Vector3 } from 'three';
import { setBodyRadius } from '../../lib/radiusRegistry';
import { getBodyPosition } from '../../lib/positionsRegistry';
import { getStarGlowTexture } from '../../lib/starTexture';
import { useSelectionStore } from '../../store/selectionStore';

interface GenericMarkerProps {
  id: string;
  position: Vector3;
  color: string;
  label: string;
  radius?: number;
  glow?: boolean;
}

/** A clickable, star-like labeled point used by the stellar / galaxy / universe views. */
export function GenericMarker({ id, position, color, label, radius = 0.6, glow = true }: GenericMarkerProps) {
  const groupRef = useRef<Group>(null);
  const haloRef = useRef<Sprite>(null);
  const worldPos = useRef(new Vector3());
  const twinklePhase = useMemo(() => Math.random() * Math.PI * 2, []);
  const glowTexture = useMemo(() => getStarGlowTexture(), []);

  const select = useSelectionStore((s) => s.select);
  const setHovered = useSelectionStore((s) => s.setHovered);
  const isSelected = useSelectionStore((s) => s.selectedId === id);
  const isHovered = useSelectionStore((s) => s.hoveredId === id);

  useEffect(() => {
    // Markers represent point-like or vastly-larger-than-rendered objects
    // (stars, galaxies, superclusters) -- frame the camera well back from the
    // tiny visual sprite so a click doesn't just fill the screen with it.
    setBodyRadius(id, radius * 5);
  }, [id, radius]);

  useFrame(({ clock }) => {
    // Track world position every frame (not just on mount) so clicks/camera
    // framing stay correct even when an ancestor group is animating/rotating
    // (e.g. the slowly-spinning galaxy).
    if (groupRef.current) {
      groupRef.current.getWorldPosition(worldPos.current);
      getBodyPosition(id).copy(worldPos.current);
    }
    if (haloRef.current) {
      const t = clock.elapsedTime;
      const flicker = 0.82 + Math.sin(t * 2.1 + twinklePhase) * 0.12 + Math.sin(t * 5.4 + twinklePhase) * 0.06;
      const mat = haloRef.current.material as SpriteMaterial;
      mat.opacity = flicker * (isSelected || isHovered ? 1 : 0.85);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        select(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* bright white-hot core -- real stars read as near-white at their center regardless of tint */}
      <sprite scale={[radius * 1.3, radius * 1.3, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#ffffff"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
      {glow && (
        <sprite ref={haloRef} scale={[radius * 3.6, radius * 3.6, 1]}>
          <spriteMaterial
            map={glowTexture}
            color={color}
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      )}
      {isSelected && (
        <Billboard>
          <mesh>
            <ringGeometry args={[radius * 2.4, radius * 2.6, 40]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} toneMapped={false} />
          </mesh>
        </Billboard>
      )}
      <Html position={[0, radius * 2 + 0.4, 0]} center style={{ pointerEvents: 'none' }} occlude={false}>
        <div
          className="font-mono"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            whiteSpace: 'nowrap',
            color: isSelected || isHovered ? '#00f0ff' : 'rgba(240,244,248,0.6)',
            textShadow: isSelected || isHovered ? '0 0 8px rgba(0,240,255,0.8)' : 'none',
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
          {label}
        </div>
      </Html>
    </group>
  );
}
