import { z } from 'zod'

export const createInquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  country: z.string().optional(),
  tourInterest: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  tourId: z.string().optional(),
})

export const updateInquirySchema = z.object({
  status: z.enum(['new', 'contacted', 'converted', 'closed']).optional(),
})

export const inquiryQuerySchema = z.object({
  status: z.enum(['new', 'contacted', 'converted', 'closed']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

export type CreateInquiryInput = z.infer<typeof createInquirySchema>
export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>
export type InquiryQuery = z.infer<typeof inquiryQuerySchema>
