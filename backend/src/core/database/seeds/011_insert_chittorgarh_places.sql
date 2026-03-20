-- Insert Chittorgarh Places (10 places)
-- Run this in Supabase SQL Editor after cities are created

INSERT INTO locations (name, slug, type, parent_id, path, description, image, is_popular, lat, lng)
VALUES

-- 1. Chittorgarh Fort
(
  'Chittorgarh Fort',
  'chittorgarh-fort',
  'place',
  (SELECT id FROM locations WHERE slug = 'chittorgarh'),
  (SELECT path || '/chittorgarh-fort' FROM locations WHERE slug = 'chittorgarh'),
  'Chittorgarh Fort is the largest fort in India and a UNESCO World Heritage Site, sprawling over 700 acres atop a 180-meter high hill. Built in the 7th century by the Mauryan dynasty, the fort has witnessed three major sieges and is a symbol of Rajput valor and sacrifice. The fort complex contains 65 historic structures including palaces, temples, towers, and reservoirs. The fort is famous for the legendary acts of jauhar (self-immolation) performed by Rajput women to protect their honor during sieges. The fort''s massive walls stretch 13 kilometers and have seven impressive gates. The fort offers panoramic views of the surrounding countryside and the city below. It takes a full day to explore all the monuments within the fort. The fort represents the epitome of Rajput architecture and military engineering. The stories of Rani Padmini, Rana Kumbha, and other legendary figures are deeply associated with this fort. It''s a must-visit for anyone interested in Indian history and Rajput culture.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  true,
  '24.8829',
  '74.6230'
),

-- 2. Vijay Stambh (Victory Tower)
(
  'Vijay Stambh',
  'vijay-stambh',
  'place',
  (SELECT id FROM locations WHERE slug = 'chittorgarh'),
  (SELECT path || '/vijay-stambh' FROM locations WHERE slug = 'chittorgarh'),
  'Vijay Stambh, or the Tower of Victory, is a magnificent 37-meter high nine-story tower built by Maharana Kumbha in 1448 to commemorate his victory over Mahmud Khilji of Malwa. This architectural masterpiece is adorned with intricate carvings depicting Hindu deities, weapons, and scenes from Hindu epics like Ramayana and Mahabharata. The tower has 157 narrow steps leading to the top, offering breathtaking views of the fort and surrounding landscape. Each story features beautifully carved balconies and windows. The tower is dedicated to Lord Vishnu and showcases sculptures of various Hindu gods and goddesses. The craftsmanship displayed in the carvings is exceptional, with every inch of the tower decorated with detailed artwork. The tower stands as a symbol of Rajput military prowess and artistic excellence. It''s illuminated in the evening, creating a spectacular sight. The tower is considered one of the finest examples of medieval Indian architecture. Climbing to the top is a rewarding experience for visitors.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  true,
  '24.8829',
  '74.6230'
),

-- 3. Kirti Stambh (Tower of Fame)
(
  'Kirti Stambh',
  'kirti-stambh',
  'place',
  (SELECT id FROM locations WHERE slug = 'chittorgarh'),
  (SELECT path || '/kirti-stambh' FROM locations WHERE slug = 'chittorgarh'),
  'Kirti Stambh, or the Tower of Fame, is a 22-meter high seven-story tower built in the 12th century by a Jain merchant named Jeeja Bhagerwala, dedicated to Adinath, the first Jain Tirthankara. This tower predates the Vijay Stambh and is an excellent example of Jain architecture. The tower is adorned with intricate carvings of Jain Tirthankaras and detailed sculptures depicting Jain mythology. The narrow staircase inside leads to the top, offering beautiful views of the fort complex. The tower showcases the religious tolerance and cultural diversity of medieval Rajasthan. The carvings are remarkably well-preserved despite being over 800 years old. The tower''s architecture demonstrates the advanced engineering skills of medieval Indian craftsmen. Each story features beautifully carved figures of Digambar Jain Tirthankaras. The tower is an important pilgrimage site for Jains. It stands as a testament to the patronage of Jainism by Rajput rulers and the artistic excellence of Jain temple architecture.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '24.8829',
  '74.6230'
),

