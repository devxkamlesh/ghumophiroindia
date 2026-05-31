-- ============================================
-- BANNERS TABLE
-- ============================================
-- For managing homepage hero banners

CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  image VARCHAR(500) NOT NULL,
  link_url VARCHAR(500),
  link_text VARCHAR(100) DEFAULT 'Book Now',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for active banners
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active, display_order);

-- Insert default banners
INSERT INTO banners (title, subtitle, description, image, link_url, link_text, display_order, is_active) VALUES
(
  'Golden Triangle Tour',
  'Delhi · Agra · Jaipur',
  '6 Days, 5 Nights | Starting from ₹24,999',
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80',
  '/tours',
  'Book Now',
  1,
  true
),
(
  'Magical Rajasthan Tour',
  'Jaipur · Udaipur · Jodhpur · Jaisalmer',
  '8 Days, 7 Nights | Starting from ₹34,999',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1920&q=80',
  '/tours',
  'Book Now',
  2,
  true
),
(
  'Desert Safari Experience',
  'Jaisalmer · Bikaner',
  '4 Days, 3 Nights | Starting from ₹18,999',
  'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1920&q=80',
  '/tours',
  'Book Now',
  3,
  true
);

-- Success message
SELECT 'Banners table created successfully' AS status;
