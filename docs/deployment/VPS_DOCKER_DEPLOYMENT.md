# VPS Docker Deployment Guide 🚀

Complete guide to deploy Ghumo Firo India to VPS using Docker Compose.

---

## 📋 Prerequisites

### On Your Local Machine
- Git installed
- SSH access to VPS
- Code editor

### On VPS
- Ubuntu 20.04+ or similar Linux distribution
- Root or sudo access
- Minimum 8GB RAM (15.6GB recommended)
- 50GB+ disk space
- Domain name pointed to VPS IP (optional but recommended)

---

## 🎯 Deployment Overview

```
Local Machine → Git Push → VPS → Docker Build → Running Containers
```

**Services:**
- PostgreSQL 16 (Database)
- Redis 7 (Cache)
- Backend API (Node.js + Express)
- Frontend (Next.js)
- Nginx (Reverse Proxy + SSL)

---

## 📦 Step 1: Prepare Local Environment

### 1.1 Update Docker Files (Already Done ✅)
- ✅ `.dockerignore` files created
- ✅ Dockerfiles updated to Node 24
- ✅ Health checks added
- ✅ Next.js standalone output configured

### 1.2 Generate Production Secrets

```bash
# Generate JWT secrets (run on local machine)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy output for JWT_SECRET

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy output for JWT_REFRESH_SECRET

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output for DB_PASSWORD

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output for REDIS_PASSWORD
```

### 1.3 Create Production Environment File

Create `infrastructure/docker/.env.production`:

```env
# ============================================
# PRODUCTION ENVIRONMENT VARIABLES
# ============================================

# Database
DB_PASSWORD=<paste_generated_db_password>
POSTGRES_DB=ghumo_phiro
POSTGRES_USER=ghumo_user

# Redis
REDIS_PASSWORD=<paste_generated_redis_password>

# JWT
JWT_SECRET=<paste_generated_jwt_secret>
JWT_REFRESH_SECRET=<paste_generated_jwt_refresh_secret>

# Cloudinary (from your account)
CLOUDINARY_CLOUD_NAME=djoqjwwid
CLOUDINARY_API_KEY=661467625611547
CLOUDINARY_API_SECRET=sFMTi9xtJnRihYvGGmcQ32nhubU

# URLs (update with your domain or IP)
FRONTEND_URL=https://ghumophiroindia.com
NEXT_PUBLIC_API_URL=https://ghumophiroindia.com/api/v1
NEXT_PUBLIC_APP_URL=https://ghumophiroindia.com

# CORS (update with your domain)
CORS_ORIGIN=https://ghumophiroindia.com,https://www.ghumophiroindia.com
```

**⚠️ IMPORTANT:** Never commit this file to Git! It's already in `.gitignore`.

---

## 🖥️ Step 2: Prepare VPS

### 2.1 Connect to VPS

```bash
ssh root@YOUR_VPS_IP
# Or if you have a user:
ssh your_user@YOUR_VPS_IP
```

### 2.2 Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.3 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (if not root)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 2.4 Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 2.5 Install Certbot (for SSL)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2.6 Create Project Directory

```bash
sudo mkdir -p /var/www/ghumo-phiro
sudo chown -R $USER:$USER /var/www/ghumo-phiro
cd /var/www/ghumo-phiro
```

---

## 📤 Step 3: Deploy Code to VPS

### Option A: Using Git (Recommended)

```bash
# On VPS
cd /var/www/ghumo-phiro
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .

# Or if already cloned
git pull origin main
```

### Option B: Using SCP (Manual)

```bash
# On local machine
cd "c:\Users\kamle\Desktop\travel kiro"

# Copy entire project (excluding node_modules)
scp -r backend frontend infrastructure shared package.json your_user@YOUR_VPS_IP:/var/www/ghumo-phiro/
```

### 3.1 Upload Environment File

```bash
# On local machine
scp infrastructure/docker/.env.production your_user@YOUR_VPS_IP:/var/www/ghumo-phiro/infrastructure/docker/.env
```

---

## 🐳 Step 4: Build and Start Docker Containers

### 4.1 Navigate to Docker Directory

```bash
cd /var/www/ghumo-phiro/infrastructure/docker
```

### 4.2 Build Images

```bash
# Build all images (takes 5-10 minutes)
docker-compose -f docker-compose.production.yml build

# Or build individually
docker-compose -f docker-compose.production.yml build postgres
docker-compose -f docker-compose.production.yml build redis
docker-compose -f docker-compose.production.yml build backend
docker-compose -f docker-compose.production.yml build frontend
```

