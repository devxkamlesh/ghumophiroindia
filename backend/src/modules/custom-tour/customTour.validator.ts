import { z } from 'zod'

export const CUSTOM_TOUR_STATUSES = ['pending', 'processing', 'quoted', 'confirmed', 'rejected'] as const

export const createCustomTourSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  country: z.string().min(2).max(100),
  numberOfTravelers: z.number().int().positive(),
  duration: z.number().int().positive(),
  budget: z.string().min(1).max(100),
  destinations: z.array(z.string().min(1)).min(1),
  interests: z.array(z.string()).optional(),
  startDate: z.string().datetime().optional(),
  additionalInfo: z.string().max(2000).optional(),
})

export const updateCustomTourStatusSchema = z.object({
  status: z.enum(CUSTOM_TOUR_STATUSES, {
    errorMap: () => ({ message: `Status must be one of: ${CUSTOM_TOUR_STATUSES.join(', ')}` }),
  }),
})

export const customTourQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
})

export type CreateCustomTourInput = z.infer<typeof createCustomTourSchema>
export type UpdateCustomTourStatusInput = z.infer<typeof updateCustomTourStatusSchema>
export type CustomTourQueryInput = z.infer<typeof customTourQuerySchema>
