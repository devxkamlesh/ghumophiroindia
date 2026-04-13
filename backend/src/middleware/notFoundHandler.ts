import { Request, Response } from 'express'
import { sendError } from '../shared/response'

export const notFoundHandler = (req: Request, res: Response) => {
  sendError(res, `Route ${req.method} ${req.url} not found`, 404)
}
