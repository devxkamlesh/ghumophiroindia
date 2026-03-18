import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import { authConfig, SessionPayload } from './config'

const SECRET = new TextEncoder().encode(authConfig.secret)

/**
 * Create a new session and set the session cookie
 */
export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: authConfig.algorithm })
    .setIssuedAt()
    .setExpirationTime(`${authConfig.sessionMaxAge}s`)
    .sign(SECRET)

  const cookieStore = await cookies()
  cookieStore.set(authConfig.sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: authConfig.sessionMaxAge,
    path: '/',
  })

  return token
}

/**
 * Get the current session from cookies (server components)
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(authConfig.sessionCookieName)?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as SessionPayload
  } catch (error) {
    console.error('Session verification failed:', error)
    return null
  }
}

/**
 * Get session from request (middleware)
 */
export async function getSessionFromRequest(
  req: NextRequest
): Promise<SessionPayload | null> {
  const token = req.cookies.get(authConfig.sessionCookieName)?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as SessionPayload
  } catch (error) {
    return null
  }
}

/**
 * Destroy the current session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(authConfig.sessionCookieName)
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

/**
 * Check if user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession()
  return session?.role === 'admin'
}

/**
 * Require authentication (throws if not authenticated)
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

/**
 * Require admin role (throws if not admin)
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth()
  if (session.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }
  return session
}
