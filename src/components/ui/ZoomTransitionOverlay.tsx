import { useEffect, useRef, useState } from 'react';
import { useSelectionStore } from '../../store/selectionStore';

/** Brief radial flash whenever the scale level changes, selling scroll-driven transitions as a "dive" rather than a hard cut. */
export function ZoomTransitionOverlay() {
  const scaleLevel = useSelectionStore((s) => s.scaleLevel);
  const [opacity, setOpacity] = useState(0);
  const [instant, setInstant] = useState(false);
  const prevLevelRef = useRef(scaleLevel);

  useEffect(() => {
    if (prevLevelRef.current === scaleLevel) return;
    prevLevelRef.current = scaleLevel;
    setInstant(true);
    setOpacity(1);
    const raf = requestAnimationFrame(() => {
      setInstant(false);
      setOpacity(0);
    });
    return () => cancelAnimationFrame(raf);
  }, [scaleLevel]);

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
