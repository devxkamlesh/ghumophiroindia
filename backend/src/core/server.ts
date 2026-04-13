import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import config from './config'
import logger from './logger'
import { checkDatabaseConnection } from './database'
import { checkRedisConnection } from './redis'

export const createServer = (): Application => {
  const app = express()

  // Trust proxy - required when behind Nginx reverse proxy
  app.set('trust proxy', 1)

  // Security middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }))

  // CORS configuration
  app.use(cors({
    origin: config.allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }))

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))
  app.use(cookieParser())

  // Compression middleware
  app.use(compression())

  // Logging middleware
  if (config.env === 'development') {
    app.use(morgan('dev'))
  } else {
    app.use(morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    }))
  }

  // Health check endpoint
  app.get('/health', async (req, res) => {
    const dbConnected = await checkDatabaseConnection()
    const redisConnected = await checkRedisConnection()

    const health = {
      status: dbConnected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.env,
      services: {
        database: dbConnected ? 'connected' : 'disconnected',
        redis: redisConnected ? 'connected' : 'disconnected',
      },
    }

    const statusCode = dbConnected ? 200 : 503
    res.status(statusCode).json(health)
  })

  return app
}

export default createServer
