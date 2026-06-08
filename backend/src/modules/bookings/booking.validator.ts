import { z } from 'zod'

// Reusable field validators ----------------------------------------------------
const nameField = z
  .string({ required_error: 'Full name is required' })
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name is too long')
  .regex(/^[\p{L}\p{M}.'\- ]+$/u, 'Name can only contain letters, spaces, and . \' -')

const emailField = z
  .string({ required_error: 'Email is required' })
  .trim()
  .min(1, 'Email is required')
  .max(150, 'Email is too long')
  .email('Enter a valid email address')

// Accepts +, digits, spaces, dashes and brackets, but must contain 10–15 digits
const phoneField = z
  .string({ required_error: 'Phone number is required' })
  .trim()
  .max(20, 'Phone number is too long')
  .regex(/^[+\d][\d\s\-()]*$/, 'Enter a valid phone number')
  .refine((v) => {
    const digits = v.replace(/\D/g, '')
    return digits.length >= 10 && digits.length <= 15
  }, 'Phone number must have 10–15 digits')

// Age as string (10/120 child/adult) — optional but validated when present
const ageField = z
  .string()
  .max(3)
  .refine((v) => v === '' || (/^\d{1,3}$/.test(v) && Number(v) >= 1 && Number(v) <= 120),
    'Enter a valid age (1–120)')
  .optional()

export const createBookingSchema = z.object({
  tourId: z.number({ required_error: 'Tour is required' }).int().positive('Invalid tour'),
  customerName: nameField,
  customerEmail: emailField,
  customerPhone: phoneField,
  customerCountry: z.string().trim().min(2, 'Location is required').max(100).default('India'),
  numberOfTravelers: z.number().int().positive('At least one traveller is required').max(50, 'Too many travellers'),
  startDate: z
    .string({ required_error: 'Start date is required' })
    .datetime('Invalid start date')
    .refine((v) => {
      const d = new Date(v)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return d.getTime() >= today.getTime()
    }, 'Start date cannot be in the past'),
  specialRequests: z.string().max(1000, 'Special requests are too long').optional(),
  // Rich booking selection (optional — backward compatible)
  numberOfAdults: z.number().int().min(0).max(50).optional(),
  numberOfChildren: z.number().int().min(0).max(50).optional(),
  departureCity: z.string().max(100).optional(),
  roomsCount: z.number().int().min(1).max(25).optional(),
  travelGoing: z.string().max(50).optional(),
  travelReturn: z.string().max(50).optional(),
  addons: z.record(z.string(), z.number().int().min(0)).optional(),
  passengers: z.array(z.object({
    name: z.string().trim().max(100).optional(),
    mobile: z.string().trim().max(20).optional(),
    gender: z.string().max(20).optional(),
    age: ageField,
    type: z.enum(['adult', 'child']).optional(),
  })).max(60).optional(),
})
  .refine(
    (data) => (data.numberOfAdults === undefined || data.numberOfAdults >= 1),
    { message: 'At least one adult is required', path: ['numberOfAdults'] }
  )

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
