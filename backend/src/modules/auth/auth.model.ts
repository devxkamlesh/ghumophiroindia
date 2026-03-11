import type { users } from '../../core/database/schema'
import type { InferSelectModel } from 'drizzle-orm'

// Full user row from DB
export type User = InferSelectModel<typeof users>

// User without sensitive fields (safe to return in API responses)
export type SafeUser = Omit<User, 'password'>

// Auth response returned after login/register
export interface AuthResponse {
  user: SafeUser
  accessToken: string
  refreshToken: string
}

// Refresh response
export interface RefreshResponse {
  accessToken: string
}
