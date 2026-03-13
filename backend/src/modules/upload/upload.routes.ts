import { Router, Request, Response } from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { authenticate, requireAdmin } from '../../middleware/auth.middleware'
import config from '../../core/config'
import logger from '../../core/logger'

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key:    config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
})

const router  = Router()
const upload  = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }) // 10 MB

// POST /api/v1/upload/image
// Admin only — uploads a single image to Cloudinary and returns the secure URL
router.post(
  '/image',
  authenticate,
  requireAdmin,
  upload.single('image'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file provided' })
      return
    }

    try {
      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'ghumo-phiro/tours', resource_type: 'image' },
          (err, result) => {
            if (err || !result) reject(err ?? new Error('Upload failed'))
            else resolve(result as { secure_url: string })
          }
        )
        stream.end(req.file!.buffer)
      })

      res.json({ success: true, data: { url: result.secure_url } })
    } catch (err: any) {
      logger.error('Cloudinary upload error:', err)
      res.status(500).json({ success: false, error: 'Image upload failed' })
    }
  }
)

export default router
