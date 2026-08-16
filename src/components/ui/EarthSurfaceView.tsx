import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelectionStore } from '../../store/selectionStore';

const ESRI_IMAGERY_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const ESRI_LABELS_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';
const DEFAULT_CENTER: [number, number] = [35.681, 139.767];

/** The 2D satellite map layer -- App.tsx mounts this behind the persistent UI chrome (Sidebar, TopBar, etc). */
export function EarthSurfaceView() {
  const latLng = useSelectionStore((s) => s.earthSurfaceLatLng);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const isFirstLatLngRef = useRef(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: latLng ?? DEFAULT_CENTER,
      zoom: latLng ? 12 : 4,
      minZoom: 2,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: true,
    });
    L.tileLayer(ESRI_IMAGERY_URL, {
      maxZoom: 19,
      attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics',
    }).addTo(map);
    L.tileLayer(ESRI_LABELS_URL, { maxZoom: 19, opacity: 0.9 }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;

    // Fade in rather than popping straight to a flat map -- the globe->map
    // cut itself is unavoidable (2D tiles), but a quick materialize reads as
    // a continuation of the dive instead of a hard scene change.
    const raf = requestAnimationFrame(() => setVisible(true));

    return () => {
      cancelAnimationFrame(raf);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Skip the initial mount (already the map's construction center) --
    // this effect handles *later* moves, e.g. the "go to my location" button.
    if (isFirstLatLngRef.current) {
      isFirstLatLngRef.current = false;
      return;
    }
    if (mapRef.current && latLng) {
      mapRef.current.flyTo(latLng, 18, { duration: 2 });
    }
  }, [latLng]);

  return (
    <div
      className="absolute inset-0 bg-space"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 550ms ease-out' }}
    >
      <div ref={containerRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-xs rounded-lg border border-offwhite/10 bg-space-raised/85 px-3 py-2 font-mono text-[10px] leading-relaxed text-offwhite/45 backdrop-blur-md">
        衛星画像: Esri World Imagery（無料タイル）。地域により解像度が異なります。
      </div>
    </div>
  );
}
