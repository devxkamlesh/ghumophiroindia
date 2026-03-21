import { eq } from 'drizzle-orm'
import db from '../../core/database'
import { banners } from '../../core/database/schema'
import { NotFoundError } from '../../shared/errors'
import logger from '../../core/logger'

interface CreateBannerInput {
  title: string
  subtitle?: string
  description?: string
  image: string
  linkUrl?: string
  linkText?: string
  displayOrder?: number
  isActive?: boolean
}

interface UpdateBannerInput {
  title?: string
  subtitle?: string
  description?: string
  image?: string
  linkUrl?: string
  linkText?: string
  displayOrder?: number
  isActive?: boolean
}

export class BannerService {
  async getAll() {
    return db.select().from(banners).orderBy(banners.displayOrder, banners.id)
  }

  async getActive() {
    return db
      .select()
      .from(banners)
      .where(eq(banners.isActive, true))
      .orderBy(banners.displayOrder, banners.id)
  }

  async getById(id: number) {
    const [banner] = await db.select().from(banners).where(eq(banners.id, id)).limit(1)
    if (!banner) throw new NotFoundError('Banner not found')
    return banner
  }

  async create(data: CreateBannerInput) {
    const [banner] = await db.insert(banners).values({
      title: data.title,
      subtitle: data.subtitle ?? null,
      description: data.description ?? null,
      image: data.image,
      linkUrl: data.linkUrl ?? null,
      linkText: data.linkText ?? 'Book Now',
      displayOrder: data.displayOrder ?? 0,
      isActive: data.isActive ?? true,
    }).returning()
    
    logger.info(`Banner created: ${banner.title}`)
    return banner
  }

  async update(id: number, data: UpdateBannerInput) {
    await this.getById(id) // Check exists

    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    if (data.title !== undefined) updateData.title = data.title
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle
    if (data.description !== undefined) updateData.description = data.description
    if (data.image !== undefined) updateData.image = data.image
    if (data.linkUrl !== undefined) updateData.linkUrl = data.linkUrl
    if (data.linkText !== undefined) updateData.linkText = data.linkText
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder
    if (data.isActive !== undefined) updateData.isActive = data.isActive

    const [updated] = await db.update(banners).set(updateData).where(eq(banners.id, id)).returning()
    logger.info(`Banner updated: ${updated.title}`)
    return updated
  }

  async delete(id: number) {
    await this.getById(id) // Check exists
    await db.delete(banners).where(eq(banners.id, id))
    logger.info(`Banner deleted: ${id}`)
    return { message: 'Banner deleted' }
  }

  async reorder(orders: { id: number; displayOrder: number }[]) {
    for (const { id, displayOrder } of orders) {
      await db.update(banners).set({ displayOrder, updatedAt: new Date() }).where(eq(banners.id, id))
    }
    logger.info(`Banners reordered: ${orders.length} items`)
    return { message: 'Banners reordered' }
  }
}

export default new BannerService()
