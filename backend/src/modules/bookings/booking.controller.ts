import { Request, Response, NextFunction } from 'express'
import bookingService from './booking.service'
import { sendSuccess } from '../../shared/response'
import type { CreateBookingInput, UpdateBookingStatusInput, UpdatePaymentStatusInput, BookingQueryInput } from './booking.validator'

export class BookingController {
  /**
   * Create booking
   * POST /api/v1/bookings
   */
  async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateBookingInput = req.body
      const userId = req.user?.userId
      
      const booking = await bookingService.createBooking(data, userId)
      sendSuccess(res, { booking }, 'Booking created successfully', 201)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get all bookings (admin)
   * GET /api/v1/bookings
   */
  async getBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as BookingQueryInput
      const result = await bookingService.getBookings(query)

      sendSuccess(res, {
        bookings: result.bookings,
        pagination: result.pagination,
      }, 'Bookings retrieved successfully')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get booking by ID
   * GET /api/v1/bookings/:id
   */
  async getBookingById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const booking = await bookingService.getBookingById(parseInt(id, 10))
      sendSuccess(res, { booking })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get user bookings
   * GET /api/v1/bookings/user/:userId
   */
  async getUserBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const bookings = await bookingService.getUserBookings(userId)
      sendSuccess(res, { bookings })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update booking status (admin)
   * PATCH /api/v1/bookings/:id/status
   */
  async updateBookingStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const data: UpdateBookingStatusInput = req.body
      const booking = await bookingService.updateBookingStatus(parseInt(id, 10), data)
      sendSuccess(res, { booking }, 'Booking status updated')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update payment status (admin)
   * PATCH /api/v1/bookings/:id/payment
   */
  async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const data: UpdatePaymentStatusInput = req.body
      const booking = await bookingService.updatePaymentStatus(parseInt(id, 10), data)
      sendSuccess(res, { booking }, 'Payment status updated')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get booking statistics (admin)
   * GET /api/v1/bookings/stats
   */
  async getBookingStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await bookingService.getBookingStats()
      sendSuccess(res, { stats })
    } catch (error) {
      next(error)
    }
  }
}

export default new BookingController()
