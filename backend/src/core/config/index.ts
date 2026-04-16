import dotenv from 'dotenv'

dotenv.config()

interface Config {
  env: string
  port: number
  apiVersion: string
  frontendUrl: string
  allowedOrigins: string[]
  database: {
    url: string
    directUrl: string
  }
  redis: {
    url: string
    token: string
    host: string
    port: number
    password: string
  }
  jwt: {
    secret: string
    expiresIn: string
    refreshExpiresIn: string
  }
  cloudinary: {
    cloudName: string
    apiKey: string
    apiSecret: string
  }
  email: {
    resendApiKey: string
    from: string
    host: string
    port: number
    user: string
    pass: string
  }
  rateLimit: {
    windowMs: number
    maxRequests: number
  }
  logging: {
    level: string
    filePath: string
  }
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  
  database: {
    url: process.env.DATABASE_URL || '',
    directUrl: process.env.DIRECT_URL || '',
  },
  
  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  
  email: {
    resendApiKey: process.env.RESEND_API_KEY || '',
    from: process.env.EMAIL_FROM || 'noreply@ghumophiroindia.com',
    // Legacy SMTP (kept for fallback)
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || './logs',
  },
}

// Validate required config
const validateConfig = () => {
  const required = [
    'database.url',
    'jwt.secret',
  ]
  
  const missing: string[] = []
  
  required.forEach(key => {
    const keys = key.split('.')
    let value: any = config
    
    for (const k of keys) {
      value = value[k]
      if (!value) {
        missing.push(key)
        break
      }
    }
  })
  
  if (missing.length > 0) {
    throw new Error(`Missing required config: ${missing.join(', ')}`)
  }
}

if (config.env !== 'test') {
  validateConfig()
}

export default config
