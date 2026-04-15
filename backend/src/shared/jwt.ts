import { SignJWT, jwtVerify } from 'jose'
import config from '../core/config'

const secret = new TextEncoder().encode(config.jwt.secret)

export interface JWTPayload {
  userId: number
  email: string
  role: string
}

/**
 * Generate JWT access token
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
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
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(config.jwt.refreshExpiresIn)
    .sign(secret)

  return token
}

/**
 * Verify JWT access token
 */
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as JWTPayload
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

/**
 * Verify JWT refresh token (same secret, validates expiry separately)
 */
export async function verifyRefreshToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as JWTPayload
  } catch (error) {
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
