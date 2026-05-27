# 🚀 Setup Supabase for Localhost - Step by Step

Your VPS configuration has been backed up. Now let's set up Supabase!

---

## ✅ What I've Done

1. ✅ Backed up VPS config:
   - `backend/.env.vps.backup`
   - `frontend/.env.vps.backup`

2. ✅ Updated for localhost:
   - `backend/.env` - Ready for Supabase (needs your DATABASE_URL)
   - `frontend/.env.local` - Points to localhost:4000

3. ✅ Kept your credentials:
   - Cloudinary (same)
   - JWT secrets (same)
   - Email/Resend (same)

---

## 🎯 What You Need to Do Now

### Step 1: Create Supabase Project (5 minutes)

1. **Go to Supabase**
   - Open: https://supabase.com
   - Click **"Sign in"** or **"Start your project"**
   - Sign up with GitHub/Google/Email

2. **Create New Project**
   - Click **"New Project"**
   - Organization: Select or create one
   - **Name**: `ghumo-phiro-local` (or any name you like)
   - **Database Password**: Create a strong password
     - Example: `MySuper$ecure123!`
     - ⚠️ **SAVE THIS PASSWORD!** You'll need it in Step 2
   - **Region**: Choose closest to you (e.g., Mumbai, Singapore)
   - Click **"Create new project"**

3. **Wait for Setup**
   - Takes 2-3 minutes
   - You'll see "Setting up project..." message
   - Wait until it says "Project is ready"

### Step 2: Get Database Connection String

1. **In your Supabase project dashboard:**
   - Click **"Settings"** (gear icon in left sidebar)
   - Click **"Database"**
   - Scroll down to **"Connection string"** section

2. **Copy the URI format:**
   - Select **"URI"** tab
   - You'll see something like:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
     ```
   - Click **"Copy"** button

3. **Replace [YOUR-PASSWORD]:**
   - The copied string has `[YOUR-PASSWORD]` in it
   - Replace it with the password you created in Step 1
   - Example:
     ```
     postgresql://postgres:MySuper$ecure123!@db.abcdefghijklmnop.supabase.co:5432/postgres
     ```

### Step 3: Update Backend .env

1. **Open file:** `backend/.env`

2. **Find this line:**
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```

3. **Replace with your connection string:**
   ```env
   DATABASE_URL=postgresql://postgres:MySuper$ecure123!@db.abcdefghijklmnop.supabase.co:5432/postgres
   ```

4. **Save the file**

### Step 4: Install Dependencies & Run Migrations

Open terminal in your project folder:

```bash
# Install backend dependencies
cd backend
npm install

# Run database migrations (creates all tables)
npm run db:push

# You should see:
# ✓ Pushing schema to database...
# ✓ Done!
```

### Step 5: Start Backend

```bash
# Still in backend folder
npm run dev

# You should see:
# Server running on http://localhost:4000
# Database connected successfully
```

**Keep this terminal open!**

### Step 6: Start Frontend

Open a **NEW terminal** window:

```bash
# Go to frontend folder
cd frontend

# Install dependencies (if not already done)
npm install

# Start frontend
npm run dev

# You should see:
# ▲ Next.js 14.x.x
# - Local: http://localhost:3000
```

**Keep this terminal open too!**

---

## 🎉 Test Your Setup

### 1. Check Backend Health
Open browser: http://localhost:4000/api/v1/health

Should see:
```json
{
  "success": true,
  "message": "API is running"
}
```

### 2. Check Frontend
Open browser: http://localhost:3000

Should see your homepage!

### 3. Check Database Connection
In Supabase dashboard:
- Go to **"Table Editor"**
- You should see tables: `users`, `locations`, `tours`, `bookings`, etc.

---

## 👤 Create Admin User

### Option 1: Via API (Easiest)

Open terminal and run:

```bash
curl -X POST http://localhost:4000/api/v1/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Admin\",\"email\":\"admin@test.com\",\"password\":\"Admin@123\"}"
```

### Option 2: Via Supabase Dashboard

1. Go to Supabase → **SQL Editor**
2. Click **"New query"**
3. Paste this:

```sql
INSERT INTO users (name, email, password, role, is_active, created_at)
VALUES (
  'Admin User',
  'admin@test.com',
  '$2b$10$YourHashedPasswordHere',
  'admin',
  true,
  NOW()
);
```

4. Click **"Run"**

### Option 3: Register & Promote

