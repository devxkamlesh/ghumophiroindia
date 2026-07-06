import type { Store, Options, IncrementResponse } from 'express-rate-limit'
import { redis } from '../core/redis'

/**
 * Distributed rate-limit store backed by the existing Upstash Redis client.
 *
 * Why: PM2 runs the backend in cluster mode (2 instances). express-rate-limit's
 * default MemoryStore is per-process, so each instance keeps its own counters —
 * effectively doubling every limit and making the auth brute-force limit
 * inconsistent. A shared Redis counter fixes that.
 *
 * Falls back to MemoryStore automatically (see createStore) when Redis is not
 * configured, e.g. local dev without Upstash.
 */
class RedisRateLimitStore implements Store {
  windowMs = 60_000
  prefix: string

  constructor(prefix = 'rl:') {
    this.prefix = prefix
  }

  init(options: Options): void {
    this.windowMs = options.windowMs
  }

  private key(key: string): string {
    return `${this.prefix}${key}`
  }

  async increment(key: string): Promise<IncrementResponse> {
    const k = this.key(key)
    const totalHits = await redis!.incr(k)

    // First hit in this window — set the expiry.
    if (totalHits === 1) {
      await redis!.pexpire(k, this.windowMs)
    }

    const ttl = await redis!.pttl(k)
    const resetTime = new Date(Date.now() + (ttl > 0 ? ttl : this.windowMs))
    return { totalHits, resetTime }
  }

  async decrement(key: string): Promise<void> {
    await redis!.decr(this.key(key))
  }

  async resetKey(key: string): Promise<void> {
    await redis!.del(this.key(key))
  }
}

/**
 * Returns a RedisRateLimitStore when Redis is available, otherwise `undefined`
 * so express-rate-limit uses its in-memory default (fine for single-process dev).
 */
export function createStore(prefix: string): Store | undefined {
  return redis ? new RedisRateLimitStore(prefix) : undefined
}