### 4.3 Start Services

```bash
# Start all services in detached mode
docker-compose -f docker-compose.production.yml up -d

# Check status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f
```

### 4.4 Verify Services

```bash
# Check if all containers are running
docker ps

# Expected output:
# - ghumo-postgres (healthy)
# - ghumo-redis (healthy)
# - ghumo-backend (healthy)
# - ghumo-frontend (running)
```

---

## 🗄️ Step 5: Setup Database

### 5.1 Run Migrations

```bash
# Access backend container
docker exec -it ghumo-backend sh

# Inside container, run migrations
npm run db:push

# Exit container
exit
```

### 5.2 Run Seeds (Import Location Data)

```bash
# Copy seed files to container
docker cp ../../backend/src/core/database/seeds ghumo-backend:/app/seeds

# Access PostgreSQL container
docker exec -it ghumo-postgres psql -U ghumo_user -d ghumo_phiro

# Inside PostgreSQL, run seeds in order
\i /app/seeds/001_insert_indian_states.sql
\i /app/seeds/002_insert_rajasthan_cities.sql
\i /app/seeds/003_insert_rajasthan_places_part1.sql
\i /app/seeds/004_insert_rajasthan_places_part2.sql
\i /app/seeds/005_mark_locations_popular.sql
\i /app/seeds/006_insert_jaisalmer_places.sql
\i /app/seeds/007_insert_mount_abu_places.sql
\i /app/seeds/008_insert_pushkar_places.sql
\i /app/seeds/009_insert_bikaner_places.sql
\i /app/seeds/010_insert_sawai_madhopur_places.sql
\i /app/seeds/011_insert_chittorgarh_places.sql

# Verify data
SELECT type, COUNT(*) FROM locations GROUP BY type;

# Exit PostgreSQL
\q
```

**Expected Output:**
```
 type    | count
---------+-------
 country |     1
 state   |    13
 city    |     8
 place   |    65
```

---

## 🌐 Step 6: Configure Nginx

### 6.1 Copy Nginx Configuration

```bash
sudo cp /var/www/ghumo-phiro/infrastructure/nginx/nginx.conf /etc/nginx/sites-available/ghumo-phiro

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/ghumo-phiro /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default
```

### 6.2 Update Nginx Config for Your Domain

```bash
sudo nano /etc/nginx/sites-available/ghumo-phiro
```

**Update these lines:**
```nginx
server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;
```

### 6.3 Test Nginx Configuration

```bash
sudo nginx -t

# If OK, reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 Step 7: Setup SSL Certificate

### 7.1 Obtain SSL Certificate

```bash
sudo certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com
```

**Follow prompts:**
1. Enter email address
2. Agree to terms
3. Choose to redirect HTTP to HTTPS (recommended)

### 7.2 Test Auto-Renewal

```bash
sudo certbot renew --dry-run
```

### 7.3 Update Nginx Config with SSL Paths

Certbot should auto-update, but verify these lines exist:

```nginx
ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN.com/privkey.pem;
```

---

## ✅ Step 8: Verify Deployment

### 8.1 Check Services

```bash
# Check Docker containers
docker ps

# Check logs
docker-compose -f /var/www/ghumo-phiro/infrastructure/docker/docker-compose.production.yml logs -f backend
docker-compose -f /var/www/ghumo-phiro/infrastructure/docker/docker-compose.production.yml logs -f frontend
```

### 8.2 Test Endpoints

```bash
# Test backend health
curl http://localhost:4000/health

# Test frontend
curl http://localhost:3000

# Test through Nginx
curl https://YOUR_DOMAIN.com/api/v1/health
curl https://YOUR_DOMAIN.com
```

### 8.3 Test in Browser

1. Open `https://YOUR_DOMAIN.com`
2. Check homepage loads
3. Test navigation
4. Try login/register
5. Check admin panel

---

## 🔧 Step 9: Create Admin User

### 9.1 Access Backend Container

```bash
docker exec -it ghumo-backend sh
```

### 9.2 Create Admin User (via API or Database)

**Option A: Using API (Recommended)**

```bash
# On VPS or local machine
curl -X POST https://YOUR_DOMAIN.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@ghumophiroindia.com",
    "password": "YourSecurePassword123!",
    "phone": "+919876543210"
  }'
```

**Option B: Using Database**

```bash
# Access PostgreSQL
docker exec -it ghumo-postgres psql -U ghumo_user -d ghumo_phiro

# Update user role to admin
UPDATE users SET role = 'admin' WHERE email = 'admin@ghumophiroindia.com';

# Verify
SELECT id, name, email, role FROM users WHERE role = 'admin';

# Exit
\q
```

