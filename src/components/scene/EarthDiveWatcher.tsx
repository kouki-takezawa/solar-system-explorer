import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useSelectionStore } from '../../store/selectionStore';
import { useTimeStore } from '../../store/timeStore';
import { getBodyPosition } from '../../lib/positionsRegistry';
import { getBodyRadius } from '../../lib/radiusRegistry';
import { daysSinceJ2000 } from '../../lib/julianDate';
import { worldDirectionToLatLng } from '../../lib/planetGeo';
import { PLANETS } from '../../data/planets';

const NORMAL_SELECTION_DISTANCE = 4.3; // matches CameraRig's usual "click a planet" framing for Earth
const EARTH_ROTATION_PERIOD_HOURS = PLANETS.find((p) => p.id === 'earth')!.rotationPeriodHours;

/** Watches for the camera zooming in past Earth's close-orbit clamp and opens the 2D surface map. */
export function EarthDiveWatcher() {
  const { camera } = useThree();
  const selectedId = useSelectionStore((s) => s.selectedId);
  const earthSurfaceOpen = useSelectionStore((s) => s.earthSurfaceOpen);
  const openEarthSurface = useSelectionStore((s) => s.openEarthSurface);
  const firedRef = useRef(false);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
  }, [selectedId]);

  useEffect(() => {
    if (wasOpenRef.current && !earthSurfaceOpen) {
      // Just closed the surface map: pull the camera back out to Earth's
      // normal close-up framing instead of leaving it jammed at the dive
      // threshold (which would just re-trigger immediately).
      const earthPos = getBodyPosition('earth');
      const offset = camera.position.clone().sub(earthPos);
      const dir = offset.lengthSq() > 0.0001 ? offset.normalize() : new Vector3(0.5, 0.35, 1).normalize();
      camera.position.copy(earthPos.clone().addScaledVector(dir, NORMAL_SELECTION_DISTANCE));
      firedRef.current = false;
    }
    wasOpenRef.current = earthSurfaceOpen;
  }, [earthSurfaceOpen, camera]);

  useFrame((state) => {
    if (earthSurfaceOpen || selectedId !== 'earth' || firedRef.current) return;
    // Measure against what the camera is actually orbiting/dollying toward
    // (controls.target), not Earth's live orbital position -- in free camera
    // mode the target stays fixed at the moment of selection while Earth
    // keeps moving, so comparing against the live position would drift out
    // of sync with what the OrbitControls zoom clamp itself is doing.
    const controls = state.controls as OrbitControlsImpl | null;
    if (!controls) return;
    const dist = camera.position.distanceTo(controls.target);
    const earthRadius = getBodyRadius('earth');
    if (dist <= earthRadius * 2.0) {
      firedRef.current = true;

      const earthPos = getBodyPosition('earth');
      const towardCamera = camera.position.clone().sub(earthPos).normalize();
      const { currentTimeMs } = useTimeStore.getState();
      const hours = daysSinceJ2000(new Date(currentTimeMs)) * 24;
      const rotationY = (hours / EARTH_ROTATION_PERIOD_HOURS) * Math.PI * 2;
      const latLng = worldDirectionToLatLng(towardCamera, rotationY);

      openEarthSurface(latLng);
    }
  });

  return null;
}
