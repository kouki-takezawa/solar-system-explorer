import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useSelectionStore } from '../../store/selectionStore';
import { LEVEL_ZOOM, nextLevel, prevLevel } from '../../lib/levels';
import { CameraRig } from './CameraRig';
import { SolarSystemLevel } from './levels/SolarSystemLevel';
import { StellarNeighborhoodLevel } from './levels/StellarNeighborhoodLevel';
import { GalaxyLevel } from './levels/GalaxyLevel';
import { UniverseLevel } from './levels/UniverseLevel';

export function SceneCanvas() {
  const select = useSelectionStore((s) => s.select);
  const scaleLevel = useSelectionStore((s) => s.scaleLevel);
  const setScaleLevel = useSelectionStore((s) => s.setScaleLevel);
  const zoom = LEVEL_ZOOM[scaleLevel];
  const starsRadius = Math.max(400, zoom.zoomOutMax * 0.5);

  const next = nextLevel(scaleLevel);
  const prev = prevLevel(scaleLevel);

  return (
    <Canvas dpr={[1, 1.75]} gl={{ antialias: true, logarithmicDepthBuffer: true }} onPointerMissed={() => select(null)}>
      <color attach="background" args={['#05070f']} />
      <PerspectiveCamera makeDefault position={[0, 55, 130]} fov={50} near={0.05} far={8000} />
      <ambientLight intensity={0.22} color="#33406b" />

      <Suspense fallback={null}>
        <Stars radius={starsRadius} depth={80} count={6000} factor={2.4} saturation={0} fade speed={0.3} />

        <group key={scaleLevel}>
          {scaleLevel === 'solar' && <SolarSystemLevel />}
          {scaleLevel === 'stellar' && <StellarNeighborhoodLevel />}
          {scaleLevel === 'galaxy' && <GalaxyLevel />}
          {scaleLevel === 'universe' && <UniverseLevel />}

          <CameraRig
            overviewDistance={zoom.overviewDistance}
            zoomInMin={zoom.zoomInMin}
            zoomOutMax={zoom.zoomOutMax}
            onBoundary={(direction) => {
              if (direction === 'out' && next) {
                setScaleLevel(next);
                return true;
              }
              if (direction === 'in' && prev) {
                setScaleLevel(prev);
                return true;
              }
              return false;
            }}
          />
        </group>

        <EffectComposer multisampling={0}>
          <Bloom intensity={0.55} luminanceThreshold={0.22} luminanceSmoothing={0.35} mipmapBlur radius={0.6} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
