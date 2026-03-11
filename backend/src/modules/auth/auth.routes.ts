import { Router } from 'express'
import authController from './auth.controller'
import { authenticate, authenticateRefreshToken, optionalAuth } from '../../middleware/auth.middleware'
import { validateBody } from '../../middleware/validate.middleware'
import { authLimiter } from '../../middleware/rateLimiter'
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
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

// Password reset (public, rate limited)
router.post(
  '/forgot-password',
  authLimiter,
  validateBody(forgotPasswordSchema),
  authController.forgotPassword
)

router.post(
  '/reset-password',
  authLimiter,
  validateBody(resetPasswordSchema),
  authController.resetPassword
)

// Session route (optional auth)
router.get('/session', optionalAuth, authController.getSession)

// Refresh token route (uses refresh token, not access token)
router.post('/refresh', authenticateRefreshToken, authController.refreshToken)

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

export default router
