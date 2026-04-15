import { eq } from 'drizzle-orm'
import { randomBytes } from 'crypto'
import db from '../../core/database'
import { users } from '../../core/database/schema'
import { hashPassword, comparePassword } from '../../shared/password'
import { generateToken, generateRefreshToken } from '../../shared/jwt'
import { ConflictError, UnauthorizedError, NotFoundError } from '../../shared/errors'
import { setCache, getCache, deleteCache } from '../../core/redis'
import logger from '../../core/logger'
import type { RegisterInput, LoginInput, UpdateProfileInput, ChangePasswordInput, ForgotPasswordInput, ResetPasswordInput } from './auth.validator'

const RESET_TOKEN_TTL = 3600 // 1 hour in seconds
const RESET_TOKEN_PREFIX = 'pwd_reset:'

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

  /**
   * Forgot password — generate a reset token and log it
   * (In production, send via email. Email service not yet implemented.)
   */
  async forgotPassword(data: ForgotPasswordInput) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    })

    // Always return success to prevent email enumeration
    if (!user || !user.isActive) {
      return { message: 'If that email exists, a reset link has been sent.' }
    }

    // Generate a secure random token
    const resetToken = randomBytes(32).toString('hex')
    const cacheKey = `${RESET_TOKEN_PREFIX}${resetToken}`

    // Store userId against the token in Redis (or log if Redis unavailable)
    await setCache(cacheKey, user.id, RESET_TOKEN_TTL)

    // TODO: Send email with reset link containing the token
    // For now, log the token so it can be used during development
    logger.info(`Password reset token for ${user.email}: ${resetToken} (expires in 1 hour)`)

    return { message: 'If that email exists, a reset link has been sent.' }
  }

  /**
   * Reset password using token
   */
  async resetPassword(data: ResetPasswordInput) {
    const cacheKey = `${RESET_TOKEN_PREFIX}${data.token}`

    // Look up the userId stored against this token
    const userId = await getCache<number>(cacheKey)

    if (!userId) {
      throw new UnauthorizedError('Invalid or expired reset token')
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid or expired reset token')
    }

    // Hash and save the new password
    const hashedPassword = await hashPassword(data.password)

    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, userId))

    // Invalidate the token so it can't be reused
    await deleteCache(cacheKey)

    logger.info(`Password reset successfully for user ${userId}`)
    return { message: 'Password reset successfully' }
  }
}

export default new AuthService()
