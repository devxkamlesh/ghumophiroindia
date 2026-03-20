-- ============================================
-- MIGRATION 006: Gallery Images Table
-- Run this in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS gallery_images (
  id          SERIAL PRIMARY KEY,
  url         TEXT NOT NULL,
  title       TEXT,
  alt_text    TEXT,
  folder      TEXT NOT NULL DEFAULT 'general',
  tags        JSONB DEFAULT '[]',
  width       INTEGER,
  height      INTEGER,
  file_size   INTEGER,
  mime_type   TEXT,
  is_active   BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  uploaded_by INTEGER REFERENCES users(id),
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_folder       ON gallery_images(folder);
CREATE INDEX IF NOT EXISTS idx_gallery_is_active    ON gallery_images(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_uploaded_by  ON gallery_images(uploaded_by);

SELECT 'Gallery table created successfully!' AS status;
