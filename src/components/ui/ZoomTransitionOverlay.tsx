import { useEffect, useRef, useState } from 'react';
import { useSelectionStore } from '../../store/selectionStore';

/** Brief radial flash whenever the scale level or Earth-surface view changes, selling zoom transitions as a "dive" rather than a hard cut. */
export function ZoomTransitionOverlay() {
  const scaleLevel = useSelectionStore((s) => s.scaleLevel);
  const earthSurfaceOpen = useSelectionStore((s) => s.earthSurfaceOpen);
  const [opacity, setOpacity] = useState(0);
  const [instant, setInstant] = useState(false);
  const prevLevelRef = useRef(scaleLevel);
  const prevSurfaceRef = useRef(earthSurfaceOpen);

  useEffect(() => {
    const changed = prevLevelRef.current !== scaleLevel || prevSurfaceRef.current !== earthSurfaceOpen;
    prevLevelRef.current = scaleLevel;
    prevSurfaceRef.current = earthSurfaceOpen;
    if (!changed) return;
    setInstant(true);
    setOpacity(1);
    const raf = requestAnimationFrame(() => {
      setInstant(false);
      setOpacity(0);
    });
    return () => cancelAnimationFrame(raf);
  }, [scaleLevel, earthSurfaceOpen]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30"
      style={{
        opacity,
        transition: instant ? 'none' : 'opacity 650ms ease-out',
        background:
          'radial-gradient(circle, rgba(0,240,255,0.45) 0%, rgba(0,240,255,0.12) 40%, rgba(5,7,15,0) 72%)',
      }}
    />
  );
}
