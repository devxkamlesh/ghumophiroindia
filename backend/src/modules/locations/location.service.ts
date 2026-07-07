import { eq, and, or, like, inArray, sql } from 'drizzle-orm'
import db from '../../core/database'
import { locations, tours, tourLocations } from '../../core/database/schema'
import { NotFoundError, ConflictError } from '../../shared/errors'
import { getCache, setCache, deleteCache, CACHE_TTL } from '../../core/redis'
import logger from '../../core/logger'
import type { CreateLocationInput, UpdateLocationInput, LocationQueryInput } from './location.validator'

// `getAll` returns the full location tree and is hit from many public pages.
// The data changes only via admin CRUD, so cache the whole payload and drop the
// key on any location mutation.
// Bump the version suffix whenever the cached payload shape changes (e.g. adding
// tourCount) so a deploy serves a freshly-computed value instead of stale cache.
const ALL_LOCATIONS_KEY = 'locations:all:v2'
type LocationList = { locations: unknown[]; pagination: { page: number; limit: number; total: number; totalPages: number } }

const cols = {
  id:          locations.id,
  name:        locations.name,
  slug:        locations.slug,
  type:        locations.type,
  parentId:    locations.parentId,
  path:        locations.path,
  lat:         locations.lat,
  lng:         locations.lng,
  description: locations.description,
  image:       locations.image,
  isActive:    locations.isActive,
  isPopular:   locations.isPopular,
  createdAt:   locations.createdAt,
}

export class LocationService {
  async getAll(_query: LocationQueryInput) {
    const cached = await getCache<LocationList>(ALL_LOCATIONS_KEY)
    if (cached) return cached

    try {
      const result = await db.select(cols).from(locations).orderBy(locations.path)

      // Attach a descendant-aware active-tour count to each location. A state
      // aggregates the tours linked to all its cities/places (via the `path`
      // hierarchy), not only the tours linked to the state node directly.
      const countMap = await this.getTourCounts()
      const withCounts = result.map(l => ({ ...l, tourCount: countMap.get(l.id) ?? 0 }))

      const payload: LocationList = {
        locations: withCounts,
        pagination: { page: 1, limit: 500, total: withCounts.length, totalPages: 1 },
      }
      await setCache(ALL_LOCATIONS_KEY, payload, CACHE_TTL.WARM)
      return payload
    } catch {
      return { locations: [], pagination: { page: 1, limit: 500, total: 0, totalPages: 0 } }
    }
  }

  /**
   * Map of locationId -> count of DISTINCT active tours, aggregated over the
   * location and all its descendants (matched by `path` prefix). One query.
   */
  private async getTourCounts(): Promise<Map<number, number>> {
    const map = new Map<number, number>()
    try {
      const rows = await db.execute(sql`
        SELECT l.id AS id, COUNT(DISTINCT t.id)::int AS tour_count
        FROM locations l
        LEFT JOIN locations d ON d.path = l.path OR d.path LIKE l.path || '/%'
        LEFT JOIN tour_locations tl ON tl.location_id = d.id
        LEFT JOIN tours t ON t.id = tl.tour_id AND t.is_active = true
        GROUP BY l.id
      `)
      for (const r of rows as unknown as Array<{ id: number; tour_count: number }>) {
        map.set(Number(r.id), Number(r.tour_count) || 0)
      }
    } catch (e) {
      logger.warn(`getTourCounts failed: ${(e as Error).message}`)
    }
    return map
  }

  /**
   * All active tours linked to a location OR any of its descendants.
   * Deduplicated, so a tour linked to several cities in a state appears once.
   */
  async getToursForLocationTree(id: number) {
    const loc = await this.getById(id)
    const descendants = await db
      .select({ id: locations.id })
      .from(locations)
      .where(or(eq(locations.id, id), like(locations.path, `${loc.path}/%`)))
    const ids = descendants.map(d => d.id)
    if (ids.length === 0) return []

    return db
      .selectDistinct({
        id:           tours.id,
        title:        tours.title,
        slug:         tours.slug,
        price:        tours.price,
        duration:     tours.duration,
        rating:       tours.rating,
        images:       tours.images,
        category:     tours.category,
        isFeatured:   tours.isFeatured,
        description:  tours.description,
        included:     tours.included,
        destinations: tours.destinations,
      })
      .from(tourLocations)
      .innerJoin(tours, eq(tourLocations.tourId, tours.id))
      .where(and(inArray(tourLocations.locationId, ids), eq(tours.isActive, true)))
  }

  /** Drop the cached location list. Called after any location mutation. */
  private async invalidateCache() {
    await deleteCache(ALL_LOCATIONS_KEY)
  }

