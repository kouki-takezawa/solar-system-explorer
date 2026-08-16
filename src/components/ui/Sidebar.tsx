import { useMemo } from 'react';
import { useSelectionStore, type SidebarTab } from '../../store/selectionStore';
import { useTimeStore } from '../../store/timeStore';
import { ALL_BODIES, PLANETS, type PlanetData } from '../../data/planets';
import { MOON_ENTITY } from '../../data/moon';
import { NEARBY_STARS, SUN_AS_STAR } from '../../data/stars';
import { GALAXY_LANDMARKS } from '../../lib/galaxy';
import { UNIVERSE_SHELLS } from '../../lib/universe';
import { heliocentricPosition, orbitalSpeedKmS, vecLength } from '../../lib/orbitalMechanics';
import { formatDate, formatTime } from '../../lib/timeUtils';
import type { Entity, ScaleLevel } from '../../types';

const AU_KM = 1.495978707e8;
const LIGHT_SPEED_KM_S = 299792.458;
const EARTH = PLANETS.find((p) => p.id === 'earth')!;
const STELLAR_ENTITIES: Entity[] = [SUN_AS_STAR, ...NEARBY_STARS];
const EARTH_INDEX = ALL_BODIES.findIndex((b) => b.id === 'earth');
const SOLAR_CHIPS = [...ALL_BODIES.slice(0, EARTH_INDEX + 1), MOON_ENTITY, ...ALL_BODIES.slice(EARTH_INDEX + 1)];

type ChipItem = { id: string; nameJa: string; nameEn: string; color: string };

function getChipList(scaleLevel: ScaleLevel): ChipItem[] {
  if (scaleLevel === 'solar') return SOLAR_CHIPS;
  if (scaleLevel === 'stellar') return STELLAR_ENTITIES;
  if (scaleLevel === 'galaxy') return GALAXY_LANDMARKS;
  return UNIVERSE_SHELLS;
}

function getEntityDetail(scaleLevel: ScaleLevel, id: string): Entity | null {
  if (scaleLevel === 'solar') return id === 'moon' ? MOON_ENTITY : null;
  if (scaleLevel === 'stellar') return STELLAR_ENTITIES.find((e) => e.id === id) ?? null;
  if (scaleLevel === 'galaxy') return GALAXY_LANDMARKS.find((e) => e.id === id) ?? null;
  if (scaleLevel === 'universe') return UNIVERSE_SHELLS.find((e) => e.id === id) ?? null;
  return null;
}

function useTelemetry(planet: PlanetData | null) {
  const sec = useTimeStore((s) => Math.floor(s.currentTimeMs / 1000));
  return useMemo(() => {
    if (!planet) return null;
    const date = new Date(sec * 1000);
    const helio = heliocentricPosition(planet.elements, date);
    const distSunAU = vecLength(helio);
    const earthHelio = heliocentricPosition(EARTH.elements, date);
    const dx = helio.x - earthHelio.x;
    const dy = helio.y - earthHelio.y;
    const dz = helio.z - earthHelio.z;
    const distEarthAU = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const speed = orbitalSpeedKmS(planet.elements, distSunAU);
    const lightMin = (distEarthAU * AU_KM) / LIGHT_SPEED_KM_S / 60;
    return { distSunAU, distEarthAU, speed, lightMin, date };
  }, [planet, sec]);
}

function formatPeriod(days: number): string {
  if (days < 1) return `${(days * 24).toFixed(1)} 時間`;
  if (days < 365) return `${days.toFixed(1)} 日`;
  return `${(days / 365.25).toFixed(2)} 年`;
}

function formatRotation(hours: number): string {
  const retro = hours < 0;
  const h = Math.abs(hours);
  const text = h < 48 ? `${h.toFixed(1)} 時間` : `${(h / 24).toFixed(1)} 日`;
  return retro ? `${text}（逆行）` : text;
}

const TABS: { key: SidebarTab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'telemetry', label: 'Telemetry' },
  { key: 'missions', label: 'Missions' },
];

