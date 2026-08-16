import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Group, Vector3 } from 'three';
import type { ProbeData } from '../../data/probes';
import { PLANETS } from '../../data/planets';
import { heliocentricPosition } from '../../lib/orbitalMechanics';
import { daysSinceJ2000 } from '../../lib/julianDate';
import { latLngToWorldDirection } from '../../lib/planetGeo';
import { scaleDistanceAU } from '../../lib/scale';
import { getBodyPosition } from '../../lib/positionsRegistry';
import { useSelectionStore } from '../../store/selectionStore';
import { useTimeStore } from '../../store/timeStore';
import { useSelectableBody } from '../../hooks/useSelectableBody';
import { getStarGlowTexture } from '../../lib/starTexture';
import { ProbeModel } from './ProbeModel';
import { SelectionRing } from './SelectionRing';
import { BodyLabel } from './BodyLabel';

const YEAR_MS = 365.25 * 86400 * 1000;
const parentRotationPeriod = new Map(PLANETS.map((p) => [p.id, p.rotationPeriodHours]));
const parentSceneRadius = new Map(PLANETS.map((p) => [p.id, p.sceneRadius]));

function computeScenePosition(probe: ProbeData, currentTimeMs: number, distanceScale: 'log' | 'true', out: Vector3): Vector3 {
  const date = new Date(currentTimeMs);
  const motion = probe.motion;

  if (motion.type === 'orbit') {
    const parentPos = getBodyPosition(motion.parentId);
    const rel = heliocentricPosition(motion.elements, date);
    const dirLen = Math.hypot(rel.x, rel.z, rel.y) || 1;
    out.set(rel.x / dirLen, rel.z / dirLen, rel.y / dirLen);
    return out.multiplyScalar(motion.visualOrbitRadius).add(parentPos);
  }

  if (motion.type === 'surface') {
    const parentPos = getBodyPosition(motion.parentId);
    const rotationPeriodHours = parentRotationPeriod.get(motion.parentId) ?? 24;
    const sceneRadius = parentSceneRadius.get(motion.parentId) ?? 1;
    const hours = daysSinceJ2000(date) * 24;
    const rotationY = ((hours / rotationPeriodHours) * Math.PI * 2) % (Math.PI * 2);
    latLngToWorldDirection(motion.latDeg, motion.lngDeg, rotationY, out);
    return out.multiplyScalar(sceneRadius * 1.03).add(parentPos);
  }

  // escape trajectory: decades past the last gravity assist, essentially a straight radial line by now
  const yearsSince = (currentTimeMs - motion.referenceDateMs) / YEAR_MS;
  const distanceAU = Math.max(0.01, motion.referenceDistanceAU + motion.speedAUPerYear * yearsSince);
  const sceneDist = scaleDistanceAU(distanceAU, distanceScale);
  const lonRad = (motion.directionLonDeg * Math.PI) / 180;
  const latRad = (motion.directionLatDeg * Math.PI) / 180;
  const ex = Math.cos(latRad) * Math.cos(lonRad);
  const ey = Math.cos(latRad) * Math.sin(lonRad);
  const ez = Math.sin(latRad);
  return out.set(ex, ez, ey).multiplyScalar(sceneDist);
}

export function ProbeMesh({ probe }: { probe: ProbeData }) {
  const groupRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  const scratch = useRef(new Vector3());
  const [launched, setLaunched] = useState(() => useTimeStore.getState().currentTimeMs >= probe.launchDateMs);
  const glowTexture = useMemo(() => getStarGlowTexture(), []);

  const { isSelected, isHovered, handlers } = useSelectableBody(probe.id, probe.sceneSize * 4);

  useFrame((_, delta) => {
    const { currentTimeMs } = useTimeStore.getState();
    const isLaunched = currentTimeMs >= probe.launchDateMs;
    if (isLaunched !== launched) setLaunched(isLaunched);
    if (!isLaunched) return;

    const { distanceScale } = useSelectionStore.getState();
    const pos = computeScenePosition(probe, currentTimeMs, distanceScale, scratch.current);
    groupRef.current?.position.copy(pos);
    getBodyPosition(probe.id).copy(pos);
    if (modelRef.current) modelRef.current.rotation.y += delta * 0.15;
  });

  if (!launched) return null;

  const isRover = probe.motion.type === 'surface';

  return (
    <group ref={groupRef} {...handlers}>
      <group ref={modelRef}>
        <ProbeModel size={probe.sceneSize} color={probe.color} isRover={isRover} />
      </group>

      {/* always-visible blip so tiny probes stay findable when zoomed out */}
      <sprite scale={[probe.sceneSize * 6, probe.sceneSize * 6, 1]}>
        <spriteMaterial
          map={glowTexture}
          color={probe.color}
          transparent
          opacity={isSelected || isHovered ? 1 : 0.75}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      {isSelected && <SelectionRing innerRadius={probe.sceneSize * 5} outerRadius={probe.sceneSize * 5.6} />}

      <BodyLabel name={probe.nameJa} yOffset={probe.sceneSize * 3 + 0.2} active={isSelected || isHovered} dotSize={4} fontSize={10} />
    </group>
  );
}
