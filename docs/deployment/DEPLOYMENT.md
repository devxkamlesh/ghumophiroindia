# VPS Deployment Guide - Manual Steps

## Server Specifications

Your Hostinger VPS (Mumbai):
- **CPU**: AMD EPYC 9355P (4 vCPU @ 3.5 GHz)
- **RAM**: 15.6 GB
- **Storage**: 193.7 GB NVMe SSD
- **Network**: 842 Mbps down / 411 Mbps up
- **OS**: Ubuntu 24.04 LTS
- **Location**: Mumbai, India

## Architecture on VPS

```
Internet
    ↓
Nginx (Port 80/443) - Reverse Proxy + SSL
    ↓
    ├─→ Frontend (Port 3000) - Next.js
    ├─→ Backend API (Port 4000) - Node.js/Express
    ├─→ PostgreSQL (Port 5432) - Database
    └─→ Redis (Port 6379) - Cache
```

## Resource Allocation

- **PostgreSQL**: ~2 GB RAM
- **Redis**: ~2 GB RAM
- **Backend**: ~1-2 GB RAM
- **Frontend**: ~1-2 GB RAM
- **Nginx**: ~100 MB RAM
- **System**: ~2 GB RAM
- **Available**: ~6 GB RAM (buffer)

---

## Step-by-Step Deployment

### 1. Initial Server Setup

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y curl git nginx certbot python3-certbot-nginx ufw
```

### 2. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Enable and start Docker
systemctl enable docker
systemctl start docker

# Verify installation
docker --version
```

### 3. Install Docker Compose

```bash
# Download Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### 4. Configure Firewall

```bash
# Enable firewall
ufw --force enable

# Set default policies
ufw default deny incoming
ufw default allow outgoing

# Allow required ports
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp

# Reload firewall
ufw reload

# Check status
ufw status
```

### 5. Clone Repository

```bash
# Create application directory
mkdir -p /opt/ghumo-phiro
cd /opt/ghumo-phiro

# Clone your repository
git clone https://github.com/devxkamlesh/ghumophiroindia.git .

# Or upload files via SFTP/SCP
```

### 6. Create Environment File

```bash
# Navigate to docker directory
cd /opt/ghumo-phiro/infrastructure/docker

# Create .env file
nano .env
```

Paste this content (update values):

```env
# Database
DB_PASSWORD=your-secure-password-here

# Redis
REDIS_PASSWORD=your-redis-password-here

# JWT
JWT_SECRET=your-jwt-secret-min-64-chars-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=djoqjwwid
CLOUDINARY_API_KEY=661467625611547
CLOUDINARY_API_SECRET=sFMTi9xtJnRihYvGGmcQ32nh

# URLs (update with your domain)
FRONTEND_URL=https://ghumophiroindia.com
NEXT_PUBLIC_API_URL=https://ghumophiroindia.com/api/v1
NEXT_PUBLIC_APP_URL=https://ghumophiroindia.com
```

**Generate secure passwords:**
```bash
# For DB_PASSWORD
openssl rand -base64 32

# For REDIS_PASSWORD
openssl rand -base64 32

# For JWT_SECRET
openssl rand -base64 64
```

Save and exit (Ctrl+X, Y, Enter)

### 7. Start Docker Containers

```bash
# Navigate to docker directory
cd /opt/ghumo-phiro/infrastructure/docker

# Start all services
docker-compose -f docker-compose.production.yml up -d

# Check if containers are running
docker ps

# View logs
docker-compose -f docker-compose.production.yml logs -f
```

Wait for all services to start (about 1-2 minutes).

### 8. Run Database Migrations

```bash
# Run migrations
docker exec ghumo-backend npm run db:push

# Verify database connection
docker exec ghumo-postgres pg_isready -U ghumo_user
```

### 9. Configure Nginx

```bash
# Copy Nginx configuration
cp /opt/ghumo-phiro/infrastructure/nginx/nginx.conf /etc/nginx/sites-available/ghumo-phiro

# Create symbolic link
ln -s /etc/nginx/sites-available/ghumo-phiro /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

### 10. Setup SSL Certificate

```bash
# Get SSL certificate from Let's Encrypt
certbot --nginx -d ghumophiroindia.com -d www.ghumophiroindia.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (option 2)

# Test auto-renewal
certbot renew --dry-run
```

### 11. Verify Deployment

```bash
# Check backend health
curl http://localhost:4000/health

# Check frontend
curl http://localhost:3000

# Check PostgreSQL
docker exec ghumo-postgres pg_isready -U ghumo_user

# Check Redis
docker exec ghumo-redis redis-cli ping

# Check all containers
docker ps
```

### 12. Test Your Website

Open browser and visit:
- `https://ghumophiroindia.com` - Frontend
- `https://ghumophiroindia.com/api/v1/health` - Backend health

---

## Common Commands

### View Logs

```bash
# All services
cd /opt/ghumo-phiro/infrastructure/docker
docker-compose -f docker-compose.production.yml logs -f

# Specific service
docker logs -f ghumo-backend
docker logs -f ghumo-frontend
docker logs -f ghumo-postgres
docker logs -f ghumo-redis
```

