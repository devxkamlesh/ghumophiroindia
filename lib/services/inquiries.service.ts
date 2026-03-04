import { db } from '@/lib/db'
import { inquiries } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { CreateInquiryInput, UpdateInquiryInput, InquiryQuery } from '@/lib/validations/inquiry.schema'
import { toInquiryEntity, toInquiryUpdateEntity, toInquiryResponse } from '@/lib/mappers/inquiry.mapper'

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
      inquiries: inquiriesList.map(toInquiryResponse),
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

    return inquiry ? toInquiryResponse(inquiry) : null
  },

  /**
   * Create a new inquiry
   */
  async create(data: CreateInquiryInput) {
    const entity = toInquiryEntity(data)
    const [newInquiry] = await db
      .insert(inquiries)
      .values(entity)
      .returning()

    return toInquiryResponse(newInquiry)
  },

  /**
   * Update an inquiry
   */
  async update(id: string, data: UpdateInquiryInput) {
    const updates = toInquiryUpdateEntity(data)
    const [updatedInquiry] = await db
      .update(inquiries)
      .set(updates)
      .where(eq(inquiries.id, parseInt(id)))
      .returning()

    return updatedInquiry ? toInquiryResponse(updatedInquiry) : null
  },

  /**
   * Mark inquiry as in progress
   */
  async markInProgress(id: string) {
    return this.update(id, { status: 'contacted' })
  },

  /**
   * Mark inquiry as resolved
   */
  async markResolved(id: string) {
    return this.update(id, { status: 'closed' })
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
    const inquiriesList = await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt))
      .limit(limit)
    
    return inquiriesList.map(toInquiryResponse)
  },
}
