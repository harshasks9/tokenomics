// Edition storage. Reuses the same Vercel KV / Upstash REST binding the options
// feature already uses (KV_REST_API_URL / KV_REST_API_TOKEN), with an in-memory
// fallback for local dev or when KV is not bound.

import type { NewsEdition } from "./types";

const LATEST_KEY = "news:latest";

let memoryEdition: NewsEdition | null = null;

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
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`KV command failed: ${response.status} ${await response.text()}`);
  }
  return (await response.json()) as { result: T | null };
}

export async function readLatestEdition(): Promise<NewsEdition | null> {
  if (storeMode() === "memory") return memoryEdition;
  const response = await redisCommand<string>(["GET", LATEST_KEY]);
  if (!response?.result) return null;
  try {
    return JSON.parse(response.result) as NewsEdition;
  } catch {
    return null;
  }
}

export async function writeEdition(edition: NewsEdition): Promise<void> {
  if (storeMode() === "memory") {
    memoryEdition = edition;
    return;
  }
  const payload = JSON.stringify(edition);
  await redisCommand(["SET", LATEST_KEY, payload]);
  // Keep a dated snapshot for history / audit.
  await redisCommand(["SET", `news:edition:${edition.date}`, payload]);
}
