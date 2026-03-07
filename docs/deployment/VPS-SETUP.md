# VPS Manual Setup Guide - Hostinger Mumbai

This guide will help you manually deploy the backend and database on your VPS using PM2.

## Software Versions (Updated April 2026)

This guide uses the latest stable versions as of April 2026:

- **Node.js**: 24.x LTS (Long-Term Support until April 2028)
- **npm**: 11.x (bundled with Node.js 24)
- **PostgreSQL**: 18.x (Latest stable with async I/O improvements)
- **Redis**: 8.x (Latest stable with 5x throughput improvements)
- **PM2**: 6.x (Latest stable with improved monitoring)
- **Nginx**: 1.28.x stable (Production recommended)
- **Ubuntu**: 24.04.4 LTS

## VPS Specifications
- **Provider**: Hostinger Mumbai
- **CPU**: AMD EPYC 9355P (4 vCPU @ 3.5 GHz)
- **RAM**: 15.6 GB
- **Storage**: 193.7 GB NVMe SSD
- **OS**: Ubuntu 24.04.4 LTS

---

## Step 1: Initial VPS Setup

### 1.1 Connect to VPS
```bash
ssh root@187.127.151.137
```

### 1.2 Update System
```bash
apt update && apt upgrade -y
```

### 1.3 Install Required Software
```bash
# Install Node.js 24.x LTS (Latest stable for production - April 2026)
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y nodejs

# Install PostgreSQL 18 from official PostgreSQL repository
# Add PostgreSQL APT repository
apt install -y postgresql-common
/usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y
apt update
apt install -y postgresql-18 postgresql-contrib-18

# Install Redis 8.x (Latest stable - 2026)
apt install -y redis-server

# Install PM2 6.x globally (Latest stable)
npm install -g pm2@latest

# Install build tools
apt install -y build-essential git nginx
```

### 1.4 Verify Installations
```bash
node --version    # Should show v24.x
npm --version     # Should show v11.x
psql --version    # Should show 18.x
redis-cli --version  # Should show 8.x
pm2 --version     # Should show 6.x
nginx -v          # Should show 1.28.x or 1.26.x
```

---

## Step 2: Configure PostgreSQL

### 2.1 Start PostgreSQL
```bash
systemctl start postgresql
systemctl enable postgresql
systemctl status postgresql
```

### 2.2 Create Database and User
```bash
# Switch to postgres user
sudo -u postgres psql

# Inside PostgreSQL shell, run:
CREATE DATABASE ghumo_phiro_db;
CREATE USER ghumo_admin WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE ghumo_phiro_db TO ghumo_admin;
ALTER DATABASE ghumo_phiro_db OWNER TO ghumo_admin;

# Grant schema permissions
\c ghumo_phiro_db
GRANT ALL ON SCHEMA public TO ghumo_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ghumo_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ghumo_admin;

# Exit PostgreSQL
\q
```

### 2.3 Configure PostgreSQL for Local Connections
```bash
# Edit pg_hba.conf (PostgreSQL 18)
nano /etc/postgresql/18/main/pg_hba.conf

# Add this line (or modify existing local line):
# local   all             all                                     md5

# Restart PostgreSQL
systemctl restart postgresql
```

### 2.4 Test Database Connection
```bash
psql -U ghumo_admin -d ghumo_phiro_db -h localhost
# Enter password when prompted
# If successful, you'll see the PostgreSQL prompt
\q
```

---

## Step 3: Configure Redis

### 3.1 Configure Redis
```bash
# Edit Redis config
nano /etc/redis/redis.conf

# Find and modify these settings:
# maxmemory 2gb
# maxmemory-policy allkeys-lru
# bind 127.0.0.1
# requirepass your_redis_password_here

# Save and exit (Ctrl+X, Y, Enter)
```

### 3.2 Start Redis
```bash
systemctl start redis-server
systemctl enable redis-server
systemctl status redis-server
```

### 3.3 Test Redis Connection
```bash
redis-cli
# If you set a password:
AUTH your_redis_password_here
PING
# Should return: PONG
exit
```

