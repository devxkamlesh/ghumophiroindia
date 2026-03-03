import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { inquiries } from '@/lib/db/schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const requiredFields = ['name', 'email', 'phone', 'message']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const newInquiry = await db.insert(inquiries).values({
      ...body,
      status: 'new',
    }).returning()

    return NextResponse.json(newInquiry[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
