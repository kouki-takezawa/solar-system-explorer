import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { DoubleSide, RingGeometry, Vector3 } from 'three';

interface SaturnRingProps {
  innerRadius: number;
  outerRadius: number;
  textureUrl: string;
}

/** RingGeometry's default UVs aren't radial, so a ring texture just smears -- remap u across [inner, outer]. */
export function SaturnRing({ innerRadius, outerRadius, textureUrl }: SaturnRingProps) {
  const texture = useTexture(textureUrl);

  const geometry = useMemo(() => {
    const geo = new RingGeometry(innerRadius, outerRadius, 128, 1);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    const v = new Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const u = (v.length() - innerRadius) / (outerRadius - innerRadius);
      uv.setXY(i, u, 1);
    }
    return geo;
  }, [innerRadius, outerRadius]);

  return (
    <mesh geometry={geometry} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
      <meshStandardMaterial map={texture} transparent side={DoubleSide} roughness={0.85} metalness={0.05} />
    </mesh>
  );
}
