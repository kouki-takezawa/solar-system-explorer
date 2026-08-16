import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Group, Sprite, SpriteMaterial, Vector3 } from 'three';
import { getBodyPosition } from '../../lib/positionsRegistry';
import { getStarGlowTexture } from '../../lib/starTexture';
import { useSelectableBody } from '../../hooks/useSelectableBody';
import { SelectionRing } from './SelectionRing';
import { BodyLabel } from './BodyLabel';

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

  // Markers represent point-like or vastly-larger-than-rendered objects
  // (stars, galaxies, superclusters) -- frame the camera well back from the
  // tiny visual sprite so a click doesn't just fill the screen with it.
  const { isSelected, isHovered, handlers } = useSelectableBody(id, radius * 5);

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
    <group ref={groupRef} position={position} {...handlers}>
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
      {isSelected && <SelectionRing innerRadius={radius * 2.4} outerRadius={radius * 2.6} />}
      <BodyLabel name={label} yOffset={radius * 2 + 0.4} active={isSelected || isHovered} />
    </group>
  );
}
