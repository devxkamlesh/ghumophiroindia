-- Insert Jaisalmer Places (7 places)
-- Run this in Supabase SQL Editor after cities are created

INSERT INTO locations (name, slug, type, parent_id, path, description, image, is_popular, lat, lng)
VALUES

-- 1. Jaisalmer Fort
(
  'Jaisalmer Fort',
  'jaisalmer-fort',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaisalmer'),
  (SELECT path || '/jaisalmer-fort' FROM locations WHERE slug = 'jaisalmer'),
  'Jaisalmer Fort, also known as Sonar Quila or the Golden Fort, is one of the largest fully preserved fortified cities in the world. Built in 1156 AD by Rajput ruler Rawal Jaisal, this magnificent yellow sandstone fortress rises from the Thar Desert like a golden mirage. Unlike most forts in India, Jaisalmer Fort is a living fort with nearly one-fourth of the old city''s population residing within its walls. The fort houses five palaces, several ornate Jain temples dating from the 12th to 16th centuries, and numerous havelis with intricate carvings. The narrow winding lanes, ancient houses, temples, and shops create a medieval atmosphere. As the sun sets, the fort''s golden-yellow sandstone walls glow magnificently, earning it the nickname "Golden Fort." The fort offers panoramic views of the city and surrounding desert. It''s a UNESCO World Heritage Site and represents the finest example of Rajput military architecture.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  true,
  '26.9124',
  '70.9083'
),

-- 2. Sam Sand Dunes
(
  'Sam Sand Dunes',
  'sam-sand-dunes',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaisalmer'),
  (SELECT path || '/sam-sand-dunes' FROM locations WHERE slug = 'jaisalmer'),
  'Sam Sand Dunes, located 40 kilometers from Jaisalmer city, offers the quintessential Thar Desert experience with its vast stretches of golden sand dunes. This is the most popular spot for experiencing desert life, camel safaris, and witnessing spectacular sunsets over the undulating dunes. The dunes rise up to 30-60 meters high and create a mesmerizing landscape that changes with the shifting sands and sunlight. Visitors can enjoy camel rides, jeep safaris, and overnight camping under the star-studded desert sky. The area comes alive in the evening with cultural programs featuring traditional Rajasthani folk music and dance performances, including the famous Kalbeliya dance. Desert camps offer authentic Rajasthani cuisine and comfortable accommodation in Swiss tents. The experience of watching the sunrise or sunset from atop a sand dune is truly magical. Adventure enthusiasts can try dune bashing and parasailing. The best time to visit is between October and March when the weather is pleasant.',
  'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80&fit=crop',
  true,
  '26.9030',
  '70.7494'
),

-- 3. Patwon Ki Haveli
(
  'Patwon Ki Haveli',
  'patwon-ki-haveli',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaisalmer'),
  (SELECT path || '/patwon-ki-haveli' FROM locations WHERE slug = 'jaisalmer'),
  'Patwon Ki Haveli is the largest and most elaborate haveli in Jaisalmer, consisting of five separate havelis built by a wealthy trader family between 1800 and 1860. This architectural masterpiece showcases the finest example of Jaisalmer''s haveli architecture with its intricate yellow sandstone carvings, ornate balconies, and beautifully painted walls. Each haveli has its own courtyard and is adorned with exquisite mirror work, miniature paintings, and detailed stonework. The facade features over 60 balconies with intricate lattice work that allowed women to observe street activities while maintaining privacy. The havelis now house a museum displaying artifacts, textiles, and furniture from the bygone era. The craftsmanship displayed in the jharokhas (overhanging enclosed balconies), gateways, and archways is simply breathtaking. The haveli offers insights into the opulent lifestyle of wealthy merchants during the 19th century. It''s a photographer''s paradise, especially during golden hour when the sandstone glows magnificently.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '26.9158',
  '70.9119'
),

