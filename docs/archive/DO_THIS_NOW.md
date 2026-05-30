# 🎯 DO THIS NOW - 5 Minute Setup

## 📋 You Are Here

```
✅ Backend configured with Supabase
✅ Frontend configured for localhost  
✅ VPS backed up safely
⏳ Database tables need to be created ← YOU ARE HERE
```

---

## 🚀 Follow These Steps (Copy-Paste Ready)

### Step 1: Open Supabase (30 seconds)

1. Open browser
2. Go to: https://supabase.com/dashboard
3. Click on project: `lxvsyobuaywkwgrbqcrc`
4. Click **"SQL Editor"** in left sidebar
5. Click **"New query"** button

---

### Step 2: Create All Tables (2 minutes)

**Copy this entire SQL script** and paste in SQL Editor:

```sql
-- ============================================
-- CREATE ALL TABLES
-- ============================================

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

CREATE TABLE IF NOT EXISTS tour_locations (
  id SERIAL PRIMARY KEY,
  tour_id INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_tl_tour_id ON tour_locations(tour_id);
CREATE INDEX IF NOT EXISTS idx_tl_location_id ON tour_locations(location_id);

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

SELECT 'All tables created successfully!' AS status;
```

**Click "Run"** (or press Ctrl+Enter)

✅ You should see: `All tables created successfully!`

---

### Step 3: Insert Locations (1 minute)

Click **"New query"** again, then **copy and paste this**:

```sql
-- ============================================
-- INSERT LOCATIONS
-- ============================================

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

INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES 
('Jaipur', 'jaipur', 'city', (SELECT id FROM locations WHERE slug = 'rajasthan'), 'india/rajasthan/jaipur', '26.9124', '75.7873', 'The Pink City', 'https://www.andbeyond.com/wp-content/uploads/sites/5/Jaipur-2.jpg', true),
('Udaipur', 'udaipur', 'city', (SELECT id FROM locations WHERE slug = 'rajasthan'), 'india/rajasthan/udaipur', '24.5854', '73.7125', 'City of Lakes', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/77/ea/4b/royalty-meets-fairy-tale.jpg?w=1400&h=-1&s=1', true),
('Jodhpur', 'jodhpur', 'city', (SELECT id FROM locations WHERE slug = 'rajasthan'), 'india/rajasthan/jodhpur', '26.2389', '73.0243', 'The Blue City', 'https://s7ap1.scene7.com/is/image/incredibleindia/2-mehrangarh-fort-jodhpur-rajasthan-city-hero?qlt=82&ts=1726660925514', true),
('Jaisalmer', 'jaisalmer', 'city', (SELECT id FROM locations WHERE slug = 'rajasthan'), 'india/rajasthan/jaisalmer', '26.9157', '70.9083', 'The Golden City', 'https://images.unsplash.com/photo-1477587458883-47145ed94245', true),
('Mount Abu', 'mount-abu', 'city', (SELECT id FROM locations WHERE slug = 'rajasthan'), 'india/rajasthan/mount-abu', '24.5926', '72.7156', 'Hill Station of Rajasthan', 'https://www.tourism.rajasthan.gov.in/content/dam/rajasthan-tourism/english/city/banners/desk/mount-abu.jpg', true),
('Pushkar', 'pushkar', 'city', (SELECT id FROM locations WHERE slug = 'rajasthan'), 'india/rajasthan/pushkar', '26.4898', '74.5511', 'Holy City of Rajasthan', 'https://www.peakadventuretour.com/assets/imgs/pushkar-fair-bnr.webp', true),
('Bikaner', 'bikaner', 'city', (SELECT id FROM locations WHERE slug = 'rajasthan'), 'india/rajasthan/bikaner', '28.0229', '73.3119', 'Desert Heritage City', 'https://www.tourism.rajasthan.gov.in/content/dam/rajasthan-tourism/english/city/banners/desk/19.jpg', true),
('Sawai Madhopur', 'sawai-madhopur', 'city', (SELECT id FROM locations WHERE slug = 'rajasthan'), 'india/rajasthan/sawai-madhopur', '26.0173', '76.5026', 'Gateway to Ranthambore', 'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,height=585,dpr=2/tour_img/f168bdc39cec0bec3f3a7d4a0381c0b41a6df2690a372d594a244dd6c13a06c8.jpg', true),
('Chittorgarh', 'chittorgarh', 'city', (SELECT id FROM locations WHERE slug = 'rajasthan'), 'india/rajasthan/chittorgarh', '24.8799', '74.6290', 'City of Valor and Forts', 'https://s7ap1.scene7.com/is/image/incredibleindia/1-chittorgarh-fort-chittorgarh-rajasthan-attr-hero?qlt=82&ts=1727352792140', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  is_popular = EXCLUDED.is_popular;

SELECT id, name, slug, type, path, is_popular FROM locations ORDER BY path;
```

