/**
 * Background Workers — all instantiation is deferred inside startScheduledJobs().
 *
 * Nothing connects to Redis at module load time.
 * If local Redis is unavailable the server starts normally and workers are skipped.
 *
 * Worker 1 — Distance Generator  (Haversine, precomputes distances table)
 * Worker 2 — Popularity Scorer   (recomputes location_summary)
 * Worker 3 — Cache Warmer        (pre-loads Redis map cache)
 */

import { Queue, Worker, Job } from 'bullmq'
import IORedis from 'ioredis'
import { eq, sql } from 'drizzle-orm'
import db from '../core/database'
import {
  locations, distances, locationSummary,
  bookings, tours, tourDestinations, destinations,
} from '../core/database/schema'
import mapCacheService from '../modules/locations/map.cache'
import logger from '../core/logger'
import config from '../core/config'

// ─── Haversine distance (km) ──────────────────────────────────────────────────
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ─── Exported queue references (set after startScheduledJobs runs) ────────────
// These are used by cache-invalidator.ts to enqueue jobs.
// They are null until startScheduledJobs() succeeds.
export let popularityQueue:  Queue | null = null
export let cacheWarmerQueue: Queue | null = null
export let distanceQueue:    Queue | null = null

// ─── Main entry point ─────────────────────────────────────────────────────────

