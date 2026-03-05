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

    // Fetch stats from all services
    const [bookingStats, newInquiriesCount, pendingCustomToursCount] = await Promise.all([
      bookingsService.getStats(),
      inquiriesService.getNewCount(),
      customTourService.getPendingCount(),
    ])

    const stats = {
      bookings: bookingStats,
      inquiries: {
        new: newInquiriesCount,
      },
      customTours: {
        pending: pendingCustomToursCount,
      },
    }

    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
