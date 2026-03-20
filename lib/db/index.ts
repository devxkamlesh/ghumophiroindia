import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const connectionString = process.env.DATABASE_URL

const client = postgres(connectionString, {
  ssl: 'require', // Supabase requires SSL
  max: 10, // Connection pool size
})

export const db = drizzle(client, { schema })

