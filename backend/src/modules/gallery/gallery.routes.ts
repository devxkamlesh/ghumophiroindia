import { Router } from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { authenticate, authorize } from '../../middleware/auth.middleware'
import { sendSuccess } from '../../shared/response'
import config from '../../core/config'
import logger from '../../core/logger'

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key:    config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
})

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }) // 50MB

// All gallery routes require admin auth
router.use(authenticate, authorize('admin'))

// ── Helpers ───────────────────────────────────────────────────────────────────

const BASE_FOLDER = 'ghumo-phiro'

function toFolder(folder: string) {
  // Sanitize folder name - allow forward slashes for subfolders
  return `${BASE_FOLDER}/${folder.replace(/[^a-zA-Z0-9_\/-]/g, '-').toLowerCase()}`
}

async function listFolder(folder: string, nextCursor?: string) {
  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: toFolder(folder),
    max_results: 100,
    next_cursor: nextCursor,
    context: true,
    tags: true,
  })
  return result
}

// ── Routes ────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/gallery/folders
 * List all folders (including subfolders) under ghumo-phiro/
 */
router.get('/folders', async (req, res, next) => {
  try {
    // Get all resources to extract unique folder paths
    const allFolders = new Set<string>()
    let nextCursor: string | undefined = undefined
    
    do {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: BASE_FOLDER,
        max_results: 500,
        next_cursor: nextCursor,
      })
      
      // Extract folder from each resource's public_id
      result.resources.forEach((resource: any) => {
        const publicId = resource.public_id as string
        // Remove BASE_FOLDER prefix and extract folder path
        if (publicId.startsWith(BASE_FOLDER + '/')) {
          const pathAfterBase = publicId.substring(BASE_FOLDER.length + 1)
          const lastSlash = pathAfterBase.lastIndexOf('/')
          if (lastSlash > 0) {
            const folderPath = pathAfterBase.substring(0, lastSlash)
            allFolders.add(folderPath)
          }
        }
      })
      
      nextCursor = result.next_cursor
    } while (nextCursor)
    
    const folders = Array.from(allFolders).sort().map(path => ({
      name: path.split('/').pop() || path,
      path: path,
    }))
    
    sendSuccess(res, { folders })
  } catch (e) { next(e) }
})

/**
 * GET /api/v1/gallery?folder=tours&next_cursor=xxx
 * List images in a folder
 */
router.get('/', async (req, res, next) => {
  try {
    const folder = (req.query.folder as string) || 'general'
    const nextCursor = req.query.next_cursor as string | undefined
    const result = await listFolder(folder, nextCursor)

    const images = result.resources.map((r: any) => {
      // Extract folder from publicId (remove BASE_FOLDER prefix and filename)
      const publicId = r.public_id as string
      let extractedFolder = 'general'
      if (publicId.startsWith(BASE_FOLDER + '/')) {
        const pathAfterBase = publicId.substring(BASE_FOLDER.length + 1)
        const lastSlash = pathAfterBase.lastIndexOf('/')
        if (lastSlash > 0) {
          extractedFolder = pathAfterBase.substring(0, lastSlash)
        }
      }

      return {
        publicId:  r.public_id,
        url:       r.secure_url,
        format:    r.format,
        width:     r.width,
        height:    r.height,
        bytes:     r.bytes,
        folder:    extractedFolder,
        tags:      r.tags || [],
        context:   r.context?.custom || {},
        createdAt: r.created_at,
      }
    })

    sendSuccess(res, {
      images,
      nextCursor: result.next_cursor || null,
      total: result.rate_limit_remaining,
    })
  } catch (e) { next(e) }
})

/**
 * GET /api/v1/gallery/stats
 * Usage stats per folder
 */
router.get('/stats', async (req, res, next) => {
  try {
    const usage = await cloudinary.api.usage()
    sendSuccess(res, {
      stats: {
        totalImages: usage.resources,
        totalStorage: usage.storage?.usage || 0,
        storageMB: Math.round((usage.storage?.usage || 0) / 1024 / 1024),
        transformations: usage.transformations?.usage || 0,
        bandwidth: usage.bandwidth?.usage || 0,
      },
    })
  } catch (e) { next(e) }
})

/**
 * POST /api/v1/gallery/upload
 * Upload one or more images to a Cloudinary folder
 */
