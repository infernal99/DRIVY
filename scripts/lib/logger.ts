import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.resolve(here, '../../content/metadata/logs');

function timestamp(): string {
  return new Date().toISOString();
}

/** Minimal logger: prints to stdout and appends to a per-script log file under content/metadata/logs/. */
export function createLogger(scriptName: string) {
  mkdirSync(LOG_DIR, { recursive: true });
  const logPath = path.join(LOG_DIR, `${scriptName}.log`);

  function write(level: string, message: string) {
    const line = `[${timestamp()}] [${level}] ${message}`;
    if (level === 'ERROR') console.error(line);
    else console.log(line);
    try {
      appendFileSync(logPath, line + '\n');
    } catch {
      // Logging to disk is best-effort — never fail the script over it.
    }
  }

  return {
    info: (message: string) => write('INFO', message),
    warn: (message: string) => write('WARN', message),
    error: (message: string) => write('ERROR', message),
    logPath,
  };
}
