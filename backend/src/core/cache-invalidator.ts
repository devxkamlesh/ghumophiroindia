/**
 * Cache Invalidator — listens to domain events and invalidates
 * the correct cache keys. Single place for all invalidation logic.
 *
 * Called once at startup: setupCacheInvalidation()
 */

import events from './events'
import mapCacheService from '../modules/locations/map.cache'
import tourCache from '../modules/tours/tour.cache'
import logger from './logger'

// Lazy-load queues — only available when local Redis is running
async function tryEnqueue(queueName: 'popularity' | 'cache-warmer', jobName: string, data: object, priority = 5) {
  try {
    const { popularityQueue, cacheWarmerQueue } = await import('../jobs/workers')
    const queue = queueName === 'popularity' ? popularityQueue : cacheWarmerQueue
    if (!queue) return  // workers not started (no local Redis)
    await queue.add(jobName, data, { priority })
  } catch {
    // Workers not available (no local Redis) — skip silently
  }
}

export function setupCacheInvalidation() {

  // ── Tour events ─────────────────────────────────────────────────────────────

  events.on('tour.created', async ({ locationSlugs }) => {
    // Invalidate tour list caches + map caches for affected locations
    await tourCache.invalidateAllTours()
    await invalidateMapSlugs(locationSlugs)
    logger.info(`[invalidator] tour.created → invalidated tours + maps: ${locationSlugs.join(', ')}`)
  })

  events.on('tour.updated', async ({ tourId, locationSlugs }) => {
    await tourCache.invalidateAllTours()
    await invalidateMapSlugs(locationSlugs)
    // Enqueue popularity rescore for affected locations
    await enqueueScoringForSlugs(locationSlugs)
    logger.info(`[invalidator] tour.updated(${tourId}) → invalidated tours + maps + queued rescore`)
  })

  events.on('tour.deleted', async ({ tourId, locationSlugs }) => {
    await tourCache.invalidateAllTours()
    await invalidateMapSlugs(locationSlugs)
    await enqueueScoringForSlugs(locationSlugs)
    logger.info(`[invalidator] tour.deleted(${tourId}) → invalidated tours + maps + queued rescore`)
  })

  // ── Booking events ───────────────────────────────────────────────────────────
  // Bookings affect popularityScore — enqueue rescore, don't invalidate map immediately
  // (map TTL is 30m, popularity worker runs every hour — acceptable lag)

  events.on('booking.created', async ({ locationId }) => {
    if (locationId) {
      await tryEnqueue('popularity', 'score-location', { locationId }, 10)
      logger.info(`[invalidator] booking.created → queued popularity rescore for location ${locationId}`)
    }
  })

  events.on('booking.updated', async ({ locationId }) => {
    if (locationId) {
      await tryEnqueue('popularity', 'score-location', { locationId }, 10)
    }
  })

  // ── Destination events ───────────────────────────────────────────────────────

  events.on('destination.updated', async ({ locationSlug }) => {
    await mapCacheService.invalidate(locationSlug)
    await tryEnqueue('cache-warmer', 'warm-map', { slug: locationSlug }, 5)
    logger.info(`[invalidator] destination.updated → invalidated + queued rebuild for ${locationSlug}`)
  })

  logger.info('[invalidator] Cache invalidation listeners registered')
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function invalidateMapSlugs(slugs: string[]) {
  await Promise.all(slugs.map(slug => mapCacheService.invalidate(slug)))
  await Promise.all(slugs.map(slug => tryEnqueue('cache-warmer', 'warm-map', { slug }, 5)))
}

async function enqueueScoringForSlugs(slugs: string[]) {
  await Promise.all(slugs.map(slug => tryEnqueue('popularity', 'score-by-slug', { slug }, 8)))
}
