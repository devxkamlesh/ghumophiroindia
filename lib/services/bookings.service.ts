import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'
import { eq, and, gte, lte, desc } from 'drizzle-orm'
import { CreateBookingInput, UpdateBookingInput, BookingQuery } from '@/lib/validations/booking.schema'

export const bookingsService = {
  /**
   * Get all bookings with optional filtering and pagination
   */
  async getAll(query?: BookingQuery) {
    const {
      status,
      tourId,
      userId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = query || {}

    const conditions = []

    if (status) {
      conditions.push(eq(bookings.status, status))
    }

    if (tourId) {
      conditions.push(eq(bookings.tourId, parseInt(tourId)))
    }

    if (userId) {
      conditions.push(eq(bookings.userId, parseInt(userId)))
    }

    if (startDate) {
      conditions.push(gte(bookings.startDate, new Date(startDate)))
    }

    if (endDate) {
      conditions.push(lte(bookings.startDate, new Date(endDate)))
    }

    const offset = (page - 1) * limit

    const [bookingsList, totalCount] = await Promise.all([
      db
        .select()
        .from(bookings)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(bookings.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: bookings.id })
        .from(bookings)
        .where(conditions.length > 0 ? and(...conditions) : undefined),
    ])

    return {
      bookings: bookingsList,
      total: totalCount.length,
      page,
      limit,
      totalPages: Math.ceil(totalCount.length / limit),
    }
  },

  /**
   * Get a single booking by ID
   */
  async getById(id: string) {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(id)))
      .limit(1)

    return booking || null
  },

  /**
   * Get bookings by user ID
   */
  async getByUserId(userId: string, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit
    const userIdInt = parseInt(userId)

    const [userBookings, totalCount] = await Promise.all([
      db
        .select()
        .from(bookings)
        .where(eq(bookings.userId, userIdInt))
        .orderBy(desc(bookings.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: bookings.id })
        .from(bookings)
        .where(eq(bookings.userId, userIdInt)),
    ])

    return {
      bookings: userBookings,
      total: totalCount.length,
      page,
      limit,
      totalPages: Math.ceil(totalCount.length / limit),
    }
  },

  /**
   * Create a new booking
   */
  async create(data: CreateBookingInput) {
    const [newBooking] = await db
      .insert(bookings)
      .values({
        tourId: parseInt(data.tourId),
        userId: data.userId ? parseInt(data.userId) : null,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        customerCountry: '', // Will be added from user profile or form
        numberOfTravelers: data.numberOfTravelers,
        startDate: new Date(data.startDate),
        endDate: new Date(data.startDate), // Calculate based on tour duration
        totalPrice: '0', // Calculate based on tour price
        specialRequests: data.specialRequests,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return newBooking
  },

  /**
   * Update a booking
   */
  async update(id: string, data: UpdateBookingInput) {
    const [updatedBooking] = await db
      .update(bookings)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, parseInt(id)))
      .returning()

    return updatedBooking || null
  },

  /**
   * Cancel a booking
   */
  async cancel(id: string) {
    return this.update(id, { status: 'cancelled' })
  },

  /**
   * Confirm a booking
   */
  async confirm(id: string) {
    return this.update(id, { status: 'confirmed' })
  },

  /**
   * Get recent bookings (for dashboard)
   */
  async getRecent(limit: number = 5) {
    return db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt))
      .limit(limit)
  },

  /**
   * Get booking statistics
   */
  async getStats() {
    const allBookings = await db.select().from(bookings)

    return {
      total: allBookings.length,
      pending: allBookings.filter((b) => b.status === 'pending').length,
      confirmed: allBookings.filter((b) => b.status === 'confirmed').length,
      cancelled: allBookings.filter((b) => b.status === 'cancelled').length,
      completed: allBookings.filter((b) => b.status === 'completed').length,
    }
  },
}
