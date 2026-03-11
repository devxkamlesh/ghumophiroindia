/**
 * Map-Ready Cache Layer — Split payload strategy
 *
 * Payload is split into 3 independent keys so the frontend can
 * load lazily and Redis memory stays bounded:
 *
 *   map:jaipur:core   → { center, location, summary }          TTL 30m
 *   map:jaipur:places → [{ id, name, lat, lng, type }]         TTL 30m
 *   map:jaipur:tours  → [{ id, title, slug, price, rating }]   TTL 30m
 *
 * API:
 *   GET /locations/map/:slug          → core only (fast)
 *   GET /locations/map/:slug/places   → places list
 *   GET /locations/map/:slug/tours    → tours list
 *   GET /locations/map/:slug/full     → all three merged
 */

import { eq, like, and } from 'drizzle-orm'
import db from '../../core/database'
import { locations, locationSummary, tours, tourDestinations, destinations } from '../../core/database/schema'
import { getCache, setCache, deleteCache, generateCacheKey } from '../../core/redis'
import logger from '../../core/logger'

const MAP_TTL = 30 * 60  // 30 minutes

// ── Cache key helpers ─────────────────────────────────────────────────────────
const keys = {
  core:   (slug: string) => generateCacheKey('map', slug, 'core'),
  places: (slug: string) => generateCacheKey('map', slug, 'places'),
  tours:  (slug: string) => generateCacheKey('map', slug, 'tours'),
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MapCore {
  center:   { lat: number | null; lng: number | null }
  location: { id: number; name: string; slug: string; type: string; path: string }
  summary:  { totalTours: number; avgPrice: number; popularityScore: number }
  cachedAt: string
}

export interface MapPlace {
  id: number; name: string; slug: string; type: string
  lat: number | null; lng: number | null
}

export interface MapTour {
  id: number; title: string; slug: string
  price: string; rating: string | null; duration: number
}

export interface MapFull extends MapCore {
  places: MapPlace[]
  tours:  MapTour[]
}

// ── Observability counters (in-process, logged periodically) ──────────────────
const stats = { hits: 0, misses: 0, builds: 0 }

export function getMapCacheStats() { return { ...stats } }

// ── Service ───────────────────────────────────────────────────────────────────

export class MapCacheService {

  // ── Getters ─────────────────────────────────────────────────────────────────

  async getCore(slug: string): Promise<MapCore | null> {
    const v = await getCache<MapCore>(keys.core(slug))
    v ? stats.hits++ : stats.misses++
    return v
  }

  async getPlaces(slug: string): Promise<MapPlace[] | null> {
    return getCache<MapPlace[]>(keys.places(slug))
  }

  async getTours(slug: string): Promise<MapTour[] | null> {
    return getCache<MapTour[]>(keys.tours(slug))
  }

  async getFull(slug: string): Promise<MapFull | null> {
    const [core, places, tours] = await Promise.all([
      this.getCore(slug),
      this.getPlaces(slug),
      this.getTours(slug),
    ])
    if (!core || !places || !tours) return null
    return { ...core, places, tours }
  }

  // ── Build ────────────────────────────────────────────────────────────────────

  async build(slug: string): Promise<MapFull | null> {
    stats.builds++

    // 1. Location (minimal columns only)
    const location = await db
      .select({ id: locations.id, name: locations.name, slug: locations.slug,
                type: locations.type, path: locations.path, lat: locations.lat, lng: locations.lng })
      .from(locations)
      .where(eq(locations.slug, slug))
      .limit(1)
      .then(r => r[0] ?? null)

    if (!location) return null

    // 2. Places in subtree — path-based, no recursion, indexed
    const places = await db
      .select({ id: locations.id, name: locations.name, slug: locations.slug,
                type: locations.type, lat: locations.lat, lng: locations.lng })
      .from(locations)
      .where(and(like(locations.path, `${location.path}/%`), eq(locations.type, 'place')))

    // 3. Tours via JOIN chain (single query)
    const toursInLocation = await db
      .select({ id: tours.id, title: tours.title, slug: tours.slug,
                price: tours.price, rating: tours.rating, duration: tours.duration })
      .from(tours)
      .innerJoin(tourDestinations, eq(tours.id, tourDestinations.tourId))
      .innerJoin(destinations, eq(tourDestinations.destinationId, destinations.id))
      .innerJoin(locations, eq(destinations.locationId, locations.id))
      .where(and(like(locations.path, `${location.path}%`), eq(tours.isActive, true)))

    // 4. Precomputed summary (0 aggregation)
    const summary = await db
      .select({ totalTours: locationSummary.totalTours, avgPrice: locationSummary.avgPrice,
                popularityScore: locationSummary.popularityScore })
      .from(locationSummary)
      .where(eq(locationSummary.locationId, location.id))
      .limit(1)
      .then(r => r[0] ?? { totalTours: toursInLocation.length, avgPrice: 0, popularityScore: 0 })

    const cachedAt = new Date().toISOString()

    const core: MapCore = {
      center:   { lat: location.lat, lng: location.lng },
      location: { id: location.id, name: location.name, slug: location.slug,
                  type: location.type, path: location.path },
      summary,
      cachedAt,
    }

    // Store 3 keys independently — frontend loads lazily
    await Promise.all([
      setCache(keys.core(slug),   core,                MAP_TTL),
      setCache(keys.places(slug), places as MapPlace[], MAP_TTL),
      setCache(keys.tours(slug),  toursInLocation as MapTour[], MAP_TTL),
    ])

    logger.info(`[map-cache] Built ${slug}: ${places.length} places, ${toursInLocation.length} tours`)

    return { ...core, places: places as MapPlace[], tours: toursInLocation as MapTour[] }
  }

  // ── Invalidate ───────────────────────────────────────────────────────────────

  async invalidate(slug: string): Promise<void> {
    await Promise.all([
      deleteCache(keys.core(slug)),
      deleteCache(keys.places(slug)),
      deleteCache(keys.tours(slug)),
    ])
    logger.info(`[map-cache] Invalidated all keys for ${slug}`)
  }

  // ── Get or build ─────────────────────────────────────────────────────────────

  async getOrBuild(slug: string): Promise<MapFull | null> {
    const full = await this.getFull(slug)
    if (full) {
      logger.info(`[map-cache] HIT ${slug} (hits=${stats.hits} misses=${stats.misses})`)
      return full
    }
    logger.info(`[map-cache] MISS ${slug} — building`)
    return this.build(slug)
  }

  async getCoreOrBuild(slug: string): Promise<MapCore | null> {
    const cached = await this.getCore(slug)
    if (cached) return cached
    const full = await this.build(slug)
    return full ? { center: full.center, location: full.location, summary: full.summary, cachedAt: full.cachedAt } : null
  }
}

export default new MapCacheService()
