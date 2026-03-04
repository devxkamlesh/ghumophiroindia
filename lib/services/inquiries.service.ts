import { db } from '@/lib/db'
import { inquiries } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { CreateInquiryInput, UpdateInquiryInput, InquiryQuery } from '@/lib/validations/inquiry.schema'

export const inquiriesService = {
  /**
   * Get all inquiries with optional filtering and pagination
   */
  async getAll(query?: InquiryQuery) {
    const { status, page = 1, limit = 10 } = query || {}

    const conditions = status ? [eq(inquiries.status, status)] : []
    const offset = (page - 1) * limit

    const [inquiriesList, totalCount] = await Promise.all([
      db
        .select()
        .from(inquiries)
        .where(conditions.length > 0 ? conditions[0] : undefined)
        .orderBy(desc(inquiries.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: inquiries.id })
        .from(inquiries)
        .where(conditions.length > 0 ? conditions[0] : undefined),
    ])

    return {
      inquiries: inquiriesList,
      total: totalCount.length,
      page,
      limit,
      totalPages: Math.ceil(totalCount.length / limit),
    }
  },

  /**
   * Get a single inquiry by ID
   */
  async getById(id: string) {
    const [inquiry] = await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.id, parseInt(id)))
      .limit(1)

    return inquiry || null
  },

  /**
   * Create a new inquiry
   */
  async create(data: CreateInquiryInput) {
    const [newInquiry] = await db
      .insert(inquiries)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        country: null,
        tourInterest: data.tourId || null,
        message: data.message,
        status: 'new',
        createdAt: new Date(),
      })
      .returning()

    return newInquiry
  },

  /**
   * Update an inquiry
   */
  async update(id: string, data: UpdateInquiryInput) {
    const [updatedInquiry] = await db
      .update(inquiries)
      .set(data)
      .where(eq(inquiries.id, parseInt(id)))
      .returning()

    return updatedInquiry || null
  },

  /**
   * Mark inquiry as in progress
   */
  async markInProgress(id: string) {
    return this.update(id, { status: 'in_progress' })
  },

  /**
   * Mark inquiry as resolved
   */
  async markResolved(id: string, response?: string) {
    return this.update(id, { status: 'resolved', response })
  },

  /**
   * Get new inquiries count
   */
  async getNewCount() {
    const newInquiries = await db
      .select({ count: inquiries.id })
      .from(inquiries)
      .where(eq(inquiries.status, 'new'))

    return newInquiries.length
  },

  /**
   * Get recent inquiries (for dashboard)
   */
  async getRecent(limit: number = 5) {
    return db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt))
      .limit(limit)
  },
}