  async getChildren(parentId: number) {
    return db.select(cols).from(locations).where(eq(locations.parentId, parentId)).orderBy(locations.name)
  }

  async getDescendants(id: number) {
    const parent = await this.getById(id)
    return db.select(cols).from(locations).where(like(locations.path, `${parent.path}/%`)).orderBy(locations.path)
  }

  async getById(id: number) {
    const [loc] = await db.select(cols).from(locations).where(eq(locations.id, id)).limit(1)
    if (!loc) throw new NotFoundError('Location not found')
    return loc
  }

  async getBySlug(slug: string) {
    const [loc] = await db.select(cols).from(locations).where(eq(locations.slug, slug)).limit(1)
    if (!loc) throw new NotFoundError('Location not found')
    return loc
  }

  async create(data: CreateLocationInput) {
    const [existing] = await db.select({ id: locations.id }).from(locations).where(eq(locations.slug, data.slug)).limit(1)
    if (existing) throw new ConflictError('A location with this slug already exists')

    let path = data.slug
    if (data.parentId) {
      const parent = await this.getById(data.parentId)
      path = `${parent.path}/${data.slug}`
    }

    const [loc] = await db.insert(locations).values({
      name:        data.name,
      slug:        data.slug,
      type:        data.type,
      parentId:    data.parentId ?? null,
      path,
      lat:         data.lat != null ? String(data.lat) : null,
      lng:         data.lng != null ? String(data.lng) : null,
      description: data.description ?? null,
      image:       data.image ?? null,
      isActive:    true,
      isPopular:   data.isPopular ?? false,
    }).returning()
    logger.info(`Location created: ${loc.name} (${loc.type})`)
    await this.invalidateCache()
    return loc
  }

  async update(id: number, data: UpdateLocationInput) {
    const existing = await this.getById(id)

    if (data.slug && data.slug !== existing.slug) {
      const [dup] = await db.select({ id: locations.id }).from(locations).where(eq(locations.slug, data.slug)).limit(1)
      if (dup) throw new ConflictError('Slug already in use')
    }

    const newSlug     = data.slug     ?? existing.slug
    const newParentId = data.parentId ?? existing.parentId

    let path = newSlug
    if (newParentId) {
      const parent = await this.getById(newParentId)
      path = `${parent.path}/${newSlug}`
    }

    const updateData: Record<string, unknown> = {}
    if (data.name        !== undefined) updateData.name        = data.name
    if (data.slug        !== undefined) updateData.slug        = data.slug
    if (data.type        !== undefined) updateData.type        = data.type
    if (data.parentId    !== undefined) updateData.parentId    = data.parentId
    if (data.description !== undefined) updateData.description = data.description
    if (data.image       !== undefined) updateData.image       = data.image
    if (data.lat         !== undefined) updateData.lat         = data.lat != null ? String(data.lat) : null
    if (data.lng         !== undefined) updateData.lng         = data.lng != null ? String(data.lng) : null
    if (data.isPopular   !== undefined) updateData.isPopular   = data.isPopular
    updateData.path = path

    const [updated] = await db.update(locations).set(updateData).where(eq(locations.id, id)).returning()
    logger.info(`Location updated: ${updated.name}, isPopular: ${updated.isPopular}`)
    await this.invalidateCache()
    return updated
  }

  async delete(id: number) {
    await this.getById(id) // throws if not found
    await db.delete(locations).where(eq(locations.id, id))
    logger.info(`Location deleted: ${id}`)
    await this.invalidateCache()
    return { message: 'Location deleted' }
  }

  async bulkImport(data: CreateLocationInput[]) {
    const results = {
      success: [] as any[],
      failed: [] as { row: number; data: any; error: string }[],
      skipped: [] as { row: number; data: any; reason: string }[],
    }

    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      try {
        // Check if slug already exists
        const [existing] = await db.select({ id: locations.id }).from(locations).where(eq(locations.slug, row.slug)).limit(1)
        if (existing) {
          results.skipped.push({ row: i + 1, data: row, reason: 'Slug already exists' })
          continue
        }

        // Create location
        const created = await this.create(row)
        results.success.push(created)
      } catch (error: any) {
        results.failed.push({ row: i + 1, data: row, error: error.message || 'Unknown error' })
      }
    }

    logger.info(`Bulk import completed: ${results.success.length} success, ${results.failed.length} failed, ${results.skipped.length} skipped`)
    return results
  }

  // Stub — distances table not created yet
  async getDistance(_fromId: number, _toId: number) { return null }
  async upsertDistance(_f: number, _t: number, _d: number, _m?: number) { return null }
}

export default new LocationService()
