import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { hash, compare } from 'bcryptjs'

export interface CreateUserInput {
  name: string
  email: string
  password: string
  phone?: string
  role?: 'admin' | 'user'
}

export interface UpdateUserInput {
  name?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  avatar?: string
}

export const usersService = {
  /**
   * Get user by ID
   */
  async getById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, parseInt(id))).limit(1)
    return user || null
  },

  /**
   * Get user by email
   */
  async getByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    return user || null
  },

  /**
   * Create a new user
   */
  async create(data: CreateUserInput) {
    // Hash password
    const hashedPassword = await hash(data.password, 10)

    const [newUser] = await db
      .insert(users)
      .values({
        ...data,
        password: hashedPassword,
        role: data.role || 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    // Remove password from response
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
  },

  /**
   * Update user profile
   */
  async update(id: string, data: UpdateUserInput) {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, parseInt(id)))
      .returning()

    if (!updatedUser) return null

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser
    return userWithoutPassword
  },

  /**
   * Verify user password
   */
  async verifyPassword(email: string, password: string) {
    const user = await this.getByEmail(email)
    if (!user) return null

    const isValid = await compare(password, user.password)
    if (!isValid) return null

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  /**
   * Change user password
   */
  async changePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await this.getById(id)
    if (!user) return { success: false, error: 'User not found' }

    // Verify current password
    const isValid = await compare(currentPassword, user.password)
    if (!isValid) return { success: false, error: 'Current password is incorrect' }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10)

    // Update password
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, parseInt(id)))

    return { success: true }
  },

  /**
   * Delete user
   */
  async delete(id: string) {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, parseInt(id)))
      .returning()

    return deletedUser || null
  },

  /**
   * Get all users (admin only)
   */
  async getAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit

    const [usersList, totalCount] = await Promise.all([
      db.select().from(users).limit(limit).offset(offset),
      db.select({ count: users.id }).from(users),
    ])

    // Remove passwords from response
    const usersWithoutPasswords = usersList.map(({ password, ...user }) => user)

    return {
      users: usersWithoutPasswords,
      total: totalCount.length,
      page,
      limit,
      totalPages: Math.ceil(totalCount.length / limit),
    }
  },
}