export async function startScheduledJobs(): Promise<void> {
  // 1. Create connection — lazyConnect so we can test it before creating queues
  const conn = new IORedis({
    host:                 config.redis.host     || 'localhost',
    port:                 config.redis.port     || 6379,
    password:             config.redis.password || undefined,
    maxRetriesPerRequest: null,
    lazyConnect:          true,
    enableOfflineQueue:   false,
  })

  // 2. Test connectivity — bail out gracefully if Redis isn't running
  conn.on('error', () => {}) // suppress unhandled error events during probe
  try {
    await conn.connect()
    await conn.ping()
  } catch (err: any) {
    conn.disconnect()
    logger.warn(`[workers] Local Redis unavailable — background workers disabled. (${err.message})`)
    logger.warn('[workers] Start Redis on localhost:6379 to enable distance generation, popularity scoring and cache warming.')
    return
  }

  logger.info('[workers] Redis connected — starting background workers')

  // 3. Create queues (only after connection is confirmed)
  distanceQueue    = new Queue('distance-generator', { connection: conn })
  popularityQueue  = new Queue('popularity-scorer',  { connection: conn })
  cacheWarmerQueue = new Queue('cache-warmer',       { connection: conn })

  // 4. Create workers
  const distanceWorker = new Worker(
    'distance-generator',
    async (job: Job) => {
      if (job.name === 'generate-pair') {
        const { fromId, toId } = job.data as { fromId: number; toId: number }
        const [from, to] = await Promise.all([
          db.select({ lat: locations.lat, lng: locations.lng }).from(locations).where(eq(locations.id, fromId)).limit(1).then(r => r[0]),
          db.select({ lat: locations.lat, lng: locations.lng }).from(locations).where(eq(locations.id, toId)).limit(1).then(r => r[0]),
        ])
        if (!from?.lat || !from?.lng || !to?.lat || !to?.lng) {
          logger.warn(`Distance job skipped: missing coords for ${fromId} or ${toId}`)
          return
        }
        const distanceKm = haversine(from.lat, from.lng, to.lat, to.lng)
        const durationMinutes = Math.round((distanceKm / 40) * 60)
        await db.insert(distances).values({ fromLocationId: fromId, toLocationId: toId, distanceKm, durationMinutes })
          .onConflictDoUpdate({ target: [distances.fromLocationId, distances.toLocationId], set: { distanceKm, durationMinutes } })
        logger.info(`Distance computed: ${fromId}→${toId} = ${distanceKm.toFixed(1)}km`)
        return { fromId, toId, distanceKm }
      }

      if (job.name === 'generate-all') {
        const MAX_KM = 300
        const locs = await db
          .select({ id: locations.id, lat: locations.lat, lng: locations.lng })
          .from(locations)
          .where(sql`lat IS NOT NULL AND lng IS NOT NULL AND type IN ('city', 'place')`)

        let count = 0
        for (let i = 0; i < locs.length; i++) {
          for (let j = i + 1; j < locs.length; j++) {
            const a = locs[i], b = locs[j]
            if (!a.lat || !a.lng || !b.lat || !b.lng) continue
            const distanceKm = haversine(a.lat, a.lng, b.lat, b.lng)
            if (distanceKm > MAX_KM) continue
            const durationMinutes = Math.round((distanceKm / 40) * 60)
            await db.insert(distances).values({ fromLocationId: a.id, toLocationId: b.id, distanceKm, durationMinutes })
              .onConflictDoUpdate({ target: [distances.fromLocationId, distances.toLocationId], set: { distanceKm, durationMinutes } })
            count++
          }
        }
        logger.info(`Distance generator: ${count} pairs computed for ${locs.length} locations`)
        return { count }
      }
    },
    { connection: conn, concurrency: 2 }
  )

  const popularityWorker = new Worker(
    'popularity-scorer',
    async (job: Job) => {
      let targetId: number | undefined = job.data?.locationId
      if (!targetId && job.data?.slug) {
        const [loc] = await db.select({ id: locations.id }).from(locations).where(eq(locations.slug, job.data.slug)).limit(1)
        targetId = loc?.id
      }

      const locs = targetId
        ? await db.select({ id: locations.id }).from(locations).where(eq(locations.id, targetId))
        : await db.select({ id: locations.id }).from(locations)

      let updated = 0
      for (const loc of locs) {
        const [tourCount]   = await db.select({ count: sql<number>`count(distinct ${tours.id})::int` }).from(tours)
          .innerJoin(tourDestinations, eq(tours.id, tourDestinations.tourId))
          .innerJoin(destinations, eq(tourDestinations.destinationId, destinations.id))
          .where(sql`${destinations.locationId} = ${loc.id} AND ${tours.isActive} = true`)

        const [bookingCount] = await db.select({ count: sql<number>`count(*)::int` }).from(bookings)
          .innerJoin(tours, eq(bookings.tourId, tours.id))
          .innerJoin(tourDestinations, eq(tours.id, tourDestinations.tourId))
          .innerJoin(destinations, eq(tourDestinations.destinationId, destinations.id))
          .where(sql`${destinations.locationId} = ${loc.id}`)

        const [recentCount] = await db.select({ count: sql<number>`count(*)::int` }).from(bookings)
          .innerJoin(tours, eq(bookings.tourId, tours.id))
          .innerJoin(tourDestinations, eq(tours.id, tourDestinations.tourId))
          .innerJoin(destinations, eq(tourDestinations.destinationId, destinations.id))
          .where(sql`${destinations.locationId} = ${loc.id} AND ${bookings.createdAt} > now() - interval '30 days'`)

        const [priceData] = await db.select({ avg: sql<number>`coalesce(avg(${tours.price}::numeric), 0)::int` }).from(tours)
          .innerJoin(tourDestinations, eq(tours.id, tourDestinations.tourId))
          .innerJoin(destinations, eq(tourDestinations.destinationId, destinations.id))
          .where(sql`${destinations.locationId} = ${loc.id} AND ${tours.isActive} = true`)

        const totalTours     = tourCount?.count    ?? 0
        const totalBookings  = bookingCount?.count  ?? 0
        const recentBookings = recentCount?.count   ?? 0
        const avgPrice       = priceData?.avg        ?? 0
        const popularityScore = Math.round((totalTours * 10) + (totalBookings * 5) + (recentBookings * 15))

        await db.insert(locationSummary)
          .values({ locationId: loc.id, totalTours, totalPlaces: 0, avgPrice, popularityScore, updatedAt: new Date() })
          .onConflictDoUpdate({ target: [locationSummary.locationId], set: { totalTours, avgPrice, popularityScore, updatedAt: new Date() } })
        updated++
      }
      logger.info(`Popularity scorer: updated ${updated} summaries`)
      return { updated }
    },
    { connection: conn, concurrency: 1 }
  )

  const cacheWarmerWorker = new Worker(
    'cache-warmer',
    async (job: Job) => {
      if (job.name === 'warm-map') {
        const { slug } = job.data as { slug: string }
        await mapCacheService.build(slug)
        return { slug }
      }
      if (job.name === 'warm-all-popular') {
        const popularLocs = await db.select({ slug: locations.slug }).from(locations).where(eq(locations.isPopular, true))
        for (const loc of popularLocs) await mapCacheService.build(loc.slug)
        logger.info(`Cache warmer: warmed ${popularLocs.length} popular maps`)
        return { warmed: popularLocs.map(l => l.slug) }
      }
    },
    { connection: conn, concurrency: 3 }
  )

  // 5. Error handlers
  distanceWorker.on('failed',    (job, err) => logger.error(`[distance-worker] job ${job?.id} failed: ${err.message}`))
  popularityWorker.on('failed',  (job, err) => logger.error(`[popularity-worker] job ${job?.id} failed: ${err.message}`))
  cacheWarmerWorker.on('failed', (job, err) => logger.error(`[cache-warmer] job ${job?.id} failed: ${err.message}`))

  // 6. Register recurring jobs
  await cacheWarmerQueue.add('warm-all-popular', {}, { repeat: { every: 30 * 60 * 1000 }, jobId: 'warm-all-popular-recurring' })
  await popularityQueue.add('score-all',         {}, { repeat: { every: 60 * 60 * 1000 }, jobId: 'score-all-recurring' })

  logger.info('[workers] Scheduled jobs registered: cache-warmer (30m), popularity-scorer (1h)')
}

export default { startScheduledJobs }