-- 4. Gadisar Lake
(
  'Gadisar Lake',
  'gadisar-lake',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaisalmer'),
  (SELECT path || '/gadisar-lake' FROM locations WHERE slug = 'jaisalmer'),
  'Gadisar Lake is a historic man-made reservoir built in 1400 AD by Maharaja Gadsi Singh to provide water to the arid city of Jaisalmer. This scenic lake is surrounded by numerous temples, shrines, and ghats, creating a serene and picturesque setting. The ornate entrance gateway, Tilon Ki Pol, built by a courtesan named Tilon, is an architectural marvel with intricate carvings. The lake attracts numerous migratory birds during winter, making it a paradise for bird watchers and nature photographers. Visitors can enjoy peaceful boat rides while admiring the golden sandstone structures reflected in the calm waters. The lake is especially beautiful during sunrise and sunset when the surrounding temples and chattris (cenotaphs) are bathed in golden light. Small temples and shrines dot the banks, and the peaceful atmosphere provides a welcome respite from the desert heat. The lake area is perfect for morning walks and evening strolls. It''s an important water conservation heritage site that showcases ancient water management systems.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '26.9077',
  '70.9140'
),

-- 5. Kuldhara Village
(
  'Kuldhara Village',
  'kuldhara-village',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaisalmer'),
  (SELECT path || '/kuldhara-village' FROM locations WHERE slug = 'jaisalmer'),
  'Kuldhara is an abandoned village located 18 kilometers from Jaisalmer, shrouded in mystery and legends. Established in the 13th century by Paliwal Brahmins, this prosperous village was mysteriously abandoned overnight in 1825 along with 84 neighboring villages. According to legend, the villagers left to escape the tyranny of a local minister and cursed the land so that no one could ever settle there again. The ruins of the village, with its well-planned streets, houses, and temples, offer a haunting glimpse into the past. The village showcases advanced urban planning with a sophisticated water conservation system. Archaeological surveys have revealed the high level of civilization that once thrived here. The site has an eerie, ghostly atmosphere, especially during sunset. It''s now protected by the Archaeological Survey of India and has become a popular tourist destination. The village is said to be haunted, adding to its mystique. Visitors can explore the ruins and imagine life in this once-thriving community.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '26.7833',
  '70.7667'
),

-- 6. Tanot Mata Temple
(
  'Tanot Mata Temple',
  'tanot-mata-temple',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaisalmer'),
  (SELECT path || '/tanot-mata-temple' FROM locations WHERE slug = 'jaisalmer'),
  'Tanot Mata Temple is a historic temple located near the India-Pakistan border, about 120 kilometers from Jaisalmer. The temple gained fame during the 1965 Indo-Pak war when Pakistani bombs fell around it but miraculously failed to explode, leaving the temple unscathed. This miracle strengthened the faith of soldiers and locals in the protective powers of Tanot Mata. The temple is now maintained by the Border Security Force (BSF) and has become a symbol of faith and patriotism. Visitors can see the unexploded bombs displayed in the temple museum. The temple attracts devotees and tourists who come to seek blessings and witness this miracle site. The journey to the temple takes you through the stark beauty of the Thar Desert and offers glimpses of military installations. The temple complex is simple yet spiritually powerful. BSF personnel conduct daily prayers and maintain the temple with great devotion. The temple represents the perfect blend of faith, history, and military valor.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '27.0167',
  '71.0833'
),

-- 7. Longewala Border
(
  'Longewala Border',
  'longewala-border',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaisalmer'),
  (SELECT path || '/longewala-border' FROM locations WHERE slug = 'jaisalmer'),
  'Longewala is a historic battle site located on the India-Pakistan border, famous for the Battle of Longewala during the 1971 Indo-Pak war. A small contingent of 120 Indian soldiers successfully defended their post against a massive Pakistani attack involving 2,000 soldiers and 45 tanks. This heroic defense became legendary and was immortalized in the Bollywood film "Border." The site now features a war memorial maintained by the Indian Army, displaying captured Pakistani tanks and military equipment. Visitors can see the actual bunkers and trenches used during the battle. The memorial museum showcases photographs, weapons, and artifacts from the war. The vast desert landscape adds to the dramatic atmosphere of this historic site. It''s a place of national pride and pays tribute to the bravery of Indian soldiers. The site is located about 120 kilometers from Jaisalmer and requires permission from the BSF to visit. It''s a must-visit for history enthusiasts and patriots.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '27.0833',
  '71.0833'
);
