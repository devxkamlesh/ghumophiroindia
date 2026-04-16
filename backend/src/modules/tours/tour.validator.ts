import { z } from 'zod'

export const createTourSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  longDescription: z.string().optional(),
  duration: z.number().int().positive('Duration must be positive'),
  price: z.number().positive('Price must be positive'),
  maxGroupSize: z.number().int().positive('Max group size must be positive'),
  difficulty: z.enum(['easy', 'moderate', 'challenging']),
  category: z.enum(['city', 'heritage', 'desert', 'custom']),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  highlights: z.array(z.string()).min(1, 'At least one highlight is required'),
  included: z.array(z.string()).min(1, 'At least one inclusion is required'),
  excluded: z.array(z.string()).min(1, 'At least one exclusion is required'),
  itinerary: z.array(z.object({
    day: z.number().int().positive(),
    title: z.string().min(3),
    description: z.string().min(10),
    activities: z.array(z.string()).min(1),
    locationId: z.number().int().positive().nullable().optional(),
  })).min(1, 'At least one day itinerary is required'),
  destinations: z.array(z.string()).min(1, 'At least one destination is required'),
  locationIds: z.array(z.number().int().positive()).optional().default([]),
  isFeatured: z.boolean().optional(),
})

export const updateTourSchema = createTourSchema.partial()

export const tourQuerySchema = z.object({
  page:        z.coerce.number().int().positive().optional().default(1),
  limit:       z.coerce.number().int().positive().max(100).optional().default(10),
  category:    z.enum(['city', 'heritage', 'desert', 'custom']).optional(),
  difficulty:  z.enum(['easy', 'moderate', 'challenging']).optional(),
  minPrice:    z.coerce.number().positive().optional(),
  maxPrice:    z.coerce.number().positive().optional(),
  minDuration: z.coerce.number().int().positive().optional(),
  maxDuration: z.coerce.number().int().positive().optional(),
  featured:    z.enum(['true', 'false']).optional().transform(v => v === undefined ? undefined : v === 'true'),
  search:      z.string().max(200).optional(),
  sortBy:      z.enum(['price', 'duration', 'rating', 'createdAt']).optional().default('createdAt'),
  sortOrder:   z.enum(['asc', 'desc']).optional().default('desc'),
})

export const tourIdSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10)),
})

export type CreateTourInput = z.infer<typeof createTourSchema>
export type UpdateTourInput = z.infer<typeof updateTourSchema>
export type TourQueryInput = z.infer<typeof tourQuerySchema>
export type TourIdInput = z.infer<typeof tourIdSchema>
