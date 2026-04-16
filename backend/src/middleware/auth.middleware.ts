import { Request, Response, NextFunction } from 'express'
import { verifyToken, verifyRefreshToken, JWTPayload } from '../shared/jwt'
import { UnauthorizedError, ForbiddenError } from '../shared/errors'

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload
    }
  }
}

/**
 * Authenticate user from JWT token
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided')
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const payload = await verifyToken(token)

    // Attach user to request
    req.user = payload

    next()
  } catch (error) {
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
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const payload = await verifyToken(token)
      req.user = payload
    }

    next()
  } catch (error) {
    // Continue without authentication
    next()
  }
}

/**
 * Authenticate using refresh token (for /refresh endpoint only)
 */
export const authenticateRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No refresh token provided')
    }

    const token = authHeader.substring(7)
    const payload = await verifyRefreshToken(token)
    req.user = payload

    next()
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired refresh token'))
  }
}
