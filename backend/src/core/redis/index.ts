import { Redis } from '@upstash/redis'
import config from '../config'

// Initialize Redis client (Upstash or skip if not configured)
export const redis = config.redis.url && config.redis.token
  ? new Redis({
      url: config.redis.url,
      token: config.redis.token,
    })
  : null

// Note: For local Redis, you would use ioredis instead
// This implementation uses Upstash Redis (serverless)
// For VPS deployment, update docker-compose to use local Redis

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
  if (!redis) {
    return null
  }
  
  try {
    const data = await redis.get<T>(key)
    return data
  } catch (error) {
    console.error('Redis GET error:', error)
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
  if (!redis) {
    return
  }
  
  try {
    await redis.set(key, value, { ex: ttl })
  } catch (error) {
    console.error('Redis SET error:', error)
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
    console.error('Redis DEL error:', error)
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
      await redis.del(...keys)
    }
  } catch (error) {
    console.error('Redis DELETE PATTERN error:', error)
  }
}

/**
 * Check if Redis is connected
 */
export async function checkRedisConnection(): Promise<boolean> {
  if (!redis) return false
  
  try {
    await redis.ping()
    return true
  } catch (error) {
    console.error('Redis connection failed:', error)
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
