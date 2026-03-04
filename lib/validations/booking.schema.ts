import { z } from 'zod'

export const createBookingSchema = z.object({
  tourId: z.string(),
  userId: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  country: z.string().min(2, 'Country is required').optional(),
  numberOfTravelers: z.number().int().min(1, 'At least 1 traveler required').max(50),
  startDate: z.string(),
  endDate: z.string(),
  totalPrice: z.number().positive('Total price must be positive'),
  specialRequests: z.string().optional(),
})

export const updateBookingSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded']).optional(),
  specialRequests: z.string().optional(),
})

export const bookingQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  tourId: z.string().optional(),
  userId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>
export type BookingQuery = z.infer<typeof bookingQuerySchema>
