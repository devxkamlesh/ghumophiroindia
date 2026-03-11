import { Router } from 'express'
import destinationService from './destination.service'
import { createDestinationSchema, updateDestinationSchema } from './destination.validator'
import { sendSuccess } from '../../shared/response'
import { authenticate, authorize } from '../../middleware/auth.middleware'
import { validateBody, validateParams } from '../../middleware/validate.middleware'
import { z } from 'zod'

const idParamSchema = z.object({ id: z.coerce.number().int().positive() })
const slugParamSchema = z.object({ slug: z.string().min(1) })

const router = Router()

// Public routes — specific paths MUST come before /:id
router.get('/', async (req, res, next) => {
  try {
    const destinations = await destinationService.getAll()
    sendSuccess(res, { destinations })
  } catch (error) {
    next(error)
  }
})

router.get('/popular', async (req, res, next) => {
  try {
    const destinations = await destinationService.getPopular()
    sendSuccess(res, { destinations })
  } catch (error) {
    next(error)
  }
})

router.get('/slug/:slug', validateParams(slugParamSchema), async (req, res, next) => {
  try {
    const destination = await destinationService.getBySlug(req.params.slug)
    sendSuccess(res, { destination })
  } catch (error) {
    next(error)
  }
})

router.get('/:id', validateParams(idParamSchema), async (req, res, next) => {
  try {
    const destination = await destinationService.getById(Number(req.params.id))
    sendSuccess(res, { destination })
  } catch (error) {
    next(error)
  }
})

// Admin routes
router.use(authenticate, authorize('admin'))

router.post('/', validateBody(createDestinationSchema), async (req, res, next) => {
  try {
    const destination = await destinationService.create(req.body)
    sendSuccess(res, { destination }, 'Destination created successfully', 201)
  } catch (error) {
    next(error)
  }
})

router.patch('/:id', validateParams(idParamSchema), validateBody(updateDestinationSchema), async (req, res, next) => {
  try {
    const destination = await destinationService.update(Number(req.params.id), req.body)
    sendSuccess(res, { destination }, 'Destination updated successfully')
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', validateParams(idParamSchema), async (req, res, next) => {
  try {
    await destinationService.delete(Number(req.params.id))
    sendSuccess(res, null, 'Destination deleted successfully')
  } catch (error) {
    next(error)
  }
})

export default router
