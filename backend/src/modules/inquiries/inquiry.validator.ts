import { z } from 'zod'

export const INQUIRY_STATUSES = ['new', 'contacted', 'converted', 'closed'] as const

export const createInquirySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  country: z.string().max(100).optional(),
  tourInterest: z.string().max(200).optional(),
  message: z.string().min(10).max(2000),
})

export const updateInquiryStatusSchema = z.object({
  status: z.enum(INQUIRY_STATUSES, {
    errorMap: () => ({ message: `Status must be one of: ${INQUIRY_STATUSES.join(', ')}` }),
  }),
})

export const inquiryQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
})

export type CreateInquiryInput = z.infer<typeof createInquirySchema>
export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>
export type InquiryQueryInput = z.infer<typeof inquiryQuerySchema>