---

## 📊 Step 10: Monitoring & Maintenance

### 10.1 View Logs

```bash
# All services
docker-compose -f /var/www/ghumo-phiro/infrastructure/docker/docker-compose.production.yml logs -f

# Specific service
docker logs -f ghumo-backend
docker logs -f ghumo-frontend
docker logs -f ghumo-postgres
docker logs -f ghumo-redis
```

### 10.2 Restart Services

```bash
cd /var/www/ghumo-phiro/infrastructure/docker

# Restart all
docker-compose -f docker-compose.production.yml restart

# Restart specific service
docker-compose -f docker-compose.production.yml restart backend
docker-compose -f docker-compose.production.yml restart frontend
```

### 10.3 Stop Services

```bash
# Stop all
docker-compose -f docker-compose.production.yml stop

# Stop specific service
docker-compose -f docker-compose.production.yml stop backend
```

### 10.4 Update Application

```bash
# Pull latest code
cd /var/www/ghumo-phiro
git pull origin main

# Rebuild and restart
cd infrastructure/docker
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d

# Run migrations if needed
docker exec -it ghumo-backend npm run db:push
```

### 10.5 Backup Database

```bash
# Create backup
docker exec ghumo-postgres pg_dump -U ghumo_user ghumo_phiro > backup_$(date +%Y%m%d).sql

# Restore backup
docker exec -i ghumo-postgres psql -U ghumo_user ghumo_phiro < backup_20260531.sql
```

### 10.6 Monitor Resources

```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check Docker stats
docker stats

# Check container resource usage
docker-compose -f docker-compose.production.yml top
```

---

## 🚨 Troubleshooting

### Issue 1: Container Won't Start

```bash
# Check logs
docker logs ghumo-backend

# Common causes:
# - Missing environment variables
# - Port already in use
# - Database connection failed

# Solution:
# 1. Check .env file
# 2. Verify DATABASE_URL
# 3. Check if ports 3000, 4000, 5432, 6379 are free
```

### Issue 2: Database Connection Failed

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check PostgreSQL logs
docker logs ghumo-postgres

# Test connection
docker exec -it ghumo-postgres psql -U ghumo_user -d ghumo_phiro

# Solution:
# 1. Verify DB_PASSWORD in .env
# 2. Check DATABASE_URL format
# 3. Restart postgres container
```

### Issue 3: Frontend Can't Connect to Backend

```bash
# Check backend is running
curl http://localhost:4000/health

# Check NEXT_PUBLIC_API_URL
docker exec ghumo-frontend env | grep NEXT_PUBLIC_API_URL

# Solution:
# 1. Verify NEXT_PUBLIC_API_URL in .env
# 2. Rebuild frontend: docker-compose build frontend
# 3. Restart: docker-compose up -d frontend
```

### Issue 4: Nginx 502 Bad Gateway

```bash
# Check backend is running
docker ps | grep backend

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test backend directly
curl http://localhost:4000/health

# Solution:
# 1. Restart backend container
# 2. Check Nginx upstream configuration
# 3. Verify port 4000 is accessible
```

### Issue 5: SSL Certificate Issues

```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Issue 6: Out of Memory

```bash
# Check memory usage
free -h
docker stats

# Solution:
# 1. Increase VPS RAM
# 2. Reduce Docker container limits
# 3. Add swap space:
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Issue 7: Disk Space Full

```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a --volumes

# Remove old images
docker image prune -a

# Remove old logs
sudo find /var/log -type f -name "*.log" -mtime +30 -delete
```

---

## 📝 Useful Commands

### Docker Commands

```bash
# List containers
docker ps
docker ps -a

# View logs
docker logs <container_name>
docker logs -f <container_name>  # Follow logs

# Execute command in container
docker exec -it <container_name> sh
docker exec -it <container_name> bash

# Stop container
docker stop <container_name>

# Start container
docker start <container_name>

# Restart container
docker restart <container_name>

# Remove container
docker rm <container_name>

# Remove image
docker rmi <image_name>

# Clean up
docker system prune -a
```

### Docker Compose Commands

```bash
# Start services
docker-compose -f docker-compose.production.yml up -d

# Stop services
docker-compose -f docker-compose.production.yml stop

# Restart services
docker-compose -f docker-compose.production.yml restart

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Build images
docker-compose -f docker-compose.production.yml build

# Pull images
docker-compose -f docker-compose.production.yml pull

# Remove containers
docker-compose -f docker-compose.production.yml down

