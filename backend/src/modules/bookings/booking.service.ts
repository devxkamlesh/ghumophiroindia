import { eq, and, desc, sql } from 'drizzle-orm'
import db from '../../core/database'
import { bookings, tours } from '../../core/database/schema'
import { NotFoundError } from '../../shared/errors'
import logger from '../../core/logger'
import type { CreateBookingInput, UpdateBookingStatusInput, UpdatePaymentStatusInput, BookingQueryInput } from './booking.validator'

export class BookingService {
  /**
   * Create new booking
   */
  async createBooking(data: CreateBookingInput, userId?: number) {
    // Verify tour exists
    const tour = await db.query.tours.findFirst({
      where: eq(tours.id, data.tourId),
    })

    if (!tour) {
      throw new NotFoundError('Tour not found')
    }

    if (!tour.isActive) {
      throw new NotFoundError('Tour not found')
    }

    // Calculate end date and total price
    const startDate = new Date(data.startDate)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + tour.duration)

    const totalPrice = parseFloat(tour.price) * data.numberOfTravelers

    const [booking] = await db.insert(bookings).values({
      ...data,
      userId,
      startDate,
      endDate,
      totalPrice: totalPrice.toString(),
      status: 'pending',
      paymentStatus: 'pending',
    }).returning()

    logger.info(`Booking ${booking.id} created for tour ${data.tourId}`)
    return booking
  }

  /**
   * Get bookings with filters
   */
  async getBookings(query: BookingQueryInput) {
    const { page = 1, limit = 10, status, paymentStatus, tourId, userId } = query

    const conditions = []
    if (status) conditions.push(eq(bookings.status, status))
    if (paymentStatus) conditions.push(eq(bookings.paymentStatus, paymentStatus))
    if (tourId) conditions.push(eq(bookings.tourId, tourId))
    if (userId) conditions.push(eq(bookings.userId, userId))

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(bookings)
      .where(whereClause)

    const offset = (page - 1) * limit
    const results = await db.query.bookings.findMany({
      where: whereClause,
      orderBy: desc(bookings.createdAt),
      limit,
      offset,
    })

    return {
      bookings: results,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    }
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id: number) {
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
    })

    if (!booking) {
      throw new NotFoundError('Booking not found')
    }

    return booking
  }

  /**
   * Get user bookings
   */
  async getUserBookings(userId: number) {
    const userBookings = await db.query.bookings.findMany({
      where: eq(bookings.userId, userId),
      orderBy: desc(bookings.createdAt),
    })

    // Fetch tour details for each booking
    const bookingsWithTours = await Promise.all(
      userBookings.map(async (booking) => {
        const tour = await db.query.tours.findFirst({
          where: eq(tours.id, booking.tourId!),
          columns: {
            id: true,
            title: true,
            slug: true,
            duration: true,
            destinations: true,
          },
        })

        return {
          ...booking,
          bookingDate: booking.startDate,
          numberOfPeople: booking.numberOfTravelers,
          tour: tour ? {
            id: tour.id,
            title: tour.title,
            destination: Array.isArray(tour.destinations) ? tour.destinations[0] : 'Rajasthan',
            duration: tour.duration,
          } : null,
        }
      })
    )

    return bookingsWithTours
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(id: number, data: UpdateBookingStatusInput) {
    const [updated] = await db
      .update(bookings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError('Booking not found')
    }

    logger.info(`Booking ${id} status updated to ${data.status}`)
    return updated
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(id: number, data: UpdatePaymentStatusInput) {
    const [updated] = await db
      .update(bookings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError('Booking not found')
    }

    logger.info(`Booking ${id} payment status updated to ${data.paymentStatus}`)
    return updated
  }

  /**
   * Get booking statistics
   */
  async getBookingStats() {
    const [stats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        pending: sql<number>`count(*) filter (where status = 'pending')::int`,
        confirmed: sql<number>`count(*) filter (where status = 'confirmed')::int`,
        completed: sql<number>`count(*) filter (where status = 'completed')::int`,
        cancelled: sql<number>`count(*) filter (where status = 'cancelled')::int`,
        totalRevenue: sql<number>`sum(total_price::numeric) filter (where payment_status = 'paid')::numeric`,
      })
      .from(bookings)

    return stats
  }
}

export default new BookingService()
