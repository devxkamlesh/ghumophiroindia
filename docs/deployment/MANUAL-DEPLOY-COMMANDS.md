# Manual Deployment Commands Reference

This file contains all commands you need to run manually for deployment.
Copy and paste these commands one by one into your VPS terminal.

---

## Initial VPS Setup (Run Once)

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 24.x LTS (Latest stable - April 2026)
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y nodejs

# Install PostgreSQL 18 from official repository
apt install -y postgresql-common
/usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y
apt update
apt install -y postgresql-18 postgresql-contrib-18

# Install Redis 8.x (Latest stable - 2026)
apt install -y redis-server

# Install PM2 6.x (Latest stable)
npm install -g pm2@latest

# Install other tools
apt install -y build-essential git nginx
```

---

## Database Setup (Run Once)

```bash
# Start PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE ghumo_phiro_db;
CREATE USER ghumo_admin WITH PASSWORD 'YOUR_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE ghumo_phiro_db TO ghumo_admin;
ALTER DATABASE ghumo_phiro_db OWNER TO ghumo_admin;
\c ghumo_phiro_db
GRANT ALL ON SCHEMA public TO ghumo_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ghumo_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ghumo_admin;
EOF

# Test connection
psql -U ghumo_admin -d ghumo_phiro_db -h localhost -c "SELECT version();"
```

---

## Redis Setup (Run Once)

```bash
# Start Redis
systemctl start redis-server
systemctl enable redis-server

# Test Redis
redis-cli ping
```

---

## Application Deployment

### First Time Deployment

```bash
# Create app directory
mkdir -p /var/www/ghumo-phiro
cd /var/www/ghumo-phiro

# Upload your backend folder here using SCP/SFTP
# Or clone from git: git clone https://github.com/devxkamlesh/ghumophiroindia.git .

# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
nano .env
# Copy contents from .env.production.example and update values

# Run database migrations
npm run db:push

# Build application
npm run build

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
# Run the command it outputs

# Check status
pm2 status
pm2 logs
```

### Update Deployment (When You Make Changes)

```bash
# Navigate to backend directory
cd /var/www/ghumo-phiro/backend

# Pull latest changes (if using git)
git pull

# Or upload new files using SCP/SFTP

# Install any new dependencies
npm install

# Run any new migrations
npm run db:push

# Rebuild application
npm run build

# Reload PM2 (zero downtime)
pm2 reload ghumo-phiro-backend

# Check logs
pm2 logs ghumo-phiro-backend --lines 50
```

---

## Nginx Setup (Run Once)

```bash
# Create Nginx config
cat > /etc/nginx/sites-available/ghumo-phiro << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

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
    }

    location /health {
        proxy_pass http://localhost:5000/health;
        access_log off;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/ghumo-phiro /etc/nginx/sites-enabled/

# Test and restart Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx
```

---

## Firewall Setup (Run Once)

```bash
# Configure UFW
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

---

## Testing Commands

```bash
# Test backend locally
curl http://localhost:5000/health

# Test through Nginx
curl http://your-vps-ip/api/v1/health

# Check PM2 status
pm2 status

# View logs
pm2 logs ghumo-phiro-backend

# Monitor resources
pm2 monit

# Check database
psql -U ghumo_admin -d ghumo_phiro_db -h localhost -c "\dt"

# Check Redis
redis-cli ping
```

---

## Useful Management Commands

### PM2 Commands
```bash
pm2 list                              # List all apps
pm2 status                            # Show status
pm2 logs ghumo-phiro-backend          # View logs
pm2 logs ghumo-phiro-backend --lines 100  # Last 100 lines
pm2 restart ghumo-phiro-backend       # Restart app
pm2 reload ghumo-phiro-backend        # Zero-downtime reload
pm2 stop ghumo-phiro-backend          # Stop app
pm2 delete ghumo-phiro-backend        # Remove from PM2
pm2 monit                             # Monitor resources
pm2 save                              # Save current config
```

### Database Commands
```bash
# Connect to database
psql -U ghumo_admin -d ghumo_phiro_db -h localhost

# Inside psql:
\dt                    # List tables
\d table_name          # Describe table
SELECT COUNT(*) FROM users;  # Query example
\q                     # Exit

# Backup database
pg_dump -U ghumo_admin -d ghumo_phiro_db -h localhost > backup_$(date +%Y%m%d).sql

# Restore database
psql -U ghumo_admin -d ghumo_phiro_db -h localhost < backup_file.sql
```

### Service Management
```bash
# PostgreSQL
systemctl status postgresql
systemctl restart postgresql
systemctl stop postgresql
systemctl start postgresql

# Redis
systemctl status redis-server
systemctl restart redis-server

# Nginx
systemctl status nginx
systemctl restart nginx
nginx -t  # Test config
```

### Log Viewing
```bash
# Application logs
tail -f /var/www/ghumo-phiro/backend/logs/error.log
tail -f /var/www/ghumo-phiro/backend/logs/combined.log
tail -f /var/www/ghumo-phiro/backend/logs/pm2-error.log

# System logs
journalctl -u postgresql -n 50
journalctl -u redis-server -n 50
journalctl -u nginx -n 50

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## Troubleshooting

### Backend Not Starting
```bash
# Check logs
pm2 logs ghumo-phiro-backend

# Check if port is in use
netstat -tulpn | grep :5000

# Check environment variables
cd /var/www/ghumo-phiro/backend
cat .env

# Try running directly
npm run dev
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
systemctl status postgresql

# Test connection
psql -U ghumo_admin -d ghumo_phiro_db -h localhost

# Check PostgreSQL logs
journalctl -u postgresql -n 100
```

### Redis Connection Issues
```bash
# Check Redis is running
systemctl status redis-server

# Test connection
redis-cli ping

# Check Redis logs
journalctl -u redis-server -n 100
```

### Nginx Issues
```bash
# Test configuration
nginx -t

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Restart Nginx
systemctl restart nginx
```

---

## Performance Monitoring

```bash
# System resources
htop
free -h
df -h

# PM2 monitoring
pm2 monit

# Database performance
psql -U ghumo_admin -d ghumo_phiro_db -h localhost -c "SELECT * FROM pg_stat_activity;"

# Redis info
redis-cli info
redis-cli info memory
```

---

## Security Checklist

- [ ] Changed default PostgreSQL password
- [ ] Set Redis password
- [ ] Generated strong JWT secrets
- [ ] Configured firewall (UFW)
- [ ] Updated CORS_ORIGIN in .env
- [ ] PostgreSQL only accepts local connections
- [ ] Redis only accepts local connections
- [ ] Nginx configured as reverse proxy
- [ ] PM2 running as non-root user (optional)

---

## Quick Start Summary

1. Setup VPS (install Node, PostgreSQL, Redis, PM2, Nginx)
2. Create database and user
3. Upload backend code to `/var/www/ghumo-phiro/backend`
4. Create `.env` file with production values
5. Run `npm install && npm run db:push && npm run build`
6. Start with `pm2 start ecosystem.config.js`
7. Configure Nginx reverse proxy
8. Test: `curl http://your-vps-ip/api/v1/health`

Done! Backend is live on VPS.
