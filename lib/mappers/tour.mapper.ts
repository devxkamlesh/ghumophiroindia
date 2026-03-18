import { CreateTourInput, UpdateTourInput } from '@/lib/validations/tour.schema'

/**
 * Generate URL-friendly slug from title
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Map CreateTourInput (API) to database insert format
 */
export function toTourEntity(input: CreateTourInput) {
  return {
    title: input.title,
    slug: slugify(input.title),
    description: input.description,
    longDescription: input.description, // Can be enhanced later
    duration: input.duration,
    price: input.price.toString(), // Convert number to string for decimal
    maxGroupSize: input.maxGroupSize,
    difficulty: input.difficulty,
    category: 'custom', // Default category, can be enhanced
    images: input.images,
    highlights: input.highlights || [],
    included: input.included || [],
    excluded: input.excluded || [],
    itinerary: input.itinerary?.map(item => ({
      day: item.day,
      title: item.title,
      description: item.description,
      activities: [], // Can be enhanced later
    })) || [],
    destinations: [], // Will be populated from destinationId
    rating: '0',
    reviewCount: 0,
    isActive: true,
    isFeatured: false,
  }
}

/**
 * Map UpdateTourInput (API) to database update format
 */
export function toTourUpdateEntity(input: UpdateTourInput) {
  const updates: Record<string, any> = {}

  if (input.title !== undefined) updates.title = input.title
  if (input.description !== undefined) {
    updates.description = input.description
    updates.longDescription = input.description
  }
  if (input.duration !== undefined) updates.duration = input.duration
  if (input.price !== undefined) updates.price = input.price.toString()
  if (input.maxGroupSize !== undefined) updates.maxGroupSize = input.maxGroupSize
  if (input.difficulty !== undefined) updates.difficulty = input.difficulty
  if (input.images !== undefined) updates.images = input.images
  if (input.highlights !== undefined) updates.highlights = input.highlights
  if (input.included !== undefined) updates.included = input.included
  if (input.excluded !== undefined) updates.excluded = input.excluded
  if (input.itinerary !== undefined) {
    updates.itinerary = input.itinerary.map(item => ({
      day: item.day,
      title: item.title,
      description: item.description,
      activities: [],
    }))
  }

  return updates
}

/**
 * Map database tour to API response format
 */
export function toTourResponse(tour: any) {
  return {
    id: tour.id.toString(),
    title: tour.title,
    slug: tour.slug,
    description: tour.description,
    longDescription: tour.longDescription,
    duration: tour.duration,
    price: parseFloat(tour.price),
    maxGroupSize: tour.maxGroupSize,
    difficulty: tour.difficulty,
    category: tour.category,
    images: tour.images,
    highlights: tour.highlights,
    included: tour.included,
    excluded: tour.excluded,
    itinerary: tour.itinerary,
    destinations: tour.destinations,
    rating: tour.rating ? parseFloat(tour.rating) : 0,
    reviewCount: tour.reviewCount || 0,
    isActive: tour.isActive,
    isFeatured: tour.isFeatured,
    createdAt: tour.createdAt?.toISOString(),
    updatedAt: tour.updatedAt?.toISOString(),
  }
}
