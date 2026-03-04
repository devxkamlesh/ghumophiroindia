import { db } from '@/lib/db'
import { destinations } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export interface CreateDestinationInput {
  name: string
  slug: string
  subtitle: string
  description: string
  image: string
  isPopular?: boolean
}

export const destinationsService = {
  /**
   * Get all destinations
   */
  async getAll() {
    return db.select().from(destinations).orderBy(destinations.name)
  },

  /**
   * Get featured destinations
   */
  async getFeatured(limit: number = 6) {
    return db
      .select()
      .from(destinations)
      .where(eq(destinations.isPopular, true))
      .limit(limit)
  },

  /**
   * Get destination by ID
   */
  async getById(id: string) {
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, parseInt(id)))
      .limit(1)

    return destination || null
  },

  /**
   * Create a new destination
   */
  async create(data: CreateDestinationInput) {
    const [newDestination] = await db
      .insert(destinations)
      .values({
        ...data,
        isPopular: data.isPopular || false,
        createdAt: new Date(),
      })
      .returning()

    return newDestination
  },

  /**
   * Update a destination
   */
  async update(id: string, data: Partial<CreateDestinationInput>) {
    const [updatedDestination] = await db
      .update(destinations)
      .set(data)
      .where(eq(destinations.id, parseInt(id)))
      .returning()

    return updatedDestination || null
  },

  /**
   * Delete a destination
   */
  async delete(id: string) {
    const [deletedDestination] = await db
      .delete(destinations)
      .where(eq(destinations.id, parseInt(id)))
      .returning()

    return deletedDestination || null
  },
}
