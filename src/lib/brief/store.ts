import fs from "node:fs";
import path from "node:path";
import type { BriefIndexEntry, DailyBrief } from "./types";

/**
 * Brief storage with three backends, picked automatically:
 *  - "redis":  Upstash/Vercel KV via REST (production; survives deploys)
 *  - "file":   local JSON files under data/briefs/ (local development)
 *  - "memory": in-process fallback (serverless without Redis; non-durable)
 */

const BRIEF_KEY_PREFIX = "brief:daily:";
const INDEX_KEY = "brief:index";
const FILE_DIR = path.join(process.cwd(), "data", "briefs");

type RedisResult<T> = { result: T | null };

const memoryBriefs = new Map<string, DailyBrief>();
let memoryIndex: BriefIndexEntry[] = [];

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
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Redis command failed: ${response.status} ${await response.text()}`);
  }
  return (await response.json()) as RedisResult<T>;
}

function briefFilePath(date: string) {
  return path.join(FILE_DIR, `${date}.json`);
}

function indexFilePath() {
  return path.join(FILE_DIR, "index.json");
}

export async function readBrief(date: string): Promise<DailyBrief | null> {
  const mode = storeMode();
  if (mode === "redis") {
    const response = await redisCommand<string>(["GET", `${BRIEF_KEY_PREFIX}${date}`]);
    return response?.result ? (JSON.parse(response.result) as DailyBrief) : null;
  }
  if (mode === "file") {
    try {
      return JSON.parse(fs.readFileSync(briefFilePath(date), "utf-8")) as DailyBrief;
    } catch {
      return memoryBriefs.get(date) ?? null;
    }
  }
  return memoryBriefs.get(date) ?? null;
}

export async function readIndex(): Promise<BriefIndexEntry[]> {
  const mode = storeMode();
  if (mode === "redis") {
    const response = await redisCommand<string>(["GET", INDEX_KEY]);
    return response?.result ? (JSON.parse(response.result) as BriefIndexEntry[]) : [];
  }
  if (mode === "file") {
    try {
      return JSON.parse(fs.readFileSync(indexFilePath(), "utf-8")) as BriefIndexEntry[];
    } catch {
      return memoryIndex;
    }
  }
  return memoryIndex;
}

export async function readLatestBrief(): Promise<DailyBrief | null> {
  const index = await readIndex();
  if (index.length === 0) return null;
  return readBrief(index[0].date);
}

export async function writeBrief(brief: DailyBrief): Promise<void> {
  const entry: BriefIndexEntry = {
    date: brief.date,
    generated_at: brief.generated_at,
    item_count: brief.items.length,
    mode: brief.mode,
  };
  const index = (await readIndex()).filter((item) => item.date !== brief.date);
  index.unshift(entry);
  index.sort((a, b) => (a.date < b.date ? 1 : -1));

  const mode = storeMode();
  if (mode === "redis") {
    await redisCommand(["SET", `${BRIEF_KEY_PREFIX}${brief.date}`, JSON.stringify(brief)]);
    await redisCommand(["SET", INDEX_KEY, JSON.stringify(index)]);
    return;
  }
  if (mode === "file") {
    try {
      fs.writeFileSync(briefFilePath(brief.date), JSON.stringify(brief, null, 2), "utf-8");
      fs.writeFileSync(indexFilePath(), JSON.stringify(index, null, 2), "utf-8");
      return;
    } catch {
      // fall through to memory
    }
  }
  memoryBriefs.set(brief.date, brief);
  memoryIndex = index;
}
