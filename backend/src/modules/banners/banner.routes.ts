import { Router } from 'express'
import bannerService from './banner.service'
import { createBannerSchema, updateBannerSchema, reorderBannersSchema } from './banner.validator'
import { sendSuccess } from '../../shared/response'
import { authenticate, authorize } from '../../middleware/auth.middleware'
import { validateBody, validateParams } from '../../middleware/validate.middleware'
import { z } from 'zod'

const idParam = z.object({ id: z.coerce.number().int().positive() })

const router = Router()

// ── Public ────────────────────────────────────────────────────────────────────

router.get('/active', async (_req, res, next) => {
  try {
    const banners = await bannerService.getActive()
    sendSuccess(res, { banners })
  } catch (e) { next(e) }
})

// ── Admin ─────────────────────────────────────────────────────────────────────

router.use(authenticate, authorize('admin'))

router.get('/', async (_req, res, next) => {
  try {
    const banners = await bannerService.getAll()
    sendSuccess(res, { banners })
  } catch (e) { next(e) }
})

router.get('/:id', validateParams(idParam), async (req, res, next) => {
  try {
    const banner = await bannerService.getById(Number(req.params.id))
    sendSuccess(res, { banner })
  } catch (e) { next(e) }
})

router.post('/', validateBody(createBannerSchema), async (req, res, next) => {
  try {
    const banner = await bannerService.create(req.body)
    sendSuccess(res, { banner }, 'Banner created', 201)
  } catch (e) { next(e) }
})

router.patch('/:id', validateParams(idParam), validateBody(updateBannerSchema), async (req, res, next) => {
  try {
    const banner = await bannerService.update(Number(req.params.id), req.body)
    sendSuccess(res, { banner }, 'Banner updated')
  } catch (e) { next(e) }
})

router.delete('/:id', validateParams(idParam), async (req, res, next) => {
  try {
    await bannerService.delete(Number(req.params.id))
    sendSuccess(res, null, 'Banner deleted')
  } catch (e) { next(e) }
})

router.post('/reorder', validateBody(reorderBannersSchema), async (req, res, next) => {
  try {
    await bannerService.reorder(req.body.orders)
    sendSuccess(res, null, 'Banners reordered')
  } catch (e) { next(e) }
})

export default router
