import { NextResponse } from 'next/server'
import { toursService } from '@/lib/services/tours.service'
import { createTourSchema, tourQuerySchema } from '@/lib/validations/tour.schema'
import { requireAdmin } from '@/lib/auth/session'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const query = {
      destination: searchParams.get('destination') || undefined,
      duration: searchParams.get('duration') || undefined,
      travelers: searchParams.get('travelers') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      difficulty: searchParams.get('difficulty') as 'easy' | 'moderate' | 'challenging' | undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
    }

    // Validate query
    const validatedQuery = tourQuerySchema.parse(query)
    
    // Fetch tours using service
    const result = await toursService.getAll(validatedQuery)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Tours GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tours' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Check admin authentication
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = createTourSchema.parse(body)
    
    // Create tour using service
    const newTour = await toursService.create(validatedData)

    return NextResponse.json(newTour, { status: 201 })
  } catch (error: any) {
    console.error('Tours POST error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create tour' },
      { status: 500 }
    )
  }
}
