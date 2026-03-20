# 🎯 START HERE - Localhost Setup with Supabase

## ✅ What's Been Done

Your VPS configuration has been safely backed up and your project is now configured for localhost development with Supabase!

### Backed Up Files:
- ✅ `backend/.env.vps.backup` - Your VPS backend configuration
- ✅ `frontend/.env.vps.backup` - Your VPS frontend configuration

### Updated Files:
- ✅ `backend/.env` - Now configured for localhost (needs your Supabase URL)
- ✅ `frontend/.env.local` - Now points to localhost:4000

---

## 🚀 Next Steps (Follow in Order)

### 📖 Step 1: Read the Setup Guide
Open and follow: **`SETUP_SUPABASE_NOW.md`**

This guide will walk you through:
1. Creating a Supabase project (5 minutes)
2. Getting your database connection string
3. Updating your backend .env file
4. Running migrations
5. Starting backend and frontend
6. Creating an admin user
7. Adding sample locations

### 📋 Step 2: Keep Quick Reference Handy
Open: **`LOCALHOST_QUICK_REFERENCE.md`**

This has all the commands you'll need daily:
- Start/stop servers
- Database queries
- Troubleshooting
- Common tasks

---

## 🎯 Quick Start (If You Already Have Supabase)

If you already created a Supabase project:

### 1. Update Backend .env
```bash
# Edit backend/.env
# Replace this line:
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# With your actual Supabase connection string
```

### 2. Install & Migrate
```bash
cd backend
npm install
npm run db:push
```

### 3. Start Backend
```bash
npm run dev
```

### 4. Start Frontend (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

### 5. Access Your App
- Frontend: http://localhost:3000
- Backend: http://localhost:4000/api/v1
- Admin: http://localhost:3000/dashboard

---

## 📚 All Documentation Files

### Setup Guides:
1. **`SETUP_SUPABASE_NOW.md`** ⭐ - Start here! Step-by-step Supabase setup
2. **`LOCALHOST_SETUP_GUIDE.md`** - Detailed guide (Supabase + Local PostgreSQL options)
3. **`QUICK_START.md`** - 5-minute quick start guide

### Reference:
4. **`LOCALHOST_QUICK_REFERENCE.md`** ⭐ - Daily commands and troubleshooting
5. **`LOCATION_EXCEL_FORMAT.md`** - How to bulk import locations
6. **`LOCATION_QUICK_GUIDE.md`** - Location data format reference

### Deployment:
7. **`docs/deployment/UPDATE-SERVER.md`** - How to deploy to VPS
8. **`docs/deployment/DEPLOYMENT.md`** - Full deployment guide

---

## 🔄 Switch Back to VPS

When you want to deploy to your VPS server:

```bash
# Restore VPS configuration
cp backend/.env.vps.backup backend/.env
cp frontend/.env.vps.backup frontend/.env.local

# Deploy (on VPS server)
cd /var/www/ghumo-phiro
git pull origin main
cd backend && npm run build && pm2 restart ghumo-phiro-backend
cd ../frontend && npm run build && pm2 restart ghumo-frontend
```

---

## 🎨 What's Different Now?

### Before (VPS):
- Backend: Port 5000
- Database: Local PostgreSQL on VPS (187.127.151.137)
- Frontend: Points to VPS API

### Now (Localhost):
- Backend: Port 4000
- Database: Supabase (Cloud PostgreSQL)
- Frontend: Points to localhost:4000

### Same:
- ✅ Cloudinary credentials
- ✅ JWT secrets
- ✅ Email/Resend API
- ✅ All your code

---

## ⚠️ Important Notes

1. **Don't commit .env files** - They're in .gitignore (good!)
2. **Keep .vps.backup files safe** - You'll need them for deployment
3. **Use different databases** - Localhost Supabase vs VPS PostgreSQL
4. **Port 4000 for localhost** - Port 5000 is for VPS

---

## 🐛 Having Issues?

### Can't connect to database?
- Check `DATABASE_URL` in `backend/.env`
- Verify Supabase project is running
- See: `SETUP_SUPABASE_NOW.md` Step 2

### Port already in use?
```bash
npx kill-port 4000
npx kill-port 3000
```

### Module not found?
```bash
cd backend && npm install
cd frontend && npm install
```

### Need more help?
- Check: `LOCALHOST_QUICK_REFERENCE.md`
- Check terminal logs for errors
- Check browser console (F12)

---

## ✅ Verification Checklist

Before you start developing, verify:

- [ ] Read `SETUP_SUPABASE_NOW.md`
- [ ] Created Supabase project
- [ ] Updated `backend/.env` with DATABASE_URL
- [ ] Ran `npm run db:push` in backend
- [ ] Backend running on http://localhost:4000
- [ ] Frontend running on http://localhost:3000
- [ ] Can access homepage
- [ ] Created admin user
- [ ] Can login to admin panel
- [ ] Added sample locations
- [ ] Locations show on homepage

---

## 🎉 You're Ready!

Once you complete the setup in `SETUP_SUPABASE_NOW.md`, you'll have:

✅ Full local development environment
✅ Cloud database (Supabase)
✅ Auto-reload on code changes
✅ Visual database management
✅ Same features as production
✅ Safe VPS backup

**Start with: `SETUP_SUPABASE_NOW.md`**

Happy coding! 🚀
