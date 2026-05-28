# 🚀 Supabase Database Setup - Complete SQL Script

**Problem**: `npm run db:push` gives 429 rate limit error  
**Solution**: Run migrations directly in Supabase SQL Editor

---

## ✅ Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your project: `lxvsyobuaywkwgrbqcrc`
3. Click **"SQL Editor"** in left sidebar
4. Click **"New query"** button

---

## ✅ Step 2: Create All Tables

Copy and paste this complete SQL script into the SQL Editor:

```sql
-- ============================================
-- CREATE ALL TABLES FOR GHUMO PHIRO
-- ============================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  avatar TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- 2. Locations Table (Hierarchy: Country → State → City → Place)
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  parent_id INTEGER REFERENCES locations(id),
  path TEXT NOT NULL,
  lat NUMERIC(10, 7),
  lng NUMERIC(10, 7),
  description TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_locations_slug ON locations(slug);
CREATE INDEX IF NOT EXISTS idx_locations_parent_id ON locations(parent_id);
CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(type);
CREATE INDEX IF NOT EXISTS idx_locations_path ON locations(path);

-- 3. Tours Table
CREATE TABLE IF NOT EXISTS tours (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  long_description TEXT,
  duration INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  max_group_size INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  images JSONB NOT NULL,
  highlights JSONB NOT NULL,
  included JSONB NOT NULL,
  excluded JSONB NOT NULL,
  itinerary JSONB NOT NULL,
  destinations JSONB NOT NULL,
  rating NUMERIC(2, 1),
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tours_is_active ON tours(is_active);
CREATE INDEX IF NOT EXISTS idx_tours_is_featured ON tours(is_featured);
CREATE INDEX IF NOT EXISTS idx_tours_category ON tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_difficulty ON tours(difficulty);
CREATE INDEX IF NOT EXISTS idx_tours_price ON tours(price);
CREATE INDEX IF NOT EXISTS idx_tours_rating ON tours(rating);
CREATE INDEX IF NOT EXISTS idx_tours_active_featured ON tours(is_active, is_featured);

-- 4. Tour Locations (Many-to-Many)
CREATE TABLE IF NOT EXISTS tour_locations (
  id SERIAL PRIMARY KEY,
  tour_id INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_tl_tour_id ON tour_locations(tour_id);
CREATE INDEX IF NOT EXISTS idx_tl_location_id ON tour_locations(location_id);

-- 5. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  tour_id INTEGER REFERENCES tours(id),
  user_id INTEGER REFERENCES users(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_country TEXT NOT NULL,
  number_of_travelers INTEGER NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON bookings(user_id, status);

-- 6. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT,
  tour_interest TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);

-- 7. Custom Tour Requests Table
CREATE TABLE IF NOT EXISTS custom_tour_requests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  number_of_travelers INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  budget TEXT NOT NULL,
  destinations JSONB NOT NULL,
  interests JSONB,
  start_date TIMESTAMP,
  additional_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ctr_status ON custom_tour_requests(status);
CREATE INDEX IF NOT EXISTS idx_ctr_created_at ON custom_tour_requests(created_at);

-- 8. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  tour_id INTEGER REFERENCES tours(id),
  booking_id INTEGER REFERENCES bookings(id),
  customer_name TEXT NOT NULL,
  customer_country TEXT NOT NULL,
  rating INTEGER NOT NULL,
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  images JSONB,
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_tour_id ON reviews(tour_id);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(is_published);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'All tables created successfully!' AS status;
```

**Click "Run" button** (or press Ctrl+Enter)

You should see: `All tables created successfully!`

---

## ✅ Step 3: Insert Location Hierarchy (India → Rajasthan → 9 Cities)

Create a **new query** and paste this:

