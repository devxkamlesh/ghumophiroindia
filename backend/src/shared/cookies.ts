import type { Response } from 'express'
import config from '../core/config'

/**
 * httpOnly auth cookies. Tokens live here instead of localStorage so they are
 * not readable by JavaScript (XSS can no longer exfiltrate a session).
 *
 * Frontend and API are served from the same site in production
 * (ghumofiroindia.com + /api), so SameSite=Lax cookies are sent on both the
 * Next.js document requests (for middleware route protection) and API calls.
 */
export const ACCESS_COOKIE = 'gpi_at'
export const REFRESH_COOKIE = 'gpi_rt'

const isProd = config.env === 'production'

const baseCookie = {
  httpOnly: true,
  secure: isProd, // only require HTTPS in production (dev runs over http)
  sameSite: 'lax' as const,
  path: '/',
}

const ACCESS_MAX_AGE = 1000 * 60 * 60          // 1 hour (token itself expires in ~15m)
const REFRESH_MAX_AGE = 1000 * 60 * 60 * 24 * 7 // 7 days

export function setAccessCookie(res: Response, accessToken: string): void {
  res.cookie(ACCESS_COOKIE, accessToken, { ...baseCookie, maxAge: ACCESS_MAX_AGE })
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  setAccessCookie(res, accessToken)
  res.cookie(REFRESH_COOKIE, refreshToken, { ...baseCookie, maxAge: REFRESH_MAX_AGE })
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_COOKIE, { ...baseCookie })
  res.clearCookie(REFRESH_COOKIE, { ...baseCookie })
}
