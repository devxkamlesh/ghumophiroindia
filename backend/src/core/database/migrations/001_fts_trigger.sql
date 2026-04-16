-- Full-Text Search trigger for tours table
-- Run once via: psql $DATABASE_URL -f this_file.sql

-- 1. Add search_vector column if not exists
ALTER TABLE tours ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- 2. Populate existing rows
UPDATE tours
SET search_vector = to_tsvector('english',
  coalesce(title, '') || ' ' ||
  coalesce(description, '') || ' ' ||
  coalesce(category, '') || ' ' ||
  coalesce(difficulty, '')
);

-- 3. Create GIN index for fast FTS queries
CREATE INDEX IF NOT EXISTS idx_tours_search_vector ON tours USING gin(search_vector);

-- 4. Create trigger to auto-update search_vector on INSERT/UPDATE
CREATE OR REPLACE FUNCTION tours_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    coalesce(NEW.title, '') || ' ' ||
    coalesce(NEW.description, '') || ' ' ||
    coalesce(NEW.category, '') || ' ' ||
    coalesce(NEW.difficulty, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tours_search_vector_trigger ON tours;
CREATE TRIGGER tours_search_vector_trigger
  BEFORE INSERT OR UPDATE ON tours
  FOR EACH ROW EXECUTE FUNCTION tours_search_vector_update();

-- 5. Geo extension for earthdistance (optional, for future use)
-- CREATE EXTENSION IF NOT EXISTS cube;
-- CREATE EXTENSION IF NOT EXISTS earthdistance;
