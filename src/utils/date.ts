export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isConsecutiveDay(previousISO: string, currentISO: string): boolean {
  const prev = new Date(previousISO + 'T00:00:00');
  const curr = new Date(currentISO + 'T00:00:00');
  const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

export function daysSince(dateISO: string, nowISO: string = todayISO()): number {
  const then = new Date(dateISO + 'T00:00:00');
  const now = new Date(nowISO + 'T00:00:00');
  return Math.round((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}
