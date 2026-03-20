# ⚡ Quick Start - Localhost with Supabase

## 🎯 Current Status

✅ Backend `.env` configured with Supabase  
✅ Frontend `.env.local` configured for localhost  
✅ VPS config backed up (`.env.vps.backup`)  
⏳ **NEXT**: Create database tables in Supabase

---

## 🚀 3-Step Setup (5 minutes)

### Step 1: Create Tables in Supabase (2 min)

1. Open: https://supabase.com/dashboard
2. Select project: `lxvsyobuaywkwgrbqcrc`
3. Click **SQL Editor** → **New query**
4. Open file: `SUPABASE_SQL_SETUP.md`
5. Copy **Step 2** SQL script (creates all 8 tables)
6. Paste in SQL Editor → Click **Run**

### Step 2: Insert Locations (1 min)

1. In SQL Editor, click **New query**
2. Copy **Step 3** SQL script from `SUPABASE_SQL_SETUP.md`
3. Paste → Click **Run**
4. Should see 11 locations (India → Rajasthan → 9 cities)

### Step 3: Start Servers (2 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## ✅ Test URLs

- Backend: http://localhost:4000/api/v1/health
- Frontend: http://localhost:3000
- Destinations: http://localhost:3000/destinations
- Map: http://localhost:3000/destinations/map
- Admin: http://localhost:3000/dashboard/locations

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `SUPABASE_SQL_SETUP.md` | **Complete setup guide with all SQL scripts** |
| `backend/.env` | Supabase connection (localhost) |
| `backend/.env.vps.backup` | VPS backup (don't delete!) |
| `frontend/.env.local` | Points to localhost:4000 |
| `frontend/.env.vps.backup` | VPS backup (don't delete!) |

---

## 🔑 Credentials

**Supabase Project**: `lxvsyobuaywkwgrbqcrc`  
**Database Password**: `c4&-V8mYxS$$k@R` (URL-encoded in .env)  
**Connection**: Session Pooler (aws-1-ap-south-1)

**Admin User** (create after setup):
- Email: `admin@test.com`
- Password: `Admin@123`
- See `SUPABASE_SQL_SETUP.md` Step 4

---

## 🗺️ Map Markers

The map now shows:
- 🔵 Blue = Countries (zoom 5)
- 🟣 Purple = States (zoom 7)
- 🟢 Green = Cities (zoom 11)
- 🟠 Orange = Places (zoom 14)

GPS pointers are fixed:
- Anchor point at bottom tip of pin
- Points exactly to coordinates
- Smooth drop animation

---

## 🐛 Quick Fixes

**Backend won't start?**
```bash
cd backend
npx kill-port 4000
npm run dev
```

**Frontend won't start?**
```bash
cd frontend
npx kill-port 3000
npm run dev
```

**Database connection error?**
- Check `backend/.env` has correct DATABASE_URL
- Verify Supabase project is running (green status)

**Map markers not showing?**
- Check browser console for errors
- Verify locations have lat/lng values in Supabase Table Editor

---

## 🔄 Switch Back to VPS

When you want to deploy to VPS:

```bash
# Backend
copy backend\.env.vps.backup backend\.env

# Frontend  
copy frontend\.env.vps.backup frontend\.env.local
```

---

## 📚 Full Documentation

- **Complete Setup**: `SUPABASE_SQL_SETUP.md` (all SQL scripts)
- **Localhost Guide**: `LOCALHOST_SETUP_GUIDE.md`
- **Location Format**: `LOCATION_EXCEL_FORMAT.md`
- **Admin Panel**: `ADMIN_PANEL_GUIDE.md`

---

## 💡 What's Next?

After setup is complete:

1. ✅ Create admin user (Step 4 in SUPABASE_SQL_SETUP.md)
2. ✅ Test map at http://localhost:3000/destinations/map
3. ✅ Login to admin panel
4. ✅ Add more locations via admin panel
5. ✅ Create tours and link to locations

---

**🎉 Ready to code! Open `SUPABASE_SQL_SETUP.md` to start.**
