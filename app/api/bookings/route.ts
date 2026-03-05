import { NextResponse } from 'next/server'
import { bookingsService } from '@/lib/services/bookings.service'
import { createBookingSchema, bookingQuerySchema } from '@/lib/validations/booking.schema'
import { getSession } from '@/lib/auth/session'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const query = {
      status: searchParams.get('status') as 'pending' | 'confirmed' | 'cancelled' | 'completed' | undefined,
      tourId: searchParams.get('tourId') || undefined,
      userId: searchParams.get('userId') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
    }

    // Validate query
    const validatedQuery = bookingQuerySchema.parse(query)
    
    // Fetch bookings using service
    const result = await bookingsService.getAll(validatedQuery)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Bookings GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Get session if user is logged in
    const session = await getSession()
    if (session) {
      body.userId = session.userId.toString()
    }
    
    // Validate input
    const validatedData = createBookingSchema.parse(body)
    
    // Create booking using service
    const newBooking = await bookingsService.create(validatedData)

    // TODO: Send confirmation email
    // TODO: Send notification to admin

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error: any) {
    console.error('Booking error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    )
  }
}
