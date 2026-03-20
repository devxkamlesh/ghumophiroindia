-- ============================================
-- INSERT RAJASTHAN PLACES - PART 2
-- ============================================
-- Udaipur (remaining 2) + Jodhpur (6 places)
-- Run this in Supabase SQL Editor after Part 1

-- ============================================
-- UDAIPUR PLACES (Remaining)
-- ============================================

INSERT INTO locations (name, slug, type, parent_id, path, description, image, is_popular, lat, lng)
VALUES
(
  'Jagdish Temple',
  'jagdish-temple',
  'place',
  (SELECT id FROM locations WHERE slug = 'udaipur' AND type = 'city'),
  'india/rajasthan/udaipur/jagdish-temple',
  'Jagdish Temple is a magnificent Indo-Aryan temple built in 1651 by Maharana Jagat Singh I, dedicated to Lord Vishnu. This three-story temple stands majestically in the heart of Udaipur, featuring intricate carvings, beautifully sculpted pillars, and decorated ceilings. The temple showcases stunning architecture with a black stone image of Lord Vishnu as Jagannath, Lord of the Universe. The outer walls are adorned with sculptures of elephants, dancers, and horsemen. The temple''s pyramidal spire rises 79 feet high and is visible from various parts of the city. Daily aarti ceremonies create a spiritual atmosphere, and the temple remains an important pilgrimage site. The craftsmanship displayed in every corner reflects the artistic excellence of the Mewar dynasty.',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
  true,
  24.5797,
  73.6833
),
(
  'Karni Mata Temple Udaipur',
  'karni-mata-temple-udaipur',
  'place',
  (SELECT id FROM locations WHERE slug = 'udaipur' AND type = 'city'),
  'india/rajasthan/udaipur/karni-mata-temple-udaipur',
  'Karni Mata Temple is perched atop Machla Magra Hills, offering panoramic views of Udaipur city, its lakes, and surrounding Aravalli ranges. Built in honor of Karni Mata, an incarnation of Goddess Durga, this temple is accessible via a ropeway that provides breathtaking aerial views during the ascent. The temple complex features beautiful architecture with white marble structures and intricate carvings. The main sanctum houses the idol of Karni Mata, and the temple premises include smaller shrines dedicated to other deities. The sunset views from the temple are spectacular, with the entire city bathed in golden light. The ropeway ride itself is an attraction, offering bird''s eye views of Fateh Sagar Lake and the city. The temple is especially crowded during Navratri when special celebrations take place.',
  'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800',
  true,
  24.5926,
  73.6781
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- JODHPUR PLACES (Blue City)
-- ============================================

INSERT INTO locations (name, slug, type, parent_id, path, description, image, is_popular, lat, lng)
VALUES
(
  'Mehrangarh Fort',
  'mehrangarh-fort',
  'place',
  (SELECT id FROM locations WHERE slug = 'jodhpur' AND type = 'city'),
  'india/rajasthan/jodhpur/mehrangarh-fort',
  'Mehrangarh Fort is one of India''s largest and most magnificent forts, rising 410 feet above Jodhpur city. Built in 1459 by Rao Jodha, this architectural marvel features massive walls up to 120 feet high and 70 feet wide. The fort houses several palaces with intricate carvings, expansive courtyards, and museums displaying royal palanquins, weapons, costumes, and paintings. The Moti Mahal (Pearl Palace), Phool Mahal (Flower Palace), and Sheesh Mahal (Mirror Palace) showcase exquisite craftsmanship. The fort offers breathtaking panoramic views of the blue city below. The museum collection includes the famous Mahadol palanquin and an impressive armory. The fort''s imposing structure and rich history make it a UNESCO World Heritage Site candidate and one of Rajasthan''s most visited attractions.',
  'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800',
  true,
  26.2985,
  73.0187
),
(
  'Umaid Bhawan Palace',
  'umaid-bhawan-palace',
  'place',
  (SELECT id FROM locations WHERE slug = 'jodhpur' AND type = 'city'),
  'india/rajasthan/jodhpur/umaid-bhawan-palace',
  'Umaid Bhawan Palace is one of the world''s largest private residences, built between 1928-1943 by Maharaja Umaid Singh. This magnificent Art Deco palace features 347 rooms and is built with golden-yellow sandstone and marble. The palace is divided into three parts: a luxury Taj hotel, the royal family''s residence, and a museum showcasing royal artifacts, vintage cars, and clocks. The palace architecture blends eastern and western influences, featuring intricate frescoes, elegant interiors, and beautiful gardens. The museum displays photographs, weapons, and memorabilia from the royal family. The palace sits on Chittar Hill, offering stunning views of Jodhpur. The underground Zodiac Pool and the throne chamber are architectural highlights. This living palace represents the grandeur of Rajput royalty.',
  'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800',
  true,
  26.2850,
  73.0376
),
(
  'Jaswant Thada',
  'jaswant-thada',
  'place',
  (SELECT id FROM locations WHERE slug = 'jodhpur' AND type = 'city'),
  'india/rajasthan/jodhpur/jaswant-thada',
  'Jaswant Thada is an architectural marvel built in 1899 as a cenotaph for Maharaja Jaswant Singh II. Known as the "Taj Mahal of Marwar," this memorial is built entirely of intricately carved white marble sheets that emit a warm glow when illuminated by the sun. The structure features delicate lattice work, beautiful domes, and carved gazebos. The memorial houses portraits of Jodhpur rulers and serves as the cremation ground for the royal family. The complex includes a beautiful garden with a lake, creating a peaceful atmosphere. The marble used is so thin that it becomes translucent in sunlight, creating a magical effect. The memorial offers excellent views of Mehrangarh Fort and the blue city. The serene environment and stunning architecture make it a must-visit attraction.',
  'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800',
  true,
  26.2970,
  73.0168
),
(
  'Clock Tower Market',
  'clock-tower-market',
  'place',
  (SELECT id FROM locations WHERE slug = 'jodhpur' AND type = 'city'),
  'india/rajasthan/jodhpur/clock-tower-market',
  'The Clock Tower (Ghanta Ghar) and its surrounding Sardar Market form the vibrant heart of old Jodhpur. Built by Maharaja Sardar Singh in the late 19th century, this iconic landmark towers over the bustling bazaar below. The market is a sensory explosion of colors, sounds, and aromas, offering everything from spices, textiles, handicrafts, jewelry, to traditional Rajasthani items. The narrow lanes are filled with shops selling bandhani fabrics, mojari shoes, antiques, and local snacks. The market is famous for its spice market where vendors sell aromatic spices in colorful displays. Street food stalls offer local delicacies like mirchi vada and mawa kachori. The area provides an authentic glimpse into local life and culture. Shopping here is an experience in itself, with opportunities to interact with local artisans and traders.',
  'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800',
  true,
  26.2960,
  73.0243
),
(
  'Balsamand Lake',
  'balsamand-lake',
  'place',
  (SELECT id FROM locations WHERE slug = 'jodhpur' AND type = 'city'),
  'india/rajasthan/jodhpur/balsamand-lake',
  'Balsamand Lake is an artificial lake built in 1159 AD by Balak Rao Parihar as a water reservoir. Surrounded by lush green gardens and groves of trees including mango, papaya, pomegranate, and guava, this serene lake offers a peaceful retreat from the city. The lake is flanked by the beautiful Balsamand Lake Palace, built in 1936 as a summer palace for the royal family, now converted into a heritage hotel. The palace showcases red sandstone architecture with intricate carvings and beautiful courtyards. The lake attracts various migratory birds, making it a paradise for bird watchers. The well-maintained gardens provide perfect spots for picnics and relaxation. The sunset views over the lake with the palace in the background create a picturesque scene. The tranquil atmosphere makes it an ideal spot for nature lovers and photography enthusiasts.',
  'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800',
  true,
  26.3167,
  73.0833
),
(
  'Kaylana Lake',
  'kaylana-lake',
  'place',
  (SELECT id FROM locations WHERE slug = 'jodhpur' AND type = 'city'),
  'india/rajasthan/jodhpur/kaylana-lake',
  'Kaylana Lake is a picturesque artificial lake built in 1872 by Pratap Singh, spread over 84 square kilometers. Located about 8 km west of Jodhpur, this lake serves as an important water source for the city while offering a scenic getaway. The lake is surrounded by rocky hills and babul trees, creating a natural habitat for various bird species including Siberian cranes, flamingos, and pelicans during winter. The sunset views from the lake are spectacular, with the sun setting behind the Aravalli hills reflecting in the calm waters. The lake area features gardens and walking paths perfect for evening strolls. Boating facilities are available for visitors to enjoy the serene waters. The lake is a popular spot for picnics, photography, and bird watching. The peaceful environment away from city chaos makes it a favorite among locals and tourists alike.',
  'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800',
  true,
  26.2167,
  72.9667
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SUMMARY
-- ============================================
-- Part 2 Complete: 8 places added
-- - Udaipur: 2 places (Jagdish Temple, Karni Mata Temple)
-- - Jodhpur: 6 places (Mehrangarh Fort, Umaid Bhawan, Jaswant Thada, Clock Tower, Balsamand Lake, Kaylana Lake)
--
-- Total Progress: 24/60+ places (40% complete)
-- Next: Part 3 will include Jaisalmer (7 places)
