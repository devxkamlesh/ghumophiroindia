# Quick Reference Guide 🚀

## 📍 Important URLs

### Local Development
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Admin Dashboard:** http://localhost:3000/dashboard
- **Locations Manager:** http://localhost:3000/dashboard/locations
- **Gallery Manager:** http://localhost:3000/dashboard/gallery

### Database
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Project ID:** lxvsyobuaywkwgrbqcrc

---

## 📁 Where to Find Things

### Documentation
```
docs/
├── README.md                    # Start here
├── guides/
│   ├── QUICK_START.md          # Setup guide
│   └── ADMIN_PANEL_GUIDE.md    # Admin guide
├── database/
│   ├── SUPABASE_SQL_SETUP.md   # Database setup
│   └── RAJASTHAN_PLACES_COMPLETE.md
├── deployment/
│   └── VERCEL_DEPLOYMENT.md    # Deploy guide
└── data/
    └── location_import_template.csv
```

### Code
```
backend/
├── src/
│   ├── modules/              # Feature modules
│   ├── core/                 # Core services
│   └── middleware/           # Middleware

frontend/
├── src/
│   ├── app/                  # Next.js pages
│   ├── components/           # React components
│   └── services/             # API services
```

### Database
```
backend/src/core/database/
├── migrations/               # Schema changes
├── seeds/                    # Seed data
│   ├── 001_insert_indian_states.sql
│   ├── 002_insert_rajasthan_cities.sql
│   ├── 003-011_insert_places.sql
│   └── README.md
└── schema.ts                 # Drizzle schema
```

---

## 🔧 Common Commands

### Start Development
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Database
```bash
# Run migrations
cd backend
npm run db:migrate

# Generate types
npm run db:generate
```

### Build
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

---

## 🎯 Quick Tasks

### Add a New Location
1. Go to http://localhost:3000/dashboard/locations
2. Click "Add Location"
3. Fill form (name, type, parent, coordinates)
4. Click "Add Location"

### Search Locations
1. Go to locations page
2. Type in search bar
3. Use filters if needed
4. Click location to edit

### Export Locations
1. Go to locations page
2. Click "Export CSV"
3. File downloads automatically

### Upload to Gallery
1. Go to http://localhost:3000/dashboard/gallery
2. Drag & drop images
3. Select folder
4. Images upload to Cloudinary

### Run SQL Seeds
1. Open Supabase SQL Editor
2. Copy content from `backend/src/core/database/seeds/XXX.sql`
3. Paste and click RUN
4. Repeat for each file in order

---

## 📊 Database Hierarchy

```
Country (India)
└── State (Rajasthan, Gujarat, etc.)
    └── City (Jaipur, Udaipur, etc.)
        └── Place (Hawa Mahal, City Palace, etc.)
```

**Current Data:**
- 1 Country
- 13 States
- 8 Cities (Rajasthan)
- 65+ Places (Rajasthan)

---

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL=          # Supabase connection string
REDIS_URL=             # Redis connection
JWT_SECRET=            # JWT secret
CLOUDINARY_CLOUD_NAME= # Cloudinary config
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_MAPBOX_TOKEN=
```

---

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check if port 4000 is in use
netstat -ano | findstr :4000

# Kill process if needed
taskkill /PID <PID> /F

# Restart
npm run dev
```

### Frontend build fails
```bash
# Clear cache
rm -rf .next
npm run build
```

### Database connection fails
1. Check DATABASE_URL in backend/.env
2. Verify Supabase project is active
3. Test connection: `node backend/test-connection.js`

### Can't see locations in database
1. Open Supabase SQL Editor
2. Run: `SELECT COUNT(*) FROM locations;`
3. If 0, run seed files in order (001-011)

---

## 📱 Admin Panel Features

### Dashboard
- Overview stats
- Recent bookings
- Quick actions

### Locations
- Tree view hierarchy
- Search & filter
- Add/edit/delete
- Export to CSV
- Mark as popular

### Gallery
- Upload images
- Folder management
- Move images
- Copy URLs
- Cloudinary integration

### Tours
- Manage tours
- Pricing
- Itineraries
- Availability

### Bookings
- View bookings
- Update status
- Customer details

---

## 🎨 Design System

### Colors
- **Primary:** Orange (#F97316)
- **Success:** Green (#10B981)
- **Warning:** Amber (#F59E0B)
- **Error:** Red (#EF4444)
- **Info:** Blue (#3B82F6)

### Typography
- **Font:** Inter
- **Headings:** Bold
- **Body:** Regular

### Components
- **Buttons:** Rounded-lg (8px)
- **Cards:** Rounded-xl (12px)
- **Modals:** Rounded-2xl (16px)
- **Inputs:** Rounded-xl (12px)

---

## 🔗 Useful Links

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs)
- [Supabase Docs](https://supabase.com/docs)

### Tools
- [Mapbox Studio](https://studio.mapbox.com/)
- [Cloudinary Console](https://cloudinary.com/console)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

## 📞 Need Help?

### Setup Issues
→ `docs/guides/QUICK_START.md`

### Database Issues
→ `docs/database/SUPABASE_SQL_SETUP.md`

### Deployment Issues
→ `docs/deployment/VERCEL_DEPLOYMENT.md`

### Admin Panel Help
→ `docs/guides/ADMIN_PANEL_GUIDE.md`

### Can't Find Something?
→ `docs/README.md` (full index)

---

## ✅ Daily Checklist

### Before Starting Work
- [ ] Pull latest code: `git pull`
- [ ] Start backend: `cd backend && npm run dev`
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Check both are running (localhost:3000 & localhost:4000)

### Before Committing
- [ ] Test changes locally
- [ ] Check for errors in console
- [ ] Run build: `npm run build`
- [ ] Write clear commit message

### Before Deploying
- [ ] Test on localhost
- [ ] Check environment variables
- [ ] Run production build
- [ ] Test on staging (if available)

---

**Last Updated:** May 31, 2026

**Quick Access:** Bookmark this page for fast reference! 🔖
