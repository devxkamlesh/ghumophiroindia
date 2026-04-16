-- Trigram index for typo-tolerant and multilingual search
-- Run once: psql $DATABASE_URL -f this_file.sql

-- Enable pg_trgm extension (handles typos, partial matches, non-English)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN trigram index on tours.title
-- Enables: ILIKE '%rajastan%' → matches 'Rajasthan' (typo-tolerant)
CREATE INDEX IF NOT EXISTS idx_tours_title_trgm
  ON tours USING gin(title gin_trgm_ops);

-- GIN trigram index on locations.name
CREATE INDEX IF NOT EXISTS idx_locations_name_trgm
  ON locations USING gin(name gin_trgm_ops);

-- Combined FTS + trigram search query example:
-- SELECT * FROM tours
-- WHERE search_vector @@ plainto_tsquery('english', 'golden triangle')
--    OR title % 'rajastan'          -- trigram similarity (typo)
--    OR title ILIKE '%jaipur%'      -- substring
-- ORDER BY similarity(title, 'rajastan') DESC;