function SelectedPanel({
  isSun,
  planet,
  tab,
  setTab,
}: {
  isSun: boolean;
  planet: PlanetData | null;
  tab: SidebarTab;
  setTab: (t: SidebarTab) => void;
}) {
  const telemetry = useTelemetry(planet);

  const name = isSun ? '太陽' : planet?.nameJa ?? '';
  const nameEn = isSun ? 'Sun' : planet?.nameEn ?? '';
  const color = isSun ? '#ffd27a' : planet?.color ?? '#00f0ff';

  return (
    <div>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="h-3 w-3 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
        <div>
          <h2 className="text-base font-semibold text-offwhite">{name}</h2>
          <p className="font-mono text-[10px] tracking-widest text-offwhite/40">{nameEn.toUpperCase()}</p>
        </div>
      </div>

      {!isSun && (
        <div className="mb-3 flex gap-1 rounded-lg border border-offwhite/10 bg-space p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 rounded-md py-1.5 font-mono text-[10px] tracking-wide transition-colors ${
                tab === t.key ? 'bg-cyan/15 text-cyan' : 'text-offwhite/45 hover:text-offwhite/75'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {isSun && (
        <div className="space-y-3 font-mono text-xs">
          <Row label="直径" value={`${(696000 * 2).toLocaleString()} km`} />
          <Row label="表面温度" value="約 5,500 ℃" />
          <Row label="質量比率" value="太陽系全質量の 99.86%" />
          <p className="pt-2 text-[11px] leading-relaxed text-offwhite/60">
            太陽系の中心に位置する恒星。核融合反応によって輝き、全惑星の軌道を重力で支配している。
          </p>
        </div>
      )}

      {!isSun && planet && tab === 'overview' && (
        <div className="space-y-3 font-mono text-xs">
          <Row label="直径" value={`${Math.round(planet.realRadiusKm * 2).toLocaleString()} km`} />
          <Row label="公転周期" value={formatPeriod(planet.elements.periodDays)} />
          <Row label="自転周期" value={formatRotation(planet.rotationPeriodHours)} />
          <Row label="衛星数" value={`${planet.moons}`} />
          <Row label="発見" value={planet.discovered} />
          <p className="pt-2 text-[11px] leading-relaxed text-offwhite/60">{planet.description}</p>
          {planet.id === 'earth' && (
            <p className="rounded-md border border-cyan/30 bg-cyan/10 px-3 py-2 text-[11px] leading-relaxed text-cyan">
              💡 このままズームインし続けると、衛星写真で地表まで降りられます。
            </p>
          )}
        </div>
      )}

      {!isSun && planet && tab === 'telemetry' && telemetry && (
        <div className="space-y-3 font-mono text-xs">
          <Row label="太陽からの距離" value={`${telemetry.distSunAU.toFixed(3)} AU`} accent />
          <Row label="地球からの距離" value={`${telemetry.distEarthAU.toFixed(3)} AU`} accent />
          <Row label="通信遅延（片道）" value={`${telemetry.lightMin.toFixed(1)} 分`} accent />
          <Row label="公転速度" value={`${telemetry.speed.toFixed(2)} km/s`} accent />
          <Row label="計算基準時刻" value={`${formatDate(telemetry.date)} ${formatTime(telemetry.date)} UTC`} />
          <p className="pt-2 text-[10px] leading-relaxed text-offwhite/35">
            ※ 簡易ケプラー軌道要素による近似計算です（デモ用途）。
          </p>
        </div>
      )}

      {!isSun && planet && tab === 'missions' && (
        <div className="space-y-2 font-mono text-xs">
          {planet.missions.length === 0 && <p className="text-offwhite/45">記録された探査ミッションはありません。</p>}
          {planet.missions.map((m) => (
            <div key={m} className="rounded-md border border-violet/30 bg-violet/10 px-3 py-2 text-[11px] text-offwhite/75">
              {m}
            </div>
          ))}
          <p className="pt-2 text-[10px] leading-relaxed text-offwhite/35">
            ※ 探査機の3Dモデル・軌道表示は Phase 3 で実装予定です。
          </p>
        </div>
      )}
    </div>
  );
}

const LEVEL_LABEL: Record<ScaleLevel, string> = {
  solar: '太陽系',
  stellar: '恒星近傍',
  galaxy: '銀河系',
  universe: '観測可能な宇宙',
};

function GenericSelectedPanel({ entity }: { entity: Entity }) {
  const setScaleLevel = useSelectionStore((s) => s.setScaleLevel);
  return (
    <div>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="h-3 w-3 rounded-full" style={{ background: entity.color, boxShadow: `0 0 10px ${entity.color}` }} />
        <div>
          <h2 className="text-base font-semibold text-offwhite">{entity.nameJa}</h2>
          <p className="font-mono text-[10px] tracking-widest text-offwhite/40">{entity.nameEn.toUpperCase()}</p>
        </div>
      </div>
      {entity.drillTarget && (
        <button
          onClick={() => setScaleLevel(entity.drillTarget!)}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan/40 bg-cyan/10 py-2 font-mono text-[11px] text-cyan transition-colors hover:bg-cyan/20"
        >
          {LEVEL_LABEL[entity.drillTarget]}ビューへズームイン →
        </button>
      )}
      <div className="space-y-3 font-mono text-xs">
        {entity.facts.map((f) => (
          <Row key={f.label} label={f.label} value={f.value} accent />
        ))}
        <p className="pt-2 text-[11px] leading-relaxed text-offwhite/60">{entity.description}</p>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-offwhite/5 pb-1.5">
      <span className="text-offwhite/45">{label}</span>
      <span className={`font-mono-tabular ${accent ? 'text-cyan' : 'text-offwhite/85'}`}>{value}</span>
    </div>
  );
}

export function Sidebar() {
  const searchQuery = useSelectionStore((s) => s.searchQuery);
  const setSearchQuery = useSelectionStore((s) => s.setSearchQuery);
  const selectedId = useSelectionStore((s) => s.selectedId);
  const select = useSelectionStore((s) => s.select);
  const sidebarTab = useSelectionStore((s) => s.sidebarTab);
  const setSidebarTab = useSelectionStore((s) => s.setSidebarTab);
  const scaleLevel = useSelectionStore((s) => s.scaleLevel);
  const sidebarOpen = useSelectionStore((s) => s.sidebarOpen);
  const setSidebarOpen = useSelectionStore((s) => s.setSidebarOpen);

  const chipList = useMemo(() => getChipList(scaleLevel), [scaleLevel]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return chipList;
    return chipList.filter((b) => b.nameJa.includes(searchQuery.trim()) || b.nameEn.toLowerCase().includes(q));
  }, [chipList, searchQuery]);

  const selectedPlanet =
    scaleLevel === 'solar' && selectedId && selectedId !== 'sun' ? PLANETS.find((p) => p.id === selectedId) ?? null : null;
  const isSun = scaleLevel === 'solar' && selectedId === 'sun';
  const isMoon = scaleLevel === 'solar' && selectedId === 'moon';
  const selectedEntity = selectedId ? getEntityDetail(scaleLevel, selectedId) : null;

  return (
    <>
      {sidebarOpen && (
        <div
          className="pointer-events-auto fixed inset-0 z-10 bg-space/70 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`pointer-events-auto fixed left-0 top-0 z-20 flex h-full w-[85vw] max-w-[340px] flex-col border-r border-offwhite/10 bg-space-raised/95 pt-20 backdrop-blur-md transition-transform duration-300 md:absolute md:z-10 md:w-[320px] md:translate-x-0 md:bg-space-raised/85 lg:w-[360px] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-3 top-[68px] flex h-7 w-7 items-center justify-center rounded-full border border-offwhite/15 font-mono text-xs text-offwhite/50 hover:border-cyan/50 hover:text-cyan md:hidden"
        >
          ×
        </button>
        <div className="px-4 pb-3">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="天体を検索..."
            className="w-full rounded-lg border border-offwhite/15 bg-space px-3 py-2.5 font-mono text-xs text-offwhite placeholder:text-offwhite/30 focus:border-cyan/60 focus:outline-none focus:ring-1 focus:ring-cyan/40"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {filtered.map((body) => (
            <button
              key={body.id}
              onClick={() => select(body.id)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] transition-colors ${
                selectedId === body.id
                  ? 'border-cyan/70 bg-cyan/10 text-cyan'
                  : 'border-offwhite/15 text-offwhite/55 hover:border-offwhite/35 hover:text-offwhite'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: body.color }} />
              {body.nameJa}
            </button>
          ))}
          {filtered.length === 0 && <p className="font-mono text-[11px] text-offwhite/35">該当する天体がありません</p>}
        </div>

        <div className="flex-1 overflow-y-auto border-t border-offwhite/10 px-4 py-4">
          {!selectedId && (
            <div className="mt-10 flex flex-col items-center gap-3 text-center text-offwhite/35">
              <div className="h-14 w-14 rounded-full border border-dashed border-offwhite/20" />
              <p className="font-mono text-[11px] leading-relaxed">
                天体をクリックすると
                <br />
                詳細情報がここに表示されます
              </p>
            </div>
          )}
          {selectedId && scaleLevel === 'solar' && !isMoon && (
            <SelectedPanel isSun={isSun} planet={selectedPlanet} tab={sidebarTab} setTab={setSidebarTab} />
          )}
          {selectedId && (scaleLevel !== 'solar' || isMoon) && selectedEntity && (
            <GenericSelectedPanel entity={selectedEntity} />
          )}
        </div>
      </div>
    </>
  );
}
