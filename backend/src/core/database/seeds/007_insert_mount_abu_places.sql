-- Insert Mount Abu Places (10 places)
-- Run this in Supabase SQL Editor after cities are created

INSERT INTO locations (name, slug, type, parent_id, path, description, image, is_popular, lat, lng)
VALUES

-- 1. Dilwara Temples
(
  'Dilwara Temples',
  'dilwara-temples',
  'place',
  (SELECT id FROM locations WHERE slug = 'mount-abu'),
  (SELECT path || '/dilwara-temples' FROM locations WHERE slug = 'mount-abu'),
  'Dilwara Temples are a group of five exquisitely carved Jain temples built between the 11th and 13th centuries, renowned worldwide for their extraordinary marble architecture and intricate craftsmanship. These temples represent the pinnacle of Jain temple architecture with their stunning marble carvings that are so delicate they appear translucent in places. The Vimal Vasahi and Luna Vasahi temples are the most famous, featuring ornate ceilings, pillars, doorways, and panels carved with incredible precision. Every inch of marble is adorned with detailed carvings of gods, goddesses, dancers, musicians, and floral patterns. The craftsmanship is so fine that it''s said to have taken 1,500 artisans and 14 years to complete just one temple. The temples are dedicated to various Jain Tirthankaras and remain active places of worship. Photography is strictly prohibited inside to preserve the sanctity. The temples are surrounded by lush green hills, adding to their serene atmosphere. They are considered among the finest examples of temple architecture in India.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  true,
  '24.6000',
  '72.7167'
),

-- 2. Nakki Lake
(
  'Nakki Lake',
  'nakki-lake',
  'place',
  (SELECT id FROM locations WHERE slug = 'mount-abu'),
  (SELECT path || '/nakki-lake' FROM locations WHERE slug = 'mount-abu'),
  'Nakki Lake is a picturesque artificial lake situated in the heart of Mount Abu at an altitude of 1,200 meters. According to legend, the lake was dug out by gods using their nails (nakh), hence the name Nakki. This serene lake is surrounded by hills and peculiar rock formations, creating a romantic and peaceful atmosphere. Boating on the lake is a popular activity, with paddle boats and rowboats available for hire. The lake is surrounded by a well-maintained promenade perfect for evening walks. The Raghunath Temple and Toad Rock are located nearby, adding to the scenic beauty. During sunset, the lake reflects the golden hues of the sky, creating a magical ambiance. The area around the lake has numerous food stalls and shops selling local handicrafts. The lake is believed to be sacred and holds religious significance for locals. It''s the perfect spot for relaxation and enjoying the cool mountain breeze.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  true,
  '24.5926',
  '72.7156'
),

-- 3. Guru Shikhar
(
  'Guru Shikhar',
  'guru-shikhar',
  'place',
  (SELECT id FROM locations WHERE slug = 'mount-abu'),
  (SELECT path || '/guru-shikhar' FROM locations WHERE slug = 'mount-abu'),
  'Guru Shikhar is the highest peak in the Aravalli Range, standing at 1,722 meters above sea level, and offers breathtaking panoramic views of Mount Abu and the surrounding landscape. The peak is named after Guru Dattatreya, an incarnation of Lord Vishnu, and houses a temple dedicated to him at the summit. The journey to the top involves climbing approximately 300 steps, but the spectacular views make it worthwhile. On clear days, visitors can see as far as the Gujarat plains. The temple complex includes a bell that visitors ring after reaching the summit. The area is surrounded by dense forests and offers a cool, refreshing climate even during summer. The peak is especially beautiful during sunrise and sunset when the sky is painted in vibrant colors. There''s also an observatory near the peak. The site attracts both pilgrims and nature lovers. It''s a must-visit for anyone seeking spiritual solace and natural beauty.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  true,
  '24.6500',
  '72.7833'
),

