-- Insert Bikaner Places (10 places)
-- Run this in Supabase SQL Editor after cities are created

INSERT INTO locations (name, slug, type, parent_id, path, description, image, is_popular, lat, lng)
VALUES

-- 1. Junagarh Fort
(
  'Junagarh Fort',
  'junagarh-fort',
  'place',
  (SELECT id FROM locations WHERE slug = 'bikaner'),
  (SELECT path || '/junagarh-fort' FROM locations WHERE slug = 'bikaner'),
  'Junagarh Fort is an impregnable fortress built in 1588 by Raja Rai Singh, one of Emperor Akbar''s most distinguished generals. Unlike most Rajasthani forts built on hilltops, Junagarh stands on the plains, yet it was never conquered despite numerous attacks. The fort complex houses magnificent palaces, temples, and pavilions built by successive rulers over centuries. The architecture showcases a beautiful blend of Rajput, Mughal, and Gujarati styles with intricate stone carvings, lattice work, and mirror work. The fort contains 37 palaces, temples, and pavilions including Anup Mahal, Ganga Niwas, and Phool Mahal, each more beautiful than the last. The museum inside displays royal artifacts, manuscripts, miniature paintings, and weapons. The fort''s walls are adorned with beautiful frescoes and paintings depicting royal life. The Har Mandir temple within the fort is a masterpiece of religious architecture. The fort represents the military prowess and artistic excellence of Bikaner''s rulers.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  true,
  '28.0229',
  '73.3119'
),

-- 2. Karni Mata Temple
(
  'Karni Mata Temple',
  'karni-mata-temple',
  'place',
  (SELECT id FROM locations WHERE slug = 'bikaner'),
  (SELECT path || '/karni-mata-temple' FROM locations WHERE slug = 'bikaner'),
  'Karni Mata Temple, also known as the Rat Temple, is one of the most unique temples in the world, located 30 kilometers from Bikaner in Deshnoke. The temple is home to over 25,000 rats called kabbas, which are considered sacred and worshipped as reincarnations of Karni Mata''s devotees. According to legend, when Karni Mata''s stepson drowned, she asked Yama (god of death) to revive him, and Yama agreed that her family members would be reincarnated as rats. Devotees consider it auspicious to spot white rats, believed to be manifestations of Karni Mata and her sons. The temple is built in Mughal style with beautiful marble carvings and silver doors donated by Maharaja Ganga Singh. Thousands of pilgrims visit daily, offering food to the rats and seeking blessings. The rats are well-fed and cared for by temple authorities. Despite initial hesitation, visitors find the experience fascinating and spiritually significant. The temple represents unique religious beliefs and practices found nowhere else in the world.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  true,
  '27.8167',
  '73.3333'
),

-- 3. Lalgarh Palace
(
  'Lalgarh Palace',
  'lalgarh-palace',
  'place',
  (SELECT id FROM locations WHERE slug = 'bikaner'),
  (SELECT path || '/lalgarh-palace' FROM locations WHERE slug = 'bikaner'),
  'Lalgarh Palace is a magnificent architectural marvel built between 1902 and 1926 by Maharaja Ganga Singh in memory of his father Maharaja Lall Singh. The palace is built in Indo-Saracenic style with red sandstone and showcases intricate lattice work, filigree work, and beautiful carvings. The palace complex includes lush gardens, courtyards, and pavilions that reflect the grandeur of royal lifestyle. Part of the palace has been converted into a heritage hotel while other sections house museums displaying royal artifacts, photographs, and hunting trophies. The Shri Sadul Museum within the palace displays an impressive collection of paintings, manuscripts, and royal memorabilia. The palace''s architecture combines Rajput, Mughal, and European styles creating a unique aesthetic. The intricate jharokhas (balconies), pillars, and arches are masterpieces of craftsmanship. The palace gardens are beautifully maintained with fountains and peacocks roaming freely. It''s a perfect example of early 20th-century royal architecture and lifestyle.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '28.0167',
  '73.3167'
),

