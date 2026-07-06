import { Redis as UpstashRedis } from '@upstash/redis'
import IORedis from 'ioredis'
import config from '../config'
import logger from '../logger'

/**
 * Redis client with two interchangeable backends:
 *
 *   1. Upstash (serverless REST) — used when UPSTASH_REDIS_REST_URL + _TOKEN are set.
 *   2. ioredis (TCP) — used for a self-hosted / local Redis on the VPS. Enabled
 *      ONLY when REDIS_URL or REDIS_HOST is explicitly set, so local dev without a
 *      Redis server doesn't spam connection errors.
 *
 * Why this exists: the VPS runs a local Redis, but the app previously only wired
 * the Upstash client. With no Upstash creds, `redis` was `null` — so /health always
 * reported redis:"disconnected", the cache silently no-oped, and the rate-limit
 * store fell back to a per-process MemoryStore (inconsistent across PM2 cluster
 * workers). Wiring ioredis makes the health check trustworthy and enables real,
 * shared caching + rate limiting.
 *
 * The low-level commands used by the rate-limit store (incr/pexpire/pttl/decr/del)
 * have identical signatures on both clients, so only get/set need serialization
 * branching (Upstash auto-serializes JSON; ioredis stores strings).
 */

type RedisClient = UpstashRedis | IORedis

const hasUpstash = Boolean(config.redis.url && config.redis.token)
// Explicit opt-in for local Redis: an env var must be present (config defaults
// host to 'localhost', so we check the raw env to avoid connecting by accident).
const hasLocalRedis = Boolean(process.env.REDIS_URL || process.env.REDIS_HOST)

let client: RedisClient | null = null
let usingUpstash = false

if (hasUpstash) {
  client = new UpstashRedis({ url: config.redis.url, token: config.redis.token })
  usingUpstash = true
  logger.info('Redis: using Upstash (REST) client')
} else if (hasLocalRedis) {
  const common = {
    // Keep a functional cache during brief blips, but don't retry forever.
    maxRetriesPerRequest: 2 as number | null,
    enableReadyCheck: true,
    // Cap reconnect backoff at 2s; keep trying (Redis is expected to be up on the VPS).
    retryStrategy: (times: number) => Math.min(times * 200, 2000),
  }

  client = process.env.REDIS_URL
    ? new IORedis(process.env.REDIS_URL, common)
    : new IORedis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password || undefined,
        ...common,
      })

  // Log connection lifecycle once per state change (ioredis emits 'error' on every
  // failed reconnect; we downgrade to warn so it doesn't crash or flood as errors).
  client.on('connect', () => logger.info('Redis: ioredis connected'))
  client.on('error', (err: Error) => logger.warn(`Redis (ioredis) error: ${err.message}`))
  logger.info(`Redis: using ioredis (TCP) at ${process.env.REDIS_URL ? 'REDIS_URL' : `${config.redis.host}:${config.redis.port}`}`)
} else {
  logger.warn('Redis: no client configured (set UPSTASH_* or REDIS_URL/REDIS_HOST) — cache disabled, rate limiting is per-process')
}

// Initialize Redis client (null when neither backend is configured)
export const redis = client

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  HOT: 3600,      // 1 hour - featured tours, popular destinations
  WARM: 21600,    // 6 hours - tour listings, search results
  COLD: 86400,    // 24 hours - static content, reviews
  WEEK: 604800,   // 7 days - rarely changing data
} as const

// Cache key prefixes
export const CACHE_KEYS = {
  TOUR: 'tour',
  TOURS: 'tours',
  DESTINATION: 'destination',
  DESTINATIONS: 'destinations',
  BOOKING: 'booking',
  USER: 'user',
  STATS: 'stats',
} as const

/**
 * Get data from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) return null

  try {
    if (usingUpstash) {
      return await (redis as UpstashRedis).get<T>(key)
    }
    const raw = await (redis as IORedis).get(key)
    if (raw == null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      // Value wasn't JSON (e.g. a plain string) — return as-is.
      return raw as unknown as T
    }
  } catch (error) {
    logger.warn(`Redis GET error for "${key}": ${(error as Error).message}`)
    return null
  }
}

/**
 * Set data in cache with TTL
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = CACHE_TTL.WARM
): Promise<void> {
  if (!redis) return

  try {
    if (usingUpstash) {
      await (redis as UpstashRedis).set(key, value as any, { ex: ttl })
    } else {
      await (redis as IORedis).set(key, JSON.stringify(value), 'EX', ttl)
    }
  } catch (error) {
    logger.warn(`Redis SET error for "${key}": ${(error as Error).message}`)
  }
}

/**
 * Delete single cache key
 */
export async function deleteCache(key: string): Promise<void> {
  if (!redis) return

  try {
    await redis.del(key)
  } catch (error) {
    logger.warn(`Redis DEL error for "${key}": ${(error as Error).message}`)
  }
}

/**
 * Delete multiple cache keys by pattern
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  if (!redis) return

  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await (redis as IORedis).del(...keys)
    }
  } catch (error) {
    logger.warn(`Redis DELETE PATTERN error for "${pattern}": ${(error as Error).message}`)
  }
}

/**
 * Check if Redis is connected.
 * Used by /health — must resolve to a real boolean, never throw.
 */
export async function checkRedisConnection(): Promise<boolean> {
  if (!redis) return false

  try {
    const pong = await redis.ping()
    // Upstash returns 'PONG'; ioredis returns 'PONG' too.
    return pong === 'PONG' || pong === 'pong' || pong === 'OK'
  } catch (error) {
    logger.warn(`Redis connection check failed: ${(error as Error).message}`)
    return false
  }
}

/**
 * Generate cache key
 */
export function generateCacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}`
}

export default redis
