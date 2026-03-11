import { eq, desc } from 'drizzle-orm'
import db from '../../core/database'
import { destinations } from '../../core/database/schema'
import { NotFoundError, ConflictError } from '../../shared/errors'
import { getCache, setCache, deleteCache, deleteCachePattern, CACHE_TTL, generateCacheKey } from '../../core/redis'
import logger from '../../core/logger'
import type { CreateDestinationInput, UpdateDestinationInput } from './destination.validator'

const KEY = {
  all:     () => generateCacheKey('destinations', 'all'),
  popular: () => generateCacheKey('destinations', 'popular'),
  id:      (id: number)   => generateCacheKey('destinations', 'id', id),
  slug:    (slug: string) => generateCacheKey('destinations', 'slug', slug),
}

async function invalidateAll() {
  await deleteCachePattern('destinations:*')
}

export class DestinationService {
  async getAll() {
    const cached = await getCache(KEY.all())
    if (cached) return cached

    const result = await db.query.destinations.findMany({
      orderBy: desc(destinations.isPopular),
    })
    await setCache(KEY.all(), result, CACHE_TTL.HOT)
    return result
  }

  async getPopular() {
    const cached = await getCache(KEY.popular())
    if (cached) return cached

    const result = await db.query.destinations.findMany({
      where: eq(destinations.isPopular, true),
      limit: 6,
    })
    await setCache(KEY.popular(), result, CACHE_TTL.HOT)
    return result
  }

  async getById(id: number) {
    const cached = await getCache(KEY.id(id))
    if (cached) return cached

    const destination = await db.query.destinations.findFirst({
      where: eq(destinations.id, id),
    })
    if (!destination) throw new NotFoundError('Destination not found')

    await setCache(KEY.id(id), destination, CACHE_TTL.WARM)
    return destination
  }

  async getBySlug(slug: string) {
    const cached = await getCache(KEY.slug(slug))
    if (cached) return cached

    const destination = await db.query.destinations.findFirst({
      where: eq(destinations.slug, slug),
    })
    if (!destination) throw new NotFoundError('Destination not found')

    await setCache(KEY.slug(slug), destination, CACHE_TTL.WARM)
    return destination
  }

  async create(data: CreateDestinationInput) {
    const existing = await db.query.destinations.findFirst({
      where: eq(destinations.slug, data.slug),
    })
    if (existing) throw new ConflictError('Destination with this slug already exists')

    const [destination] = await db.insert(destinations).values(data).returning()
    await invalidateAll()
    logger.info(`Destination ${destination.id} created`)
    return destination
  }

  async update(id: number, data: UpdateDestinationInput) {
    const existing = await db.query.destinations.findFirst({
      where: eq(destinations.id, id),
    })
    if (!existing) throw new NotFoundError('Destination not found')

    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await db.query.destinations.findFirst({
        where: eq(destinations.slug, data.slug),
      })
      if (slugExists) throw new ConflictError('Destination with this slug already exists')
    }

    const [updated] = await db
      .update(destinations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(destinations.id, id))
      .returning()

    // Invalidate specific keys + list caches
    await deleteCache(KEY.id(id))
    await deleteCache(KEY.slug(existing.slug))
    if (data.slug && data.slug !== existing.slug) await deleteCache(KEY.slug(data.slug))
    await deleteCache(KEY.all())
    await deleteCache(KEY.popular())

    logger.info(`Destination ${id} updated`)
    return updated
  }

  async delete(id: number) {
    const existing = await db.query.destinations.findFirst({
      where: eq(destinations.id, id),
    })
    if (!existing) throw new NotFoundError('Destination not found')

    await db.delete(destinations).where(eq(destinations.id, id))
    await invalidateAll()
    logger.info(`Destination ${id} deleted`)
    return { message: 'Destination deleted successfully' }
  }
}

export default new DestinationService()
