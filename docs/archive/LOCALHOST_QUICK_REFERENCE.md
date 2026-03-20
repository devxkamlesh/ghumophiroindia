# 🚀 Localhost Quick Reference Card

## 📋 Quick Commands

### Start Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Access URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api/v1
- **Admin Panel**: http://localhost:3000/dashboard
- **Supabase Dashboard**: https://app.supabase.com

---

## 🔧 Common Commands

### Backend
```bash
cd backend

# Install dependencies
npm install

# Run migrations
npm run db:push

# Start dev server
npm run dev

# Build for production
npm run build

# Run production
npm start
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run production
npm start
```

---

## 🗄️ Database Quick Actions

### Via Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project
3. **Table Editor** - View/edit data visually
4. **SQL Editor** - Run SQL queries

### Common SQL Queries

```sql
-- View all locations
SELECT * FROM locations ORDER BY path;

-- View all users
SELECT id, name, email, role, is_active FROM users;

-- Make user admin
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';

-- Mark location as popular
UPDATE locations SET is_popular = true WHERE slug = 'jaipur';

-- View popular locations
SELECT * FROM locations WHERE is_popular = true;

-- Delete location
DELETE FROM locations WHERE slug = 'location-slug';
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill port 4000 (backend)
npx kill-port 4000

# Kill port 3000 (frontend)
npx kill-port 3000
```

### Database Connection Error
1. Check `DATABASE_URL` in `backend/.env`
2. Verify Supabase project is running
3. Check password is correct

### Module Not Found
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS Error
1. Check `CORS_ORIGIN=http://localhost:3000` in `backend/.env`
2. Restart backend server

### Changes Not Showing
1. Hard refresh browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Restart dev server

---

## 📁 Important Files

### Backend
- `backend/.env` - Current config (localhost + Supabase)
- `backend/.env.vps.backup` - VPS production config
- `backend/.env.example` - Template
- `backend/src/core/database/schema.ts` - Database schema

### Frontend
- `frontend/.env.local` - Current config (localhost)
- `frontend/.env.vps.backup` - VPS production config
- `frontend/.env.example` - Template

---

## 🔄 Switch Between Environments

### Switch to VPS Config
```bash
# Backend
cp backend/.env.vps.backup backend/.env

# Frontend
cp frontend/.env.vps.backup frontend/.env.local
```

### Switch to Localhost Config
```bash
# Backend
cp backend/.env.example backend/.env
# Then update DATABASE_URL with Supabase connection string

# Frontend
cp frontend/.env.example frontend/.env.local
```

---

## 👤 User Management

### Create Admin User (API)
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"Admin@123"}'
```

### Promote User to Admin (SQL)
```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

### View All Users (SQL)
```sql
SELECT id, name, email, role, is_active, created_at FROM users;
```

---

## 📍 Location Management

### Add Location via Admin Panel
1. Go to http://localhost:3000/dashboard/locations
2. Click "Add Location"
3. Fill form
4. Toggle "Mark as Popular" if needed
5. Save

### Add Location via SQL
```sql
-- Add country
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES ('India', 'india', 'country', NULL, 'india', '20.5937', '78.9629', 
        'Incredible India', 'https://...', true);

-- Add state (get parent_id from country)
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES ('Rajasthan', 'rajasthan', 'state', 
        (SELECT id FROM locations WHERE slug='india'), 
        'india/rajasthan', '27.0238', '74.2179', 
        'Land of Kings', 'https://...', true);
```

---

## 🔍 Health Checks

### Backend Health
```bash
curl http://localhost:4000/api/v1/health
```

### Database Connection Test
```bash
cd backend
node -e "require('./src/core/database').default.execute('SELECT 1').then(() => console.log('✅ Connected')).catch(e => console.error('❌ Error:', e))"
```

---

## 📊 View Logs

### Backend Logs
Check Terminal 1 where backend is running

### Frontend Logs
Check Terminal 2 where frontend is running

### Browser Console
Press `F12` → Console tab

---

## 🎨 Development Workflow

1. **Start servers** (backend + frontend)
2. **Make changes** in code
3. **Auto-reload** happens automatically
4. **Test** in browser
5. **Check logs** if errors
6. **Commit** when done

```bash
git add .
git commit -m "Your message"
git push origin main
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
PORT=4000
JWT_SECRET=your-secret
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

## 📞 Quick Help

### Check if Backend is Running
```bash
curl http://localhost:4000/api/v1/health
```

### Check if Frontend is Running
Open: http://localhost:3000

### Check Database Connection
Go to Supabase Dashboard → Table Editor

### View API Endpoints
Check: `backend/src/modules/*/routes.ts`

---

## 💾 Backup & Restore

### Backup Current Config
```bash
# Already done! Files are:
# backend/.env.vps.backup
# frontend/.env.vps.backup
```

### Export Database (Supabase)
1. Supabase Dashboard → Database → Backups
2. Or use SQL Editor to export specific tables

---

## 🚀 Deploy to VPS

When ready to deploy:
1. Switch to VPS config (see above)
2. Push to git
3. Pull on VPS
4. Restart services

See: `docs/deployment/UPDATE-SERVER.md`

---

## ✅ Daily Checklist

- [ ] Backend running on port 4000
- [ ] Frontend running on port 3000
- [ ] No errors in terminal logs
- [ ] Can access admin panel
- [ ] Database connection working
- [ ] Changes auto-reload

---

**Keep this file handy for quick reference! 📌**
