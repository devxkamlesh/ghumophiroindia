import { NextResponse } from 'next/server'
import { bookingsService } from '@/lib/services/bookings.service'
import { getSession } from '@/lib/auth/session'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await params
    
    // Check if user is accessing their own bookings or is admin
    if (session.userId.toString() !== userId && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10
    
    // Fetch user bookings using service
    const result = await bookingsService.getByUserId(userId, page, limit)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('User bookings GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user bookings' },
      { status: 500 }
    )
  }
}
