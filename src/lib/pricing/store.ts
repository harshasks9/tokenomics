import fs from "node:fs";
import path from "node:path";
import type { LiveSnapshot } from "./types";

/**
 * Live-snapshot storage, same three backends as the daily brief:
 *  - "redis":  Upstash / Vercel KV via REST (production; survives deploys)
 *  - "file":   data/pricing/*.json (local development)
 *  - "memory": in-process fallback (non-durable)
 *
 * We keep one "latest" snapshot plus a dated history so a bad refresh can be
 * rolled back by re-pointing latest.
 */

const LATEST_KEY = "pricing:latest";
const HISTORY_PREFIX = "pricing:snapshot:";
const FILE_DIR = path.join(process.cwd(), "data", "pricing");

type RedisResult<T> = { result: T | null };

let memoryLatest: LiveSnapshot | null = null;
const memoryHistory = new Map<string, LiveSnapshot>();

function redisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

function fileStoreAvailable() {
  try {
    fs.mkdirSync(FILE_DIR, { recursive: true });
    return true;
  } catch {
    return false;
  }
}

export function storeMode(): "redis" | "file" | "memory" {
  if (redisConfig()) return "redis";
  if (fileStoreAvailable()) return "file";
  return "memory";
}

async function redisCommand<T>(command: unknown[]) {
  const config = redisConfig();
  if (!config) return null;
  const response = await fetch(config.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Redis command failed: ${response.status} ${await response.text()}`);
  }
  return (await response.json()) as RedisResult<T>;
}

export async function readLatest(): Promise<LiveSnapshot | null> {
  const mode = storeMode();
  if (mode === "redis") {
    const r = await redisCommand<string>(["GET", LATEST_KEY]);
    return r?.result ? (JSON.parse(r.result) as LiveSnapshot) : null;
  }
  if (mode === "file") {
    try {
      return JSON.parse(fs.readFileSync(path.join(FILE_DIR, "latest.json"), "utf-8")) as LiveSnapshot;
    } catch {
      return memoryLatest;
    }
  }
  return memoryLatest;
}

export async function readSnapshot(date: string): Promise<LiveSnapshot | null> {
  const mode = storeMode();
  if (mode === "redis") {
    const r = await redisCommand<string>(["GET", `${HISTORY_PREFIX}${date}`]);
    return r?.result ? (JSON.parse(r.result) as LiveSnapshot) : null;
  }
  if (mode === "file") {
    try {
      return JSON.parse(fs.readFileSync(path.join(FILE_DIR, `${date}.json`), "utf-8")) as LiveSnapshot;
    } catch {
      return memoryHistory.get(date) ?? null;
    }
  }
  return memoryHistory.get(date) ?? null;
}

export async function writeSnapshot(snapshot: LiveSnapshot): Promise<void> {
  const date = snapshot.updatedAt.slice(0, 10);
  const mode = storeMode();
  const json = JSON.stringify(snapshot);
  if (mode === "redis") {
    await redisCommand(["SET", LATEST_KEY, json]);
    await redisCommand(["SET", `${HISTORY_PREFIX}${date}`, json]);
    return;
  }
  if (mode === "file") {
    try {
      fs.writeFileSync(path.join(FILE_DIR, "latest.json"), json);
      fs.writeFileSync(path.join(FILE_DIR, `${date}.json`), json);
      return;
    } catch {
      // fall through to memory
    }
  }
  memoryLatest = snapshot;
  memoryHistory.set(date, snapshot);
}
