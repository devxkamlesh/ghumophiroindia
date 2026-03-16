-- Migration: Replace destinations table with tour_locations join table
-- Run: sudo -u postgres psql -d ghumo_phiro_db -f /var/www/ghumo-phiro/backend/src/core/database/migrations/004_tour_locations.sql

-- 1. Create tour_locations join table
CREATE TABLE IF NOT EXISTS tour_locations (
  id           SERIAL PRIMARY KEY,
  tour_id      INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  location_id  INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  sort_order   INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_tl_tour_id      ON tour_locations(tour_id);
CREATE INDEX IF NOT EXISTS idx_tl_location_id  ON tour_locations(location_id);

-- 2. Drop destinations table (data is now managed via locations hierarchy)
-- NOTE: Only run this after you have migrated any data you want to keep
DROP TABLE IF EXISTS destinations CASCADE;

-- Done. Tours now link to locations via tour_locations join table.
-- India GPS bounds for reference:
--   Latitude:  8°4'N  to 37°6'N   (8.0667 to 37.1000)
--   Longitude: 68°7'E to 97°25'E  (68.1167 to 97.4167)
