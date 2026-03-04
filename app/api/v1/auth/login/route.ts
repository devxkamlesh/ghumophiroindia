import { NextRequest, NextResponse } from 'next/server'
import { usersService } from '@/lib/services/users.service'
import { createSession } from '@/lib/auth/session'
import { loginSchema } from '@/lib/validations/user.schema'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validatedData = loginSchema.parse(body)

    // Verify credentials
    const user = await usersService.verifyPassword(
      validatedData.email,
      validatedData.password
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create session
    await createSession({
      userId: user.id.toString(),
      email: user.email,
      role: user.role as 'admin' | 'user',
      name: user.name,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
