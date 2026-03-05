import { NextResponse } from 'next/server'
import { toursService } from '@/lib/services/tours.service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('q') || searchParams.get('keyword')
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10
    
    if (!keyword) {
      return NextResponse.json(
        { error: 'Search keyword is required' },
        { status: 400 }
      )
    }
    
    // Search tours using service
    const tours = await toursService.search(keyword, limit)

    return NextResponse.json(tours)
  } catch (error: any) {
    console.error('Tours search error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to search tours' },
      { status: 500 }
    )
  }
}
