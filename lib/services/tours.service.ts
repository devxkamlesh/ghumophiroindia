import { db } from '@/lib/db'
import { tours } from '@/lib/db/schema'
import { eq, and, gte, lte, ilike, desc } from 'drizzle-orm'
import { CreateTourInput, UpdateTourInput, TourQuery } from '@/lib/validations/tour.schema'
import { toTourEntity, toTourUpdateEntity, toTourResponse } from '@/lib/mappers/tour.mapper'

export const toursService = {
  /**
   * Get all tours with optional filtering and pagination
   */
  async getAll(query?: TourQuery) {
    const {
      destination,
      minPrice,
      maxPrice,
      difficulty,
      page = 1,
      limit = 10,
    } = query || {}

    const conditions = []

    if (destination) {
      conditions.push(ilike(tours.title, `%${destination}%`))
    }

    if (minPrice !== undefined) {
      conditions.push(gte(tours.price, minPrice.toString()))
    }

    if (maxPrice !== undefined) {
      conditions.push(lte(tours.price, maxPrice.toString()))
    }

    if (difficulty) {
      conditions.push(eq(tours.difficulty, difficulty))
    }

    const offset = (page - 1) * limit

    const [toursList, totalCount] = await Promise.all([
      db
        .select()
        .from(tours)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(tours.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: tours.id })
        .from(tours)
        .where(conditions.length > 0 ? and(...conditions) : undefined),
    ])

    return {
      tours: toursList.map(toTourResponse),
      total: totalCount.length,
      page,
      limit,
      totalPages: Math.ceil(totalCount.length / limit),
    }
  },

  /**
   * Get a single tour by ID
   */
  async getById(id: string) {
    const [tour] = await db.select().from(tours).where(eq(tours.id, parseInt(id))).limit(1)
    return tour ? toTourResponse(tour) : null
  },

  /**
   * Create a new tour
   */
  async create(data: CreateTourInput) {
    const entity = toTourEntity(data)
    const [newTour] = await db
      .insert(tours)
      .values(entity)
      .returning()

    return toTourResponse(newTour)
  },

  /**
   * Update an existing tour
   */
  async update(id: string, data: UpdateTourInput) {
    const updates = toTourUpdateEntity(data)
    const [updatedTour] = await db
      .update(tours)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(tours.id, parseInt(id)))
      .returning()

    return updatedTour ? toTourResponse(updatedTour) : null
  },

  /**
   * Delete a tour
   */
  async delete(id: string) {
    const [deletedTour] = await db
      .delete(tours)
      .where(eq(tours.id, parseInt(id)))
      .returning()

    return deletedTour ? toTourResponse(deletedTour) : null
  },

  /**
   * Get featured/popular tours
   */
  async getFeatured(limit: number = 6) {
    const toursList = await db
      .select()
      .from(tours)
      .orderBy(desc(tours.rating))
      .limit(limit)
    
    return toursList.map(toTourResponse)
  },

  /**
   * Search tours by keyword
   */
  async search(keyword: string, limit: number = 10) {
    const toursList = await db
      .select()
      .from(tours)
      .where(
        ilike(tours.title, `%${keyword}%`)
      )
      .limit(limit)
    
    return toursList.map(toTourResponse)
  },
}
