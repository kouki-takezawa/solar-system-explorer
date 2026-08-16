/** Days between J2000.0 epoch (2000-01-01 12:00 TT) and the given date. */
export function daysSinceJ2000(date: Date): number {
  const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0);
  return (date.getTime() - J2000_MS) / 86400000;
}