-- 4. Sunset Point
(
  'Sunset Point',
  'sunset-point',
  'place',
  (SELECT id FROM locations WHERE slug = 'mount-abu'),
  (SELECT path || '/sunset-point' FROM locations WHERE slug = 'mount-abu'),
  'Sunset Point is one of the most popular viewpoints in Mount Abu, offering spectacular views of the sun setting over the Aravalli hills. Located about 2 kilometers from Nakki Lake, this spot attracts hundreds of visitors every evening who gather to witness the mesmerizing sunset. The point provides a panoramic view of the surrounding valleys, hills, and the town of Mount Abu. As the sun descends, the sky transforms into a canvas of orange, pink, and purple hues, creating a magical atmosphere. The area has several viewing platforms and seating arrangements for comfortable viewing. Local vendors sell snacks, tea, and souvenirs, adding to the lively atmosphere. The cool mountain breeze and the stunning natural beauty make it a perfect romantic spot. Photographers love capturing the changing colors of the sky and landscape. The point is accessible by road and a short walk. It''s advisable to reach early during peak season to secure a good viewing spot.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '24.5833',
  '72.7000'
),

-- 5. Toad Rock
(
  'Toad Rock',
  'toad-rock',
  'place',
  (SELECT id FROM locations WHERE slug = 'mount-abu'),
  (SELECT path || '/toad-rock' FROM locations WHERE slug = 'mount-abu'),
  'Toad Rock is a unique rock formation near Nakki Lake that resembles a toad about to jump into the lake. This natural wonder has become one of Mount Abu''s most photographed landmarks due to its peculiar shape and prominent location. The rock is easily accessible and offers excellent views of Nakki Lake and the surrounding hills. According to local legend, the rock was once a toad that was turned to stone. The area around Toad Rock is perfect for rock climbing and adventure activities. Many visitors enjoy climbing to the top of the rock for panoramic views and photo opportunities. The rock is especially beautiful during sunset when it casts interesting shadows. The surrounding area has well-maintained pathways and gardens. It''s a popular spot for families and nature enthusiasts. The rock formation is a testament to the fascinating geological history of the Aravalli Range. Nearby, there are several other interesting rock formations worth exploring.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '24.5917',
  '72.7167'
),

-- 6. Achalgarh Fort
(
  'Achalgarh Fort',
  'achalgarh-fort',
  'place',
  (SELECT id FROM locations WHERE slug = 'mount-abu'),
  (SELECT path || '/achalgarh-fort' FROM locations WHERE slug = 'mount-abu'),
  'Achalgarh Fort is a historic fort located about 11 kilometers from Mount Abu, built in the 14th century by Rana Kumbha of Mewar. The fort stands majestically on a hilltop and offers stunning views of the surrounding landscape. Within the fort complex lies the famous Achaleshwar Mahadev Temple, dedicated to Lord Shiva, which features a brass Nandi (bull) weighing 5 tons. The temple is built around a natural rock formation believed to be Shiva''s toe. The fort also houses three stone buffaloes standing around a pond, which according to legend, were demons turned to stone. The fort''s architecture showcases typical Rajput military design with strong walls and strategic positioning. The area is surrounded by dense forests and offers a peaceful atmosphere. The fort provides insights into the region''s rich history and religious significance. The panoramic views from the fort are breathtaking, especially during sunrise and sunset. It''s a perfect blend of history, spirituality, and natural beauty.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '24.6333',
  '72.7500'
),

-- 7. Honeymoon Point
(
  'Honeymoon Point',
  'honeymoon-point',
  'place',
  (SELECT id FROM locations WHERE slug = 'mount-abu'),
  (SELECT path || '/honeymoon-point' FROM locations WHERE slug = 'mount-abu'),
  'Honeymoon Point, also known as Anadara Point, is a popular viewpoint offering breathtaking views of the valleys and hills of Mount Abu. Located close to Nakki Lake, this romantic spot is especially popular among newlyweds and couples, hence the name. The point provides panoramic views of the lush green valleys, rocky terrain, and distant plains. During sunset, the entire landscape is bathed in golden light, creating a magical romantic atmosphere. The area has well-maintained viewing platforms and seating arrangements. Local vendors sell refreshments and souvenirs. The cool mountain breeze and serene environment make it perfect for spending quality time with loved ones. The point is easily accessible by road and a short walk. It''s less crowded than Sunset Point, offering a more intimate experience. The natural beauty and peaceful ambiance make it ideal for photography and relaxation. Many couples visit this spot to create lasting memories against the backdrop of stunning natural scenery.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '24.5833',
  '72.6833'
),