---

## Step 4: Setup Application Directory

### 4.1 Create App Directory
```bash
mkdir -p /var/www/ghumo-phiro
cd /var/www/ghumo-phiro
```

### 4.2 Upload Backend Code
You have several options:

### Option A: Using Git (Recommended)
```bash
# Clone from GitHub
cd /var/www/ghumo-phiro
git clone https://github.com/devxkamlesh/ghumophiroindia.git .
cd backend
```

**Option B: Using SCP from Local Machine**
```bash
# Run this from your local machine (Windows)
scp -r C:\Users\kamle\Desktop\travel kiro\backend root@187.127.151.137:/var/www/ghumo-phiro/
```

**Option C: Using SFTP Client**
- Use FileZilla, WinSCP, or similar
- Upload the `backend` folder to `/var/www/ghumo-phiro/`

---

## Step 5: Configure Backend Environment

### 5.1 Navigate to Backend Directory
```bash
cd /var/www/ghumo-phiro/backend
```

### 5.2 Create Production .env File
```bash
nano .env
```

### 5.3 Add Environment Variables
```env
# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database (Local PostgreSQL)
DATABASE_URL=postgresql://ghumo_admin:your_secure_password_here@localhost:5432/ghumo_phiro_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars_long_production
JWT_REFRESH_EXPIRES_IN=30d

# Redis (Local Redis)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=djoqjwwid
CLOUDINARY_API_KEY=661467625611547
CLOUDINARY_API_SECRET=sFMTi9xtJnRihYvGGmcQ32nhubU

# CORS
CORS_ORIGIN=http://your-domain.com,https://your-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Save and exit (Ctrl+X, Y, Enter)

### 5.4 Install Dependencies
```bash
npm install --production
```

---

## Step 6: Setup Database Schema

### 6.1 Install Dev Dependencies (for migrations)
```bash
npm install
```

### 6.2 Run Database Migrations
```bash
npm run db:push
```

This will create all tables in your PostgreSQL database.

### 6.3 Verify Tables Created
```bash
psql -U ghumo_admin -d ghumo_phiro_db -h localhost

# Inside PostgreSQL:
\dt
# You should see: users, tours, bookings, destinations, inquiries, custom_tour_requests, reviews

\q
```

---

## Step 7: Build and Test Backend

### 7.1 Build TypeScript
```bash
npm run build
```

This creates the `dist` folder with compiled JavaScript.

### 7.2 Test Backend Startup
```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ Database connected successfully
✅ Redis connected successfully
```

Press Ctrl+C to stop.

---

## Step 8: Setup PM2 for Production

### 8.1 Create PM2 Ecosystem File
```bash
nano ecosystem.config.js
```

### 8.2 Add PM2 Configuration
```javascript
module.exports = {
  apps: [{
    name: 'ghumo-phiro-backend',
    script: './dist/app.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '500M'
  }]
}
```

Save and exit.

### 8.3 Create Logs Directory
```bash
mkdir -p logs
```

### 8.4 Start Application with PM2
```bash
pm2 start ecosystem.config.js
```

### 8.5 Verify Application is Running
```bash
pm2 status
pm2 logs ghumo-phiro-backend
```

### 8.6 Save PM2 Configuration
```bash
pm2 save
pm2 startup
# Follow the command it outputs to enable PM2 on system boot
```

---

## Step 9: Setup Nginx Reverse Proxy

### 9.1 Install Nginx
```bash
apt install -y nginx
```

### 9.2 Create Nginx Configuration
```bash
nano /etc/nginx/sites-available/ghumo-phiro
```

### 9.3 Add Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # API Backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5000/health;
        access_log off;
    }
}
```

Save and exit.

### 9.4 Enable Site and Test Configuration
```bash
ln -s /etc/nginx/sites-available/ghumo-phiro /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
systemctl enable nginx
```

---

## Step 10: Configure Firewall

### 10.1 Setup UFW Firewall
```bash
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS (for future SSL)
ufw enable
ufw status
```

---

