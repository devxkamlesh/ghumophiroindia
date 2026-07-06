import { getCache, setCache } from '../core/redis'

/**
 * Per-user token "version" used to revoke refresh tokens.
 *
 * Every refresh token carries the version it was minted with. On refresh we
 * compare it to the current stored version; a mismatch means the token was
 * revoked (logout, password change/reset, role change, deactivation) and is
 * rejected. Access tokens are short-lived (15m) and are NOT checked per-request
 * to avoid a Redis round-trip on every API call — revoking refresh tokens means
 * a revoked session dies within one access-token lifetime.
 *
 * When Redis is not configured (local dev) this is a best-effort no-op:
 * getTokenVersion returns 0 and bumps are dropped, so refresh keeps working.
 */
const PREFIX = 'tokenv:'
const TTL_SECONDS = 60 * 60 * 24 * 30 // 30 days — outlives the refresh token

export async function getTokenVersion(userId: number): Promise<number> {
  const v = await getCache<number>(`${PREFIX}${userId}`)
  return typeof v === 'number' ? v : 0
}

export async function bumpTokenVersion(userId: number): Promise<number> {
  const next = (await getTokenVersion(userId)) + 1
  await setCache(`${PREFIX}${userId}`, next, TTL_SECONDS)
  return next
}
