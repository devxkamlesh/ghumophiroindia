import { NextResponse } from 'next/server'
import { inquiriesService } from '@/lib/services/inquiries.service'
import { createInquirySchema, inquiryQuerySchema } from '@/lib/validations/inquiry.schema'
import { requireAdmin } from '@/lib/auth/session'

export async function GET(request: Request) {
  try {
    // Check admin authentication
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const query = {
      status: searchParams.get('status') as 'new' | 'contacted' | 'converted' | 'closed' | undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
    }

    // Validate query
    const validatedQuery = inquiryQuerySchema.parse(query)
    
    // Fetch inquiries using service
    const result = await inquiriesService.getAll(validatedQuery)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Inquiries GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createInquirySchema.parse(body)
    
    // Create inquiry using service
    const newInquiry = await inquiriesService.create(validatedData)

    // TODO: Send notification email to admin
    // TODO: Send auto-reply to customer

    return NextResponse.json(newInquiry, { status: 201 })
  } catch (error: any) {
    console.error('Inquiry error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}
