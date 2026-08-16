import { Vector3 } from 'three';

const registry: Record<string, Vector3> = {};

export function getBodyPosition(id: string): Vector3 {
  if (!registry[id]) registry[id] = new Vector3();
  return registry[id];
}
