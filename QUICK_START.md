# 🚀 Quick Start Guide

Get your project running on localhost in 5 minutes!

---

## ⚡ Super Quick Setup (Supabase)

### 1. Create Supabase Database (2 minutes)
1. Go to [https://supabase.com](https://supabase.com) and sign up
2. Click **"New Project"**
3. Set name: `ghumo-phiro-local`
4. Set password (save it!)
5. Click **"Create"** and wait 2 minutes

### 2. Setup Backend (1 minute)
```bash
cd backend
cp .env.example .env
npm install
```

Edit `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
JWT_SECRET=my-secret-key-123
JWT_REFRESH_SECRET=my-refresh-key-456
CORS_ORIGIN=http://localhost:3000
```

Run migrations:
```bash
npm run db:push
```

### 3. Setup Frontend (1 minute)
```bash
cd frontend
cp .env.example .env.local
npm install
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### 4. Start Everything (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access Your App
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/dashboard
- **API**: http://localhost:4000/api/v1

---

## 🎯 Create Admin User

### Option 1: Register via API
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@test.com",
    "password": "Admin@123"
  }'
```

### Option 2: Via Supabase Dashboard
1. Go to Supabase → SQL Editor
2. Run:
```sql
INSERT INTO users (name, email, password, role, is_active)
VALUES ('Admin', 'admin@test.com', '$2b$10$K8Z8Z8Z8Z8Z8Z8Z8Z8Z8ZuK', 'admin', true);
```

### Option 3: Promote Existing User
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 📍 Add Sample Locations

### Via Admin Panel
1. Go to http://localhost:3000/dashboard/locations
2. Click **"Add Location"**
3. Add India (country)
4. Add Rajasthan (state, parent: India)
5. Add Jaipur (city, parent: Rajasthan)
6. Toggle **"Mark as Popular"** for each
7. Save

### Via SQL (Faster)
Go to Supabase → SQL Editor and run:

```sql
-- 1. Add India
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES ('India', 'india', 'country', NULL, 'india', '20.5937', '78.9629', 
        'Incredible India', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', true);

-- 2. Add Rajasthan
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES ('Rajasthan', 'rajasthan', 'state', 
        (SELECT id FROM locations WHERE slug='india'), 
        'india/rajasthan', '27.0238', '74.2179', 
        'Land of Kings', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', true);

-- 3. Add Jaipur
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES ('Jaipur', 'jaipur', 'city', 
        (SELECT id FROM locations WHERE slug='rajasthan'), 
        'india/rajasthan/jaipur', '26.9124336', '75.7872709', 
        'The Pink City', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', true);

-- 4. Add Udaipur
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES ('Udaipur', 'udaipur', 'city', 
        (SELECT id FROM locations WHERE slug='rajasthan'), 
        'india/rajasthan/udaipur', '24.5854', '73.7125', 
        'City of Lakes', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', true);

-- 5. Add Jodhpur
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES ('Jodhpur', 'jodhpur', 'city', 
        (SELECT id FROM locations WHERE slug='rajasthan'), 
        'india/rajasthan/jodhpur', '26.2389', '73.0243', 
        'The Blue City', 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800', true);
```

---

## ✅ Verify Everything Works

1. ✅ Backend running: http://localhost:4000/api/v1/health
2. ✅ Frontend running: http://localhost:3000
3. ✅ Can login: http://localhost:3000/login
4. ✅ Admin panel: http://localhost:3000/dashboard
5. ✅ Locations show: http://localhost:3000/destinations
6. ✅ Homepage shows popular destinations

---

## 🐛 Common Issues

### "Cannot connect to database"
- Check DATABASE_URL in `backend/.env`
- Verify Supabase project is running
- Check password is correct

### "Port already in use"
```bash
# Kill process on port 4000
npx kill-port 4000

# Kill process on port 3000
npx kill-port 3000
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "CORS error"
- Check `CORS_ORIGIN` in `backend/.env` is `http://localhost:3000`
- Restart backend after changing `.env`

---

## 📚 Full Documentation

For detailed setup with local PostgreSQL or troubleshooting:
- See **LOCALHOST_SETUP_GUIDE.md**
- See **LOCATION_EXCEL_FORMAT.md** for bulk data import

---

## 🎉 You're Done!

Your app is now running locally:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000
- **Admin**: http://localhost:3000/dashboard

**Next Steps:**
1. Login to admin panel
2. Add more locations
3. Mark locations as popular
4. Create tours
5. Test bookings

---

## 💡 Development Tips

### Auto-reload
Both frontend and backend auto-reload when you save files.

### View Logs
Check terminal windows for errors and logs.

### Database GUI
Use Supabase dashboard to view/edit data visually.

### API Testing
Use Postman or curl to test API endpoints.

### Git Workflow
```bash
git add .
git commit -m "Your changes"
git push origin main
```

---

**Happy Coding! 🚀**