-- 4. Padmini Palace
(
  'Padmini Palace',
  'padmini-palace',
  'place',
  (SELECT id FROM locations WHERE slug = 'chittorgarh'),
  (SELECT path || '/padmini-palace' FROM locations WHERE slug = 'chittorgarh'),
  'Padmini Palace is a beautiful three-story palace situated in the middle of a lotus pool, associated with the legendary beauty Queen Padmini whose story is central to Chittorgarh''s history. According to legend, Alauddin Khilji saw Padmini''s reflection in a mirror placed in the palace and became obsessed with her, leading to the siege of Chittorgarh. The palace showcases typical Rajput architecture with pavilions, balconies, and beautiful water channels. The palace is surrounded by water on all sides, creating a serene and romantic atmosphere. The reflection of the palace in the water creates picture-perfect moments. The palace complex includes beautiful gardens and walkways. Though much of the original structure has been damaged over centuries, the remaining portions still showcase the architectural brilliance. The palace offers insights into the royal lifestyle and the tragic tale of Rani Padmini. The story of Padmini''s jauhar (self-immolation) to protect her honor is deeply moving. The palace is a must-visit for understanding Rajput values of honor and sacrifice.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  true,
  '24.8829',
  '74.6230'
),

-- 5. Rana Kumbha Palace
(
  'Rana Kumbha Palace',
  'rana-kumbha-palace',
  'place',
  (SELECT id FROM locations WHERE slug = 'chittorgarh'),
  (SELECT path || '/rana-kumbha-palace' FROM locations WHERE slug = 'chittorgarh'),
  'Rana Kumbha Palace is the oldest structure in Chittorgarh Fort, built in the 15th century by Maharana Kumbha, one of the greatest rulers of Mewar. This massive palace complex once served as the residence of the royal family and administrative center of the kingdom. The palace is historically significant as the birthplace of Maharana Udai Singh, the founder of Udaipur. The palace complex includes underground cellars where Rani Padmini and other royal women performed jauhar during Alauddin Khilji''s siege. The palace showcases typical Rajput architecture with courtyards, balconies, and residential quarters. Though now in ruins, the palace still conveys the grandeur of its past. The palace walls bear witness to centuries of history, battles, and royal ceremonies. The Shiva temple within the palace complex is still active. The palace offers a haunting glimpse into the tragic history of Chittorgarh. Exploring the palace ruins evokes a sense of the glory and tragedy that defined Rajput history.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '24.8829',
  '74.6230'
),

-- 6. Gaumukh Reservoir
(
  'Gaumukh Reservoir',
  'gaumukh-reservoir',
  'place',
  (SELECT id FROM locations WHERE slug = 'chittorgarh'),
  (SELECT path || '/gaumukh-reservoir' FROM locations WHERE slug = 'chittorgarh'),
  'Gaumukh Reservoir is a sacred water tank within Chittorgarh Fort, named after the cow-mouth shaped spring from which water flows into the reservoir. The reservoir is fed by a natural spring that emerges from a rock carved in the shape of a cow''s mouth (gaumukh). The water is considered holy and is used for religious ceremonies. The reservoir is surrounded by beautiful architecture including temples and pavilions. The constant flow of water from the rock formation is considered miraculous by devotees. The reservoir played a crucial role in providing water to the fort during sieges. The area around the reservoir is peaceful and perfect for meditation. The reservoir is associated with various legends and religious beliefs. The engineering marvel of the ancient water management system is impressive. The reservoir demonstrates the importance of water conservation in medieval fort architecture. The site offers a serene atmosphere amidst the historical grandeur of the fort. It''s a perfect spot for understanding the practical and spiritual aspects of fort life.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '24.8829',
  '74.6230'
),

-- 7. Meera Temple
(
  'Meera Temple',
  'meera-temple',
  'place',
  (SELECT id FROM locations WHERE slug = 'chittorgarh'),
  (SELECT path || '/meera-temple' FROM locations WHERE slug = 'chittorgarh'),
  'Meera Temple is dedicated to the legendary 16th-century saint-poetess Meerabai, who was a Rajput princess and devoted follower of Lord Krishna. The temple is built in the Indo-Aryan architectural style with beautiful carvings and sculptures. Meerabai spent much of her life in Chittorgarh, composing devotional songs (bhajans) dedicated to Lord Krishna. The temple showcases her life story through paintings and inscriptions. The temple''s sanctum houses an idol of Lord Krishna. The temple is an important pilgrimage site for devotees of Krishna and admirers of Meerabai''s poetry. The temple complex includes a small museum displaying artifacts related to Meerabai''s life. The temple has a peaceful atmosphere conducive to devotion and meditation. Meerabai''s bhajans are still sung in the temple, creating a spiritual ambiance. The temple represents the bhakti (devotional) tradition of Hinduism. Meerabai''s story of unwavering devotion despite opposition from her royal family inspires millions. The temple is a must-visit for understanding the spiritual heritage of Rajasthan.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '24.8829',
  '74.6230'
),

