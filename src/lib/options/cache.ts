import { SCREEN_CONFIG } from "./config";
import type { ScreenResult } from "./types";

type RedisResult<T> = { result: T | null };

let memoryCache: ScreenResult | null = null;
let memoryManualRefreshAt = 0;
const memoryLoginAttempts = new Map<string, { count: number; resetAt: number }>();

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

async function hashIdentifier(identifier: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`options-login:${identifier}`));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function checkLoginRateLimit(identifier: string) {
  const now = Date.now();
  const key = `options:login:${await hashIdentifier(identifier)}`;
  const limit = SCREEN_CONFIG.auth.maxLoginAttempts;
  const windowMs = SCREEN_CONFIG.auth.loginWindowMs;

  if (cacheMode() === "memory") {
    const current = memoryLoginAttempts.get(key);
    if (!current || current.resetAt <= now) {
      memoryLoginAttempts.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterSeconds: 0 };
    }
    current.count += 1;
    memoryLoginAttempts.set(key, current);
    return {
      allowed: current.count <= limit,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  const count = Number((await redisCommand<number>(["INCR", key]))?.result ?? 1);
  if (count === 1) {
    await redisCommand(["PEXPIRE", key, windowMs]);
  }
  return {
    allowed: count <= limit,
    retryAfterSeconds: count <= limit ? 0 : Math.ceil(windowMs / 1000),
  };
}

export async function clearLoginRateLimit(identifier: string) {
  const key = `options:login:${await hashIdentifier(identifier)}`;
  if (cacheMode() === "memory") {
    memoryLoginAttempts.delete(key);
    return;
  }
  await redisCommand(["DEL", key]);
}
