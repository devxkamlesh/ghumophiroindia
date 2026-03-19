import { NextResponse } from 'next/server'
import { bookingsService } from '@/lib/services/bookings.service'
import { inquiriesService } from '@/lib/services/inquiries.service'
import { customTourService } from '@/lib/services/custom-tour.service'
import { requireAdmin } from '@/lib/auth/session'

export async function GET(request: Request) {
  try {
    // Check admin authentication
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 5

    // Fetch recent items from all services
    const [recentBookings, recentInquiries, recentCustomTours] = await Promise.all([
      bookingsService.getRecent(limit),
      inquiriesService.getRecent(limit),
      customTourService.getRecent(limit),
    ])

    const recent = {
      bookings: recentBookings,
      inquiries: recentInquiries,
      customTours: recentCustomTours,
    }

    return NextResponse.json(recent)
  } catch (error: any) {
    console.error('Dashboard recent error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recent items' },
      { status: 500 }
    )
  }
}
