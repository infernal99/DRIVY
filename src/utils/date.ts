/**
 * The user's local calendar day as yyyy-mm-dd. Deliberately NOT
 * `new Date().toISOString()` (that's always UTC) — streaks are a local
 * "did you do something today" concept, and a UTC boundary would flip the
 * day mid-evening for users west of Greenwich, breaking streaks that felt
 * unbroken to them. `getFullYear`/`getMonth`/`getDate` are local-time
 * accessors, so this always matches the user's own clock. The server RPCs
 * (fn_record_answer/fn_submit_exam, see supabase/migrations) already expect
 * this to be the caller's local day — they clamp it to within one day of
 * the server clock but never recompute it themselves.
 */
export function todayISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
