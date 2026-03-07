import { createServer } from './core/server'
import { errorHandler } from './middleware/errorHandler'
import { notFoundHandler } from './middleware/notFoundHandler'
import { apiLimiter } from './middleware/rateLimiter'
import authRoutes from './modules/auth/auth.routes'
import tourRoutes from './modules/tours/tour.routes'
import bookingRoutes from './modules/bookings/booking.routes'
import destinationRoutes from './modules/destinations/destination.routes'
import inquiryRoutes from './modules/inquiries/inquiry.routes'
import customTourRoutes from './modules/custom-tour/customTour.routes'
import config from './core/config'
import logger from './core/logger'

// Create Express app
const app = createServer()

// API routes
const apiRouter = require('express').Router()

// Apply rate limiting to all API routes
apiRouter.use(apiLimiter)

// Mount module routes
apiRouter.use('/auth', authRoutes)
apiRouter.use('/tours', tourRoutes)
apiRouter.use('/bookings', bookingRoutes)
apiRouter.use('/destinations', destinationRoutes)
apiRouter.use('/inquiries', inquiryRoutes)
apiRouter.use('/custom-tours', customTourRoutes)

// Mount API router
app.use(`/api/${config.apiVersion}`, apiRouter)

// Error handling (must be last)
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
const PORT = config.port

app.listen(PORT, () => {
  logger.info(`🚀 Backend server running on http://localhost:${PORT}`)
  logger.info(`📝 Environment: ${config.env}`)
  logger.info(`🔗 API: http://localhost:${PORT}/api/${config.apiVersion}`)
  logger.info(`🏥 Health: http://localhost:${PORT}/health`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server')
  process.exit(0)
})

export default app
