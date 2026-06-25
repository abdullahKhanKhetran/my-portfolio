import { createClient } from "redis";

let redisClientPromise: Promise<ReturnType<typeof createClient>> | null = null;

function getRedisClient() {
  const url = process.env.REDIS_URL;
  if (!url) {
    return null;
  }

  if (!redisClientPromise) {
    const client = createClient({ url });
    client.on("error", () => undefined);
    redisClientPromise = client.connect().then(() => client);
  }

  return redisClientPromise;
}

export async function getCachedJson<T>(key: string): Promise<T | null> {
  const client = await getRedisClient();
  if (!client) {
    return null;
  }

  const raw = await client.get(key);
  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as T;
}

export async function setCachedJson<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  const client = await getRedisClient();
  if (!client) {
    return;
  }

  await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
}
