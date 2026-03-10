import { Request, Response, NextFunction } from 'express'
import authService from './auth.service'
import { sendSuccess } from '../../shared/response'
import type { RegisterInput, LoginInput, UpdateProfileInput, ChangePasswordInput, ForgotPasswordInput, ResetPasswordInput } from './auth.validator'

export class AuthController {
  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data: RegisterInput = req.body
      const result = await authService.register(data)
      
      sendSuccess(res, result, 'Registration successful', 201)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data: LoginInput = req.body
      const result = await authService.login(data)
      
      sendSuccess(res, result, 'Login successful')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get current user session
   * GET /api/v1/auth/session
   */
  async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendSuccess(res, null, 'No active session')
      }

      const user = await authService.getUserById(req.user.userId)
      sendSuccess(res, { user })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // In a stateless JWT system, logout is handled client-side
      // by removing the token. Server can optionally blacklist tokens.
      sendSuccess(res, null, 'Logout successful')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get user profile
   * GET /api/v1/auth/profile
   */
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getUserById(req.user!.userId)
      sendSuccess(res, { user })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update user profile
   * PATCH /api/v1/auth/profile
   */
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const data: UpdateProfileInput = req.body
      const user = await authService.updateProfile(req.user!.userId, data)
      
      sendSuccess(res, { user }, 'Profile updated successfully')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data: ChangePasswordInput = req.body
      const result = await authService.changePassword(req.user!.userId, data)
      
      sendSuccess(res, result, 'Password changed successfully')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.refreshToken(req.user!.userId)
      sendSuccess(res, result, 'Token refreshed successfully')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Forgot password — request a reset link
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data: ForgotPasswordInput = req.body
      const result = await authService.forgotPassword(data)
      sendSuccess(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Reset password using token
   * POST /api/v1/auth/reset-password
   */
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data: ResetPasswordInput = req.body
      const result = await authService.resetPassword(data)
      sendSuccess(res, result)
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthController()
