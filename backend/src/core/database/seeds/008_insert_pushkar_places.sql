-- Insert Pushkar Places (2 places)
-- Run this in Supabase SQL Editor after cities are created

INSERT INTO locations (name, slug, type, parent_id, path, description, image, is_popular, lat, lng)
VALUES

-- 1. Pushkar Lake
(
  'Pushkar Lake',
  'pushkar-lake',
  'place',
  (SELECT id FROM locations WHERE slug = 'pushkar'),
  (SELECT path || '/pushkar-lake' FROM locations WHERE slug = 'pushkar'),
  'Pushkar Lake is one of the most sacred lakes in India, believed to have been created by Lord Brahma and mentioned in ancient Hindu scriptures. The lake is surrounded by 52 bathing ghats and over 500 temples, making it a major pilgrimage destination. According to legend, the lake was formed when Lord Brahma dropped a lotus flower, and it''s believed that bathing in its holy waters cleanses sins and cures skin diseases. The lake is especially crowded during Kartik Purnima when thousands of pilgrims gather for a holy dip. The ghats are beautifully lit in the evening, creating a spiritual and serene atmosphere. The lake is surrounded by hills on three sides, adding to its scenic beauty. Various ceremonies and rituals are performed at the ghats throughout the day. The reflection of temples and ghats in the calm waters creates picture-perfect moments. The lake area is peaceful and perfect for meditation and spiritual contemplation. It''s the spiritual heart of Pushkar and a must-visit for anyone seeking divine blessings.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  true,
  '26.4899',
  '74.5511'
),

-- 2. Brahma Temple
(
  'Brahma Temple',
  'brahma-temple',
  'place',
  (SELECT id FROM locations WHERE slug = 'pushkar'),
  (SELECT path || '/brahma-temple' FROM locations WHERE slug = 'pushkar'),
  'Brahma Temple is one of the very few temples in the world dedicated to Lord Brahma, the creator god in Hinduism, making it extremely significant for Hindu pilgrims. Built in the 14th century with marble and stone, the temple features a distinctive red spire and the image of a four-headed Brahma. According to legend, Brahma performed a yajna (fire sacrifice) at Pushkar, and his wife Savitri''s absence led him to marry Gayatri, which angered Savitri who cursed that Brahma would be worshipped only in Pushkar. The temple''s architecture is simple yet elegant, with a marble floor and walls adorned with silver coins. The sanctum houses a life-size image of Brahma with four faces and four hands. The temple is especially crowded during Kartik Purnima when a grand fair is held. Devotees from across India visit to seek blessings for creation, knowledge, and prosperity. The temple complex has a peaceful atmosphere conducive to prayer and meditation. It''s a unique spiritual experience that cannot be found anywhere else in the world.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  true,
  '26.4899',
  '74.5511'
);
