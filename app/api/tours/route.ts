import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tours } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    const conditions = [eq(tours.isActive, true)]

    if (category) {
      conditions.push(eq(tours.category, category))
    }

    if (featured === 'true') {
      conditions.push(eq(tours.isFeatured, true))
    }

    const result = await db
      .select()
      .from(tours)
      .where(and(...conditions))
      .orderBy(desc(tours.createdAt))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newTour = await db.insert(tours).values(body).returning()
    return NextResponse.json(newTour[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 })
  }
}
