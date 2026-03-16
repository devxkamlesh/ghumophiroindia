import { Router } from 'express'
import tourController from './tour.controller'
import tourService from './tour.service'
import { authenticate, authorize } from '../../middleware/auth.middleware'
import { validateBody, validateQuery, validateParams } from '../../middleware/validate.middleware'
import {
  createTourSchema,
  updateTourSchema,
  tourQuerySchema,
  tourIdSchema,
} from './tour.validator'

const router = Router()

// Public routes
router.get(
  '/',
  validateQuery(tourQuerySchema),
  tourController.getTours
)

router.get(
  '/featured',
  tourController.getFeaturedTours
)

router.get(
  '/slug/:slug',
  tourController.getTourBySlug
)

router.get(
  '/:id',
  validateParams(tourIdSchema),
  tourController.getTourById
)

// Get locations linked to a tour
router.get('/:id/locations', validateParams(tourIdSchema), async (req: any, res: any, next: any) => {
  try {
    const locs = await tourService.getTourLocations(Number(req.params.id))
    const { sendSuccess } = await import('../../shared/response')
    sendSuccess(res, { locations: locs })
  } catch (e) { next(e) }
})

// Admin only routes
router.use(authenticate, authorize('admin'))

router.get(
  '/stats',
  tourController.getTourStats
)

router.post(
  '/',
  validateBody(createTourSchema),
  tourController.createTour
)

router.patch(
  '/:id',
  validateParams(tourIdSchema),
  validateBody(updateTourSchema),
  tourController.updateTour
)

router.delete(
  '/:id',
  validateParams(tourIdSchema),
  tourController.deleteTour
)

export default router