-- 4. National Research Centre on Camel
(
  'National Research Centre on Camel',
  'national-research-centre-on-camel',
  'place',
  (SELECT id FROM locations WHERE slug = 'bikaner'),
  (SELECT path || '/national-research-centre-on-camel' FROM locations WHERE slug = 'bikaner'),
  'The National Research Centre on Camel is a unique research institute dedicated to the study, breeding, and conservation of camels, located 8 kilometers from Bikaner city. Established in 1984, it''s the only institute of its kind in Asia focusing on camel research and development. The center houses over 230 camels of various breeds and conducts research on camel genetics, breeding, nutrition, and diseases. Visitors can learn about different camel breeds, their characteristics, and importance in desert ecosystems. The center offers camel rides, camel milk tasting, and demonstrations of camel products like milk, cheese, and ice cream. The museum displays information about camel anatomy, behavior, and their role in human civilization. The center plays a crucial role in preserving indigenous camel breeds and improving camel husbandry practices. Educational programs and workshops are conducted for farmers and students. The visit provides unique insights into the "ship of the desert" and its significance in Rajasthan''s culture and economy.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '28.0500',
  '73.3500'
),

-- 5. Gajner Palace
(
  'Gajner Palace',
  'gajner-palace',
  'place',
  (SELECT id FROM locations WHERE slug = 'bikaner'),
  (SELECT path || '/gajner-palace' FROM locations WHERE slug = 'bikaner'),
  'Gajner Palace is a stunning lakeside palace built by Maharaja Ganga Singh in the early 20th century as a hunting and relaxation lodge. Located 32 kilometers from Bikaner on the banks of Gajner Lake, the palace is surrounded by lush forests and offers a tranquil retreat. The red sandstone palace showcases beautiful Rajput architecture with intricate carvings, jharokhas, and courtyards. The palace has now been converted into a heritage hotel offering luxurious accommodation with modern amenities. The surrounding Gajner Wildlife Sanctuary is home to various species of deer, nilgai, wild boar, and numerous migratory birds. The lake attracts thousands of imperial sand grouse during winter, creating a spectacular sight. Boat rides on the lake offer peaceful moments amidst natural beauty. The palace grounds include beautiful gardens perfect for evening walks. The palace represents the perfect blend of royal luxury and natural wilderness. It''s an ideal destination for nature lovers and those seeking a royal experience.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '28.0500',
  '73.8833'
),

-- 6. Rampuria Haveli
(
  'Rampuria Haveli',
  'rampuria-haveli',
  'place',
  (SELECT id FROM locations WHERE slug = 'bikaner'),
  (SELECT path || '/rampuria-haveli' FROM locations WHERE slug = 'bikaner'),
  'Rampuria Haveli is a group of 15th-century havelis built by the wealthy Rampuria family of merchants, showcasing the finest example of Bikaner''s haveli architecture. These red sandstone havelis feature intricate carvings, jharokhas (overhanging balconies), and beautiful lattice work that demonstrate exceptional craftsmanship. The havelis are adorned with detailed stone carvings depicting floral patterns, geometric designs, and mythological scenes. The architecture shows influences of Mughal and Victorian styles blended with traditional Rajput design. The havelis'' facades are particularly impressive with their ornate balconies and windows. Though most havelis are still privately owned and not open to public, their exterior beauty can be admired from the street. The havelis represent the prosperity and artistic taste of Bikaner''s merchant class during the medieval period. The narrow lanes around the havelis offer a glimpse into old Bikaner''s charm. Photography enthusiasts find these havelis perfect subjects, especially during golden hour. They are important heritage structures that showcase Bikaner''s rich architectural legacy.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '28.0167',
  '73.3167'
),

-- 7. Bhandasar Jain Temple
(
  'Bhandasar Jain Temple',
  'bhandasar-jain-temple',
  'place',
  (SELECT id FROM locations WHERE slug = 'bikaner'),
  (SELECT path || '/bhandasar-jain-temple' FROM locations WHERE slug = 'bikaner'),
  'Bhandasar Jain Temple is a 16th-century architectural marvel dedicated to the 5th Jain Tirthankara, Sumatinath, built by a wealthy merchant named Bhandasa Oswal. The temple is famous for its stunning mirror work, intricate frescoes, and beautiful paintings depicting Jain mythology. According to legend, the temple''s foundation was laid using 40,000 kilograms of ghee instead of water, showcasing the builder''s devotion and wealth. The temple walls are adorned with gold leaf work and colorful paintings that have retained their brilliance over centuries. The pillars feature detailed carvings of dancers, musicians, and celestial beings. The temple''s architecture combines red sandstone with marble, creating a beautiful contrast. The sanctum houses a beautiful idol of Lord Sumatinath. The temple ceiling is covered with intricate mirror work that creates a dazzling effect. The temple is an active place of worship and attracts Jain pilgrims from across India. It represents the perfect blend of religious devotion and artistic excellence.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '28.0167',
  '73.3167'
),

