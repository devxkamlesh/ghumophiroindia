-- ============================================
-- INSERT RAJASTHAN PLACES INTO DATABASE
-- ============================================
-- Run this in Supabase SQL Editor after creating tables
-- Total: 60+ tourist places across Rajasthan

-- ============================================
-- JAIPUR PLACES (Pink City)
-- ============================================

INSERT INTO locations (name, slug, type, parent_id, path, description, image, is_popular, lat, lng)
VALUES
(
  'Hawa Mahal',
  'hawa-mahal',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaipur' AND type = 'city'),
  'india/rajasthan/jaipur/hawa-mahal',
  'The Palace of Winds, Hawa Mahal is an iconic five-story pink sandstone palace built in 1799 by Maharaja Sawai Pratap Singh. This architectural marvel features 953 small windows called jharokhas, designed to allow royal ladies to observe street festivals while remaining unseen. The unique honeycomb structure with its intricate latticework is a masterpiece of Rajput architecture blended with Mughal influences. The palace stands as a symbol of Jaipur''s rich heritage and offers stunning views of the city from its upper floors.',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
  true,
  26.9239,
  75.8267
),
(
  'Amber Fort',
  'amber-fort',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaipur' AND type = 'city'),
  'india/rajasthan/jaipur/amber-fort',
  'Perched majestically on a hilltop, Amber Fort is a magnificent blend of Hindu and Mughal architecture built in 1592 by Raja Man Singh I. This UNESCO World Heritage Site showcases stunning courtyards, palaces, and halls adorned with precious stones and intricate mirror work. The Sheesh Mahal (Mirror Palace) is particularly famous for its thousands of tiny mirrors that create a magical effect. Visitors can enjoy elephant rides up the fort, explore the beautiful Diwan-i-Aam and Diwan-i-Khas, and witness the spectacular light and sound show that brings the fort''s history to life.',
  'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800',
  true,
  26.9855,
  75.8513
),
(
  'City Palace Jaipur',
  'city-palace-jaipur',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaipur' AND type = 'city'),
  'india/rajasthan/jaipur/city-palace-jaipur',
  'The City Palace of Jaipur is a magnificent complex of courtyards, gardens, and buildings that served as the royal residence. Built by Maharaja Sawai Jai Singh II between 1729-1732, this architectural masterpiece combines Rajasthani, Mughal, and European styles. The palace houses museums displaying royal costumes, weapons, manuscripts, and artifacts. The Chandra Mahal, still home to the royal family, features seven stories with stunning views. The Mubarak Mahal showcases textile collections, while the Diwan-i-Khas displays the world''s largest silver vessels.',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
  true,
  26.9258,
  75.8237
),
(
  'Jal Mahal',
  'jal-mahal',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaipur' AND type = 'city'),
  'india/rajasthan/jaipur/jal-mahal',
  'The Water Palace, Jal Mahal, is an architectural wonder floating serenely in the middle of Man Sagar Lake. Built in the 18th century by Maharaja Madho Singh I, this five-story palace appears to float on water with four floors submerged. The red sandstone structure showcases Rajput and Mughal architectural styles with beautiful arched roofs and painted stucco work. Though entry inside is restricted, the palace offers spectacular photo opportunities, especially during sunset when it reflects beautifully in the lake waters. The surrounding Aravalli hills create a picturesque backdrop.',
  'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800',
  true,
  26.9531,
  75.8458
),
(
  'Nahargarh Fort',
  'nahargarh-fort',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaipur' AND type = 'city'),
  'india/rajasthan/jaipur/nahargarh-fort',
  'Nahargarh Fort, meaning "abode of tigers," stands proudly on the Aravalli Hills overlooking Jaipur city. Built in 1734 by Maharaja Sawai Jai Singh II, this fort was part of the city''s defense ring. The fort features stunning architecture with extended walls connecting it to Jaigarh Fort. The Madhavendra Bhawan inside has beautiful frescoes and suites built for the king and his queens. The fort offers panoramic views of Jaipur, especially breathtaking during sunset. It has also been a popular filming location for Bollywood movies.',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
  true,
  26.9369,
  75.8153
),
(
  'Jaigarh Fort',
  'jaigarh-fort',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaipur' AND type = 'city'),
  'india/rajasthan/jaipur/jaigarh-fort',
  'Jaigarh Fort, also known as the "Fort of Victory," is a majestic military structure built in 1726 by Maharaja Sawai Jai Singh II. Perched on the Cheel ka Teela (Hill of Eagles), it houses the world''s largest cannon on wheels, Jaivana. The fort features impressive architecture with massive walls, watchtowers, and underground passages. It was built to protect Amber Fort and the city palace. The fort complex includes palaces, gardens, temples, and a museum displaying artifacts and weapons. The panoramic views of Jaipur and surrounding Aravalli hills are spectacular.',
  'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800',
  true,
  26.9854,
  75.8515
),
(
  'Albert Hall Museum',
  'albert-hall-museum',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaipur' AND type = 'city'),
  'india/rajasthan/jaipur/albert-hall-museum',
  'The Albert Hall Museum, also known as the Government Central Museum, is the oldest museum in Rajasthan. Built in 1876 and designed by Sir Samuel Swinton Jacob, this Indo-Saracenic architectural marvel houses an extensive collection of artifacts including paintings, jewelry, carpets, ivory, stone, metal sculptures, and colorful crystal works. The museum is famous for its Egyptian mummy and miniature paintings. The building itself is a work of art with beautiful arches, courtyards, and intricate decorations. At night, the illuminated museum creates a magical ambiance in Ram Niwas Garden.',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
  true,
  26.9124,
  75.8187
),
(
  'Jantar Mantar',
  'jantar-mantar',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaipur' AND type = 'city'),
  'india/rajasthan/jaipur/jantar-mantar',
  'Jantar Mantar is a UNESCO World Heritage Site and an astronomical marvel built by Maharaja Sawai Jai Singh II in 1734. This collection of 19 architectural astronomical instruments is the largest of its kind in the world. The Samrat Yantra, a giant sundial, can measure time to an accuracy of two seconds. Other instruments include the Jai Prakash Yantra, Ram Yantra, and Chakra Yantra, each designed for specific astronomical calculations. The site demonstrates the scientific acumen and astronomical skills of medieval India and continues to fascinate visitors with its precision and ingenuity.',
  'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800',
  true,
  26.9247,
  75.8249
),
(
  'Birla Mandir',
  'birla-mandir-jaipur',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaipur' AND type = 'city'),
  'india/rajasthan/jaipur/birla-mandir-jaipur',
  'Birla Mandir, also known as Laxmi Narayan Temple, is a magnificent white marble temple built by the Birla family in 1988. Dedicated to Lord Vishnu and Goddess Laxmi, this modern architectural wonder showcases intricate carvings depicting scenes from Hindu mythology and scriptures. The temple''s three domes represent different approaches to religion. Built entirely of white marble, the temple glows beautifully at night when illuminated. The peaceful atmosphere, beautiful gardens, and panoramic views of Jaipur make it a popular spiritual and tourist destination.',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
  true,
  26.8952,
  75.8007
),
(
  'Patrika Gate',
  'patrika-gate',
  'place',
  (SELECT id FROM locations WHERE slug = 'jaipur' AND type = 'city'),
  'india/rajasthan/jaipur/patrika-gate',
  'Patrika Gate is Jaipur''s newest and most Instagram-worthy attraction, a stunning architectural marvel built in 2016. This nine-story gateway features intricate Rajasthani artwork, vibrant frescoes, and detailed paintings depicting the history and culture of Rajasthan. The gate showcases traditional Rajput and Mughal architectural styles with colorful arches adorned with beautiful murals. Each arch tells a different story through its artwork. The gate has become a popular spot for photography enthusiasts and tourists, especially during golden hour when the colors come alive.',
  'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800',
  true,
  26.8523,
  75.6963
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- UDAIPUR PLACES (City of Lakes)
-- ============================================

INSERT INTO locations (name, slug, type, parent_id, path, description, image, is_popular, lat, lng)
VALUES
(
  'City Palace Udaipur',
  'city-palace-udaipur',
  'place',
  (SELECT id FROM locations WHERE slug = 'udaipur' AND type = 'city'),
  'india/rajasthan/udaipur/city-palace-udaipur',
  'The City Palace of Udaipur is a majestic architectural marvel overlooking Lake Pichola, built over 400 years by successive Maharanas. This sprawling complex is a fusion of Rajasthani, Mughal, Medieval, European, and Chinese architecture. The palace features ornate peacock mosaics, intricate mirror work, marble work, and beautiful murals. It houses museums displaying royal artifacts, miniature paintings, and crystal galleries. The Mor Chowk (Peacock Courtyard) with its stunning peacock mosaics is particularly famous. The palace offers breathtaking views of the lake and surrounding city.',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
  true,
  24.5761,
  73.6833
),
(
  'Lake Pichola',
  'lake-pichola',
  'place',
  (SELECT id FROM locations WHERE slug = 'udaipur' AND type = 'city'),
  'india/rajasthan/udaipur/lake-pichola',
  'Lake Pichola is an artificial freshwater lake created in 1362 AD, named after the nearby Picholi village. This picturesque lake is the heart of Udaipur, surrounded by hills, palaces, temples, and ghats. The lake features two beautiful island palaces - Jag Niwas (Lake Palace) and Jag Mandir. Boat rides on the lake offer stunning views of the City Palace, Jag Mandir, and the surrounding Aravalli hills. The sunset views from the lake are spectacular, with the golden light reflecting off the white marble palaces. The lake is also home to various bird species.',
  'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800',
  true,
  24.5761,
  73.6811
),
(
  'Fateh Sagar Lake',
  'fateh-sagar-lake',
  'place',
  (SELECT id FROM locations WHERE slug = 'udaipur' AND type = 'city'),
  'india/rajasthan/udaipur/fateh-sagar-lake',
  'Fateh Sagar Lake is an artificial lake built in 1678 by Maharana Jai Singh and later reconstructed by Maharana Fateh Singh. This beautiful lake is surrounded by the Aravalli hills and features three islands - Nehru Park, a public park with boat-shaped restaurant; a solar observatory; and a water jet fountain. The lake is a popular spot for boating, picnics, and enjoying sunset views. The promenade along the lake offers stunning views and is perfect for evening walks. The lake also serves as an important water source for Udaipur.',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
  true,
  24.5926,
  73.6781
),
(
  'Jag Mandir',
  'jag-mandir',
  'place',
  (SELECT id FROM locations WHERE slug = 'udaipur' AND type = 'city'),
  'india/rajasthan/udaipur/jag-mandir',
  'Jag Mandir is a magnificent palace built on an island in Lake Pichola, constructed between 1551-1652. Also known as the "Lake Garden Palace," it features beautiful gardens, courtyards, and pavilions made of yellow sandstone and marble. The palace is famous for its Gul Mahal, where Prince Khurram (later Emperor Shah Jahan) took refuge in 1623. The palace showcases exquisite marble elephants at its entrance and intricate carvings throughout. It offers stunning views of the City Palace and Lake Pichola. The palace is now a popular venue for events and weddings.',
  'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800',
  true,
  24.5717,
  73.6797
),
(
  'Saheliyon Ki Bari',
  'saheliyon-ki-bari',
  'place',
  (SELECT id FROM locations WHERE slug = 'udaipur' AND type = 'city'),
  'india/rajasthan/udaipur/saheliyon-ki-bari',
  'Saheliyon Ki Bari, meaning "Garden of the Maidens," is a beautiful ornamental garden built by Maharana Sangram Singh II in the 18th century for the royal ladies. This lush garden features fountains, kiosks, marble elephants, and a lotus pool. The garden is famous for its rain fountains that work without pumps, using only water pressure. The black and white marble pavilions, beautiful lotus pools, and well-maintained lawns create a peaceful atmosphere. The garden also houses a small museum displaying royal artifacts and provides a perfect escape from the city''s hustle.',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
  true,
  24.5926,
  73.7081
),
(
  'Bagore Ki Haveli',
  'bagore-ki-haveli',
  'place',
  (SELECT id FROM locations WHERE slug = 'udaipur' AND type = 'city'),
  'india/rajasthan/udaipur/bagore-ki-haveli',
  'Bagore Ki Haveli is an 18th-century haveli built by Amir Chand Badwa, the Prime Minister of Mewar. Located on the waterfront of Lake Pichola, this 138-room haveli has been converted into a museum showcasing royal artifacts, costumes, modern art, and Mewar paintings. The haveli features beautiful courtyards, balconies with intricate designs, and stunning views of the lake. The evening cultural show "Dharohar" presents traditional Rajasthani folk dances, puppet shows, and music, making it a must-visit attraction for experiencing local culture.',
  'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800',
  true,
  24.5797,
  73.6811
)
ON CONFLICT (slug) DO NOTHING;