-- 8. Kalika Mata Temple
(
  'Kalika Mata Temple',
  'kalika-mata-temple',
  'place',
  (SELECT id FROM locations WHERE slug = 'chittorgarh'),
  (SELECT path || '/kalika-mata-temple' FROM locations WHERE slug = 'chittorgarh'),
  'Kalika Mata Temple is an ancient temple within Chittorgarh Fort, originally built in the 8th century as a Sun Temple and later converted to a temple dedicated to Goddess Kali. The temple showcases beautiful architecture with intricate carvings and sculptures. The temple''s conversion from a Sun Temple to a Kali Temple reflects the changing religious practices over centuries. The temple is built on a raised platform and features a pyramidal roof typical of North Indian temple architecture. The sanctum houses an idol of Goddess Kali, who is worshipped as the protector of the fort. The temple walls are adorned with beautiful carvings depicting various Hindu deities and mythological scenes. The temple is an active place of worship and attracts devotees throughout the year. Special prayers and ceremonies are conducted during Navratri festival. The temple offers a peaceful atmosphere for prayer and meditation. The temple''s historical and religious significance makes it an important landmark within the fort. The blend of architectural styles reflects the fort''s long and diverse history.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '24.8829',
  '74.6230'
),

-- 9. Fateh Prakash Palace
(
  'Fateh Prakash Palace',
  'fateh-prakash-palace',
  'place',
  (SELECT id FROM locations WHERE slug = 'chittorgarh'),
  (SELECT path || '/fateh-prakash-palace' FROM locations WHERE slug = 'chittorgarh'),
  'Fateh Prakash Palace is a relatively modern palace built in the early 20th century by Maharana Fateh Singh, showcasing a blend of Rajput and Mughal architectural styles. The palace now houses a museum displaying a rich collection of sculptures, weapons, and artifacts from Chittorgarh''s history. The museum''s collection includes ancient sculptures dating back to the 9th-12th centuries, providing insights into the region''s artistic heritage. The palace architecture features beautiful arches, balconies, and courtyards. The museum displays various weapons used by Rajput warriors including swords, shields, and armor. The collection of sculptures includes beautiful examples of Hindu and Jain art. The palace offers panoramic views of the fort and surrounding landscape from its terraces. The well-maintained gardens around the palace add to its beauty. The palace represents the last phase of royal construction in Chittorgarh. The museum is an excellent resource for understanding the fort''s long and glorious history. It''s a must-visit for history enthusiasts and art lovers.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '24.8829',
  '74.6230'
),

-- 10. Sanwariyaji Temple
(
  'Sanwariyaji Temple',
  'sanwariyaji-temple',
  'place',
  (SELECT id FROM locations WHERE slug = 'chittorgarh'),
  (SELECT path || '/sanwariyaji-temple' FROM locations WHERE slug = 'chittorgarh'),
  'Sanwariyaji Temple is a famous temple dedicated to Lord Krishna in his dark (sanwariya) form, located about 40 kilometers from Chittorgarh city. The temple is one of the three main Sanwariyaji temples in Rajasthan and attracts thousands of devotees daily. According to legend, the idol of Lord Krishna was found by a milkman in a dream and later installed in the temple. The temple is known for fulfilling wishes and devotees offer colorful flags and coconuts as thanksgiving. The temple complex is beautifully decorated with marble and features intricate carvings. The temple is especially crowded during festivals like Janmashtami and Holi. The temple trust runs various charitable activities including free food distribution and medical camps. The temple''s spiritual atmosphere and the devotion of pilgrims create a powerful energy. The temple represents the deep Krishna bhakti tradition of Rajasthan. The temple is well-connected by road and has facilities for pilgrims. It''s a significant pilgrimage site for Krishna devotees from across India.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '24.9500',
  '74.6500'
);
