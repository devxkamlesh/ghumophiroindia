import { NextRequest, NextResponse } from 'next/server'
import { usersService } from '@/lib/services/users.service'
import { createSession } from '@/lib/auth/session'
import { loginSchema } from '@/lib/validations/user.schema'

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json().catch(() => {
      throw new Error('Invalid JSON in request body')
    })
    
    console.log('Login attempt for:', body.email)

    // Validate input
    const validatedData = loginSchema.parse(body)

    // Verify credentials
    const user = await usersService.verifyPassword(
      validatedData.email,
      validatedData.password
    )

    if (!user) {
      console.log('Invalid credentials for:', validatedData.email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('User authenticated:', user.email)

    // Create session
    await createSession({
      userId: user.id.toString(),
      email: user.email,
      role: user.role as 'admin' | 'user',
      name: user.name,
    })

    console.log('Session created for:', user.email)

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
    console.error('Error stack:', error.stack)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    // Always return JSON error, never HTML
    return NextResponse.json(
      { 
        error: error.message || 'An error occurred during login',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
