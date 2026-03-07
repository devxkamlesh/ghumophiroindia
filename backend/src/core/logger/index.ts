import winston from 'winston'
import config from '../config'
import fs from 'fs'
import path from 'path'

const { combine, timestamp, printf, colorize, errors } = winston.format

// Ensure logs directory exists
const logsDir = path.resolve(process.cwd(), config.logging.filePath)
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`
})

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: combine(
        colorize(),
        logFormat
      ),
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
})

// If not in production, log to console with colors
if (config.env !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      logFormat
    ),
  }))
}

export default logger
