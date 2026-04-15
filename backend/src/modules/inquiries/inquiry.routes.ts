import { Router } from 'express'
import inquiryService from './inquiry.service'
import { createInquirySchema, updateInquiryStatusSchema, inquiryQuerySchema } from './inquiry.validator'
import { sendSuccess } from '../../shared/response'
import { authenticate, authorize } from '../../middleware/auth.middleware'
import { validateBody, validateQuery, validateParams } from '../../middleware/validate.middleware'
import { z } from 'zod'

const idParamSchema = z.object({ id: z.coerce.number().int().positive() })

const router = Router()

// Public route
router.post('/', validateBody(createInquirySchema), async (req, res, next) => {
  try {
    const inquiry = await inquiryService.create(req.body)
    sendSuccess(res, { inquiry }, 'Inquiry submitted successfully', 201)
  } catch (error) {
    next(error)
  }
})

// Admin routes
router.use(authenticate, authorize('admin'))

router.get('/', validateQuery(inquiryQuerySchema), async (req, res, next) => {
  try {
    const { page, limit } = req.query as unknown as { page: number; limit: number }
    const result = await inquiryService.getAll(page, limit)
    sendSuccess(res, result)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', validateParams(idParamSchema), async (req, res, next) => {
  try {
    const inquiry = await inquiryService.getById(Number(req.params.id))
    sendSuccess(res, { inquiry })
  } catch (error) {
    next(error)
  }
})

router.patch('/:id/status', validateParams(idParamSchema), validateBody(updateInquiryStatusSchema), async (req, res, next) => {
  try {
    const inquiry = await inquiryService.updateStatus(Number(req.params.id), req.body.status)
    sendSuccess(res, { inquiry })
  } catch (error) {
    next(error)
  }
})

export default router
