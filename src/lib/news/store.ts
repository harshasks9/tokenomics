// Edition storage + history index. Reuses the same Vercel KV / Upstash REST
// binding the options feature uses (KV_REST_API_URL / KV_REST_API_TOKEN), with
// an in-memory fallback for local dev or when KV is not bound.

import type { NewsEdition, HistoryEntry } from "./types";

const LATEST_KEY = "news:latest";
const HISTORY_KEY = "news:history";
const HISTORY_CAP = 60;

let memoryLatest: NewsEdition | null = null;
const memoryEditions = new Map<string, NewsEdition>();
let memoryHistory: HistoryEntry[] = [];

function redisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

export function storeMode(): "redis" | "memory" {
  return redisConfig() ? "redis" : "memory";
}

async function redisCommand<T>(command: unknown[]): Promise<{ result: T | null } | null> {
  const config = redisConfig();
  if (!config) return null;
  const response = await fetch(config.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`KV command failed: ${response.status} ${await response.text()}`);
  return (await response.json()) as { result: T | null };
}

function summarize(edition: NewsEdition): HistoryEntry {
  return {
    date: edition.date,
    label: edition.label,
    itemCount: edition.itemCount,
    topLine: edition.topLine,
    generatedAt: edition.generatedAt,
    mode: edition.mode,
  };
}

function mergeHistory(list: HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
  const next = [entry, ...list.filter((e) => e.date !== entry.date)];
  next.sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
  return next.slice(0, HISTORY_CAP);
}

export async function readLatestEdition(): Promise<NewsEdition | null> {
  if (storeMode() === "memory") return memoryLatest;
  const response = await redisCommand<string>(["GET", LATEST_KEY]);
  if (!response?.result) return null;
  try {
    return JSON.parse(response.result) as NewsEdition;
  } catch {
    return null;
  }
}

export async function readEdition(date: string): Promise<NewsEdition | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  if (storeMode() === "memory") return memoryEditions.get(date) ?? null;
  const response = await redisCommand<string>(["GET", `news:edition:${date}`]);
  if (!response?.result) return null;
  try {
    return JSON.parse(response.result) as NewsEdition;
  } catch {
    return null;
  }
}

export async function readHistory(): Promise<HistoryEntry[]> {
  if (storeMode() === "memory") return memoryHistory;
  const response = await redisCommand<string>(["GET", HISTORY_KEY]);
  if (!response?.result) return [];
  try {
    return JSON.parse(response.result) as HistoryEntry[];
  } catch {
    return [];
  }
}

export async function writeEdition(edition: NewsEdition): Promise<void> {
  const payload = JSON.stringify(edition);
  if (storeMode() === "memory") {
    memoryLatest = edition;
    memoryEditions.set(edition.date, edition);
    memoryHistory = mergeHistory(memoryHistory, summarize(edition));
    return;
  }
  await redisCommand(["SET", LATEST_KEY, payload]);
  await redisCommand(["SET", `news:edition:${edition.date}`, payload]);
  const history = mergeHistory(await readHistory(), summarize(edition));
  await redisCommand(["SET", HISTORY_KEY, JSON.stringify(history)]);
}
