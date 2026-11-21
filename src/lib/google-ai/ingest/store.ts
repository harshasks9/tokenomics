import fs from "node:fs";
import path from "node:path";
import { EMPTY_DIGEST, type Digest } from "./digest";
import type { Alert, DetectedItem, PipelineState, RunStatus } from "./types";

/**
 * Pipeline state storage — same three backends as the rest of the repo:
 *  - "redis":  Upstash / Vercel KV over REST (production; survives deploys)
 *  - "file":   JSON under data/google-ai/ (local development)
 *  - "memory": in-process fallback (not durable — the status API says so)
 */
const KEY = "gai:pipeline:v1";
const FILE_DIR = path.join(process.cwd(), "data", "google-ai");
const FILE = path.join(FILE_DIR, "pipeline.json");
const MAX_ITEMS = 400;
const MAX_ALERTS = 100;

interface Stored {
  lastRun: RunStatus | null;
  lastSuccessAt: string | null;
  items: DetectedItem[];
  alerts: Alert[];
  /** feed key → content hash of the last successful fetch */
  hashes: Record<string, string>;
  digest?: Digest;
}

const EMPTY: Stored = { lastRun: null, lastSuccessAt: null, items: [], alerts: [], hashes: {} };
let memory: Stored = structuredClone(EMPTY);

function redisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

function fileStoreAvailable(): boolean {
  // Serverless file systems are read-only or ephemeral; only use files outside production.
  if (process.env.VERCEL) return false;
  try {
    fs.mkdirSync(FILE_DIR, { recursive: true });
    return true;
  } catch {
    return false;
  }
}

export function storeMode(): PipelineState["store"] {
  if (redisConfig()) return "redis";
  if (fileStoreAvailable()) return "file";
  return "memory";
}

async function redis<T>(command: unknown[]): Promise<T | null> {
  const config = redisConfig();
  if (!config) return null;
  const res = await fetch(config.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  return ((await res.json()) as { result: T | null }).result;
}

export async function readStored(): Promise<Stored> {
  const mode = storeMode();
  try {
    if (mode === "redis") {
      const raw = await redis<string>(["GET", KEY]);
      return raw ? { ...EMPTY, ...(JSON.parse(raw) as Stored) } : structuredClone(EMPTY);
    }
    if (mode === "file") {
      return fs.existsSync(FILE) ? { ...EMPTY, ...(JSON.parse(fs.readFileSync(FILE, "utf8")) as Stored) } : structuredClone(EMPTY);
    }
  } catch {
    // Fall through to memory: a broken store must not look like a healthy empty one to callers that write.
  }
  return memory;
}

export async function writeStored(next: Stored): Promise<void> {
  next.items = next.items.slice(0, MAX_ITEMS);
  next.alerts = next.alerts.slice(0, MAX_ALERTS);
  const mode = storeMode();
  if (mode === "redis") await redis(["SET", KEY, JSON.stringify(next)]);
  else if (mode === "file") fs.writeFileSync(FILE, JSON.stringify(next, null, 1));
  memory = next;
}

export async function readState(): Promise<PipelineState> {
  const s = await readStored();
  return { store: storeMode(), lastRun: s.lastRun, lastSuccessAt: s.lastSuccessAt, items: s.items, alerts: s.alerts, digest: s.digest ?? EMPTY_DIGEST };
}

export type { Stored };