1. Go to http://localhost:3000/register
2. Register with your email
3. In Supabase SQL Editor, run:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 📍 Add Sample Locations

### Via Supabase SQL Editor

Go to Supabase → **SQL Editor** → **New query** → Paste:

```sql
-- 1. Add India
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES ('India', 'india', 'country', NULL, 'india', '20.5937', '78.9629', 
        'Incredible India - Land of diversity', 
        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80', 
        true);

-- 2. Add Rajasthan
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES ('Rajasthan', 'rajasthan', 'state', 
        (SELECT id FROM locations WHERE slug='india'), 
        'india/rajasthan', '27.0238', '74.2179', 
        'Land of Kings - Desert state with rich heritage', 
        'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80', 
        true);

-- 3. Add Jaipur
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES ('Jaipur', 'jaipur', 'city', 
        (SELECT id FROM locations WHERE slug='rajasthan'), 
        'india/rajasthan/jaipur', '26.9124336', '75.7872709', 
        'The Pink City - Capital of Rajasthan', 
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80', 
        true);

-- 4. Add Udaipur
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES ('Udaipur', 'udaipur', 'city', 
        (SELECT id FROM locations WHERE slug='rajasthan'), 
        'india/rajasthan/udaipur', '24.5854', '73.7125', 
        'City of Lakes - Venice of the East', 
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80', 
        true);

-- 5. Add Jodhpur
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES ('Jodhpur', 'jodhpur', 'city', 
        (SELECT id FROM locations WHERE slug='rajasthan'), 
        'india/rajasthan/jodhpur', '26.2389', '73.0243', 
        'The Blue City - Gateway to Thar Desert', 
        'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80', 
        true);

-- 6. Add Jaisalmer
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES ('Jaisalmer', 'jaisalmer', 'city', 
        (SELECT id FROM locations WHERE slug='rajasthan'), 
        'india/rajasthan/jaisalmer', '26.9157', '70.9083', 
        'The Golden City - Desert jewel', 
        'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80', 
        true);
```

Click **"Run"** and you'll have 6 locations!

---

## ✅ Verify Everything Works

### Checklist:

- [ ] Backend running on http://localhost:4000
- [ ] Frontend running on http://localhost:3000
- [ ] Can see homepage with locations
- [ ] Can login at http://localhost:3000/login
- [ ] Can access admin panel at http://localhost:3000/dashboard
- [ ] Can see locations at http://localhost:3000/destinations
- [ ] Can add new locations from admin panel

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL in `backend/.env`
- Verify password is correct (no spaces)
- Check Supabase project is running (green status)

### "Port 4000 already in use"
```bash
# Kill the process
npx kill-port 4000
```

### "Module not found"
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

### "CORS error in browser"
- Check backend is running on port 4000
- Check `CORS_ORIGIN=http://localhost:3000` in backend/.env
- Restart backend after changing .env

### "Tables not created"
```bash
cd backend
npm run db:push
```

---

## 📊 View Your Data

### Supabase Dashboard:
1. Go to https://app.supabase.com
2. Select your project
3. Click **"Table Editor"**
4. Browse tables visually
5. Edit data directly

### SQL Editor:
1. Click **"SQL Editor"**
2. Write queries
3. Run and see results

---

## 🔄 Switch Back to VPS

When you want to deploy to VPS again:

```bash
# Backend
cp backend/.env.vps.backup backend/.env

# Frontend
cp frontend/.env.vps.backup frontend/.env.local
```

---

## 📝 Summary

**What's Running:**
- Backend: http://localhost:4000 (Node.js + Express)
- Frontend: http://localhost:3000 (Next.js)
- Database: Supabase (Cloud PostgreSQL)

**What's Backed Up:**
- `backend/.env.vps.backup` - Your VPS backend config
- `frontend/.env.vps.backup` - Your VPS frontend config

**Next Steps:**
1. Complete Step 1-6 above
2. Create admin user
3. Add sample locations
4. Start developing!

---

## 💡 Pro Tips

1. **Keep terminals open** - Both backend and frontend need to run
2. **Auto-reload** - Both servers reload when you save files
3. **Check logs** - Errors show in terminal windows
4. **Use Supabase dashboard** - Easy way to view/edit data
5. **Commit often** - Save your work with git

---

**Need help? Check the logs in your terminal windows!**

🎉 **You're ready to develop locally with Supabase!**
