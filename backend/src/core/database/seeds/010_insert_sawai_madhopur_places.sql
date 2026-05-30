-- Insert Sawai Madhopur Places (2 places)
-- Run this in Supabase SQL Editor after cities are created

INSERT INTO locations (name, slug, type, parent_id, path, description, image, is_popular, lat, lng)
VALUES

-- 1. Ranthambore National Park
(
  'Ranthambore National Park',
  'ranthambore-national-park',
  'place',
  (SELECT id FROM locations WHERE slug = 'sawai-madhopur'),
  (SELECT path || '/ranthambore-national-park' FROM locations WHERE slug = 'sawai-madhopur'),
  'Ranthambore National Park is one of India''s largest and most famous national parks, renowned for its tiger population and being one of the best places in the world to observe tigers in their natural habitat. Spread over 1,334 square kilometers, the park was once the hunting grounds of the Maharajas of Jaipur and became a wildlife sanctuary in 1955. The park is home to Bengal tigers, leopards, sloth bears, wild boars, sambar deer, spotted deer, and over 300 species of birds. The landscape features ancient ruins, lakes, and diverse vegetation ranging from dry deciduous forests to grasslands. Safari tours in open-top jeeps or canters offer thrilling wildlife viewing experiences, especially during early morning and late afternoon. The park is famous for its tigresses like Machli, who became a celebrity for her fearless nature. The best time to visit is from October to April when tigers are more visible near water sources. The park represents successful tiger conservation efforts in India.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  true,
  '26.0173',
  '76.5026'
),

-- 2. Ranthambore Fort
(
  'Ranthambore Fort',
  'ranthambore-fort',
  'place',
  (SELECT id FROM locations WHERE slug = 'sawai-madhopur'),
  (SELECT path || '/ranthambore-fort' FROM locations WHERE slug = 'sawai-madhopur'),
  'Ranthambore Fort is a UNESCO World Heritage Site located within Ranthambore National Park, perched atop a 700-foot hill offering panoramic views of the surrounding forest and wildlife. Built in the 8th century by the Chauhan dynasty, the fort has witnessed numerous battles and changed hands between various Rajput kingdoms and Delhi Sultanate. The fort complex includes three Hindu temples dedicated to Ganesha, Shiva, and Ramlalaji, which are still active pilgrimage sites. The massive fort walls stretch over 7 kilometers and contain palaces, pavilions, tanks, and step wells showcasing medieval architecture. The Ganesh Temple inside the fort is particularly famous, and devotees send wedding invitations to Lord Ganesha here. The fort offers stunning views of the national park and is an excellent spot for bird watching. The climb to the fort takes about 30-45 minutes through forested paths where wildlife sightings are possible. The fort represents the perfect blend of history, spirituality, and natural beauty. It''s a must-visit for history enthusiasts and nature lovers alike.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  true,
  '26.0173',
  '76.4588'
);
