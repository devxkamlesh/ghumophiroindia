import { eq, desc } from 'drizzle-orm'
import db from '../../core/database'
import { destinations } from '../../core/database/schema'
import { NotFoundError, ConflictError } from '../../shared/errors'
import type { CreateDestinationInput, UpdateDestinationInput } from './destination.validator'

export class DestinationService {
  async getAll() {
    return db.query.destinations.findMany({
      orderBy: desc(destinations.isPopular),
    })
  }

  async getPopular() {
    return db.query.destinations.findMany({
      where: eq(destinations.isPopular, true),
      limit: 6,
    })
  }

  async getById(id: number) {
    const destination = await db.query.destinations.findFirst({
      where: eq(destinations.id, id),
    })
    if (!destination) throw new NotFoundError('Destination not found')
    return destination
  }

  async getBySlug(slug: string) {
    const destination = await db.query.destinations.findFirst({
      where: eq(destinations.slug, slug),
    })
    if (!destination) throw new NotFoundError('Destination not found')
    return destination
  }

  async create(data: CreateDestinationInput) {
    const existing = await db.query.destinations.findFirst({
      where: eq(destinations.slug, data.slug),
    })
    if (existing) throw new ConflictError('Destination with this slug already exists')

    const [destination] = await db.insert(destinations).values(data).returning()
    return destination
  }

  async update(id: number, data: UpdateDestinationInput) {
    const existing = await db.query.destinations.findFirst({
      where: eq(destinations.id, id),
    })
    if (!existing) throw new NotFoundError('Destination not found')

    // Check slug uniqueness if changing slug
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await db.query.destinations.findFirst({
        where: eq(destinations.slug, data.slug),
      })
      if (slugExists) throw new ConflictError('Destination with this slug already exists')
    }

    const [updated] = await db
      .update(destinations)
      .set(data)
      .where(eq(destinations.id, id))
      .returning()
    return updated
  }

  async delete(id: number) {
    const existing = await db.query.destinations.findFirst({
      where: eq(destinations.id, id),
    })
    if (!existing) throw new NotFoundError('Destination not found')

    await db.delete(destinations).where(eq(destinations.id, id))
    return { message: 'Destination deleted successfully' }
  }
}

export default new DestinationService()
