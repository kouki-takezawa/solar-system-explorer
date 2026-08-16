export function dateToYearFraction(date: Date): number {
  const year = date.getUTCFullYear();
  const startOfYear = Date.UTC(year, 0, 1);
  const startOfNextYear = Date.UTC(year + 1, 0, 1);
  return year + (date.getTime() - startOfYear) / (startOfNextYear - startOfYear);
}

export function yearFractionToDate(yearFraction: number): Date {
  const year = Math.floor(yearFraction);
  const frac = yearFraction - year;
  const startOfYear = Date.UTC(year, 0, 1);
  const startOfNextYear = Date.UTC(year + 1, 0, 1);
  return new Date(startOfYear + frac * (startOfNextYear - startOfYear));
}

const pad = (n: number) => String(n).padStart(2, '0');

export function formatDate(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function formatTime(date: Date): string {
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

/** value for <input type="datetime-local"> (interpreted in UTC to stay consistent with the sim clock) */
export function toDateTimeLocalValue(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(
    date.getUTCHours(),
  )}:${pad(date.getUTCMinutes())}`;
}

export function fromDateTimeLocalValue(value: string): number {
  return Date.parse(value + 'Z');
}
