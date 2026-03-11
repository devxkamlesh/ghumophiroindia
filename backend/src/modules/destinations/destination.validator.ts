import { z } from 'zod'

export const createDestinationSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  subtitle: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  image: z.string().url('Image must be a valid URL'),
  isPopular: z.boolean().optional().default(false),
})

export const updateDestinationSchema = createDestinationSchema.partial()

export type CreateDestinationInput = z.infer<typeof createDestinationSchema>
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>
