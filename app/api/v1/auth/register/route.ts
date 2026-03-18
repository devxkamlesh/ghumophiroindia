import { NextRequest, NextResponse } from 'next/server'
import { usersService } from '@/lib/services/users.service'
import { registerSchema } from '@/lib/validations/user.schema'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await usersService.getByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create user
    const newUser = await usersService.create({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      phone: validatedData.phone,
      role: 'user', // Default role
    })

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    }, { status: 201 })
  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
