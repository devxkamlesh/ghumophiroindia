import { NextResponse } from 'next/server'
import { customTourService } from '@/lib/services/custom-tour.service'
import { requireAdmin } from '@/lib/auth/session'
import { z } from 'zod'

// Validation schema for custom tour request
const createCustomTourSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  country: z.string().min(2, 'Country is required'),
  numberOfTravelers: z.number().int().min(1, 'At least 1 traveler required'),
  duration: z.number().int().min(1, 'Duration must be at least 1 day'),
  budget: z.string().min(1, 'Budget is required'),
  destinations: z.array(z.string()).min(1, 'At least one destination required'),
  interests: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  additionalInfo: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    // Check admin authentication
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10
    
    // Fetch custom tour requests using service
    const result = await customTourService.getAll(page, limit)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Custom tours GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch custom tour requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createCustomTourSchema.parse(body)
    
    // Ensure interests is always an array
    const requestData = {
      ...validatedData,
      interests: validatedData.interests || [],
    }
    
    // Create custom tour request using service
    const newRequest = await customTourService.create(requestData)

    // TODO: Send confirmation email to customer
    // TODO: Send notification to admin

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error: any) {
    console.error('Custom tour request error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to submit custom tour request' },
      { status: 500 }
    )
  }
}
