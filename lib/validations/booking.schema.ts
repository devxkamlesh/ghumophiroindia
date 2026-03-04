import { z } from 'zod'

export const createBookingSchema = z.object({
  tourId: z.string().uuid('Invalid tour ID'),
  userId: z.string().uuid('Invalid user ID').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  numberOfTravelers: z.number().int().min(1, 'At least 1 traveler required').max(50),
  startDate: z.string().datetime('Invalid date format'),
  specialRequests: z.string().optional(),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string(),
  }).optional(),
})

export const updateBookingSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  paymentStatus: z.enum(['pending', 'paid', 'refunded']).optional(),
  notes: z.string().optional(),
})

export const bookingQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  tourId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>
export type BookingQuery = z.infer<typeof bookingQuerySchema>
