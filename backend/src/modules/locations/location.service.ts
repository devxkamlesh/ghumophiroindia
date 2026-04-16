import { eq, and, like, sql } from 'drizzle-orm'
import db from '../../core/database'
import { locations, distances } from '../../core/database/schema'
import { NotFoundError, ConflictError } from '../../shared/errors'
import { getCache, setCache, deleteCache, deleteCachePattern, CACHE_TTL, generateCacheKey } from '../../core/redis'
import logger from '../../core/logger'
import type { CreateLocationInput, UpdateLocationInput, LocationQueryInput } from './location.validator'
import type { InferSelectModel } from 'drizzle-orm'

// Explicit type so TypeScript knows the shape coming back from cache
type Location = InferSelectModel<typeof locations>

const KEY = {
  all:      ()             => generateCacheKey('locations', 'all'),
  id:       (id: number)   => generateCacheKey('locations', 'id', id),
  slug:     (slug: string) => generateCacheKey('locations', 'slug', slug),
  path:     (path: string) => generateCacheKey('locations', 'path', path),
  children: (id: number)   => generateCacheKey('locations', 'children', id),
  popular:  ()             => generateCacheKey('locations', 'popular'),
}

export class LocationService {
  /**
   * Get all locations with optional filters
   */
  async getAll(query: LocationQueryInput) {
    const { type, parentId, path, popular, page, limit } = query
    const cacheKey = generateCacheKey('locations', 'list', JSON.stringify(query))

    const cached = await getCache<{ locations: Location[]; pagination: object }>(cacheKey)
    if (cached) return cached

    const conditions = []
    if (type)     conditions.push(eq(locations.type, type))
    if (parentId) conditions.push(eq(locations.parentId, parentId))
    if (path)     conditions.push(like(locations.path, `${path}/%`))
    if (popular)  conditions.push(eq(locations.isPopular, true))

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(locations)
      .where(whereClause)

    const offset = (page - 1) * limit
    const results = await db
      .select()
      .from(locations)
      .where(whereClause)
      .limit(limit)
      .offset(offset)

    const response = {
      locations: results,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    }

    await setCache(cacheKey, response, CACHE_TTL.HOT)
    return response
  }

  /**
   * Get location by ID — explicit return type so callers get full Location shape
   */
  async getById(id: number): Promise<Location> {
    const cached = await getCache<Location>(KEY.id(id))
    if (cached) return cached

    const location = await db.query.locations.findFirst({
      where: eq(locations.id, id),
    })
    if (!location) throw new NotFoundError('Location not found')

    await setCache(KEY.id(id), location, CACHE_TTL.WARM)
    return location
  }

  /**
   * Get location by slug — explicit return type
   */
  async getBySlug(slug: string): Promise<Location> {
    const cached = await getCache<Location>(KEY.slug(slug))
    if (cached) return cached

    const location = await db.query.locations.findFirst({
      where: eq(locations.slug, slug),
    })
    if (!location) throw new NotFoundError('Location not found')

    await setCache(KEY.slug(slug), location, CACHE_TTL.WARM)
    return location
  }

  /**
   * Get all descendants using path-based query — no recursion, single indexed query
   */
  async getDescendants(id: number): Promise<Location[]> {
    const parent = await this.getById(id)
    const cacheKey = KEY.children(id)

    const cached = await getCache<Location[]>(cacheKey)
    if (cached) return cached

    const results = await db
      .select()
      .from(locations)
      .where(like(locations.path, `${parent.path}/%`))

    await setCache(cacheKey, results, CACHE_TTL.HOT)
    return results
  }

  /**
   * Get direct children of a location
   */
  async getChildren(parentId: number): Promise<Location[]> {
    return db
      .select()
      .from(locations)
      .where(eq(locations.parentId, parentId))
  }

  /**
   * Get precomputed distance — never calculates at runtime
   */
  async getDistance(fromId: number, toId: number) {
    const [row] = await db
      .select()
      .from(distances)
      .where(and(
        eq(distances.fromLocationId, fromId),
        eq(distances.toLocationId, toId),
      ))
      .limit(1)

    return row ?? null
  }

  /**
   * Create location — auto-builds materialized path from parent
   */
  async create(data: CreateLocationInput): Promise<Location> {
    const existing = await db.query.locations.findFirst({
      where: eq(locations.slug, data.slug),
    })
    if (existing) throw new ConflictError('Location with this slug already exists')

    let path = data.slug
    if (data.parentId) {
      const parent = await this.getById(data.parentId)
      path = `${parent.path}/${data.slug}`
    }

    const [location] = await db.insert(locations).values({ ...data, path }).returning()
    await deleteCachePattern('locations:*')
    logger.info(`Location ${location.id} (${path}) created`)
    return location
  }

  /**
   * Update location — rebuilds path if slug or parentId changed
   */
  async update(id: number, data: UpdateLocationInput): Promise<Location> {
    const existing = await this.getById(id)

    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await db.query.locations.findFirst({
        where: eq(locations.slug, data.slug),
      })
      if (slugExists) throw new ConflictError('Location with this slug already exists')
    }

    let path = existing.path
    if (data.slug || data.parentId !== undefined) {
      const newSlug = data.slug ?? existing.slug
      if (data.parentId) {
        const parent = await this.getById(data.parentId)
        path = `${parent.path}/${newSlug}`
      } else {
        path = newSlug
      }
    }

    const [updated] = await db
      .update(locations)
      .set({ ...data, path, updatedAt: new Date() })
      .where(eq(locations.id, id))
      .returning()

    await deleteCachePattern('locations:*')
    logger.info(`Location ${id} updated`)
    return updated
  }

  /**
   * Upsert precomputed distance (admin/script use only)
   */
  async upsertDistance(fromId: number, toId: number, distanceKm: number, durationMinutes?: number) {
    await db
      .insert(distances)
      .values({ fromLocationId: fromId, toLocationId: toId, distanceKm, durationMinutes })
      .onConflictDoUpdate({
        target: [distances.fromLocationId, distances.toLocationId],
        set: { distanceKm, durationMinutes },
      })
    logger.info(`Distance ${fromId}→${toId}: ${distanceKm}km upserted`)
  }
}

export default new LocationService()
