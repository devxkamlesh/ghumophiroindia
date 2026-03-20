# Documentation

This folder contains all project documentation organized by category.

## 📁 Folder Structure

### `/guides` - User & Admin Guides
- **ADMIN_PANEL_GUIDE.md** - Complete guide for using the admin dashboard
- **QUICK_START.md** - Quick start guide for developers

### `/database` - Database Documentation
- **DATABASE_MANAGEMENT_GUIDE.md** - Database setup and management
- **SUPABASE_SQL_SETUP.md** - Supabase database setup instructions
- **RAJASTHAN_PLACES_COMPLETE.md** - Complete list of all Rajasthan places in database

### `/deployment` - Deployment Guides
- **VERCEL_DEPLOYMENT.md** - Guide for deploying to Vercel

### `/data` - Data Files & Templates
- **Ghumo Firo india - Rajasthan's Places.csv** - Source data for Rajasthan places
- **location_import_template.csv** - Template for importing locations
- **sand.webp** - Image asset

### `/archive` - Old Documentation
Historical documentation files that are no longer actively used but kept for reference.

---

## 🚀 Quick Links

### For Developers
1. Start here: [Quick Start Guide](guides/QUICK_START.md)
2. Database setup: [Supabase SQL Setup](database/SUPABASE_SQL_SETUP.md)
3. Deployment: [Vercel Deployment](deployment/VERCEL_DEPLOYMENT.md)

### For Admins
1. Admin panel: [Admin Panel Guide](guides/ADMIN_PANEL_GUIDE.md)
2. Database management: [Database Management Guide](database/DATABASE_MANAGEMENT_GUIDE.md)

---

## 📊 Project Architecture

```
travel kiro/
├── backend/          # Express.js API server
├── frontend/         # Next.js 15 frontend
├── docs/             # Documentation (you are here)
├── infrastructure/   # Infrastructure configs
└── shared/           # Shared types and utilities
```

---

## 🗄️ Database Structure

The project uses **Supabase (PostgreSQL)** with the following hierarchy:

```
Country (India)
└── State (Rajasthan, etc.)
    └── City (Jaipur, Udaipur, etc.)
        └── Place (Hawa Mahal, City Palace, etc.)
```

**Current Data:**
- 1 Country (India)
- 13 States
- 8 Cities (Rajasthan)
- 65+ Places (Rajasthan)

See [RAJASTHAN_PLACES_COMPLETE.md](database/RAJASTHAN_PLACES_COMPLETE.md) for full list.

---

## 🔧 Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Mapbox GL

**Backend:**
- Node.js + Express
- TypeScript
- Drizzle ORM
- Redis (caching)

**Database:**
- Supabase (PostgreSQL)
- Full-text search
- Trigram similarity

**Infrastructure:**
- Vercel (frontend)
- VPS (backend)
- Cloudinary (images)

---

## 📝 Contributing

When adding new documentation:

1. **Guides** → `/guides` (user-facing documentation)
2. **Database** → `/database` (database schemas, migrations, seeds)
3. **Deployment** → `/deployment` (deployment instructions)
4. **Data** → `/data` (CSV files, templates, assets)
5. **Archive** → `/archive` (old/deprecated docs)

---

## 🆘 Need Help?

- Check the [Quick Start Guide](guides/QUICK_START.md) first
- For database issues, see [Database Management Guide](database/DATABASE_MANAGEMENT_GUIDE.md)
- For deployment issues, see [Vercel Deployment](deployment/VERCEL_DEPLOYMENT.md)

---

**Last Updated:** May 31, 2026
