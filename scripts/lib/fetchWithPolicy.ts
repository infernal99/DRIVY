import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256Hex } from '../../src/utils/sha256';
import { createLogger } from './logger';

const here = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.resolve(here, '../../content/.cache');
const DEFAULT_MIN_DELAY_MS = 1500;
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 1 day
const MAX_REQUESTS_PER_RUN = 20; // hard cap — see content spec §3, "no scraping agresivo"

const log = createLogger('fetch-with-policy');

let requestsThisRun = 0;
let lastRequestAt = 0;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cachePathFor(url: string): string {
  mkdirSync(CACHE_DIR, { recursive: true });
  return path.join(CACHE_DIR, `${sha256Hex(url)}.json`);
}

interface CacheEntry {
  url: string;
  fetchedAt: number;
  status: number;
  body: string;
}

/**
 * A deliberately conservative fetch helper for the content pipeline:
 * disk-cached (so re-runs don't hammer sources), rate-limited to one request
 * every `minDelayMs`, retried with exponential backoff on failure, and
 * hard-capped at MAX_REQUESTS_PER_RUN network requests total per process —
 * this pipeline is meant to check a handful of pages, never to crawl.
 */
export async function fetchWithPolicy(
  url: string,
  opts: { minDelayMs?: number; maxRetries?: number; cacheTtlMs?: number } = {},
): Promise<{ ok: boolean; status: number; body: string; fromCache: boolean }> {
  const minDelayMs = opts.minDelayMs ?? DEFAULT_MIN_DELAY_MS;
  const maxRetries = opts.maxRetries ?? DEFAULT_MAX_RETRIES;
  const cacheTtlMs = opts.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;

  const cachePath = cachePathFor(url);
  if (existsSync(cachePath)) {
    const cached: CacheEntry = JSON.parse(readFileSync(cachePath, 'utf8'));
    if (Date.now() - cached.fetchedAt < cacheTtlMs) {
      log.info(`cache hit: ${url}`);
      return { ok: cached.status < 400, status: cached.status, body: cached.body, fromCache: true };
    }
  }

  if (requestsThisRun >= MAX_REQUESTS_PER_RUN) {
    log.warn(`request budget exhausted (${MAX_REQUESTS_PER_RUN}/run) — skipping ${url}`);
    return { ok: false, status: 0, body: '', fromCache: false };
  }

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const wait = Math.max(0, minDelayMs - (Date.now() - lastRequestAt));
    if (wait > 0) await sleep(wait);

    requestsThisRun += 1;
    lastRequestAt = Date.now();

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Roady-content-pipeline/1.0 (+study app; contact via project README)' },
      });
      const body = await res.text();
      const entry: CacheEntry = { url, fetchedAt: Date.now(), status: res.status, body };
      writeFileSync(cachePath, JSON.stringify(entry));
      log.info(`fetched ${url} → ${res.status} (attempt ${attempt + 1})`);
      return { ok: res.ok, status: res.status, body, fromCache: false };
    } catch (err) {
      const backoff = minDelayMs * 2 ** attempt;
      log.warn(`fetch failed for ${url} (attempt ${attempt + 1}/${maxRetries + 1}): ${(err as Error).message}`);
      if (attempt < maxRetries) await sleep(backoff);
    }
  }

  log.error(`giving up on ${url} after ${maxRetries + 1} attempts`);
  return { ok: false, status: 0, body: '', fromCache: false };
}
