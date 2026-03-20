import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:ghumofiroindia@db.byamfelpdtruxcmoqgrh.supabase.co:5432/postgres',
  },
})
