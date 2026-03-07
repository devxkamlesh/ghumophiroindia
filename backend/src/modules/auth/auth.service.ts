import { eq } from 'drizzle-orm'
import db from '../../core/database'
import { users } from '../../core/database/schema'
import { hashPassword, comparePassword } from '../../shared/password'
import { generateToken, generateRefreshToken } from '../../shared/jwt'
import { ConflictError, UnauthorizedError, NotFoundError } from '../../shared/errors'
import type { RegisterInput, LoginInput, UpdateProfileInput, ChangePasswordInput } from './auth.validator'

export class AuthService {
  /**
   * Register new user
   */
  async register(data: RegisterInput) {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    })

    if (existingUser) {
      throw new ConflictError('User with this email already exists')
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password)

    // Create user
    const [newUser] = await db.insert(users).values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      country: data.country,
      role: 'user',
    }).returning()

    // Generate tokens
    const accessToken = await generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })

    const refreshToken = await generateRefreshToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    }
  }

  /**
   * Login user
   */
  async login(data: LoginInput) {
    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    })

    if (!user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated')
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Generate tokens
    const accessToken = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const refreshToken = await generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: number, data: UpdateProfileInput) {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning()

    if (!updatedUser) {
      throw new NotFoundError('User not found')
    }

    const { password: _, ...userWithoutPassword } = updatedUser
    return userWithoutPassword
  }

  /**
   * Change password
   */
  async changePassword(userId: number, data: ChangePasswordInput) {
    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    // Verify current password
    const isPasswordValid = await comparePassword(data.currentPassword, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect')
    }

    // Hash new password
    const hashedPassword = await hashPassword(data.newPassword)

    // Update password
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))

    return { message: 'Password changed successfully' }
  }

  /**
   * Refresh access token
   */
  async refreshToken(userId: number) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid refresh token')
    }

    const accessToken = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return { accessToken }
  }
}

export default new AuthService()
