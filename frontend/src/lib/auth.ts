/**
 * Auth helpers.
 *
 * Tokens are NO LONGER stored in JavaScript — they live in httpOnly cookies set
 * by the backend (`gpi_at` / `gpi_rt`), so they cannot be read or stolen by
 * client-side scripts (XSS). The browser sends them automatically on every
 * same-site request (axios uses `withCredentials`).
 *
 * We keep only the non-sensitive user profile in localStorage for instant UI
 * (showing the name/role without a round-trip). It is NOT a source of trust —
 * the server validates the cookie on every protected request.
 */

const USER_KEY = 'gpi_user'

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? `${window.location.origin}/api/v1` : 'http://localhost:4000/api/v1')

// AuthUser id is number (matches backend schema)
export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'superadmin'
  phone?: string
  country?: string
}

/**
 * Persist the user profile after login / register. Tokens are handled by the
 * server via httpOnly cookies, so they are intentionally not passed here.
 */
export function saveAuth(user: AuthUser) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/**
 * Get the stored user object (null on server or if not logged in).
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
 * Update the stored user object (used when user data changes on the server).
 */
export function updateUser(user: AuthUser) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/**
 * Clear local auth state. Also tells the server (best-effort) to clear the
 * httpOnly cookies and revoke refresh tokens. Safe to call from sync handlers.
 */
export function clearAuth() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(USER_KEY)
  // Fire-and-forget: clears gpi_at/gpi_rt cookies + bumps the token version.
  // The endpoint uses optional auth, so it works even if the access token expired.
  try {
    fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
  } catch {
    /* ignore */
  }
}

/**
 * UI hint only — true if a user profile is cached locally. Real authentication
 * is enforced server-side via the httpOnly cookie.
 */
export function isAuthenticated(): boolean {
  return !!getUser()
}

/**
 * True if the stored user has an admin-level role.
 */
export function isAdmin(): boolean {
  const role = getUser()?.role
  return role === 'admin' || role === 'superadmin'
}
