export const authConfig = {
  secret: process.env.AUTH_SECRET || 'development-secret-change-in-production',
  sessionCookieName: 'session',
  sessionMaxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  algorithm: 'HS256' as const,
}

export type UserRole = 'admin' | 'user'

export interface SessionPayload {
  userId: string
  email: string
  role: UserRole
  name?: string
  [key: string]: string | undefined
}
