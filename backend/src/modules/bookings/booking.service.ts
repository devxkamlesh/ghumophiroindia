import { eq, and, desc, sql } from 'drizzle-orm'
import db from '../../core/database'
import { bookings, tours } from '../../core/database/schema'
import { NotFoundError } from '../../shared/errors'
import events from '../../core/events'
import logger from '../../core/logger'
import type { CreateBookingInput, UpdateBookingStatusInput, UpdatePaymentStatusInput, BookingQueryInput } from './booking.validator'

export class BookingService {
  /**
   * Create new booking
   */
  async createBooking(data: CreateBookingInput, userId?: number) {
    // Verify tour exists and is active
    const [tour] = await db
      .select()
      .from(tours)
      .where(eq(tours.id, data.tourId))
      .limit(1)

    if (!tour) throw new NotFoundError('Tour not found')
    if (!tour.isActive) throw new NotFoundError('Tour not found')

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
    events.emitBookingCreated({ tourId: data.tourId })
    return booking
  }

  /**
   * Get bookings with filters and pagination
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

    const results = await db
      .select()
      .from(bookings)
      .where(whereClause)
      .orderBy(desc(bookings.createdAt))
      .limit(limit)
      .offset(offset)

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
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1)

    if (!booking) throw new NotFoundError('Booking not found')
    return booking
  }

  /**
   * Get user bookings with joined tour info — single JOIN, no N+1
   */
  async getUserBookings(userId: number) {
    const rows = await db
      .select({
        id:                bookings.id,
        tourId:            bookings.tourId,
        userId:            bookings.userId,
        customerName:      bookings.customerName,
        customerEmail:     bookings.customerEmail,
        customerPhone:     bookings.customerPhone,
        customerCountry:   bookings.customerCountry,
        numberOfTravelers: bookings.numberOfTravelers,
        startDate:         bookings.startDate,
        endDate:           bookings.endDate,
        totalPrice:        bookings.totalPrice,
        specialRequests:   bookings.specialRequests,
        status:            bookings.status,
        paymentStatus:     bookings.paymentStatus,
        createdAt:         bookings.createdAt,
        updatedAt:         bookings.updatedAt,
        tourTitle:         tours.title,
        tourSlug:          tours.slug,
        tourDuration:      tours.duration,
      })
      .from(bookings)
      .leftJoin(tours, eq(bookings.tourId, tours.id))
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt))

    return rows.map(row => ({
      id:                row.id,
      tourId:            row.tourId,
      userId:            row.userId,
      customerName:      row.customerName,
      customerEmail:     row.customerEmail,
      customerPhone:     row.customerPhone,
      customerCountry:   row.customerCountry,
      numberOfTravelers: row.numberOfTravelers,
      startDate:         row.startDate,
      endDate:           row.endDate,
      totalPrice:        row.totalPrice,
      specialRequests:   row.specialRequests,
      status:            row.status,
      paymentStatus:     row.paymentStatus,
      createdAt:         row.createdAt,
      updatedAt:         row.updatedAt,
      tour: row.tourTitle ? {
        id:          row.tourId,
        title:       row.tourTitle,
        slug:        row.tourSlug,
        duration:    row.tourDuration,
        destination: 'Rajasthan',
      } : null,
    }))
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

    if (!updated) throw new NotFoundError('Booking not found')

    logger.info(`Booking ${id} status updated to ${data.status}`)
    events.emitBookingUpdated({ tourId: updated.tourId ?? 0 })
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

    if (!updated) throw new NotFoundError('Booking not found')

    logger.info(`Booking ${id} payment status updated to ${data.paymentStatus}`)
    return updated
  }

  /**
   * Get booking statistics
   */
  async getBookingStats() {
    const [stats] = await db
      .select({
        total:        sql<number>`count(*)::int`,
        pending:      sql<number>`count(*) filter (where status = 'pending')::int`,
        confirmed:    sql<number>`count(*) filter (where status = 'confirmed')::int`,
        completed:    sql<number>`count(*) filter (where status = 'completed')::int`,
        cancelled:    sql<number>`count(*) filter (where status = 'cancelled')::int`,
        totalRevenue: sql<number>`coalesce(sum(total_price::numeric) filter (where payment_status = 'paid'), 0)::numeric`,
      })
      .from(bookings)

    return stats
  }
}

export default new BookingService()
