import { eq, isNull, like } from 'drizzle-orm'
import db from '../../core/database'
import { locations } from '../../core/database/schema'
import { NotFoundError, ConflictError } from '../../shared/errors'
import logger from '../../core/logger'
import type { CreateLocationInput, UpdateLocationInput, LocationQueryInput } from './location.validator'

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
  createdAt:   locations.createdAt,
}

export class LocationService {
  async getAll(_query: LocationQueryInput) {
    try {
      const result = await db.select(cols).from(locations).orderBy(locations.path)
      return { locations: result, pagination: { page: 1, limit: 500, total: result.length, totalPages: 1 } }
    } catch {
      return { locations: [], pagination: { page: 1, limit: 500, total: 0, totalPages: 0 } }
    }
  }

  async getRoots() {
    return db.select(cols).from(locations).where(isNull(locations.parentId)).orderBy(locations.name)
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
    // Check slug unique
    const [existing] = await db.select({ id: locations.id }).from(locations).where(eq(locations.slug, data.slug)).limit(1)
    if (existing) throw new ConflictError('A location with this slug already exists')

    // Build path from parent
    let path = data.slug
    if (data.parentId) {
      const parent = await this.getById(data.parentId)
      path = `${parent.path}/${data.slug}`
    }

    const [loc] = await db.insert(locations).values({ ...data, path }).returning()
    logger.info(`Location created: ${loc.name} (${loc.type})`)
    return loc
  }

  async update(id: number, data: UpdateLocationInput) {
    const existing = await this.getById(id)

    if (data.slug && data.slug !== existing.slug) {
      const [dup] = await db.select({ id: locations.id }).from(locations).where(eq(locations.slug, data.slug)).limit(1)
      if (dup) throw new ConflictError('Slug already in use')
    }

    // Rebuild path if slug or parentId changed
    let path = existing.path
    const newSlug     = data.slug     ?? existing.slug
    const newParentId = data.parentId ?? existing.parentId

    if (newParentId) {
      const parent = await this.getById(newParentId)
      path = `${parent.path}/${newSlug}`
    } else {
      path = newSlug
    }

    const [updated] = await db.update(locations).set({ ...data, path }).where(eq(locations.id, id)).returning()
    logger.info(`Location updated: ${updated.name}`)
    return updated
  }

  async delete(id: number) {
    await this.getById(id) // throws if not found
    await db.delete(locations).where(eq(locations.id, id))
    logger.info(`Location deleted: ${id}`)
    return { message: 'Location deleted' }
  }

  // Stub — distances table not created yet
  async getDistance(_fromId: number, _toId: number) { return null }
  async upsertDistance(_f: number, _t: number, _d: number, _m?: number) { return null }
}

export default new LocationService()
