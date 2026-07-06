import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../shared/errors'
import { sendError } from '../shared/response'
import logger from '../core/logger'
import config from '../core/config'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  })

  // Malformed JSON in the request body.
  // express.json() (body-parser) throws a SyntaxError with `status: 400`, a
  // `type` of 'entity.parse.failed', and a `body` property. Without this branch
  // it would fall through to the generic handler and (wrongly) return 500.
  if (
    err instanceof SyntaxError &&
    (err as any).status === 400 &&
    'body' in err
  ) {
    return sendError(res, 'Malformed JSON in request body', 400)
  }

  // Zod validation error
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {}
    err.errors.forEach((error) => {
      const path = error.path.join('.')
      if (!errors[path]) {
        errors[path] = []
      }
      errors[path].push(error.message)
    })
    
    return sendError(res, 'Validation failed', 400, errors)
  }

  // App operational error
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode)
  }

  // Database errors
  if (err.message.includes('duplicate key')) {
    return sendError(res, 'Resource already exists', 409)
  }

  if (err.message.includes('foreign key constraint')) {
    return sendError(res, 'Invalid reference', 400)
  }

  // Default error
  const statusCode = 500
  const message = config.env === 'production' 
    ? 'Internal server error' 
    : err.message

  return sendError(res, message, statusCode)
}
