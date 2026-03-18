import { CreateBookingInput, UpdateBookingInput } from '@/lib/validations/booking.schema'

/**
 * Map CreateBookingInput (API) to database insert format
 */
export function toBookingEntity(input: CreateBookingInput) {
  return {
    tourId: parseInt(input.tourId),
    userId: input.userId ? parseInt(input.userId) : null,
    customerName: input.name,
    customerEmail: input.email,
    customerPhone: input.phone,
    customerCountry: input.country || '',
    numberOfTravelers: input.numberOfTravelers,
    startDate: new Date(input.startDate),
    endDate: new Date(input.endDate),
    totalPrice: input.totalPrice.toString(),
    specialRequests: input.specialRequests || null,
    status: 'pending',
    paymentStatus: 'pending',
  }
}

/**
 * Map UpdateBookingInput (API) to database update format
 */
export function toBookingUpdateEntity(input: UpdateBookingInput) {
  const updates: Record<string, any> = {}

  if (input.status !== undefined) updates.status = input.status
  if (input.paymentStatus !== undefined) updates.paymentStatus = input.paymentStatus
  if (input.specialRequests !== undefined) updates.specialRequests = input.specialRequests

  return updates
}

/**
 * Map database booking to API response format
 */
export function toBookingResponse(booking: any) {
  return {
    id: booking.id.toString(),
    tourId: booking.tourId?.toString(),
    userId: booking.userId?.toString(),
    name: booking.customerName,
    email: booking.customerEmail,
    phone: booking.customerPhone,
    country: booking.customerCountry,
    numberOfTravelers: booking.numberOfTravelers,
    startDate: booking.startDate?.toISOString(),
    endDate: booking.endDate?.toISOString(),
    totalPrice: parseFloat(booking.totalPrice),
    specialRequests: booking.specialRequests,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    createdAt: booking.createdAt?.toISOString(),
    updatedAt: booking.updatedAt?.toISOString(),
  }
}
