import { eq, and, gte, lte, ilike, or, desc, asc, sql } from 'drizzle-orm'
import db from '../../core/database'
import { tours } from '../../core/database/schema'
import { NotFoundError, ConflictError } from '../../shared/errors'
import tourCache from './tour.cache'
import logger from '../../core/logger'
import type { CreateTourInput, UpdateTourInput, TourQueryInput } from './tour.validator'
import type { Tour } from './tour.model'

// Return types for service methods
interface ToursListResponse {
  tours: Tour[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface TourStatsResponse {
  total: number
  active: number
  featured: number
  avgPrice: number
  avgRating: number
}

export class TourService {
  /**
   * Get all tours with filters and pagination
   */
  async getTours(query: TourQueryInput): Promise<ToursListResponse> {
    const {
      page = 1,
      limit = 10,
      category,
      difficulty,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      featured,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query

    // Generate cache key
    const cacheKey = tourCache.generateQueryKey(query)
    
    // Try to get from cache
    const cached = await tourCache.getToursList(cacheKey)
    if (cached) {
      logger.info('Tours list served from cache')
      return cached
    }

    // Build where conditions
    const conditions = []
    
    conditions.push(eq(tours.isActive, true))
    
    if (category) conditions.push(eq(tours.category, category))
    if (difficulty) conditions.push(eq(tours.difficulty, difficulty))
    if (minPrice) conditions.push(gte(tours.price, minPrice.toString()))
    if (maxPrice) conditions.push(lte(tours.price, maxPrice.toString()))
    if (minDuration) conditions.push(gte(tours.duration, minDuration))
    if (maxDuration) conditions.push(lte(tours.duration, maxDuration))
    if (featured !== undefined) conditions.push(eq(tours.isFeatured, featured))
    
    if (search) {
      conditions.push(
        or(
          ilike(tours.title, `%${search}%`),
          ilike(tours.description, `%${search}%`)
        )!
      )
    }

    // Build order by
    const orderByColumn = {
      price: tours.price,
      duration: tours.duration,
      rating: tours.rating,
      createdAt: tours.createdAt,
    }[sortBy]

    const orderByFn = sortOrder === 'asc' ? asc : desc

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(tours)
      .where(and(...conditions))

    // Get paginated results
    const offset = (page - 1) * limit
    const results = await db.query.tours.findMany({
      where: and(...conditions),
      orderBy: orderByFn(orderByColumn),
      limit,
      offset,
    })

    const response = {
      tours: results,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    }

    // Cache the results
    await tourCache.setToursList(cacheKey, response)
    logger.info('Tours list cached')

    return response
  }

  /**
   * Get featured tours
   */
  async getFeaturedTours(): Promise<Tour[]> {
    // Try to get from cache
    const cached = await tourCache.getFeaturedTours()
    if (cached) {
      logger.info('Featured tours served from cache')
      return cached
    }

    const results = await db.query.tours.findMany({
      where: and(eq(tours.isActive, true), eq(tours.isFeatured, true)),
      orderBy: desc(tours.rating),
      limit: 6,
    })

    // Cache the results
    await tourCache.setFeaturedTours(results)
    logger.info('Featured tours cached')

    return results
  }

  /**
   * Get single tour by ID
   */
  async getTourById(id: number): Promise<Tour> {
    // Try to get from cache
    const cached = await tourCache.getTour(id)
    if (cached) {
      logger.info(`Tour ${id} served from cache`)
      return cached
    }

    const tour = await db.query.tours.findFirst({
      where: and(eq(tours.id, id), eq(tours.isActive, true)),
    })

    if (!tour) {
      throw new NotFoundError('Tour not found')
    }

    // Cache the result
    await tourCache.setTour(id, tour)
    logger.info(`Tour ${id} cached`)

    return tour
  }

  /**
   * Get single tour by slug
   */
  async getTourBySlug(slug: string): Promise<Tour> {
    // Try to get from cache
    const cached = await tourCache.getTourBySlug(slug)
    if (cached) {
      logger.info(`Tour ${slug} served from cache`)
      return cached
    }

    const tour = await db.query.tours.findFirst({
      where: and(eq(tours.slug, slug), eq(tours.isActive, true)),
    })

    if (!tour) {
      throw new NotFoundError('Tour not found')
    }

    // Cache the result
    await tourCache.setTourBySlug(slug, tour)
    logger.info(`Tour ${slug} cached`)

    return tour
  }

  /**
   * Create new tour
   */
  async createTour(data: CreateTourInput): Promise<Tour> {
    // Check if slug already exists
    const existing = await db.query.tours.findFirst({
      where: eq(tours.slug, data.slug),
    })

    if (existing) {
      throw new ConflictError('Tour with this slug already exists')
    }

    const [newTour] = await db.insert(tours).values({
      ...data,
      price: data.price.toString(),
    }).returning()

    // Invalidate cache
    await tourCache.invalidateAllTours()
    logger.info(`Tour ${newTour.id} created`)

    return newTour
  }

  /**
   * Update tour
   */
  async updateTour(id: number, data: UpdateTourInput): Promise<Tour> {
    // Check if tour exists
    const existing = await db.query.tours.findFirst({
      where: eq(tours.id, id),
    })

    if (!existing) {
      throw new NotFoundError('Tour not found')
    }

    // Check slug uniqueness if updating slug
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await db.query.tours.findFirst({
        where: eq(tours.slug, data.slug),
      })

      if (slugExists) {
        throw new ConflictError('Tour with this slug already exists')
      }
    }

    const updateData: any = { ...data, updatedAt: new Date() }
    if (data.price) {
      updateData.price = data.price.toString()
    }

    const [updatedTour] = await db
      .update(tours)
      .set(updateData)
      .where(eq(tours.id, id))
      .returning()

    // Invalidate cache
    await tourCache.invalidateTourAndRelated(id, existing.slug)
    logger.info(`Tour ${id} updated`)

    return updatedTour
  }

  /**
   * Delete tour (soft delete)
   */
  async deleteTour(id: number): Promise<{ message: string }> {
    const existing = await db.query.tours.findFirst({
      where: eq(tours.id, id),
    })

    if (!existing) {
      throw new NotFoundError('Tour not found')
    }

    await db
      .update(tours)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(tours.id, id))

    // Invalidate cache
    await tourCache.invalidateTourAndRelated(id, existing.slug)
    logger.info(`Tour ${id} deleted`)

    return { message: 'Tour deleted successfully' }
  }

  /**
   * Get tour statistics
   */
  async getTourStats(): Promise<TourStatsResponse> {
    const [stats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(*) filter (where is_active = true)::int`,
        featured: sql<number>`count(*) filter (where is_featured = true)::int`,
        avgPrice: sql<number>`avg(price::numeric)::numeric`,
        avgRating: sql<number>`avg(rating::numeric)::numeric`,
      })
      .from(tours)

    return stats
  }
}

export default new TourService()
