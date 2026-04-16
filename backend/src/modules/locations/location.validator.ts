import { z } from 'zod'

export const LOCATION_TYPES = ['country', 'state', 'city', 'place'] as const

export const createLocationSchema = z.object({
  name:        z.string().min(2).max(100),
  slug:        z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Lowercase alphanumeric with hyphens'),
  type:        z.enum(LOCATION_TYPES),
  parentId:    z.number().int().positive().optional(),
  subtitle:    z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
  image:       z.string().url().optional(),
  lat:         z.number().optional(),
  lng:         z.number().optional(),
  isPopular:   z.boolean().optional().default(false),
})

export const updateLocationSchema = createLocationSchema.partial()

export const locationQuerySchema = z.object({
  type:      z.enum(LOCATION_TYPES).optional(),
  parentId:  z.coerce.number().int().positive().optional(),
  path:      z.string().optional(),   // filter by path prefix e.g. "india/rajasthan"
  popular:   z.enum(['true', 'false']).optional().transform(v => v === 'true'),
  page:      z.coerce.number().int().positive().optional().default(1),
  limit:     z.coerce.number().int().positive().max(100).optional().default(50),
})

export type CreateLocationInput = z.infer<typeof createLocationSchema>
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>
export type LocationQueryInput  = z.infer<typeof locationQuerySchema>
