import { SCREEN_CONFIG } from "./config";
import type { ScreenResult } from "./types";

type RedisResult<T> = { result: T | null };

let memoryCache: ScreenResult | null = null;
let memoryManualRefreshAt = 0;

function redisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

export function cacheMode(): "redis" | "memory" {
  return redisConfig() ? "redis" : "memory";
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

export async function readCachedScreen() {
  if (cacheMode() === "memory") return memoryCache;
  const response = await redisCommand<string>(["GET", SCREEN_CONFIG.cacheKey]);
  if (!response?.result) return null;
  return JSON.parse(response.result) as ScreenResult;
}

export async function writeCachedScreen(result: ScreenResult) {
  if (cacheMode() === "memory") {
    memoryCache = result;
    return;
  }
  await redisCommand(["SET", SCREEN_CONFIG.cacheKey, JSON.stringify(result)]);
}

export async function getLastManualRefreshAt() {
  if (cacheMode() === "memory") return memoryManualRefreshAt;
  const response = await redisCommand<string>(["GET", SCREEN_CONFIG.manualRefreshKey]);
  return response?.result ? Number(response.result) : 0;
}

export async function setLastManualRefreshAt(value: number) {
  if (cacheMode() === "memory") {
    memoryManualRefreshAt = value;
    return;
  }
  await redisCommand(["SET", SCREEN_CONFIG.manualRefreshKey, String(value)]);
}
