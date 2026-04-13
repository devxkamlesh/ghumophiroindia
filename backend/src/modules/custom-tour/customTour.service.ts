import { eq, desc, sql } from 'drizzle-orm'
import db from '../../core/database'
import { customTourRequests } from '../../core/database/schema'
import { NotFoundError } from '../../shared/errors'
import { z } from 'zod'

export const createCustomTourSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  country: z.string().min(2),
  numberOfTravelers: z.number().int().positive(),
  duration: z.number().int().positive(),
  budget: z.string(),
  destinations: z.array(z.string()).min(1),
  interests: z.array(z.string()).optional(),
  startDate: z.string().datetime().optional(),
  additionalInfo: z.string().optional(),
})

export class CustomTourService {
  async create(data: z.infer<typeof createCustomTourSchema>) {
    const [request] = await db.insert(customTourRequests).values({
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : null,
    }).returning()
    return request
  }

  async getAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(customTourRequests)
    
    const results = await db.query.customTourRequests.findMany({
      orderBy: desc(customTourRequests.createdAt),
      limit,
      offset,
    })

    return { requests: results, total: count }
  }

  async getById(id: number) {
    const request = await db.query.customTourRequests.findFirst({
      where: eq(customTourRequests.id, id),
    })
    if (!request) throw new NotFoundError('Custom tour request not found')
    return request
  }

  async updateStatus(id: number, status: string) {
    const [updated] = await db
      .update(customTourRequests)
      .set({ status, updatedAt: new Date() })
      .where(eq(customTourRequests.id, id))
      .returning()
    if (!updated) throw new NotFoundError('Custom tour request not found')
    return updated
  }
}

export default new CustomTourService()
