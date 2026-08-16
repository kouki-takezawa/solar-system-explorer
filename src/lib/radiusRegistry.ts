const registry: Record<string, number> = {};

export function setBodyRadius(id: string, radius: number): void {
  registry[id] = radius;
}

export function getBodyRadius(id: string): number {
  return registry[id] ?? 1;
}
