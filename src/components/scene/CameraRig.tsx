import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import gsap from 'gsap';
import { Vector3 } from 'three';
import { useSelectionStore } from '../../store/selectionStore';
import { getBodyPosition } from '../../lib/positionsRegistry';
import { getBodyRadius } from '../../lib/radiusRegistry';

interface CameraRigProps {
  /** Default camera distance from the origin when arriving via a tab click / drill-down. */
  overviewDistance: number;
  /** Zooming in past this distance requests a transition to the next-smaller level. */
  zoomInMin: number;
  /** Zooming out past this distance requests a transition to the next-larger level. */
  zoomOutMax: number;
  /**
   * Fired when the user scrolls past the near/far edge of this level. Return
   * true if it actually triggered a level change (there was somewhere to go)
   * -- only then do we stop re-checking for this mount's lifetime. Returning
   * false (e.g. already at the outermost/innermost level) leaves the check
   * live, since the camera may still be sitting right at the boundary.
   */
  onBoundary?: (direction: 'in' | 'out') => boolean;
}

export function CameraRig({ overviewDistance, zoomInMin, zoomOutMax, onBoundary }: CameraRigProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const isAnimatingRef = useRef(false);
  const followBaseRef = useRef(new Vector3());
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasMountedRef = useRef(false);
  const boundaryFiredRef = useRef(false);

  const selectedId = useSelectionStore((s) => s.selectedId);
  const cameraMode = useSelectionStore((s) => s.cameraMode);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const targetPos = selectedId ? getBodyPosition(selectedId).clone() : new Vector3(0, 0, 0);

    const entry = !hasMountedRef.current ? useSelectionStore.getState().pendingZoomEntry : null;

    let camDistance: number;
    if (selectedId) {
      const framingMultiplier = cameraMode === 'jump' ? 3 : 7;
      camDistance = Math.max(getBodyRadius(selectedId) * framingMultiplier, overviewDistance * 0.02);
    } else if (entry === 'near') {
      camDistance = zoomInMin * 1.4;
    } else if (entry === 'far') {
      camDistance = zoomOutMax * 0.75;
    } else {
      camDistance = overviewDistance;
    }

    const currentOffset = camera.position.clone().sub(controls.target);
    const dir = currentOffset.lengthSq() > 0.0001 ? currentOffset.normalize() : new Vector3(0.5, 0.35, 1).normalize();
    const newCamPos = targetPos.clone().addScaledVector(dir, camDistance);

    timelineRef.current?.kill();

    // First mount right after switching scale levels: the unit scales of the
    // two levels are unrelated, so we can't tween a fixed 3D path between
    // them -- instead start a bit further along the *same* zoom direction the
    // user was already moving in (closer for a "near" arrival, farther for a
    // "far" one) and animate in to the entry point, so it still reads as one
    // continuous zoom rather than a hard cut.
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      controls.target.copy(targetPos);
      followBaseRef.current.copy(targetPos);

      // React StrictMode (dev only) double-invokes effects on mount: run ->
      // cleanup -> run again, to catch effects that aren't idempotent. We
      // deliberately don't consume `pendingZoomEntry` here (it's left for the
      // *next* setScaleLevel call to overwrite) so both invocations compute
      // the same entry animation and stay idempotent; the cleanup below fully
      // undoes this branch's side effects so a killed-mid-flight tween can't
      // leave `controls.enabled` stuck false.
      if (entry === 'near' || entry === 'far') {
        const startDistance = entry === 'near' ? camDistance * 0.55 : camDistance * 1.8;
        const startCamPos = targetPos.clone().addScaledVector(dir, startDistance);
        camera.position.copy(startCamPos);
        controls.update();

        controls.enabled = false;
        isAnimatingRef.current = true;
        const camProxy = { x: startCamPos.x, y: startCamPos.y, z: startCamPos.z };
        const tl = gsap.timeline({
          onUpdate: () => camera.position.set(camProxy.x, camProxy.y, camProxy.z),
          onComplete: () => {
            controls.enabled = true;
            isAnimatingRef.current = false;
          },
        });
        tl.to(camProxy, { x: newCamPos.x, y: newCamPos.y, z: newCamPos.z, duration: 0.85, ease: 'power2.out' });
        timelineRef.current = tl;
      } else {
        camera.position.copy(newCamPos);
        controls.update();
      }
      return () => {
        hasMountedRef.current = false;
        timelineRef.current?.kill();
        controls.enabled = true;
        isAnimatingRef.current = false;
      };
    }

    controls.enabled = false;
    isAnimatingRef.current = true;

    const camProxy = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const targetProxy = { x: controls.target.x, y: controls.target.y, z: controls.target.z };

    const tl = gsap.timeline({
      onUpdate: () => {
        camera.position.set(camProxy.x, camProxy.y, camProxy.z);
        controls.target.set(targetProxy.x, targetProxy.y, targetProxy.z);
      },
      onComplete: () => {
        controls.enabled = true;
        isAnimatingRef.current = false;
        followBaseRef.current.copy(targetPos);
      },
    });
    tl.to(camProxy, { x: newCamPos.x, y: newCamPos.y, z: newCamPos.z, duration: 1.7, ease: 'power3.inOut' }, 0);
    tl.to(targetProxy, { x: targetPos.x, y: targetPos.y, z: targetPos.z, duration: 1.7, ease: 'power3.inOut' }, 0);
    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, cameraMode]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls || isAnimatingRef.current) return;

    if ((cameraMode === 'follow' || cameraMode === 'jump') && selectedId) {
      const live = getBodyPosition(selectedId);
      const delta = live.clone().sub(followBaseRef.current);
      if (delta.lengthSq() > 0) {
        controls.target.add(delta);
        camera.position.add(delta);
        followBaseRef.current.copy(live);
      }
    }
    controls.update();

    if (onBoundary && !boundaryFiredRef.current && !selectedId) {
      const dist = camera.position.distanceTo(controls.target);
      if (dist >= zoomOutMax * 0.995) {
        if (onBoundary('out')) boundaryFiredRef.current = true;
      } else if (dist <= zoomInMin * 1.02) {
        if (onBoundary('in')) boundaryFiredRef.current = true;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={zoomInMin * 0.97}
      maxDistance={zoomOutMax * 1.03}
      rotateSpeed={0.55}
      zoomSpeed={0.8}
    />
  );
}
