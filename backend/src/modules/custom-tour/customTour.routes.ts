import { Router } from 'express'
import customTourService, { createCustomTourSchema } from './customTour.service'
import { sendSuccess } from '../../shared/response'
import { authenticate, authorize } from '../../middleware/auth.middleware'
import { validateBody } from '../../middleware/validate.middleware'

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

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const result = await customTourService.getAll(page)
    sendSuccess(res, result)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const request = await customTourService.getById(parseInt(req.params.id, 10))
    sendSuccess(res, { request })
  } catch (error) {
    next(error)
  }
})

router.patch('/:id/status', async (req, res, next) => {
  try {
    const request = await customTourService.updateStatus(parseInt(req.params.id, 10), req.body.status)
    sendSuccess(res, { request })
  } catch (error) {
    next(error)
  }
})

export default router
