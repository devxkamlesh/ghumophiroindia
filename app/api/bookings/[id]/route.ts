import { NextResponse } from 'next/server'
import { bookingsService } from '@/lib/services/bookings.service'
import { updateBookingSchema } from '@/lib/validations/booking.schema'
import { requireAdmin, getSession } from '@/lib/auth/session'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const booking = await bookingsService.getById(id)

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if user owns this booking or is admin
    if (booking.userId !== session.userId.toString() && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(booking)
  } catch (error: any) {
    console.error('Booking GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication (only admins can update bookings)
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    
    // Validate input
    const validatedData = updateBookingSchema.parse(body)
    
    // Update booking using service
    const updatedBooking = await bookingsService.update(id, validatedData)

    if (!updatedBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // TODO: Send status update email to customer

    return NextResponse.json(updatedBooking)
  } catch (error: any) {
    console.error('Booking PATCH error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to update booking' },
      { status: 500 }
    )
  }
}