```sql
-- ============================================
-- INSERT LOCATION HIERARCHY
-- ============================================

-- 1. Insert India (Country)
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES (
  'India',
  'india',
  'country',
  NULL,
  'india',
  '20.5937',
  '78.9629',
  'Incredible India - Land of diversity and rich cultural heritage',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Rajasthan (State)
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES (
  'Rajasthan',
  'rajasthan',
  'state',
  (SELECT id FROM locations WHERE slug = 'india'),
  'india/rajasthan',
  '27.0238',
  '74.2179',
  'Land of Kings - Desert state with majestic forts and palaces',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert 9 Rajasthan Cities
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES 
-- Jaipur
(
  'Jaipur',
  'jaipur',
  'city',
  (SELECT id FROM locations WHERE slug = 'rajasthan'),
  'india/rajasthan/jaipur',
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
  'india/rajasthan/udaipur',
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
  'india/rajasthan/jodhpur',
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
  'india/rajasthan/jaisalmer',
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
  'india/rajasthan/mount-abu',
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
  'india/rajasthan/pushkar',
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
  'india/rajasthan/bikaner',
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
  'india/rajasthan/sawai-madhopur',
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
  'india/rajasthan/chittorgarh',
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

-- ============================================
-- VERIFY LOCATIONS
-- ============================================
SELECT 
  id,
  name,
  slug,
  type,
  path,
  lat,
  lng,
  is_popular,
  created_at
FROM locations
ORDER BY path;
```

**Click "Run"** - You should see 11 locations (1 country + 1 state + 9 cities)

---

## ✅ Step 4: Create Admin User

Create a **new query** and paste this:

```sql
-- ============================================
-- CREATE ADMIN USER
-- ============================================
-- Email: admin@test.com
-- Password: Admin@123
-- ============================================

INSERT INTO users (name, email, password, role, is_active, email_verified, created_at)
VALUES (
  'Admin User',
  'admin@test.com',
  '$2b$10$YourHashedPasswordHere',
  'admin',
  true,
  true,
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  is_active = true;

-- Verify admin user
SELECT id, name, email, role, is_active FROM users WHERE role = 'admin';
```

**Note**: The password hash above is a placeholder. You'll need to:

**Option A: Register via frontend (Recommended)**
1. Start your backend: `cd backend && npm run dev`
2. Start your frontend: `cd frontend && npm run dev`
3. Go to: http://localhost:3000/register
4. Register with your email
5. Then run this SQL to promote to admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

**Option B: Use bcrypt to hash password**
```bash
# In backend folder
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Admin@123', 10).then(hash => console.log(hash));"
```
Copy the hash and replace `$2b$10$YourHashedPasswordHere` in the SQL above.

---

## ✅ Step 5: Verify Database Setup

Run this verification query:

```sql
-- ============================================
-- VERIFY ALL TABLES AND DATA
-- ============================================

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Count locations by type
SELECT 
  type,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE is_popular = true) as popular_count
FROM locations
GROUP BY type
ORDER BY 
  CASE type
    WHEN 'country' THEN 1
    WHEN 'state' THEN 2
    WHEN 'city' THEN 3
    WHEN 'place' THEN 4
  END;

-- Show location hierarchy
SELECT 
  CASE type
    WHEN 'country' THEN '🌍 ' || name
    WHEN 'state' THEN '  📍 ' || name
    WHEN 'city' THEN '    🏙️ ' || name
    WHEN 'place' THEN '      📌 ' || name
  END as location_tree,
  slug,
  lat || ', ' || lng as coordinates,
  is_popular
FROM locations
ORDER BY path;

-- Check users
SELECT COUNT(*) as total_users, 
       COUNT(*) FILTER (WHERE role = 'admin') as admin_count
FROM users;
```

Expected output:
- **Tables**: 8 tables (users, locations, tours, tour_locations, bookings, inquiries, custom_tour_requests, reviews)
- **Locations**: 1 country, 1 state, 9 cities (all popular)
- **Users**: At least 1 admin user

---

## ✅ Step 6: Start Your Application

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```

Should see:
```
✓ Server running on http://localhost:4000
✓ Database connected successfully
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

Should see:
```
▲ Next.js running on http://localhost:3000
```

---

## ✅ Step 7: Test Everything

### 1. Backend Health Check
Open: http://localhost:4000/api/v1/health

