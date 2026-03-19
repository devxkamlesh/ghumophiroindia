import { NextResponse } from 'next/server'
import { toursService } from '@/lib/services/tours.service'
import { updateTourSchema } from '@/lib/validations/tour.schema'
import { requireAdmin } from '@/lib/auth/session'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tour = await toursService.getById(id)

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    return NextResponse.json(tour)
  } catch (error: any) {
    console.error('Tour GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tour' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    
    // Validate input
    const validatedData = updateTourSchema.parse(body)
    
    // Update tour using service
    const updatedTour = await toursService.update(id, validatedData)

    if (!updatedTour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    return NextResponse.json(updatedTour)
  } catch (error: any) {
    console.error('Tour PATCH error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to update tour' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    // Delete tour using service
    const deletedTour = await toursService.delete(id)

    if (!deletedTour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Tour deleted successfully', tour: deletedTour })
  } catch (error: any) {
    console.error('Tour DELETE error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete tour' },
      { status: 500 }
    )
  }
}
