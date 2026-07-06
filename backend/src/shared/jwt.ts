import { SignJWT, jwtVerify } from 'jose'
import config from '../core/config'

const secret = new TextEncoder().encode(config.jwt.secret)
const refreshSecret = new TextEncoder().encode(config.jwt.refreshSecret)

// Pin the signing/verification algorithm. Without this, jose will accept any
// HMAC variant (HS256/384/512), widening the attack surface.
const JWT_ALG = 'HS256'

export interface JWTPayload {
  userId: number
  email: string
  role: string
  /** Token revocation version — present on refresh tokens (and access tokens). */
  tokenVersion?: number
}

/**
 * Generate JWT access token
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(config.jwt.expiresIn)
    .sign(secret)

  return token
}

/**
 * Generate JWT refresh token
 */
export async function generateRefreshToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(config.jwt.refreshExpiresIn)
    .sign(refreshSecret)

  return token
}

/**
 * Verify JWT access token
 */
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: [JWT_ALG] })
    return payload as unknown as JWTPayload
  } catch (_error) {
    throw new Error('Invalid or expired token')
  }
}

/**
 * Verify JWT refresh token (same secret, validates expiry separately)
 */
export async function verifyRefreshToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, refreshSecret, { algorithms: [JWT_ALG] })
    return payload as unknown as JWTPayload
  } catch (_error) {
    throw new Error('Invalid or expired refresh token')
  }
}

/**
 * Decode token without verification (for debugging)
 */
export function decodeToken(token: string): any {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    return payload
  } catch {
    return null
  }
}
