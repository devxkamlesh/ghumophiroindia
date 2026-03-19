import { NextResponse } from 'next/server'
import { inquiriesService } from '@/lib/services/inquiries.service'
import { updateInquirySchema } from '@/lib/validations/inquiry.schema'
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
    const inquiry = await inquiriesService.getById(id)

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    return NextResponse.json(inquiry)
  } catch (error: any) {
    console.error('Inquiry GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch inquiry' },
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
    const validatedData = updateInquirySchema.parse(body)
    
    // Update inquiry using service
    const updatedInquiry = await inquiriesService.update(id, validatedData)

    if (!updatedInquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    return NextResponse.json(updatedInquiry)
  } catch (error: any) {
    console.error('Inquiry PATCH error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to update inquiry' },
      { status: 500 }
    )
  }
}
