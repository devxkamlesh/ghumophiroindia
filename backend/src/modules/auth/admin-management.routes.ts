/**
 * Admin Management Routes — superadmin only
 * Superadmin can promote/demote any user to admin (except themselves)
 * Only one superadmin exists — cannot be changed via API
 */
import { Router } from 'express'
import { eq, ne } from 'drizzle-orm'
import db from '../../core/database'
import { users } from '../../core/database/schema'
import { authenticate, requireSuperAdmin } from '../../middleware/auth.middleware'
import { sendSuccess } from '../../shared/response'
import { ForbiddenError, NotFoundError } from '../../shared/errors'

const router = Router()

// All routes require superadmin
router.use(authenticate, requireSuperAdmin)

// GET /api/v1/admin/users — list all users with roles
router.get('/users', async (req, res, next) => {
  try {
    const list = await db
      .select({
        id:        users.id,
        name:      users.name,
        email:     users.email,
        role:      users.role,
        isActive:  users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(users.createdAt)
    sendSuccess(res, { users: list })
  } catch (e) { next(e) }
})

// PATCH /api/v1/admin/users/:id/role — promote to admin or demote to user
router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const targetId = Number(req.params.id)
    const { role } = req.body

    // Cannot change own role
    if (targetId === req.user!.userId) {
      throw new ForbiddenError('Cannot change your own role')
    }

    // Only allow admin or user — superadmin role cannot be assigned via API
    if (!['admin', 'user'].includes(role)) {
      throw new ForbiddenError('Role must be "admin" or "user"')
    }

    const [target] = await db.select({ id: users.id, role: users.role })
      .from(users).where(eq(users.id, targetId)).limit(1)

    if (!target) throw new NotFoundError('User not found')
    if (target.role === 'superadmin') throw new ForbiddenError('Cannot change superadmin role')

    const [updated] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, targetId))
      .returning({ id: users.id, name: users.name, email: users.email, role: users.role })

    sendSuccess(res, { user: updated }, `User role updated to ${role}`)
  } catch (e) { next(e) }
})

// DELETE /api/v1/admin/users/:id — deactivate a user (not delete)
router.delete('/users/:id', async (req, res, next) => {
  try {
    const targetId = Number(req.params.id)

    if (targetId === req.user!.userId) throw new ForbiddenError('Cannot deactivate yourself')

    const [target] = await db.select({ id: users.id, role: users.role })
      .from(users).where(eq(users.id, targetId)).limit(1)

    if (!target) throw new NotFoundError('User not found')
    if (target.role === 'superadmin') throw new ForbiddenError('Cannot deactivate superadmin')

    await db.update(users).set({ isActive: false }).where(eq(users.id, targetId))
    sendSuccess(res, null, 'User deactivated')
  } catch (e) { next(e) }
})

export default router
