import { PLANETS } from '../../../data/planets';
import { SunMesh } from '../SunMesh';
import { PlanetMesh } from '../PlanetMesh';
import { OrbitPath } from '../OrbitPath';
import { TimeDriver } from '../TimeDriver';

export function SolarSystemLevel() {
  return (
    <group>
      <TimeDriver />
      <SunMesh />
      {PLANETS.map((planet) => (
        <OrbitPath key={planet.id} id={planet.id} elements={planet.elements} color={planet.color} />
      ))}
      {PLANETS.map((planet) => (
        <PlanetMesh key={planet.id} planet={planet} />
      ))}
    </group>
  );
}
