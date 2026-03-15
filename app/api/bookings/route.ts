import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['tourId', 'customerName', 'customerEmail', 'customerPhone', 'numberOfTravelers', 'startDate', 'totalPrice']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const newBooking = await db.insert(bookings).values({
      ...body,
      status: 'pending',
      paymentStatus: 'pending',
    }).returning()

    // TODO: Send confirmation email
    // TODO: Send notification to admin

    return NextResponse.json(newBooking[0], { status: 201 })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
