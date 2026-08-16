/** Deterministic PRNG (mulberry32) so procedural scenes look the same every mount. */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Evenly distributes `total` points across a unit sphere. */
export function fibonacciSphereDirection(index: number, total: number): [number, number, number] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = total > 1 ? 1 - (index / (total - 1)) * 2 : 0;
  const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = golden * index;
  return [Math.cos(theta) * radiusAtY, y, Math.sin(theta) * radiusAtY];
}
