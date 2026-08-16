import { useFrame } from '@react-three/fiber';
import { useTimeStore } from '../../store/timeStore';

/** Advances the simulated clock every frame. Renders nothing. */
export function TimeDriver() {
  useFrame((_, delta) => {
    useTimeStore.getState().advance(Math.min(delta, 0.25));
  });
  return null;
}
