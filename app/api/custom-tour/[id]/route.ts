import { NextResponse } from 'next/server'
import { customTourService } from '@/lib/services/custom-tour.service'
import { requireAdmin } from '@/lib/auth/session'

export async function GET(
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
    const request_data = await customTourService.getById(id)

    if (!request_data) {
      return NextResponse.json({ error: 'Custom tour request not found' }, { status: 404 })
    }

    return NextResponse.json(request_data)
  } catch (error: any) {
    console.error('Custom tour GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch custom tour request' },
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
    
    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled']
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: pending, in_progress, completed, cancelled' },
        { status: 400 }
      )
    }
    
    // Update custom tour request status using service
    const updatedRequest = await customTourService.updateStatus(id, body.status)

    if (!updatedRequest) {
      return NextResponse.json({ error: 'Custom tour request not found' }, { status: 404 })
    }

    // TODO: Send status update email to customer

    return NextResponse.json(updatedRequest)
  } catch (error: any) {
    console.error('Custom tour PATCH error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update custom tour request' },
      { status: 500 }
    )
  }
}
