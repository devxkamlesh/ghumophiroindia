import { z } from 'zod'

export const createInquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  tourId: z.string().uuid().optional(),
})

export const updateInquirySchema = z.object({
  status: z.enum(['new', 'in_progress', 'resolved']),
  response: z.string().optional(),
  assignedTo: z.string().uuid().optional(),
})

export const inquiryQuerySchema = z.object({
  status: z.enum(['new', 'in_progress', 'resolved']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

export type CreateInquiryInput = z.infer<typeof createInquirySchema>
export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>
export type InquiryQuery = z.infer<typeof inquiryQuerySchema>
