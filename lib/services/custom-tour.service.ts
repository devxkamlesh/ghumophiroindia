import { db } from '@/lib/db'
import { customTourRequests } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export interface CreateCustomTourInput {
  name: string
  email: string
  phone: string
  country: string
  numberOfTravelers: number
  duration: number
  budget: string
  destinations: string[]
  interests: string[]
  startDate?: string
  additionalInfo?: string
}

export const customTourService = {
  /**
   * Get all custom tour requests with pagination
   */
  async getAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit

    const [requests, totalCount] = await Promise.all([
      db
        .select()
        .from(customTourRequests)
        .orderBy(desc(customTourRequests.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: customTourRequests.id }).from(customTourRequests),
    ])

    return {
      requests,
      total: totalCount.length,
      page,
      limit,
      totalPages: Math.ceil(totalCount.length / limit),
    }
  },

  /**
   * Get a single custom tour request by ID
   */
  async getById(id: string) {
    const [request] = await db
      .select()
      .from(customTourRequests)
      .where(eq(customTourRequests.id, parseInt(id)))
      .limit(1)

    return request || null
  },

  /**
   * Create a new custom tour request
   */
  async create(data: CreateCustomTourInput) {
    const [newRequest] = await db
      .insert(customTourRequests)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        country: data.country,
        numberOfTravelers: data.numberOfTravelers,
        duration: data.duration,
        budget: data.budget,
        destinations: data.destinations,
        interests: data.interests || [],
        startDate: data.startDate ? new Date(data.startDate) : null,
        additionalInfo: data.additionalInfo,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return newRequest
  },

  /**
   * Update custom tour request status
   */
  async updateStatus(id: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled') {
    const [updatedRequest] = await db
      .update(customTourRequests)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(customTourRequests.id, parseInt(id)))
      .returning()

    return updatedRequest || null
  },

  /**
   * Get recent custom tour requests (for dashboard)
   */
  async getRecent(limit: number = 5) {
    return db
      .select()
      .from(customTourRequests)
      .orderBy(desc(customTourRequests.createdAt))
      .limit(limit)
  },

  /**
   * Get pending requests count
   */
  async getPendingCount() {
    const pending = await db
      .select({ count: customTourRequests.id })
      .from(customTourRequests)
      .where(eq(customTourRequests.status, 'pending'))

    return pending.length
  },
}
