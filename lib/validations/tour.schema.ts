import { z } from 'zod'

export const createTourSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120, 'Title must be less than 120 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  duration: z.number().int().positive('Duration must be a positive integer'),
  destinationId: z.string().uuid('Invalid destination ID'),
  maxGroupSize: z.number().int().min(1).max(50, 'Max group size must be between 1 and 50'),
  difficulty: z.enum(['easy', 'moderate', 'challenging']),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  highlights: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  itinerary: z.array(z.object({
    day: z.number().int().positive(),
    title: z.string(),
    description: z.string(),
  })).optional(),
})

export const updateTourSchema = createTourSchema.partial()

export const tourQuerySchema = z.object({
  destination: z.string().optional(),
  duration: z.string().optional(),
  travelers: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  difficulty: z.enum(['easy', 'moderate', 'challenging']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

export type CreateTourInput = z.infer<typeof createTourSchema>
export type UpdateTourInput = z.infer<typeof updateTourSchema>
export type TourQuery = z.infer<typeof tourQuerySchema>
