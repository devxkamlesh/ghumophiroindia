import { eq, desc } from 'drizzle-orm'
import db from '../../core/database'
import { destinations } from '../../core/database/schema'
import { NotFoundError } from '../../shared/errors'

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
}

export default new DestinationService()