# Remove containers and volumes
docker-compose -f docker-compose.production.yml down -v
```

### Database Commands

```bash
# Access PostgreSQL
docker exec -it ghumo-postgres psql -U ghumo_user -d ghumo_phiro

# Inside PostgreSQL:
\l                    # List databases
\dt                   # List tables
\d table_name         # Describe table
\q                    # Quit

# Backup database
docker exec ghumo-postgres pg_dump -U ghumo_user ghumo_phiro > backup.sql

# Restore database
docker exec -i ghumo-postgres psql -U ghumo_user ghumo_phiro < backup.sql
```

### Redis Commands

```bash
# Access Redis
docker exec -it ghumo-redis redis-cli -a YOUR_REDIS_PASSWORD

# Inside Redis:
PING                  # Test connection
KEYS *                # List all keys
GET key_name          # Get value
DEL key_name          # Delete key
FLUSHALL              # Clear all data
INFO                  # Server info
```

---

## 🔐 Security Checklist

- [ ] Strong passwords for database and Redis
- [ ] JWT secrets are random and secure (64+ characters)
- [ ] `.env` file is not committed to Git
- [ ] SSL certificate is installed and auto-renewing
- [ ] Firewall is configured (UFW)
- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] Fail2ban installed
- [ ] Regular backups scheduled
- [ ] Nginx security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured

---

## 📈 Performance Optimization

### 1. Enable Gzip Compression (Already in Nginx)
✅ Configured in `nginx.conf`

### 2. Enable Redis Caching
✅ Already implemented in backend

### 3. Optimize Database
```sql
-- Create indexes (if not exists)
CREATE INDEX IF NOT EXISTS idx_locations_slug ON locations(slug);
CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(type);
CREATE INDEX IF NOT EXISTS idx_locations_parent_id ON locations(parent_id);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
```

### 4. Monitor Performance
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Monitor in real-time
htop           # CPU and memory
iotop          # Disk I/O
nethogs        # Network usage
```

---

## 🎯 Quick Reference

### URLs
- **Frontend:** https://YOUR_DOMAIN.com
- **Backend API:** https://YOUR_DOMAIN.com/api/v1
- **Admin Panel:** https://YOUR_DOMAIN.com/dashboard
- **Health Check:** https://YOUR_DOMAIN.com/api/v1/health

### Ports
- **Frontend:** 3000 (internal)
- **Backend:** 4000 (internal)
- **PostgreSQL:** 5432 (internal)
- **Redis:** 6379 (internal)
- **Nginx:** 80, 443 (external)

### File Locations
- **Project:** `/var/www/ghumo-phiro`
- **Docker:** `/var/www/ghumo-phiro/infrastructure/docker`
- **Nginx:** `/etc/nginx/sites-available/ghumo-phiro`
- **SSL:** `/etc/letsencrypt/live/YOUR_DOMAIN.com`
- **Logs:** `/var/log/nginx/`

---

## 📞 Support

**Need help?**
- Check logs: `docker-compose logs -f`
- Review troubleshooting section above
- Check Docker documentation: https://docs.docker.com
- Check Nginx documentation: https://nginx.org/en/docs/

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Generated production secrets
- [ ] Created `.env.production` file
- [ ] Updated domain in Nginx config
- [ ] Tested Docker build locally (optional)

### VPS Setup
- [ ] Connected to VPS
- [ ] Updated system packages
- [ ] Installed Docker and Docker Compose
- [ ] Installed Nginx
- [ ] Installed Certbot
- [ ] Created project directory

### Deployment
- [ ] Deployed code to VPS
- [ ] Uploaded `.env.production`
- [ ] Built Docker images
- [ ] Started Docker containers
- [ ] Verified all containers running
- [ ] Ran database migrations
- [ ] Ran database seeds
- [ ] Configured Nginx
- [ ] Obtained SSL certificate
- [ ] Created admin user

### Post-Deployment
- [ ] Tested frontend in browser
- [ ] Tested backend API
- [ ] Tested admin panel login
- [ ] Verified database data
- [ ] Checked all logs
- [ ] Set up monitoring
- [ ] Scheduled database backups
- [ ] Documented credentials securely

---

**Status:** ✅ Complete Deployment Guide

**Estimated Time:** 1-2 hours

**Last Updated:** May 31, 2026

---

## 🎉 Congratulations!

Your Ghumo Firo India application is now deployed on VPS with Docker! 🚀

**Next Steps:**
1. Test all features thoroughly
2. Set up monitoring and alerts
3. Schedule regular backups
4. Plan for scaling if needed

**Happy Deploying!** 🎊
