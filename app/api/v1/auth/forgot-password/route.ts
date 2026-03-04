import { NextRequest, NextResponse } from 'next/server'
import { usersService } from '@/lib/services/users.service'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const { email } = forgotPasswordSchema.parse(body)

    // Check if user exists
    const user = await usersService.getByEmail(email)

    // Always return success to prevent email enumeration
    // In production, send actual password reset email here
    if (user) {
      // TODO: Generate password reset token
      // TODO: Send password reset email
      console.log(`Password reset requested for: ${email}`)
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive password reset instructions.',
    })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
