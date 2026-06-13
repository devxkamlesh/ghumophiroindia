import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import config from './config'
import logger from './logger'

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
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true)

      const allowed = config.allowedOrigins
      if (allowed.includes('*') || allowed.includes(origin)) {
        return callback(null, true)
      }
      // Return null (block) instead of throwing an error
      return callback(null, false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }))

  // Body parsing middleware
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ extended: true, limit: '50mb' }))
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

  return app
}

export default createServer
