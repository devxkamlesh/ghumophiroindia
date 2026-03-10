import { eq, desc, sql } from 'drizzle-orm'
import db from '../../core/database'
import { customTourRequests } from '../../core/database/schema'
import { NotFoundError } from '../../shared/errors'
import type { CreateCustomTourInput, UpdateCustomTourStatusInput } from './customTour.validator'

export class CustomTourService {
  async create(data: CreateCustomTourInput) {
    const [request] = await db.insert(customTourRequests).values({
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : null,
    }).returning()
    return request
  }

  async getAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(customTourRequests)

    const results = await db.query.customTourRequests.findMany({
      orderBy: desc(customTourRequests.createdAt),
      limit,
      offset,
    })

    return {
      requests: results,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    }
  }

  async getById(id: number) {
    const request = await db.query.customTourRequests.findFirst({
      where: eq(customTourRequests.id, id),
    })
    if (!request) throw new NotFoundError('Custom tour request not found')
    return request
  }

  async updateStatus(id: number, status: UpdateCustomTourStatusInput['status']) {
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
