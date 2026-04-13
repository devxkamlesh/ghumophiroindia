import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import config from '../config'
import * as schema from './schema'

if (!config.database.url) {
  throw new Error('DATABASE_URL is not defined')
}

// Create postgres client with connection pooling
const client = postgres(config.database.url, {
  ssl: 'require',
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})

// Create drizzle instance with schema
export const db = drizzle(client, { schema })

// Health check function
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await client`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

export default db