**Click "Run"**

✅ You should see 11 locations listed

---

### Step 4: Start Backend (1 minute)

Open **Command Prompt** or **PowerShell**:

```bash
cd c:\Users\kamle\Desktop\travel kiro\backend
npm install
npm run dev
```

✅ Wait for: `Server running on http://localhost:4000`

**Keep this terminal open!**

---

### Step 5: Start Frontend (1 minute)

Open **NEW Command Prompt** or **PowerShell**:

```bash
cd c:\Users\kamle\Desktop\travel kiro\frontend
npm install
npm run dev
```

✅ Wait for: `Local: http://localhost:3000`

**Keep this terminal open too!**

---

## 🎉 Test Your Setup

### 1. Backend Health Check
Open browser: http://localhost:4000/api/v1/health

Should see:
```json
{
  "success": true,
  "message": "API is running"
}
```

### 2. Frontend Homepage
Open: http://localhost:3000

Should show homepage with locations

### 3. Map Page (Most Important!)
Open: http://localhost:3000/destinations/map

Should show:
- 🔵 1 blue marker (India)
- 🟣 1 purple marker (Rajasthan)
- 🟢 9 green markers (cities)
- Markers at correct coordinates
- Click markers to see popups

### 4. Destinations Page
Open: http://localhost:3000/destinations

Should show 3 sections with Rajasthan cities

---

## ✅ Success Checklist

- [ ] Supabase SQL Editor shows "All tables created successfully!"
- [ ] Supabase shows 11 locations
- [ ] Backend terminal shows "Server running on http://localhost:4000"
- [ ] Frontend terminal shows "Local: http://localhost:3000"
- [ ] http://localhost:4000/api/v1/health returns success
- [ ] http://localhost:3000 shows homepage
- [ ] http://localhost:3000/destinations/map shows 11 markers
- [ ] Markers are positioned correctly on map
- [ ] Clicking markers shows popups

---

## 🐛 If Something Goes Wrong

### "Port 4000 already in use"
```bash
npx kill-port 4000
npm run dev
```

### "Port 3000 already in use"
```bash
npx kill-port 3000
npm run dev
```

### "Cannot connect to database"
- Check `backend/.env` has correct DATABASE_URL
- Verify Supabase project is running (green status in dashboard)

### "Markers not showing on map"
- Open browser console (F12)
- Check for errors
- Verify locations have lat/lng in Supabase Table Editor

---

## 🎯 What's Next?

### Create Admin User

**Option 1: Register via Frontend**
1. Go to: http://localhost:3000/register
2. Register with your email
3. In Supabase SQL Editor, run:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

**Option 2: Use bcrypt**
```bash
cd backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Admin@123', 10).then(hash => console.log(hash));"
```
Copy the hash, then in Supabase SQL Editor:
```sql
INSERT INTO users (name, email, password, role, is_active, email_verified)
VALUES ('Admin', 'admin@test.com', 'PASTE_HASH_HERE', 'admin', true, true);
```

### Login to Admin Panel
1. Go to: http://localhost:3000/login
2. Login with admin credentials
3. Go to: http://localhost:3000/dashboard/locations
4. Test adding/editing locations

---

## 📚 Full Documentation

If you need more details:
- **Complete Guide**: `SUPABASE_SQL_SETUP.md`
- **Quick Start**: `QUICK_START.md`
- **Setup Status**: `SETUP_STATUS.md`
- **Location Format**: `LOCATION_EXCEL_FORMAT.md`

---

## 🎉 That's It!

You now have:
- ✅ Backend running on localhost:4000
- ✅ Frontend running on localhost:3000
- ✅ Database on Supabase with 11 locations
- ✅ Interactive map with correct GPS markers
- ✅ Redesigned destinations page

**Total time**: ~5 minutes

**Ready to develop!** 🚀