### Restart Services

```bash
cd /opt/ghumo-phiro/infrastructure/docker

# Restart all
docker-compose -f docker-compose.production.yml restart

# Restart specific service
docker restart ghumo-backend
docker restart ghumo-frontend
```

### Stop Services

```bash
cd /opt/ghumo-phiro/infrastructure/docker
docker-compose -f docker-compose.production.yml stop
```

### Start Services

```bash
cd /opt/ghumo-phiro/infrastructure/docker
docker-compose -f docker-compose.production.yml start
```

### Update Application

```bash
# Pull latest code
cd /opt/ghumo-phiro
git pull origin main

# Rebuild and restart
cd infrastructure/docker
docker-compose -f docker-compose.production.yml up -d --build

# Run migrations if needed
docker exec ghumo-backend npm run db:push
```

### Check Resource Usage

```bash
# Container stats
docker stats

# System resources
free -h
df -h
```

### Database Access

```bash
# Access PostgreSQL
docker exec -it ghumo-postgres psql -U ghumo_user -d ghumo_phiro

# Common queries
\dt              # List tables
\d users         # Describe users table
SELECT * FROM users LIMIT 5;
\q               # Exit
```

### Redis Access

```bash
# Access Redis CLI
docker exec -it ghumo-redis redis-cli

# Authenticate
AUTH your-redis-password

# Common commands
PING             # Test connection
KEYS *           # List all keys
GET tour:1       # Get cached tour
FLUSHALL         # Clear all cache (use carefully!)
EXIT             # Exit
```

---

## Troubleshooting

### Containers won't start

```bash
# Check logs
docker-compose -f docker-compose.production.yml logs

# Check specific container
docker logs ghumo-backend

# Restart containers
docker-compose -f docker-compose.production.yml restart
```

### Database connection errors

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection
docker exec ghumo-postgres pg_isready -U ghumo_user

# View PostgreSQL logs
docker logs ghumo-postgres
```

### Backend API not responding

```bash
# Check backend logs
docker logs ghumo-backend

# Check if port is listening
netstat -tuln | grep 4000

# Restart backend
docker restart ghumo-backend
```

### Frontend not loading

```bash
# Check frontend logs
docker logs ghumo-frontend

# Check if port is listening
netstat -tuln | grep 3000

# Restart frontend
docker restart ghumo-frontend
```

### Nginx errors

```bash
# Test Nginx configuration
nginx -t

# Check Nginx logs
tail -f /var/log/nginx/ghumo_error.log

# Reload Nginx
systemctl reload nginx

# Restart Nginx
systemctl restart nginx
```

### SSL certificate issues

```bash
# Check certificate status
certbot certificates

# Renew certificate manually
certbot renew

# Check Nginx SSL configuration
nginx -t
```

### High memory usage

```bash
# Check what's using memory
docker stats

# Check system memory
free -h

# Restart specific service
docker restart ghumo-backend
```

---

## Performance Monitoring

### Check System Health

```bash
# CPU and Memory
htop

# Disk usage
df -h

# Network connections
netstat -tuln

# Docker stats
docker stats --no-stream
```

### Check Application Health

```bash
# Backend health endpoint
curl http://localhost:4000/health

# Check response time
time curl http://localhost:4000/api/v1/tours

# Check database connections
docker exec ghumo-postgres psql -U ghumo_user -d ghumo_phiro -c "SELECT count(*) FROM pg_stat_activity;"
```

---

## Security Best Practices

1. **Change default passwords** in `.env` file
2. **Keep system updated**: `apt update && apt upgrade`
3. **Monitor logs** regularly
4. **Use strong JWT secret** (64+ characters)
5. **Enable firewall** (UFW configured)
6. **SSL certificate** auto-renews (Let's Encrypt)
7. **Backup enabled** (Hostinger auto-backup)

---

## Cost Estimation

- **VPS**: ~₹1,500-2,000/month (Hostinger)
- **Domain**: ~₹800/year
- **SSL**: Free (Let's Encrypt)
- **Total**: ~₹2,000/month

---

## Support Checklist

Before asking for help, check:
- [ ] All containers running: `docker ps`
- [ ] Logs checked: `docker logs ghumo-backend`
- [ ] Health endpoint: `curl http://localhost:4000/health`
- [ ] Nginx config: `nginx -t`
- [ ] Firewall rules: `ufw status`
- [ ] SSL certificate: `certbot certificates`

---

## Quick Reference

```bash
# Navigate to project
cd /opt/ghumo-phiro/infrastructure/docker

# View all containers
docker ps

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Restart all
docker-compose -f docker-compose.production.yml restart

# Stop all
docker-compose -f docker-compose.production.yml stop

# Start all
docker-compose -f docker-compose.production.yml start

# Rebuild and restart
docker-compose -f docker-compose.production.yml up -d --build
```

---

## Next Steps After Deployment

1. ✅ Test all API endpoints
2. ✅ Create admin user
3. ✅ Upload tour data
4. ✅ Test booking flow
5. ✅ Configure email notifications (optional)
6. ✅ Setup monitoring (optional)
7. ✅ Add Google Analytics (optional)

Your application is now live! 🎉
