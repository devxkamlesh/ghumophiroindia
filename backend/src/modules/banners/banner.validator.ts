import { z } from 'zod'

export const createBannerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  subtitle: z.string().max(255).optional(),
  description: z.string().optional(),
  image: z.string().url('Image must be a valid URL'),
  linkUrl: z.string().url('Link URL must be valid').optional().or(z.literal('')),
  linkText: z.string().max(100).optional(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  position: z.enum(['hero', 'category']).optional(),
})

export const updateBannerSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  subtitle: z.string().max(255).optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  linkUrl: z.string().url().optional().or(z.literal('')),
  linkText: z.string().max(100).optional(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  position: z.enum(['hero', 'category']).optional(),
})

export const reorderBannersSchema = z.object({
  orders: z.array(z.object({
    id: z.number().int().positive(),
    displayOrder: z.number().int().min(0),
  })),
})

export type CreateBannerInput = z.infer<typeof createBannerSchema>
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>
export type ReorderBannersInput = z.infer<typeof reorderBannersSchema>
