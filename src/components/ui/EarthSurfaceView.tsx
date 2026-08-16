import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelectionStore } from '../../store/selectionStore';

const ESRI_IMAGERY_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const ESRI_LABELS_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';

export function EarthSurfaceView() {
  const setEarthSurfaceOpen = useSelectionStore((s) => s.setEarthSurfaceOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [35.681, 139.767],
      zoom: 4,
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

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const handleLocate = () => {
    if (!mapRef.current || !navigator.geolocation) {
      setLocateError('この端末では現在地を取得できません');
      return;
    }
    setLocateError(null);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 18, { duration: 2 });
        setLocating(false);
      },
      () => {
        setLocateError('現在地を取得できませんでした（位置情報の許可を確認してください）');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="absolute inset-0 z-40 bg-space">
      <div ref={containerRef} className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3 md:p-5">
        <button
          onClick={() => setEarthSurfaceOpen(false)}
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-offwhite/15 bg-space-raised/90 px-4 py-2 font-mono text-xs text-offwhite/85 backdrop-blur-md transition-colors hover:border-cyan/50 hover:text-cyan"
        >
          ← 宇宙へ戻る
        </button>

        <div className="pointer-events-auto flex flex-col items-end gap-1.5">
          <button
            onClick={handleLocate}
            disabled={locating}
            className="flex items-center gap-2 rounded-full border border-cyan/40 bg-space-raised/90 px-4 py-2 font-mono text-xs text-cyan backdrop-blur-md transition-colors hover:bg-cyan/10 disabled:opacity-50"
          >
            {locating ? '取得中...' : '📍 現在地へ'}
          </button>
          {locateError && (
            <span className="max-w-[220px] rounded-md bg-space-raised/95 px-2.5 py-1.5 text-right font-mono text-[10px] leading-relaxed text-alert">
              {locateError}
            </span>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-xs rounded-lg border border-offwhite/10 bg-space-raised/85 px-3 py-2 font-mono text-[10px] leading-relaxed text-offwhite/45 backdrop-blur-md">
        衛星画像: Esri World Imagery（無料タイル）。地域により解像度が異なります。
      </div>
    </div>
  );
}
