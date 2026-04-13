import { Response } from 'express'

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  errors?: Record<string, string[]>
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  }
  return res.status(statusCode).json(response)
}

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 400,
  errors?: Record<string, string[]>
): Response => {
  const response: ApiResponse = {
    success: false,
    error,
    errors,
  }
  return res.status(statusCode).json(response)
}

/**
 * Send paginated response
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): Response => {
  const response: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
  return res.status(200).json(response)
}
