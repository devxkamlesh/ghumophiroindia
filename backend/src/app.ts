import { Router } from 'express'
import { createServer } from './core/server'
import { errorHandler } from './middleware/errorHandler'
import { notFoundHandler } from './middleware/notFoundHandler'
import { apiLimiter } from './middleware/rateLimiter'
import authRoutes from './modules/auth/auth.routes'
import adminManagementRoutes from './modules/auth/admin-management.routes'
import tourRoutes from './modules/tours/tour.routes'
import bookingRoutes from './modules/bookings/booking.routes'
import inquiryRoutes from './modules/inquiries/inquiry.routes'
import customTourRoutes from './modules/custom-tour/customTour.routes'
import locationRoutes from './modules/locations/location.routes'
import uploadRoutes from './modules/upload/upload.routes'
import galleryRoutes from './modules/gallery/gallery.routes'
import bannerRoutes from './modules/banners/banner.routes'
import placeCardRoutes from './modules/place-cards/place-card.routes'
import { setupCacheInvalidation } from './core/cache-invalidator'
import config from './core/config'
import logger from './core/logger'

const app = createServer()

setupCacheInvalidation()

import('./jobs/workers').then(({ startScheduledJobs }) => {
  startScheduledJobs().catch(err =>
    logger.warn(`Background workers not started: ${err.message}`)
  )
}).catch(err => logger.warn(`Workers module load failed: ${err.message}`))

const apiRouter = Router()

apiRouter.get('/health', async (req: any, res: any) => {
  const { checkDatabaseConnection } = await import('./core/database')
  const { checkRedisConnection } = await import('./core/redis')

  // Never let the health endpoint itself throw a 500 — a dependency check that
  // rejects should read as "down", not crash the probe.
  const [dbConnected, redisConnected] = await Promise.all([
    checkDatabaseConnection().catch(() => false),
    checkRedisConnection().catch(() => false),
  ])

  // The database is a hard dependency; Redis is a best-effort cache (the cache
  // helpers no-op when it's unavailable). So:
  //   - DB down       -> "error"    + 503  (node is not usable)
  //   - Redis down    -> "degraded" + 200  (still serving, but alert-worthy)
  //   - all up        -> "ok"       + 200
  // We keep 200 on a Redis-only outage so load balancers don't pull an
  // otherwise-functional node; point uptime monitors at the `status` field
  // (alert when status !== "ok") rather than HTTP code alone.
  const status = !dbConnected ? 'error' : redisConnected ? 'ok' : 'degraded'

  res.status(dbConnected ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
    services: {
      database: dbConnected ? 'connected' : 'disconnected',
      redis: redisConnected ? 'connected' : 'disconnected',
    },
  })
})

apiRouter.use((req: any, res: any, next: any) => {
  if (req.path === '/health') return next()
  return apiLimiter(req, res, next)
})

apiRouter.use('/auth',         authRoutes)
apiRouter.use('/admin',        adminManagementRoutes)
apiRouter.use('/tours',        tourRoutes)
apiRouter.use('/bookings',     bookingRoutes)
apiRouter.use('/inquiries',    inquiryRoutes)
apiRouter.use('/custom-tours', customTourRoutes)
apiRouter.use('/locations',    locationRoutes)
apiRouter.use('/upload',       uploadRoutes)
apiRouter.use('/gallery',      galleryRoutes)
apiRouter.use('/banners',      bannerRoutes)
apiRouter.use('/place-cards',  placeCardRoutes)

app.use(`/api/${config.apiVersion}`, apiRouter)

app.use(notFoundHandler)
app.use(errorHandler)

const PORT = config.port
app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`)
  logger.info(`📝 Environment: ${config.env}`)
})

process.on('SIGTERM', () => { logger.info('SIGTERM'); process.exit(0) })
process.on('SIGINT',  () => { logger.info('SIGINT');  process.exit(0) })

export default app
