import { eq, and, desc, sql, ilike } from 'drizzle-orm'
import db from '../../core/database'
import { galleryImages } from '../../core/database/schema'
import { NotFoundError } from '../../shared/errors'
import logger from '../../core/logger'

export interface CreateImageInput {
  url: string
  title?: string
  altText?: string
  folder?: string
  tags?: string[]
  width?: number
  height?: number
  fileSize?: number
  mimeType?: string
  sortOrder?: number
  uploadedBy?: number
}

export interface UpdateImageInput {
  title?: string
  altText?: string
  folder?: string
  tags?: string[]
  sortOrder?: number
  isActive?: boolean
}

export interface GalleryQueryInput {
  folder?: string
  search?: string
  page?: number
  limit?: number
}

class GalleryService {
  /** Get all folders (distinct folder names) with hierarchy support */
  async getFolders(): Promise<string[]> {
    const rows = await db
      .selectDistinct({ folder: galleryImages.folder })
      .from(galleryImages)
      .where(eq(galleryImages.isActive, true))
      .orderBy(galleryImages.folder)
    return rows.map(r => r.folder)
  }

  /** Create a new folder/subfolder by uploading a placeholder or just returning the name */
  async createFolder(folderPath: string) {
    // Validate folder path (no special chars except / and -)
    if (!/^[a-zA-Z0-9\/_-]+$/.test(folderPath)) {
      throw new Error('Invalid folder name. Use only letters, numbers, hyphens, underscores, and forward slashes.')
    }
    
    // Folder is created implicitly when first image is uploaded to it
    // For now, just return success - Cloudinary creates folders on-demand
    logger.info(`Folder "${folderPath}" registered for use`)
    return { folder: folderPath, message: 'Folder ready for use' }
  }

  /** Get images with optional folder filter + search + pagination */
  async getImages(query: GalleryQueryInput = {}) {
    const { folder, search, page = 1, limit = 50 } = query
    const offset = (page - 1) * limit

    const conditions = [eq(galleryImages.isActive, true)]
    if (folder) conditions.push(eq(galleryImages.folder, folder))
    if (search) {
      conditions.push(
        sql`(${galleryImages.title} ILIKE ${'%' + search + '%'} OR ${galleryImages.altText} ILIKE ${'%' + search + '%'})`
      )
    }

    const where = and(...conditions)

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(galleryImages)
      .where(where)

    const images = await db
      .select()
      .from(galleryImages)
      .where(where)
      .orderBy(galleryImages.sortOrder, desc(galleryImages.createdAt))
      .limit(limit)
      .offset(offset)

    return {
      images,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    }
  }

  /** Get single image by ID */
  async getById(id: number) {
    const image = await db.query.galleryImages.findFirst({
      where: and(eq(galleryImages.id, id), eq(galleryImages.isActive, true)),
    })
    if (!image) throw new NotFoundError('Image not found')
    return image
  }

  /** Add a new image (URL-based, no file upload needed) */
  async create(data: CreateImageInput) {
    const [image] = await db
      .insert(galleryImages)
      .values({
        url:        data.url,
        title:      data.title ?? null,
        altText:    data.altText ?? null,
        folder:     data.folder ?? 'general',
        tags:       data.tags ?? [],
        width:      data.width ?? null,
        height:     data.height ?? null,
        fileSize:   data.fileSize ?? null,
        mimeType:   data.mimeType ?? null,
        sortOrder:  data.sortOrder ?? 0,
        uploadedBy: data.uploadedBy ?? null,
      })
      .returning()

    logger.info(`Gallery image ${image.id} created in folder "${image.folder}"`)
    return image
  }

  /** Update image metadata */
  async update(id: number, data: UpdateImageInput) {
    const existing = await db.query.galleryImages.findFirst({
      where: eq(galleryImages.id, id),
    })
    if (!existing) throw new NotFoundError('Image not found')

    const [updated] = await db
      .update(galleryImages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(galleryImages.id, id))
      .returning()

    logger.info(`Gallery image ${id} updated`)
    return updated
  }

  /** Soft-delete an image */
  async delete(id: number) {
    const existing = await db.query.galleryImages.findFirst({
      where: eq(galleryImages.id, id),
    })
    if (!existing) throw new NotFoundError('Image not found')

    await db
      .update(galleryImages)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(galleryImages.id, id))

    logger.info(`Gallery image ${id} deleted`)
    return { message: 'Image deleted successfully' }
  }

  /** Bulk delete images */
  async bulkDelete(ids: number[]) {
    await db
      .update(galleryImages)
      .set({ isActive: false, updatedAt: new Date() })
      .where(sql`${galleryImages.id} = ANY(${ids})`)

    logger.info(`Gallery bulk delete: ${ids.length} images`)
    return { message: `${ids.length} images deleted` }
  }

  /** Move images to a different folder */
  async moveToFolder(ids: number[], folder: string) {
    await db
      .update(galleryImages)
      .set({ folder, updatedAt: new Date() })
      .where(sql`${galleryImages.id} = ANY(${ids})`)

    logger.info(`Moved ${ids.length} images to folder "${folder}"`)
    return { message: `${ids.length} images moved to "${folder}"` }
  }

  /** Get stats */
  async getStats() {
    const [stats] = await db
      .select({
        total:   sql<number>`count(*)::int`,
        folders: sql<number>`count(distinct folder)::int`,
      })
      .from(galleryImages)
      .where(eq(galleryImages.isActive, true))

    const folderBreakdown = await db
      .select({
        folder: galleryImages.folder,
        count:  sql<number>`count(*)::int`,
      })
      .from(galleryImages)
      .where(eq(galleryImages.isActive, true))
      .groupBy(galleryImages.folder)
      .orderBy(galleryImages.folder)

    return { ...stats, folderBreakdown }
  }
}

export default new GalleryService()
