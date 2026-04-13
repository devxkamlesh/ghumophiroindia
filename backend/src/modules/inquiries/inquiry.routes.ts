import { Router } from 'express'
import inquiryService, { createInquirySchema } from './inquiry.service'
import { sendSuccess } from '../../shared/response'
import { authenticate, authorize } from '../../middleware/auth.middleware'
import { validateBody } from '../../middleware/validate.middleware'

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

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const result = await inquiryService.getAll(page)
    sendSuccess(res, result)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const inquiry = await inquiryService.getById(parseInt(req.params.id, 10))
    sendSuccess(res, { inquiry })
  } catch (error) {
    next(error)
  }
})

router.patch('/:id/status', async (req, res, next) => {
  try {
    const inquiry = await inquiryService.updateStatus(parseInt(req.params.id, 10), req.body.status)
    sendSuccess(res, { inquiry })
  } catch (error) {
    next(error)
  }
})

export default router
