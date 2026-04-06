-- ============================================
-- PLACE CARDS TABLE
-- ============================================
-- Dedicated table for the "Wonderful Place For You" / Tour Categories section.
-- Completely separate from banners.

CREATE TABLE IF NOT EXISTS place_cards (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  image VARCHAR(500) NOT NULL,
  link_url VARCHAR(500) NOT NULL DEFAULT '/tours',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_place_cards_active ON place_cards(is_active, display_order);

-- Seed 5 default cards
INSERT INTO place_cards (title, subtitle, image, link_url, display_order, is_active) VALUES
('City Tours', 'Explore vibrant cities', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80', '/tours?category=city', 1, true),
('Heritage Tours', 'Forts & palaces', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', '/tours?category=heritage', 2, true),
('Desert Safari', 'Golden dunes', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80', '/tours?category=desert', 3, true),
('Backpacking Trips', 'For the adventurous', 'https://images.unsplash.com/photo-1533692328991-08159ff19fca?w=600&q=80', '/tours', 4, true),
('Custom Tours', 'Built around you', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', '/custom-tour', 5, true);

SELECT 'place_cards table created and seeded' AS status;
