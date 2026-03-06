/**
 * Map custom tour request input to database insert format
 */
export function toCustomTourEntity(input: any) {
  return {
    name: input.name,
    email: input.email,
    phone: input.phone,
    country: input.country,
    numberOfTravelers: input.numberOfTravelers,
    duration: input.duration,
    budget: input.budget,
    destinations: input.destinations || [],
    interests: input.interests || [],
    startDate: input.startDate ? new Date(input.startDate) : null,
    additionalInfo: input.additionalInfo || null,
    status: 'pending',
  }
}

/**
 * Map custom tour request update to database update format
 */
export function toCustomTourUpdateEntity(input: any) {
  const updates: Record<string, any> = {}

  if (input.status !== undefined) updates.status = input.status
  if (input.additionalInfo !== undefined) updates.additionalInfo = input.additionalInfo

  return updates
}

/**
 * Map database custom tour request to API response format
 */
export function toCustomTourResponse(request: any) {
  return {
    id: request.id.toString(),
    name: request.name,
    email: request.email,
    phone: request.phone,
    country: request.country,
    numberOfTravelers: request.numberOfTravelers,
    duration: request.duration,
    budget: request.budget,
    destinations: request.destinations,
    interests: request.interests,
    startDate: request.startDate?.toISOString(),
    additionalInfo: request.additionalInfo,
    status: request.status,
    createdAt: request.createdAt?.toISOString(),
    updatedAt: request.updatedAt?.toISOString(),
  }
}