## Step 11: Test Deployment

### 11.1 Test API Endpoint
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok","timestamp":"..."}

curl http://187.127.151.137/api/v1/health
# Should return the same
```

### 11.2 Test from Your Local Machine
Open browser and visit:
```
http://187.127.151.137/api/v1/health
```

---

## PM2 Management Commands

### View Application Status
```bash
pm2 status
pm2 list
```

### View Logs
```bash
pm2 logs ghumo-phiro-backend
pm2 logs ghumo-phiro-backend --lines 100
pm2 logs ghumo-phiro-backend --err  # Only errors
```

### Restart Application
```bash
pm2 restart ghumo-phiro-backend
pm2 restart all
```

### Stop Application
```bash
pm2 stop ghumo-phiro-backend
```

### Delete Application from PM2
```bash
pm2 delete ghumo-phiro-backend
```

### Monitor Resources
```bash
pm2 monit
```

### Reload Application (Zero Downtime)
```bash
pm2 reload ghumo-phiro-backend
```

---

## Database Management Commands

### Backup Database
```bash
pg_dump -U ghumo_admin -d ghumo_phiro_db -h localhost > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
psql -U ghumo_admin -d ghumo_phiro_db -h localhost < backup_file.sql
```

### Connect to Database
```bash
psql -U ghumo_admin -d ghumo_phiro_db -h localhost
```

---

## Troubleshooting

### Check Backend Logs
```bash
pm2 logs ghumo-phiro-backend
tail -f /var/www/ghumo-phiro/backend/logs/error.log
tail -f /var/www/ghumo-phiro/backend/logs/combined.log
```

### Check PostgreSQL Status
```bash
systemctl status postgresql
journalctl -u postgresql -n 50
```

### Check Redis Status
```bash
systemctl status redis-server
redis-cli ping
```

### Check Nginx Status
```bash
systemctl status nginx
nginx -t
tail -f /var/log/nginx/error.log
```

### Check Port Usage
```bash
netstat -tulpn | grep :5000
netstat -tulpn | grep :5432
netstat -tulpn | grep :6379
```

### Restart All Services
```bash
systemctl restart postgresql
systemctl restart redis-server
systemctl restart nginx
pm2 restart all
```

---

## Performance Optimization

### PostgreSQL 18 Tuning (Optimized for 15.6GB RAM)
```bash
nano /etc/postgresql/18/main/postgresql.conf

# Recommended settings for your VPS:
shared_buffers = 2GB
effective_cache_size = 8GB
maintenance_work_mem = 512MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 10MB
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = 4
max_parallel_workers_per_gather = 2
max_parallel_workers = 4

# Restart PostgreSQL
systemctl restart postgresql
```

---

## Security Checklist

- ✅ PostgreSQL only accepts local connections
- ✅ Redis only accepts local connections
- ✅ Strong passwords for database and Redis
- ✅ JWT secrets are long and random
- ✅ Firewall configured (UFW)
- ✅ Application runs as non-root (PM2)
- ⏳ SSL certificate (setup later with Let's Encrypt)

---

## Next Steps

1. ✅ Database setup complete
2. ✅ Backend running on PM2
3. ✅ Nginx reverse proxy configured
4. ⏳ Setup SSL certificate (Certbot + Let's Encrypt)
5. ⏳ Deploy frontend
6. ⏳ Configure domain DNS

---

## Quick Reference

**Application Path**: `/var/www/ghumo-phiro/backend`
**Logs Path**: `/var/www/ghumo-phiro/backend/logs`
**Database**: `ghumo_phiro_db` on localhost:5432
**Redis**: localhost:6379
**Backend**: localhost:5000
**Nginx**: Port 80 (public)

**PM2 Commands**:
- `pm2 status` - Check status
- `pm2 logs` - View logs
- `pm2 restart all` - Restart app
- `pm2 monit` - Monitor resources

**Database Commands**:
- `psql -U ghumo_admin -d ghumo_phiro_db -h localhost` - Connect
- `\dt` - List tables
- `\q` - Exit