router.post('/upload', upload.array('images', 20), async (req, res, next) => {
  try {
    const files = req.files as Express.Multer.File[]
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, error: 'No files provided' })
      return
    }

    const folder = (req.body.folder as string) || 'general'
    const tags: string[] = req.body.tags ? JSON.parse(req.body.tags) : []

    const uploads = await Promise.all(
      files.map(file =>
        new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder:        toFolder(folder),
              resource_type: 'image',
              format:        'webp',
              transformation: [{ quality: 'auto:good' }],
              tags,
              context: `folder=${folder}`,
            },
            (err, result) => {
              if (err || !result) reject(err ?? new Error('Upload failed'))
              else resolve({
                publicId:  result.public_id,
                url:       result.secure_url,
                format:    result.format,
                width:     result.width,
                height:    result.height,
                bytes:     result.bytes,
                folder,
                tags:      result.tags || [],
                createdAt: result.created_at,
              })
            }
          )
          stream.end(file.buffer)
        })
      )
    )

    logger.info(`Gallery: uploaded ${uploads.length} images to folder "${folder}"`)
    sendSuccess(res, { images: uploads }, `${uploads.length} image(s) uploaded`, 201)
  } catch (e) { next(e) }
})

/**
 * PATCH /api/v1/gallery/:publicId
 * Update tags/context on an image (publicId is base64-encoded)
 */
router.patch('/:encodedId', async (req, res, next) => {
  try {
    const publicId = Buffer.from(req.params.encodedId, 'base64').toString('utf8')
    const { tags, title, altText } = req.body

    const updates: any = {}
    if (tags) updates.tags = tags
    if (title || altText) {
      updates.context = [
        title    ? `title=${title}`     : '',
        altText  ? `alt=${altText}`     : '',
      ].filter(Boolean).join('|')
    }

    if (tags) await cloudinary.uploader.replace_tag(tags.join(','), [publicId])
    if (updates.context) await cloudinary.uploader.explicit(publicId, { type: 'upload', context: updates.context })

    sendSuccess(res, { publicId }, 'Image updated')
  } catch (e) { next(e) }
})

/**
 * DELETE /api/v1/gallery/:encodedId
 * Delete a single image from Cloudinary (publicId is base64-encoded)
 */
router.delete('/:encodedId', async (req, res, next) => {
  try {
    const publicId = Buffer.from(req.params.encodedId, 'base64').toString('utf8')
    await cloudinary.uploader.destroy(publicId)
    logger.info(`Gallery: deleted image ${publicId}`)
    sendSuccess(res, { message: 'Image deleted' })
  } catch (e) { next(e) }
})

/**
 * POST /api/v1/gallery/bulk-delete
 * Delete multiple images
 */
router.post('/bulk-delete', async (req, res, next) => {
  try {
    const { publicIds } = req.body
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      res.status(400).json({ success: false, error: 'publicIds array required' })
      return
    }
    await cloudinary.api.delete_resources(publicIds)
    logger.info(`Gallery: bulk deleted ${publicIds.length} images`)
    sendSuccess(res, { message: `${publicIds.length} images deleted` })
  } catch (e) { next(e) }
})

/**
 * POST /api/v1/gallery/create-folder
 * Create a new folder in Cloudinary
 */
router.post('/create-folder', async (req, res, next) => {
  try {
    const { folder } = req.body
    if (!folder) { res.status(400).json({ success: false, error: 'folder name required' }); return }
    await cloudinary.api.create_folder(toFolder(folder))
    sendSuccess(res, { folder }, 'Folder created')
  } catch (e) { next(e) }
})

/**
 * POST /api/v1/gallery/move
 * Move images to a different folder
 */
router.post('/move', async (req, res, next) => {
  try {
    const { publicIds, targetFolder } = req.body
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      res.status(400).json({ success: false, error: 'publicIds array required' })
      return
    }
    if (!targetFolder) {
      res.status(400).json({ success: false, error: 'targetFolder required' })
      return
    }

    // Move each image by renaming with new folder prefix
    const moved: any[] = []
    const errors: any[] = []

    await Promise.all(
      publicIds.map(async (publicId: string) => {
        try {
          // Extract filename from publicId
          const parts = publicId.split('/')
          const filename = parts[parts.length - 1]
          const newPublicId = `${toFolder(targetFolder)}/${filename}`
          
          // Rename in Cloudinary - overwrite if exists to avoid conflicts
          const result = await cloudinary.uploader.rename(publicId, newPublicId, {
            overwrite: true,  // Allow overwriting existing files
            invalidate: true,
          })
          
          moved.push({
            oldPublicId: publicId,
            newPublicId: result.public_id,
            url: result.secure_url,
          })
        } catch (err: any) {
          errors.push({
            publicId,
            error: err.message || 'Move failed',
          })
        }
      })
    )

    if (errors.length > 0 && moved.length === 0) {
      // All moves failed
      res.status(500).json({ 
        success: false, 
        error: `Failed to move images: ${errors[0].error}`,
        errors 
      })
      return
    }

    logger.info(`Gallery: moved ${moved.length} images to folder "${targetFolder}"${errors.length > 0 ? ` (${errors.length} failed)` : ''}`)
    
    sendSuccess(res, { 
      moved, 
      count: moved.length,
      errors: errors.length > 0 ? errors : undefined 
    }, `${moved.length} image(s) moved to "${targetFolder}"${errors.length > 0 ? ` (${errors.length} failed)` : ''}`)
  } catch (e) { next(e) }
})

export default router
