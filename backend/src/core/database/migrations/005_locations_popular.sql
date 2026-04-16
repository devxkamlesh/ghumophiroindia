-- Add is_popular column to locations table
-- Run: sudo -u postgres psql -d ghumo_phiro_db -f /var/www/ghumo-phiro/backend/src/core/database/migrations/005_locations_popular.sql

ALTER TABLE locations ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS image TEXT;

CREATE INDEX IF NOT EXISTS idx_locations_popular ON locations(is_popular);
