import { eq, desc, sql } from 'drizzle-orm'
import db from '../../core/database'
import { inquiries } from '../../core/database/schema'
import { NotFoundError } from '../../shared/errors'
import { z } from 'zod'

export const createInquirySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  country: z.string().optional(),
  tourInterest: z.string().optional(),
  message: z.string().min(10),
})

export class InquiryService {
  async create(data: z.infer<typeof createInquirySchema>) {
    const [inquiry] = await db.insert(inquiries).values(data).returning()
    return inquiry
  }

  async getAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(inquiries)
    
    const results = await db.query.inquiries.findMany({
      orderBy: desc(inquiries.createdAt),
      limit,
      offset,
    })

    return { inquiries: results, total: count }
  }

  async getById(id: number) {
    const inquiry = await db.query.inquiries.findFirst({
      where: eq(inquiries.id, id),
    })
    if (!inquiry) throw new NotFoundError('Inquiry not found')
    return inquiry
  }

  async updateStatus(id: number, status: string) {
    const [updated] = await db
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, id))
      .returning()
    if (!updated) throw new NotFoundError('Inquiry not found')
    return updated
  }
}

export default new InquiryService()
