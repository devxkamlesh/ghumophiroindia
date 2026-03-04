import { CreateInquiryInput, UpdateInquiryInput } from '@/lib/validations/inquiry.schema'

/**
 * Map CreateInquiryInput (API) to database insert format
 */
export function toInquiryEntity(input: CreateInquiryInput) {
  return {
    name: input.name,
    email: input.email,
    phone: input.phone,
    country: input.country || null,
    tourInterest: input.tourInterest || null,
    message: input.message,
    status: 'new',
  }
}

/**
 * Map UpdateInquiryInput (API) to database update format
 */
export function toInquiryUpdateEntity(input: UpdateInquiryInput) {
  const updates: Record<string, any> = {}

  if (input.status !== undefined) updates.status = input.status

  return updates
}

/**
 * Map database inquiry to API response format
 */
export function toInquiryResponse(inquiry: any) {
  return {
    id: inquiry.id.toString(),
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    country: inquiry.country,
    tourInterest: inquiry.tourInterest,
    message: inquiry.message,
    status: inquiry.status,
    createdAt: inquiry.createdAt?.toISOString(),
  }
}