Should return:
```json
{
  "success": true,
  "message": "API is running"
}
```

### 2. Frontend Homepage
Open: http://localhost:3000

Should show:
- Homepage with hero section
- Popular destinations (9 Rajasthan cities)

### 3. Destinations Page
Open: http://localhost:3000/destinations

Should show:
- 3 sections: Cities & Places, States, Countries
- Bento grid layout with popular locations

### 4. Map Page
Open: http://localhost:3000/destinations/map

Should show:
- Interactive OpenStreetMap
- 11 markers (1 blue country, 1 purple state, 9 green cities)
- Markers should be positioned correctly on coordinates
- Click markers to see popups

### 5. Admin Panel
Open: http://localhost:3000/login

Login with your admin credentials, then:
- Go to: http://localhost:3000/dashboard/locations
- You should see all 11 locations
- Test "Mark as Popular" toggle
- Test adding new locations

---

## 🎉 Success Checklist

- [ ] All 8 tables created in Supabase
- [ ] 11 locations inserted (India → Rajasthan → 9 cities)
- [ ] Admin user created
- [ ] Backend running on localhost:4000
- [ ] Frontend running on localhost:3000
- [ ] Homepage shows locations
- [ ] Map shows markers at correct coordinates
- [ ] Admin panel accessible
- [ ] Can add/edit locations from admin panel

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check `backend/.env` has correct DATABASE_URL
- Verify Supabase project is running (green status in dashboard)
- Check password is URL-encoded: `c4%26-V8mYxS%24%24k%40R`

### "Tables already exist" error
- This is OK! It means tables were created before
- Skip to Step 3 (Insert Locations)

### "Markers not showing on map"
- Check browser console for errors
- Verify locations have valid lat/lng values
- Run this SQL to check:
```sql
SELECT name, lat, lng FROM locations WHERE lat IS NULL OR lng IS NULL;
```

### "GPS pointer not on coordinates"
The LocationMap component has been fixed with:
- Correct SVG viewBox: `0 0 24 30`
- Anchor point: `bottom` (pin tip points to exact coordinates)
- No offset needed

If markers still seem off, check:
1. Coordinates are in correct format (lat, lng)
2. Decimal precision is preserved (7 decimal places)
3. Browser zoom level is 100%

---

## 📊 Database Schema Summary

```
users
├── id (PK)
├── email (unique)
├── password (hashed)
└── role (user|admin|superadmin)

locations (hierarchical)
├── id (PK)
├── slug (unique)
├── type (country|state|city|place)
├── parent_id (FK → locations.id)
├── path (e.g., "india/rajasthan/jaipur")
├── lat, lng (coordinates)
└── is_popular (boolean)

tours
├── id (PK)
├── slug (unique)
├── price, duration, difficulty
└── is_featured (boolean)

tour_locations (many-to-many)
├── tour_id (FK → tours.id)
└── location_id (FK → locations.id)

bookings
├── id (PK)
├── tour_id (FK → tours.id)
├── user_id (FK → users.id)
└── status, payment_status

inquiries
├── id (PK)
└── status (new|contacted|closed)

custom_tour_requests
├── id (PK)
└── status (pending|processing|completed)

reviews
├── id (PK)
├── tour_id (FK → tours.id)
└── is_published (boolean)
```

---

## 🔄 Next Steps

1. **Add More Locations**: Use the admin panel or SQL Editor
2. **Add Tours**: Create tours and link them to locations
3. **Test Bookings**: Make test bookings from frontend
4. **Test Inquiries**: Submit inquiry forms
5. **Test Custom Tours**: Request custom tour quotes

---

## 💡 Pro Tips

1. **Use Supabase Table Editor** for quick data viewing/editing
2. **Use SQL Editor** for bulk operations
3. **Check backend logs** in terminal for debugging
4. **Use browser DevTools** to inspect API calls
5. **Keep both terminals open** while developing

---

**🎉 Your localhost development environment with Supabase is ready!**

Need help? Check the terminal logs or Supabase dashboard for errors.
