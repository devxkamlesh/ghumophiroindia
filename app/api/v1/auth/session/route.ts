import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        userId: session.userId,
        email: session.email,
        role: session.role,
        name: session.name,
      },
    })
  } catch (error) {
    console.error('Session error:', error)
    
    return NextResponse.json(
      { error: 'An error occurred while fetching session' },
      { status: 500 }
    )
  }
}
