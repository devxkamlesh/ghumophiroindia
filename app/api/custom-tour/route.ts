import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { customTourRequests } from '@/lib/db/schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const requiredFields = ['name', 'email', 'phone', 'country', 'numberOfTravelers', 'duration', 'budget', 'destinations']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const newRequest = await db.insert(customTourRequests).values({
      ...body,
      status: 'new',
    }).returning()

    return NextResponse.json(newRequest[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit custom tour request' }, { status: 500 })
  }
}
