-- Locations hierarchy table
-- Run: sudo -u postgres psql -d ghumo_phiro_db -f /var/www/ghumo-phiro/backend/src/core/database/migrations/003_locations.sql

CREATE TABLE IF NOT EXISTS locations (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  type        TEXT NOT NULL CHECK (type IN ('country','state','city','place')),
  parent_id   INTEGER REFERENCES locations(id) ON DELETE CASCADE,
  path        TEXT NOT NULL,
  lat         DECIMAL(10,7),
  lng         DECIMAL(10,7),
  description TEXT,
  image       TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_locations_slug      ON locations(slug);
CREATE INDEX IF NOT EXISTS idx_locations_parent_id ON locations(parent_id);
CREATE INDEX IF NOT EXISTS idx_locations_type      ON locations(type);
CREATE INDEX IF NOT EXISTS idx_locations_path      ON locations(path);

-- Seed: India root
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description)
VALUES ('India', 'india', 'country', NULL, 'india', 20.5937, 78.9629, 'Incredible India')
ON CONFLICT (slug) DO NOTHING;
