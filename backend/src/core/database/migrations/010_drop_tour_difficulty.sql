-- 010_drop_tour_difficulty.sql
-- Removes the `difficulty` field from tours (feature removed from product).
-- The single-column index is dropped automatically with the column, but we
-- drop it explicitly first to be safe. Idempotent.

DROP INDEX IF EXISTS idx_tours_difficulty;

ALTER TABLE tours DROP COLUMN IF EXISTS difficulty;
