import rateLimit from 'express-rate-limit'
import type { Request } from 'express'
import config from '../core/config'
import { createStore } from './rateLimitStore'

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

export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: isInternal,
  store: createStore('rl:api:'),
})

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
  store: createStore('rl:booking:'),
})

// Map API — heavy traffic endpoint, tighter limit
export const mapLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 50,              // 50 req/min per IP
  message: 'Too many map requests, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
  skip: isInternal,
  store: createStore('rl:map:'),
})
