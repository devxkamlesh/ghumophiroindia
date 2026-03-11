import { Router } from 'express'
import customTourService from './customTour.service'
import { createCustomTourSchema, updateCustomTourStatusSchema, customTourQuerySchema } from './customTour.validator'
import { sendSuccess } from '../../shared/response'
import { authenticate, authorize } from '../../middleware/auth.middleware'
import { validateBody, validateQuery, validateParams } from '../../middleware/validate.middleware'
import { z } from 'zod'

const idParamSchema = z.object({ id: z.coerce.number().int().positive() })

const router = Router()

// Public route
router.post('/', validateBody(createCustomTourSchema), async (req, res, next) => {
  try {
    const request = await customTourService.create(req.body)
    sendSuccess(res, { request }, 'Custom tour request submitted successfully', 201)
  } catch (error) {
    next(error)
  }
})

// Admin routes
router.use(authenticate, authorize('admin'))

router.get('/', validateQuery(customTourQuerySchema), async (req, res, next) => {
  try {
    const { page, limit } = req.query as unknown as { page: number; limit: number }
    const result = await customTourService.getAll(page, limit)
    sendSuccess(res, result)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', validateParams(idParamSchema), async (req, res, next) => {
  try {
    const request = await customTourService.getById(Number(req.params.id))
    sendSuccess(res, { request })
  } catch (error) {
    next(error)
  }
})

router.patch('/:id/status', validateParams(idParamSchema), validateBody(updateCustomTourStatusSchema), async (req, res, next) => {
  try {
    const request = await customTourService.updateStatus(Number(req.params.id), req.body.status)
    sendSuccess(res, { request })
  } catch (error) {
    next(error)
  }
})

export default router
