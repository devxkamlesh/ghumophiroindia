import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { ValidationError } from '../shared/errors'

/**
 * Validate request body against Zod schema
 */
export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body)
      next()
    } catch (error) {
      next(error)
    }
  }
}

/**
 * Validate request query against Zod schema
 */
export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = await schema.parseAsync(req.query)
      next()
    } catch (error) {
      next(error)
    }
  }
}

/**
 * Validate request params against Zod schema
 */
export const validateParams = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = await schema.parseAsync(req.params)
      next()
    } catch (error) {
      next(error)
    }
  }
}
