import rateLimit from 'express-rate-limit'
import type { Request } from 'express'
import config from '../core/config'
import { createStore } from './rateLimitStore'

/**
 * Collapse a client IP to a stable rate-limit key.
 *
 * IPv4 is used as-is. IPv6 is collapsed to its /64 prefix so a client can't
 * dodge limits by rotating through the addresses in a single allocation — this
 * mirrors what express-rate-limit's built-in key generator does internally
 * (its `ipKeyGenerator` helper is not exported in this version).
 */
function normalizeIp(ip?: string): string {
  if (!ip) return 'unknown'
  // IPv4-mapped IPv6 (e.g. ::ffff:1.2.3.4) -> plain IPv4
  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(ip)
  if (mapped) return mapped[1]
  if (!ip.includes(':')) return ip // IPv4

  // IPv6 -> expand "::" and keep the first four hextets (the /64 network).
  const addr = ip.split('%')[0] // drop any zone id
  const [headStr, tailStr] = addr.split('::')
  const head = headStr ? headStr.split(':') : []
  const tail = tailStr !== undefined && tailStr ? tailStr.split(':') : []
  const fill = Math.max(0, 8 - head.length - tail.length)
  const groups = [...head, ...Array(fill).fill('0'), ...tail]
  return `${groups.slice(0, 4).map(g => g || '0').join(':')}::/64`
}

/**
 * Skip rate limiting for internal/server-to-server calls.
 *
 * Next.js SSR/ISR fetches hit the backend directly on localhost (they do NOT
 * pass through Nginx), so their `req.ip` is a loopback address. Without this,
 * a single popular page render could exhaust the per-IP budget and rate-limit
 * the server's own rendering. External clients always arrive via Nginx with a
 * real forwarded IP, so they are still limited.
 */
const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])
const isInternal = (req: Request): boolean => LOOPBACK.has(req.ip ?? '')

/**
 * Key a request by the authenticated user when we know who they are, otherwise
 * fall back to the client IP.
 *
 * Why: the previous IP-only keying punished everyone sharing a public IP
 * (corporate/mobile NAT, university networks). One busy user could exhaust the
 * window for hundreds of others. Keying logged-in traffic on the user id gives
 * each account its own budget. `req.user` is populated by the global
 * `optionalAuth` middleware that runs *before* these limiters (see app.ts).
 *
 * The IP branch is normalised via `normalizeIp` (IPv6 -> /64) so it behaves
 * like express-rate-limit's built-in key generator.
 */
const userOrIpKey = (req: Request): string => {
  const userId = req.user?.userId
  if (userId) return `user:${userId}`
  return `ip:${normalizeIp(req.ip)}`
}

/**
 * General API limiter.
 *
 * - Authenticated users: a single generous budget keyed on their user id.
 * - Anonymous GETs (read-only browsing): a much higher per-IP budget, since
 *   these are cheap, cacheable, and the main source of shared-NAT false 429s.
 * - Anonymous writes: the original strict per-IP budget.
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: (req: Request): number => {
    if (req.user?.userId) return config.rateLimit.authenticatedMax
    return req.method === 'GET' ? config.rateLimit.anonReadMax : config.rateLimit.maxRequests
  },
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: isInternal,
  keyGenerator: userOrIpKey,
  store: createStore('rl:api:'),
})

/**
 * Authentication limiter — deliberately strict to slow credential brute-force.
 * Kept keyed on IP (default keyGenerator) since there is no authenticated user
 * yet at login/register time. Only failed attempts count toward the limit.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later',
  skipSuccessfulRequests: true,
  skip: isInternal,
  store: createStore('rl:auth:'),
})

export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 bookings per hour
  message: 'Too many booking requests, please try again later',
  skip: isInternal,
  keyGenerator: userOrIpKey,
  store: createStore('rl:booking:'),
})

// Map API — heavy traffic endpoint, tighter limit
export const mapLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 50,              // 50 req/min per user or IP
  message: 'Too many map requests, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
  skip: isInternal,
  keyGenerator: userOrIpKey,
  store: createStore('rl:map:'),
})
