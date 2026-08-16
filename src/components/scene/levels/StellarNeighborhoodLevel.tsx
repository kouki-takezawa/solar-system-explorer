import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';
import { NEARBY_STARS } from '../../../data/stars';
import { fibonacciSphereDirection } from '../../../lib/rng';
import { GenericMarker } from '../GenericMarker';

export const SCENE_UNITS_PER_LY = 14;

export function StellarNeighborhoodLevel() {
  const starPositions = useMemo(
    () =>
      NEARBY_STARS.map((star, i) => {
        const [dx, dy, dz] = fibonacciSphereDirection(i, NEARBY_STARS.length);
        return new Vector3(dx, dy, dz).multiplyScalar(star.distanceLy * SCENE_UNITS_PER_LY);
      }),
    [],
  );

  return (
    <group>
      <GenericMarker id="sun" position={new Vector3(0, 0, 0)} color="#ffd27a" label="太陽（Sol）" radius={0.9} />
      {NEARBY_STARS.map((star, i) => (
        <group key={star.id}>
          <Line points={[new Vector3(0, 0, 0), starPositions[i]]} color={star.color} transparent opacity={0.12} lineWidth={1} />
          <GenericMarker id={star.id} position={starPositions[i]} color={star.color} label={star.nameJa} radius={0.55} />
        </group>
      ))}
    </group>
  );
}
