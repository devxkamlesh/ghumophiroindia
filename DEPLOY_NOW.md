# 🚀 Deploy Now - Quick Start Card

## ⚡ 5-Minute Setup Guide

### Step 1: Generate Secrets (Local Machine)
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy these 4 outputs.

### Step 2: Create `.env.production`
Create `infrastructure/docker/.env.production`:
```env
DB_PASSWORD=<paste_3rd_output>
REDIS_PASSWORD=<paste_4th_output>
JWT_SECRET=<paste_1st_output>
JWT_REFRESH_SECRET=<paste_2nd_output>
CLOUDINARY_CLOUD_NAME=djoqjwwid
CLOUDINARY_API_KEY=661467625611547
CLOUDINARY_API_SECRET=sFMTi9xtJnRihYvGGmcQ32nhubU
FRONTEND_URL=https://YOUR_DOMAIN.com
NEXT_PUBLIC_API_URL=https://YOUR_DOMAIN.com/api/v1
NEXT_PUBLIC_APP_URL=https://YOUR_DOMAIN.com
CORS_ORIGIN=https://YOUR_DOMAIN.com
```
Replace `YOUR_DOMAIN.com` with your actual domain.

### Step 3: Deploy to VPS
```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Install Docker (if not installed)
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone or pull code
cd /var/www/ghumo-phiro
git pull origin main

# Upload .env.production (from local machine)
# scp infrastructure/docker/.env.production root@YOUR_VPS_IP:/var/www/ghumo-phiro/infrastructure/docker/.env

# Build and start
cd infrastructure/docker
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d

# Run migrations
docker exec -it ghumo-backend npm run db:push

# Check status
docker ps
```

### Step 4: Configure Nginx & SSL
```bash
# Install Nginx
sudo apt install nginx certbot python3-certbot-nginx -y

# Copy config
sudo cp /var/www/ghumo-phiro/infrastructure/nginx/nginx.conf /etc/nginx/sites-available/ghumo-phiro
sudo ln -s /etc/nginx/sites-available/ghumo-phiro /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Update domain in config
sudo nano /etc/nginx/sites-available/ghumo-phiro
# Change server_name to your domain

# Get SSL
sudo certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com

# Reload
sudo systemctl reload nginx
```

### Step 5: Verify
```bash
# Test
curl https://YOUR_DOMAIN.com/api/v1/health
curl https://YOUR_DOMAIN.com

# Open in browser
# https://YOUR_DOMAIN.com
```

---

## 📖 Full Guide
See `docs/deployment/VPS_DOCKER_DEPLOYMENT.md` for complete instructions.

---

## 🆘 Quick Troubleshooting

**Container won't start?**
```bash
docker logs ghumo-backend
docker logs ghumo-frontend
```

**Database connection failed?**
```bash
docker exec -it ghumo-postgres psql -U ghumo_user -d ghumo_phiro
```

**Nginx 502 error?**
```bash
sudo tail -f /var/log/nginx/error.log
docker ps  # Check if backend is running
```

---

**Ready? Let's deploy!** 🚀
