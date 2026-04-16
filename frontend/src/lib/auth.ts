/**
 * Auth helpers — all localStorage access is SSR-safe (typeof window check).
 *
 * Keys:
 *   gpi_token         — JWT access token
 *   gpi_refresh_token — JWT refresh token
 *   gpi_user          — serialised AuthUser object
 */

const TOKEN_KEY   = 'gpi_token'
const REFRESH_KEY = 'gpi_refresh_token'
const USER_KEY    = 'gpi_user'

// AuthUser id is number (matches backend schema)
export interface AuthUser {
  id: string        // stored as string for convenience, backend sends number
  name: string
  email: string
  role: 'admin' | 'user' | 'superadmin'
  phone?: string
  country?: string
}

/**
 * Persist tokens + user after login / register.
 */
export function saveAuth(accessToken: string, user: AuthUser, refreshToken?: string) {
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  if (refreshToken) {
    localStorage.setItem(REFRESH_KEY, refreshToken)
  }
}

/**
 * Get the current access token (null on server or if not logged in).
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Get the stored refresh token.
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_KEY)
}

/**
 * Get the stored user object.
 */
export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

/**
 * Update only the access token (used after a token refresh).
 */
export function updateAccessToken(accessToken: string) {
  localStorage.setItem(TOKEN_KEY, accessToken)
}

/**
 * Remove all auth data (logout).
 */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
}

/**
 * True if an access token exists in storage.
 * Does NOT validate expiry — that's the server's job.
 */
export function isAuthenticated(): boolean {
  return !!getToken()
}

/**
 * True if the stored user has the admin role.
 */
export function isAdmin(): boolean {
  const role = getUser()?.role
  return role === 'admin' || role === 'superadmin'
}
