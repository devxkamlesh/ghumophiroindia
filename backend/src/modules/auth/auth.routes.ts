import { Router } from 'express'
import authController from './auth.controller'
import { authenticate, optionalAuth } from '../../middleware/auth.middleware'
import { validateBody } from '../../middleware/validate.middleware'
import { authLimiter } from '../../middleware/rateLimiter'
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from './auth.validator'

const router = Router()

// Public routes (with rate limiting)
router.post(
  '/register',
  authLimiter,
  validateBody(registerSchema),
  authController.register
)

router.post(
  '/login',
  authLimiter,
  validateBody(loginSchema),
  authController.login
)

// Session route (optional auth)
router.get('/session', optionalAuth, authController.getSession)

// Protected routes (require authentication)
router.use(authenticate)

router.post('/logout', authController.logout)

router.get('/profile', authController.getProfile)

router.patch(
  '/profile',
  validateBody(updateProfileSchema),
  authController.updateProfile
)

router.post(
  '/change-password',
  validateBody(changePasswordSchema),
  authController.changePassword
)

router.post('/refresh', authController.refreshToken)

export default router
