-- Insert Rajasthan Cities into Supabase Database
-- Run this in Supabase SQL Editor

-- First, verify Rajasthan exists and get its ID
-- SELECT id, name, slug FROM locations WHERE slug = 'rajasthan';

-- Insert cities (assuming Rajasthan state already exists)
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES 
-- Jaipur
(
  'Jaipur',
  'jaipur',
  'city',
  (SELECT id FROM locations WHERE slug = 'rajasthan'),
  (SELECT path || '/jaipur' FROM locations WHERE slug = 'rajasthan'),
  '26.9124',
  '75.7873',
  'The Pink City',
  'https://www.andbeyond.com/wp-content/uploads/sites/5/Jaipur-2.jpg',
  true
),

-- Udaipur
(
  'Udaipur',
  'udaipur',
  'city',
  (SELECT id FROM locations WHERE slug = 'rajasthan'),
  (SELECT path || '/udaipur' FROM locations WHERE slug = 'rajasthan'),
  '24.5854',
  '73.7125',
  'City of Lakes',
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/77/ea/4b/royalty-meets-fairy-tale.jpg?w=1400&h=-1&s=1',
  true
),

-- Jodhpur
(
  'Jodhpur',
  'jodhpur',
  'city',
  (SELECT id FROM locations WHERE slug = 'rajasthan'),
  (SELECT path || '/jodhpur' FROM locations WHERE slug = 'rajasthan'),
  '26.2389',
  '73.0243',
  'The Blue City',
  'https://s7ap1.scene7.com/is/image/incredibleindia/2-mehrangarh-fort-jodhpur-rajasthan-city-hero?qlt=82&ts=1726660925514',
  true
),

-- Jaisalmer
(
  'Jaisalmer',
  'jaisalmer',
  'city',
  (SELECT id FROM locations WHERE slug = 'rajasthan'),
  (SELECT path || '/jaisalmer' FROM locations WHERE slug = 'rajasthan'),
  '26.9157',
  '70.9083',
  'The Golden City',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245',
  true
),

-- Mount Abu
(
  'Mount Abu',
  'mount-abu',
  'city',
  (SELECT id FROM locations WHERE slug = 'rajasthan'),
  (SELECT path || '/mount-abu' FROM locations WHERE slug = 'rajasthan'),
  '24.5926',
  '72.7156',
  'Hill Station of Rajasthan',
  'https://www.tourism.rajasthan.gov.in/content/dam/rajasthan-tourism/english/city/banners/desk/mount-abu.jpg',
  true
),

-- Pushkar
(
  'Pushkar',
  'pushkar',
  'city',
  (SELECT id FROM locations WHERE slug = 'rajasthan'),
  (SELECT path || '/pushkar' FROM locations WHERE slug = 'rajasthan'),
  '26.4898',
  '74.5511',
  'Holy City of Rajasthan',
  'https://www.peakadventuretour.com/assets/imgs/pushkar-fair-bnr.webp',
  true
),

-- Bikaner
(
  'Bikaner',
  'bikaner',
  'city',
  (SELECT id FROM locations WHERE slug = 'rajasthan'),
  (SELECT path || '/bikaner' FROM locations WHERE slug = 'rajasthan'),
  '28.0229',
  '73.3119',
  'Desert Heritage City',
  'https://www.tourism.rajasthan.gov.in/content/dam/rajasthan-tourism/english/city/banners/desk/19.jpg',
  true
),

-- Sawai Madhopur
(
  'Sawai Madhopur',
  'sawai-madhopur',
  'city',
  (SELECT id FROM locations WHERE slug = 'rajasthan'),
  (SELECT path || '/sawai-madhopur' FROM locations WHERE slug = 'rajasthan'),
  '26.0173',
  '76.5026',
  'Gateway to Ranthambore',
  'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,height=585,dpr=2/tour_img/f168bdc39cec0bec3f3a7d4a0381c0b41a6df2690a372d594a244dd6c13a06c8.jpg',
  true
),

-- Chittorgarh
(
  'Chittorgarh',
  'chittorgarh',
  'city',
  (SELECT id FROM locations WHERE slug = 'rajasthan'),
  (SELECT path || '/chittorgarh' FROM locations WHERE slug = 'rajasthan'),
  '24.8799',
  '74.6290',
  'City of Valor and Forts',
  'https://s7ap1.scene7.com/is/image/incredibleindia/1-chittorgarh-fort-chittorgarh-rajasthan-attr-hero?qlt=82&ts=1727352792140',
  true
)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  is_popular = EXCLUDED.is_popular;

-- Verify the insert
SELECT id, name, slug, type, path, is_popular 
FROM locations 
WHERE parent_id = (SELECT id FROM locations WHERE slug = 'rajasthan')
ORDER BY name;
