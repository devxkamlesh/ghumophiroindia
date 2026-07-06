import { Request, Response, NextFunction } from 'express'
import { verifyToken, verifyRefreshToken, JWTPayload } from '../shared/jwt'
import { UnauthorizedError, ForbiddenError } from '../shared/errors'
import { ACCESS_COOKIE, REFRESH_COOKIE } from '../shared/cookies'

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload
    }
  }
}

/** Pull a bearer token from the Authorization header, falling back to a cookie. */
function extractToken(req: Request, cookieName: string): string | null {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  const cookieToken = (req as any).cookies?.[cookieName]
  return typeof cookieToken === 'string' && cookieToken.length > 0 ? cookieToken : null
}

/**
 * Authenticate user from JWT token (Authorization header or httpOnly cookie)
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req, ACCESS_COOKIE)

    if (!token) {
      throw new UnauthorizedError('No token provided')
    }

    // Verify token
    const payload = await verifyToken(token)

    // Attach user to request
    req.user = payload

    next()
  } catch (_error) {
    next(new UnauthorizedError('Invalid or expired token'))
  }
}

/**
 * Authorize user by role.
 * superadmin passes ALL role checks automatically.
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'))
    }
    // superadmin has all permissions
    if (req.user.role === 'superadmin') return next()
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'))
    }
    next()
  }
}

/** Only superadmin can access */
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new UnauthorizedError('Authentication required'))
  if (req.user.role !== 'superadmin') return next(new ForbiddenError('Superadmin only'))
  next()
}

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req, ACCESS_COOKIE)

    if (token) {
      const payload = await verifyToken(token)
      req.user = payload
    }

    next()
  } catch (_error) {
    // Continue without authentication
    next()
  }
}

/**
 * Authenticate using refresh token (for /refresh endpoint only).
 * Reads the refresh token from the Authorization header or the httpOnly cookie.
 */
export const authenticateRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req, REFRESH_COOKIE)

    if (!token) {
      throw new UnauthorizedError('No refresh token provided')
    }

    const payload = await verifyRefreshToken(token)
    req.user = payload

    next()
  } catch (_error) {
    next(new UnauthorizedError('Invalid or expired refresh token'))
  }
}