-- 8. Shri Laxminath Temple
(
  'Shri Laxminath Temple',
  'shri-laxminath-temple',
  'place',
  (SELECT id FROM locations WHERE slug = 'bikaner'),
  (SELECT path || '/shri-laxminath-temple' FROM locations WHERE slug = 'bikaner'),
  'Shri Laxminath Temple is the oldest and most revered temple in Bikaner, dedicated to Lord Vishnu and Goddess Laxmi, built in 1504 by Rao Lunkaran, the founder of Bikaner. The temple is an important pilgrimage site and the royal family''s personal temple where they performed religious ceremonies. The temple architecture showcases beautiful Indo-Aryan style with intricate carvings and colorful paintings. The walls and ceilings are adorned with frescoes depicting scenes from Hindu mythology, particularly stories of Lord Vishnu''s incarnations. The temple''s sanctum houses beautiful idols of Lord Laxminath and Goddess Laxmi. The temple complex includes several smaller shrines dedicated to various deities. The temple is especially crowded during festivals like Janmashtami and Diwali when special prayers and celebrations are held. The temple''s spiritual atmosphere and beautiful architecture make it a must-visit for devotees and art lovers. The temple priests maintain ancient rituals and traditions that have been followed for over 500 years. It represents the deep religious faith of Bikaner''s royal family and citizens.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '28.0167',
  '73.3167'
),

-- 9. Devi Kund Sagar
(
  'Devi Kund Sagar',
  'devi-kund-sagar',
  'place',
  (SELECT id FROM locations WHERE slug = 'bikaner'),
  (SELECT path || '/devi-kund-sagar' FROM locations WHERE slug = 'bikaner'),
  'Devi Kund Sagar is a royal crematorium located 8 kilometers from Bikaner, featuring stunning cenotaphs (chattris) of Bikaner''s rulers built in white and red sandstone. The site serves as the final resting place for the royal family and showcases beautiful Rajput architecture. Each cenotaph is uniquely designed with intricate carvings, pillars, and domes reflecting the artistic style of its era. The most impressive is the cenotaph of Maharaja Surat Singh, built entirely in white marble with exquisite carvings. The cenotaphs are adorned with beautiful paintings and inscriptions detailing the achievements of the rulers. The site offers a peaceful atmosphere amidst the desert landscape. The architecture demonstrates the importance given to memorial structures in Rajput culture. The cenotaphs are particularly beautiful during sunset when the sandstone glows in golden hues. The site is less crowded than other tourist attractions, offering a serene experience. It provides insights into the royal history and architectural heritage of Bikaner. The site is well-maintained and perfect for photography and historical exploration.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '28.0500',
  '73.3500'
),

-- 10. Prachina Museum
(
  'Prachina Museum',
  'prachina-museum',
  'place',
  (SELECT id FROM locations WHERE slug = 'bikaner'),
  (SELECT path || '/prachina-museum' FROM locations WHERE slug = 'bikaner'),
  'Prachina Museum is a cultural museum located within Junagarh Fort, showcasing the rich heritage and lifestyle of Bikaner''s royal family. The museum displays an impressive collection of royal costumes, textiles, jewelry, and accessories spanning several centuries. The textile collection includes rare fabrics, embroidered garments, and traditional Rajasthani attire worn by royalty. The museum features beautiful examples of traditional crafts including mirror work, embroidery, and block printing. Visitors can see the evolution of fashion and textile arts in Rajasthan through the centuries. The jewelry collection includes ornate pieces made of gold, silver, and precious stones. The museum also displays household items, furniture, and decorative objects used in royal households. Interactive displays and detailed descriptions help visitors understand the cultural significance of each artifact. The museum plays an important role in preserving and promoting Rajasthan''s textile heritage. It''s a must-visit for anyone interested in fashion history, textiles, and royal lifestyle. The museum offers a unique glimpse into the opulent world of Rajasthani royalty.',
  'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80&fit=crop',
  false,
  '28.0229',
  '73.3119'
);
