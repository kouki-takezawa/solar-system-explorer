import { useMemo } from 'react';
import { Vector3 } from 'three';
import { UNIVERSE_SHELLS, radiusLyToSceneUnits } from '../../../lib/universe';
import { mulberry32, fibonacciSphereDirection } from '../../../lib/rng';
import { GenericMarker } from '../GenericMarker';

export function UniverseLevel() {
  const scatterPositions = useMemo(() => {
    const rng = mulberry32(46500);
    const count = 2600;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.pow(rng(), 0.65);
      const r = 25 + t * 150;
      const [dx, dy, dz] = fibonacciSphereDirection(i + Math.floor(rng() * 5), count);
      positions[i * 3] = dx * r;
      positions[i * 3 + 1] = dy * r;
      positions[i * 3 + 2] = dz * r;
    }
    return positions;
  }, []);

  return (
    <group>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[scatterPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.5} color="#8fa0ff" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
      </points>

      {UNIVERSE_SHELLS.filter((s) => s.radiusLy > 0).map((shell) => {
        const r = radiusLyToSceneUnits(shell.radiusLy);
        return (
          <mesh key={shell.id}>
            <sphereGeometry args={[r, 48, 32]} />
            <meshBasicMaterial color={shell.color} wireframe transparent opacity={0.22} toneMapped={false} />
          </mesh>
        );
      })}

      {UNIVERSE_SHELLS.map((shell) => {
        const r = shell.radiusLy > 0 ? radiusLyToSceneUnits(shell.radiusLy) : 0;
        const pos = shell.radiusLy > 0 ? new Vector3(r, r * 0.18, 0) : new Vector3(0, 0, 0);
        return (
          <GenericMarker
            key={shell.id}
            id={shell.id}
            position={pos}
            color={shell.color}
            label={shell.nameJa}
            radius={shell.radiusLy > 0 ? 2.2 : 1}
            glow={shell.radiusLy === 0}
          />
        );
      })}
    </group>
  );
}
