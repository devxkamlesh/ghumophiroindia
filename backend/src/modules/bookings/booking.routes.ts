import { Router } from 'express'
import bookingController from './booking.controller'
import { authenticate, authorize, optionalAuth } from '../../middleware/auth.middleware'
import { validateBody, validateQuery } from '../../middleware/validate.middleware'
import { bookingLimiter } from '../../middleware/rateLimiter'
import {
  createBookingSchema,
  updateBookingStatusSchema,
  updatePaymentStatusSchema,
  bookingQuerySchema,
} from './booking.validator'

const router = Router()

// Public/authenticated routes
router.post(
  '/',
  optionalAuth,
  bookingLimiter,
  validateBody(createBookingSchema),
  bookingController.createBooking
)

// User routes (require authentication)
router.get(
  '/my-bookings',
  authenticate,
  bookingController.getUserBookings
)

// Admin routes
router.use(authenticate, authorize('admin'))

router.get(
  '/',
  validateQuery(bookingQuerySchema),
  bookingController.getBookings
)

router.get(
  '/stats',
  bookingController.getBookingStats
)

router.get(
  '/:id',
  bookingController.getBookingById
)

router.patch(
  '/:id/status',
  validateBody(updateBookingStatusSchema),
  bookingController.updateBookingStatus
)

router.patch(
  '/:id/payment',
  validateBody(updatePaymentStatusSchema),
  bookingController.updatePaymentStatus
)

export default router
