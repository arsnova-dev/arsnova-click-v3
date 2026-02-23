/**
 * Redis-Client-Singleton (Story 0.1, 0.5).
 * Eine Instanz pro Prozess für Pub/Sub, Rate-Limiting und spätere Session-Daten.
 */
import Redis from 'ioredis';

const REDIS_URL = process.env['REDIS_URL'] ?? 'redis://localhost:6379';

let redis: Redis | null = null;

/**
 * Liefert die Redis-Client-Instanz (lazy init).
 * Wirft nicht – Verbindungsfehler treten beim ersten Befehl auf.
 */
export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
    });
  }
  return redis;
}

/**
 * Prüft, ob Redis erreichbar ist (Story 0.1 – Health-Check).
 */
export async function pingRedis(): Promise<boolean> {
  try {
    const client = getRedis();
    const result = await client.ping();
    return result === 'PONG';
  } catch {
    return false;
  }
}

/**
 * Schließt die Verbindung (z. B. bei SIGTERM).
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
