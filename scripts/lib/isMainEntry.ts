import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** ESM-safe replacement for `require.main === module`, for scripts run directly via tsx. */
export function isMainEntry(importMetaUrl: string): boolean {
  const invoked = process.argv[1];
  if (!invoked) return false;
  return path.resolve(fileURLToPath(importMetaUrl)) === path.resolve(invoked);
}
