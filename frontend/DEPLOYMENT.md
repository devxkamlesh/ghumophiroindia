# Deployment Guide - Ghumo Firo India Frontend

## Prerequisites

- Node.js 24.x or higher installed on server
- npm 11.x or higher
- Backend API running at `http://187.127.151.137/api/v1`
- PM2 for process management (recommended)

## Option 1: Production Build (Recommended)

### 1. Build the Application

```bash
cd frontend
npm install
npm run build
```

### 2. Start Production Server

```bash
npm run start
```

The application will run on port 3000 by default.

### 3. Use PM2 for Process Management

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start npm --name "ghumo-firo-frontend" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 4. PM2 Management Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs ghumo-firo-frontend

# Restart
pm2 restart ghumo-firo-frontend

# Stop
pm2 stop ghumo-firo-frontend

# Delete
pm2 delete ghumo-firo-frontend
```

## Option 2: Development Mode (Not Recommended for Production)

```bash
cd frontend
npm install
npm run dev
```

## Environment Configuration

### Production Environment

Create `.env.production` or `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL="http://187.127.151.137/api/v1"
NEXT_PUBLIC_API_TIMEOUT=30000

# App Configuration
NEXT_PUBLIC_APP_URL="https://ghumofiroindia.com"
NEXT_PUBLIC_APP_NAME="Ghumo Firo India"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="djoqjwwid"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="+919876543210"

# Feature Flags
NEXT_PUBLIC_ENABLE_BOOKING=true
NEXT_PUBLIC_ENABLE_CUSTOM_TOURS=true
NEXT_PUBLIC_ENABLE_REVIEWS=true
```

## Nginx Configuration

### Setup Nginx as Reverse Proxy

Create `/etc/nginx/sites-available/ghumofiroindia`:

```nginx
server {
    listen 80;
    server_name ghumofiroindia.com www.ghumofiroindia.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/ghumofiroindia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Certificate (Let's Encrypt)

### Install Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### Obtain Certificate

```bash
sudo certbot --nginx -d ghumofiroindia.com -d www.ghumofiroindia.com
```

### Auto-renewal

Certbot automatically sets up renewal. Test it:

```bash
sudo certbot renew --dry-run
```

## Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

## Custom Port Configuration

To run on a different port:

```bash
# Edit package.json start script
"start": "next start -p 3001"

# Or use environment variable
PORT=3001 npm run start
```

## Performance Optimization

### 1. Enable Compression in Nginx

Add to nginx config:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### 2. Cache Static Assets

Add to nginx config:

```nginx
location /_next/static {
    proxy_pass http://localhost:3000;
    proxy_cache_valid 200 60m;
    add_header Cache-Control "public, immutable";
}
```

### 3. Enable HTTP/2

In nginx config:

```nginx
listen 443 ssl http2;
```

## Monitoring

### Check Application Status

```bash
# PM2 status
pm2 status

# View logs
pm2 logs ghumo-firo-frontend --lines 100

# Monitor resources
pm2 monit
```

### Check Nginx Status

```bash
sudo systemctl status nginx
sudo nginx -t
```

### Check Application Health

```bash
curl http://localhost:3000
```

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs ghumo-firo-frontend

# Check if port is in use
netstat -tulpn | grep 3000

# Restart application
pm2 restart ghumo-firo-frontend
```

### Nginx Issues

```bash
# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### API Connection Issues

1. Verify backend is running:
```bash
curl http://187.127.151.137/api/v1/tours
```

2. Check CORS settings in backend
3. Verify `.env.local` has correct API URL

### Build Issues

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## Backup Strategy

### Backup Script

Create `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/frontend"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/frontend_$DATE.tar.gz \
    --exclude=node_modules \
    --exclude=.next \
    /path/to/frontend

# Keep only last 7 backups
find $BACKUP_DIR -name "frontend_*.tar.gz" -mtime +7 -delete
```

Make executable:

```bash
chmod +x backup.sh
```

Add to crontab for daily backups:

```bash
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

## Update Procedure

### 1. Pull Latest Changes

```bash
cd frontend
git pull origin main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build

```bash
npm run build
```

### 4. Restart Application

```bash
pm2 restart ghumo-firo-frontend
```

### 5. Verify

```bash
pm2 logs ghumo-firo-frontend
curl http://localhost:3000
```

## Rollback Procedure

### Using PM2

```bash
# Stop current version
pm2 stop ghumo-firo-frontend

# Restore from backup
cd /path/to/backups
tar -xzf frontend_YYYYMMDD_HHMMSS.tar.gz

# Rebuild
cd frontend
npm install
npm run build

# Restart
pm2 restart ghumo-firo-frontend
```

## Security Checklist

- [ ] SSL certificate installed and working
- [ ] Firewall configured (UFW)
- [ ] Nginx security headers configured
- [ ] Environment variables secured
- [ ] Regular backups scheduled
- [ ] PM2 configured to restart on failure
- [ ] Logs monitored regularly
- [ ] Dependencies updated regularly

## Production Checklist

- [ ] Environment variables configured
- [ ] Build successful
- [ ] PM2 process running
- [ ] Nginx configured and running
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Domain DNS configured
- [ ] Backend API accessible
- [ ] All pages loading correctly
- [ ] Forms submitting successfully
- [ ] Images loading (if applicable)
- [ ] Mobile responsive working
- [ ] Monitoring setup

## Support

For deployment issues:
- Check PM2 logs: `pm2 logs ghumo-firo-frontend`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Verify backend API: `curl http://187.127.151.137/api/v1/tours`
- Check application health: `curl http://localhost:3000`

---

**Deployment Status**: Ready for production
**Recommended Setup**: PM2 + Nginx + SSL
**Port**: 3000 (default)
**Domain**: ghumofiroindia.com
