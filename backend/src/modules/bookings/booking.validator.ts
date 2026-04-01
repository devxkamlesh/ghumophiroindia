import { z } from 'zod'

export const createBookingSchema = z.object({
  tourId: z.number().int().positive(),
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10).max(20),
  customerCountry: z.string().min(2).max(100),
  numberOfTravelers: z.number().int().positive().max(50),
  startDate: z.string().datetime(),
  specialRequests: z.string().optional(),
  // Rich booking selection (optional — backward compatible)
  numberOfAdults: z.number().int().min(0).max(50).optional(),
  numberOfChildren: z.number().int().min(0).max(50).optional(),
  departureCity: z.string().max(100).optional(),
  roomsCount: z.number().int().min(1).max(25).optional(),
  travelGoing: z.string().max(50).optional(),
  travelReturn: z.string().max(50).optional(),
  addons: z.record(z.string(), z.number().int().min(0)).optional(),
  passengers: z.array(z.object({
    name: z.string().max(100).optional(),
    mobile: z.string().max(20).optional(),
    gender: z.string().max(20).optional(),
    age: z.string().max(10).optional(),
    type: z.enum(['adult', 'child']).optional(),
  })).max(60).optional(),
})

export const updateBookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
})

export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(['pending', 'paid', 'refunded']),
})

export const bookingQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded']).optional(),
  tourId: z.coerce.number().int().positive().optional(),
  userId: z.coerce.number().int().positive().optional(),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>
export type BookingQueryInput = z.infer<typeof bookingQuerySchema>
