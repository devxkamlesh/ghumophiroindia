import { NextResponse } from 'next/server'
import { toursService } from '@/lib/services/tours.service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 6
    
    // Fetch featured tours using service
    const tours = await toursService.getFeatured(limit)

    return NextResponse.json(tours)
  } catch (error: any) {
    console.error('Featured tours GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch featured tours' },
      { status: 500 }
    )
  }
}
