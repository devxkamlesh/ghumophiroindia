-- ============================================
-- BANNER POSITION
-- ============================================
-- Adds a `position` column so banners can be grouped:
--   'hero'     → homepage hero slider (existing behaviour)
--   'category' → "Wonderful Place For You" / Tour Categories cards
-- This lets admins manage the 5 category card images from the Banners panel.

ALTER TABLE banners
  ADD COLUMN IF NOT EXISTS position VARCHAR(50) NOT NULL DEFAULT 'hero';

-- Make sure every existing banner is treated as a hero banner
UPDATE banners SET position = 'hero' WHERE position IS NULL;

-- Index for fast lookups by position + active state + order
CREATE INDEX IF NOT EXISTS idx_banners_position
  ON banners(position, is_active, display_order);

-- ── Seed the 5 default "category" cards (only if none exist yet) ───────────────
INSERT INTO banners (title, subtitle, description, image, link_url, link_text, display_order, is_active, position)
SELECT * FROM (VALUES
  (
    'City Tours',
    'Explore vibrant cities',
    NULL::text,
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80',
    '/tours?category=city',
    'See More',
    1,
    true,
    'category'
  ),
  (
    'Heritage Tours',
    'Forts & palaces',
    NULL::text,
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80',
    '/tours?category=heritage',
    'See More',
    2,
    true,
    'category'
  ),
  (
    'Desert Safari',
    'Golden dunes',
    NULL::text,
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80',
    '/tours?category=desert',
    'See More',
    3,
    true,
    'category'
  ),
  (
    'Backpacking Trips',
    'For the adventurous',
    NULL::text,
    'https://images.unsplash.com/photo-1533692328991-08159ff19fca?w=600&q=80',
    '/tours',
    'See More',
    4,
    true,
    'category'
  ),
  (
    'Custom Tours',
    'Built around you',
    NULL::text,
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
    '/custom-tour',
    'See More',
    5,
    true,
    'category'
  )
) AS seed(title, subtitle, description, image, link_url, link_text, display_order, is_active, position)
WHERE NOT EXISTS (SELECT 1 FROM banners WHERE position = 'category');

SELECT 'Banner position column + category banners ready' AS status;
