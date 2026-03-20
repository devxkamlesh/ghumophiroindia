# Localhost Setup Guide

This guide will help you run the entire project on your local machine with either Supabase or local PostgreSQL.

---

## 🎯 Prerequisites

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### Database Options (Choose One)

#### Option A: Supabase (Recommended for Beginners)
- Free tier available
- No local installation needed
- Automatic backups
- Built-in authentication

#### Option B: Local PostgreSQL
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- Full control over database
- Works offline

---

## 📦 Option A: Setup with Supabase

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: ghumo-phiro-local
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup

### Step 2: Get Database Connection Details

1. In your Supabase project, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Copy the **URI** (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your actual password

### Step 3: Configure Backend

1. Open `backend/.env` file
2. Update the database URL:
   ```env
   # Database
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   
   # Server
   PORT=4000
   NODE_ENV=development
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-too
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   
   # Redis (Optional - comment out if not using)
   # REDIS_URL=redis://localhost:6379
   
   # CORS
   CORS_ORIGIN=http://localhost:3000
   
   # Upload
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=5242880
   ```

### Step 4: Run Database Migrations

```bash
cd backend
npm install
npm run db:push
```

This will create all tables in your Supabase database.

### Step 5: Start Backend

```bash
npm run dev
```

Backend will run on: **http://localhost:4000**

### Step 6: Configure Frontend

1. Open `frontend/.env.local` (create if doesn't exist)
2. Add:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
   ```

### Step 7: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 📦 Option B: Setup with Local PostgreSQL

### Step 1: Install PostgreSQL

#### Windows
1. Download from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run installer
3. Remember the password you set for `postgres` user
4. Default port: 5432

#### Mac (using Homebrew)
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

#### Windows (using pgAdmin or psql)
```bash
# Open Command Prompt as Administrator
psql -U postgres

# In psql:
CREATE DATABASE ghumo_phiro_local;
CREATE USER ghumo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ghumo_phiro_local TO ghumo_user;
\q
```

#### Mac/Linux
```bash
# Switch to postgres user
sudo -u postgres psql

# In psql:
CREATE DATABASE ghumo_phiro_local;
CREATE USER ghumo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ghumo_phiro_local TO ghumo_user;
\q
```

### Step 3: Configure Backend

1. Open `backend/.env` file
2. Update:
   ```env
   # Database
   DATABASE_URL=postgresql://ghumo_user:your_password@localhost:5432/ghumo_phiro_local
   
   # Server
   PORT=4000
   NODE_ENV=development
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-too
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   
   # Redis (Optional - comment out if not using)
   # REDIS_URL=redis://localhost:6379
   
   # CORS
   CORS_ORIGIN=http://localhost:3000
   
   # Upload
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=5242880
   ```

### Step 4: Run Database Migrations

```bash
cd backend
npm install
npm run db:push
```

### Step 5: Start Backend

```bash
npm run dev
```

Backend will run on: **http://localhost:4000**

### Step 6: Configure Frontend

1. Open `frontend/.env.local` (create if doesn't exist)
2. Add:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
   ```

### Step 7: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 🎨 Create First Admin User

### Option 1: Using API (Recommended)

```bash
# Using curl (Windows: use Git Bash or PowerShell)
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "Admin@123",
    "phone": "1234567890"
  }'
```

### Option 2: Using Database

```sql
-- Connect to your database
-- Supabase: Use SQL Editor in Supabase dashboard
-- Local: psql -U ghumo_user -d ghumo_phiro_local

-- Insert admin user (password: Admin@123)
INSERT INTO users (name, email, password, role, is_active, created_at)
VALUES (
  'Admin User',
  'admin@example.com',
  '$2b$10$rQ8YvVvVvVvVvVvVvVvVvOqKqKqKqKqKqKqKqKqKqKqKqKqKqK',
  'admin',
  true,
  NOW()
);
```

### Option 3: Promote Existing User

```sql
-- Make any user an admin
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 🚀 Quick Start Commands

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api/v1
- **Admin Panel**: http://localhost:3000/dashboard

---

## 🔧 Common Issues & Solutions

### Issue 1: "Port 4000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:4000 | xargs kill -9
```

### Issue 2: "Cannot connect to database"
**Solution:**
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Check username/password
- Ensure database exists

### Issue 3: "Module not found"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: "CORS error"
**Solution:**
- Check `CORS_ORIGIN` in backend `.env` matches frontend URL
- Restart backend after changing `.env`

### Issue 5: "Database migration failed"
**Solution:**
```bash
# Reset database (WARNING: Deletes all data)
cd backend
npm run db:push -- --force
```

---

## 📊 Database Management

### Supabase
- **Dashboard**: https://app.supabase.com
- **SQL Editor**: Run queries directly
- **Table Editor**: Visual interface
- **Backups**: Automatic (paid plans)

### Local PostgreSQL

#### Using pgAdmin (GUI)
1. Download [pgAdmin](https://www.pgadmin.org/)
2. Connect to localhost:5432
3. Browse tables visually

#### Using psql (CLI)
```bash
# Connect
psql -U ghumo_user -d ghumo_phiro_local

# List tables
\dt

# View table structure
\d locations

# Run query
SELECT * FROM locations;

# Exit
\q
```

---

## 🗄️ Import Sample Data

### Using Admin Panel
1. Go to http://localhost:3000/dashboard/locations
2. Click "Add Location"
3. Fill in details
4. Save

### Using SQL
```bash
# Supabase: Use SQL Editor
# Local: psql -U ghumo_user -d ghumo_phiro_local

# Copy and paste from location_import_template.csv
# Or use the SQL scripts from LOCATION_EXCEL_FORMAT.md
```

---

## 🔐 Environment Variables Reference

### Backend `.env`
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Server
PORT=4000
NODE_ENV=development

# JWT
JWT_SECRET=change-this-secret-key
JWT_REFRESH_SECRET=change-this-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# CORS
CORS_ORIGIN=http://localhost:3000

# Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

## 📝 Development Workflow

### 1. Start Development
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### 2. Make Changes
- Edit files in `backend/src/` or `frontend/src/`
- Both servers auto-reload on save

### 3. Test Changes
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/v1

### 4. Commit Changes
```bash
git add .
git commit -m "Your message"
git push origin main
```

---

## 🎯 Next Steps

1. ✅ Setup database (Supabase or Local)
2. ✅ Configure environment variables
3. ✅ Run migrations
4. ✅ Start backend and frontend
5. ✅ Create admin user
6. ✅ Login to admin panel
7. ✅ Add locations
8. ✅ Mark locations as popular
9. ✅ Test the website

---

## 📞 Need Help?

### Check Logs
```bash
# Backend logs
cd backend
npm run dev

# Frontend logs
cd frontend
npm run dev
```

### Database Connection Test
```bash
cd backend
node -e "require('./src/core/database').default.execute('SELECT 1').then(() => console.log('✅ Connected')).catch(e => console.error('❌ Error:', e))"
```

### API Health Check
```bash
curl http://localhost:4000/api/v1/health
```

---

## 🚀 Production Deployment

When ready to deploy:
1. See `docs/deployment/DEPLOYMENT.md`
2. See `docs/deployment/UPDATE-SERVER.md`
3. Update environment variables for production
4. Use production database (not localhost)

---

## 💡 Pro Tips

1. **Use Supabase for development** - Easier setup, no local PostgreSQL needed
2. **Keep `.env` files secure** - Never commit to git
3. **Use different databases** - One for dev, one for production
4. **Backup regularly** - Export data before major changes
5. **Check logs** - Most issues show up in terminal logs

---

## ✅ Verification Checklist

- [ ] Node.js installed (v18+)
- [ ] Database created (Supabase or Local)
- [ ] Backend `.env` configured
- [ ] Frontend `.env.local` configured
- [ ] Backend running on port 4000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can login to admin panel
- [ ] Can add locations
- [ ] Locations show on homepage

---

**You're all set! 🎉**