-- 8. Arbuda Devi Temple
(
  'Arbuda Devi Temple',
  'arbuda-devi-temple',
  'place',
  (SELECT id FROM locations WHERE slug = 'mount-abu'),
  (SELECT path || '/arbuda-devi-temple' FROM locations WHERE slug = 'mount-abu'),
  'Arbuda Devi Temple is an ancient cave temple dedicated to Goddess Arbuda, the presiding deity of Mount Abu, located near Adhar Devi. The temple is carved out of solid rock and requires climbing approximately 365 steps to reach. The goddess is believed to be a form of Goddess Parvati who saved the life of Nandi, Lord Shiva''s bull. The temple''s unique feature is that devotees have to bow their heads while entering due to the low cave entrance, symbolizing humility before the divine. The cave temple has a mystical atmosphere with natural rock formations and ancient carvings. The climb to the temple offers beautiful views of the surrounding hills and valleys. The temple is an important pilgrimage site and attracts devotees throughout the year. The spiritual energy and peaceful environment make it perfect for meditation and prayer. The temple complex is well-maintained and has facilities for devotees. It''s believed that visiting this temple fulfills wishes and brings blessings.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '24.6167',
  '72.7333'
),

-- 9. Mount Abu Wildlife Sanctuary
(
  'Mount Abu Wildlife Sanctuary',
  'mount-abu-wildlife-sanctuary',
  'place',
  (SELECT id FROM locations WHERE slug = 'mount-abu'),
  (SELECT path || '/mount-abu-wildlife-sanctuary' FROM locations WHERE slug = 'mount-abu'),
  'Mount Abu Wildlife Sanctuary is a biodiversity hotspot spread over 288 square kilometers, home to a rich variety of flora and fauna. The sanctuary is known for its subtropical forests, rocky terrain, and diverse wildlife including leopards, sloth bears, wild boars, sambars, and numerous bird species. The sanctuary is a paradise for bird watchers with over 250 species of birds including the rare Grey Jungle Fowl. The lush green forests are home to various medicinal plants and herbs. Trekking trails through the sanctuary offer opportunities to explore the natural beauty and spot wildlife. The sanctuary plays a crucial role in conserving the unique ecosystem of the Aravalli Range. The cool climate and dense vegetation provide a refreshing escape from the desert heat of Rajasthan. The best time to visit is during early morning or late afternoon when animals are most active. Guided nature walks and jeep safaris are available for visitors. The sanctuary is a must-visit for nature lovers and wildlife enthusiasts.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '24.6000',
  '72.7000'
),

-- 10. Peace Park
(
  'Peace Park',
  'peace-park',
  'place',
  (SELECT id FROM locations WHERE slug = 'mount-abu'),
  (SELECT path || '/peace-park' FROM locations WHERE slug = 'mount-abu'),
  'Peace Park is a beautifully landscaped garden located near the Brahma Kumaris World Spiritual University headquarters in Mount Abu. The park is designed to promote peace, meditation, and spiritual reflection with its serene environment and thoughtful layout. The park features well-maintained lawns, colorful flower beds, walking paths, and meditation spots. Various sculptures and installations throughout the park convey messages of peace, unity, and spiritual awakening. The park''s tranquil atmosphere makes it perfect for morning walks, yoga, and meditation. Benches are strategically placed for visitors to sit and enjoy the peaceful surroundings. The park is maintained by the Brahma Kumaris organization and reflects their philosophy of inner peace and harmony. The lush greenery and cool mountain air create a refreshing environment. The park is especially beautiful during spring when flowers are in full bloom. It''s a perfect place for families, spiritual seekers, and anyone looking to escape the hustle and bustle of daily life.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '24.5833',
  '72.7167'
);
