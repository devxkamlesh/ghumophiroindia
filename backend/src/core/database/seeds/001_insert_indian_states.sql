-- Insert 13 Indian States into Supabase Database
-- Run this in Supabase SQL Editor after inserting India

INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES 
-- Rajasthan
(
  'Rajasthan',
  'rajasthan',
  'state',
  (SELECT id FROM locations WHERE slug = 'india'),
  'india/rajasthan',
  '27.0238',
  '74.2179',
  'Majestic forts, golden deserts, and vibrant bazaars make Rajasthan India''s most regal destination. Home to Jaipur, Jodhpur, Udaipur, and Jaisalmer.',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80&fit=crop',
  true
),

-- Himachal Pradesh
(
  'Himachal Pradesh',
  'himachal-pradesh',
  'state',
  (SELECT id FROM locations WHERE slug = 'india'),
  'india/himachal-pradesh',
  '31.1048',
  '77.1734',
  'Alpine valleys, snow-capped Himalayan peaks, and charming hill stations like Manali, Shimla, and Dharamshala nestled in pristine nature.',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80&fit=crop',
  true
),

-- Uttarakhand
(
  'Uttarakhand',
  'uttarakhand',
  'state',
  (SELECT id FROM locations WHERE slug = 'india'),
  'india/uttarakhand',
  '30.0668',
  '79.0193',
  'Sacred Char Dham temples, thrilling Rishikesh adventure sports, and the source of the Ganga — India''s divine and adventure capital.',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80&fit=crop',
  true
),

-- Jammu & Kashmir
(
  'Jammu & Kashmir',
  'jammu-kashmir',
  'state',
  (SELECT id FROM locations WHERE slug = 'india'),
  'india/jammu-kashmir',
  '33.7782',
  '76.5762',
  'Floating houseboats on Dal Lake, lush Mughal gardens, and dramatic mountain valleys of unmatched beauty — truly heaven on earth.',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80&fit=crop',
  true
),

-- Sikkim
(
  'Sikkim',
  'sikkim',
  'state',
  (SELECT id FROM locations WHERE slug = 'india'),
  'india/sikkim',
  '27.533',
  '88.5122',
  'A tiny Buddhist kingdom with towering Kangchenjunga views, ancient monasteries, colorful prayer flags, and pristine mountain lakes.',
  'https://images.unsplash.com/photo-1569668941740-573f01fcb2e8?w=800&q=80&fit=crop',
  true
),

-- Uttar Pradesh
(
  'Uttar Pradesh',
  'uttar-pradesh',
  'state',
  (SELECT id FROM locations WHERE slug = 'india'),
  'india/uttar-pradesh',
  '26.8467',
  '80.9462',
  'Home to the iconic Taj Mahal and the ancient ghats of Varanasi — the spiritual and cultural soul of India beats in Uttar Pradesh.',
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80&fit=crop',
  true
),

-- Leh Ladakh
(
  'Leh Ladakh',
  'leh-ladakh',
  'state',
  (SELECT id FROM locations WHERE slug = 'india'),
  'india/leh-ladakh',
  '34.1526',
  '77.5771',
  'Stark moonscapes, turquoise Pangong Lake, ancient Tibetan monasteries, and adrenaline-fueled mountain passes at 11,000+ feet above sea level.',
  'https://images.unsplash.com/photo-1626016498462-b571d7cc9c99?w=800&q=80&fit=crop',
  true
),

-- Gujarat
(
  'Gujarat',
  'gujarat',
  'state',
  (SELECT id FROM locations WHERE slug = 'india'),
  'india/gujarat',
  '22.2587',
  '71.1924',
  'The white Rann of Kutch salt desert, Asiatic lions of Gir, ancient Dwarka temples, and India''s most vibrant folk art and Navratri festivals.',
  'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80&fit=crop',
  true
),

-- Madhya Pradesh
(
  'Madhya Pradesh',
  'madhya-pradesh',
  'state',
  (SELECT id FROM locations WHERE slug = 'india'),
  'india/madhya-pradesh',
  '23.4733',
  '77.947',
  'UNESCO Khajuraho temples, royal Bengal tiger reserves of Kanha and Bandhavgarh, ancient Bhimbetka caves, and the timeless Narmada river.',
  'https://images.unsplash.com/photo-1611735341450-74d61e660ad2?w=800&q=80&fit=crop',
  true
),

-- Punjab
(
  'Punjab',
  'punjab',
  'state',
  (SELECT id FROM locations WHERE slug = 'india'),
  'india/punjab',
  '31.1471',
  '75.3412',
  'The Golden Temple''s spiritual glow, legendary Punjabi warmth and cuisine, Wagah border ceremony, and the fertile heartland of North India.',
  'https://images.unsplash.com/photo-1571989961426-8c93f5d11c62?w=800&q=80&fit=crop',
  true
),

-- Delhi
(
  'Delhi',
  'delhi',
  'state',
  (SELECT id FROM locations WHERE slug = 'india'),
  'india/delhi',
  '28.7041',
  '77.1025',
  'Six dynasties of history, Red Fort, Qutub Minar, world-class street food in Chandni Chowk, and India''s most electric urban energy.',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80&fit=crop',
  true
),

-- Kerala
(
  'Kerala',
  'kerala',
  'state',
  (SELECT id FROM locations WHERE slug = 'india'),
  'india/kerala',
  '10.8505',
  '76.2711',
  'Tranquil Alleppey backwaters, spice-scented Munnar hills, ancient Ayurvedic retreats, Kathakali performances, and pristine Kovalam beaches.',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80&fit=crop',
  true
),

-- Maharashtra
(
  'Maharashtra',
  'maharashtra',
  'state',
  (SELECT id FROM locations WHERE slug = 'india'),
  'india/maharashtra',
  '19.7515',
  '75.7139',
  'From Mumbai''s electric skyline and Gateway of India to UNESCO Ajanta & Ellora caves and mighty Sahyadri hill forts — Maharashtra captivates.',
  'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80&fit=crop',
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
WHERE type = 'state'
ORDER BY name;
