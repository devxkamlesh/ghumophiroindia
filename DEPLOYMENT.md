# Ghumo Firo Holidays — VPS Deployment Guide

**Server:** 161.118.176.26  
**Domain:** ghumofiroindia.com  
**Stack:** Node.js + Express (backend) · Next.js (frontend) · PostgreSQL · PM2 · Nginx

---

## First Time Setup

### 1. Clone the repo
```bash
cd /var/www
git clone https://github.com/devxkamlesh/ghumophiroindia.git ghumo-phiro
cd ghumo-phiro
```

### 2. Create backend .env
```bash
nano backend/.env
```
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=https://ghumofiroindia.com,http://161.118.176.26
FRONTEND_URL=https://ghumofiroindia.com
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### 3. Create frontend .env.local
```bash
nano frontend/.env.local
```
```env
# Leave empty to use dynamic origin (recommended)
# NEXT_PUBLIC_API_URL=https://ghumofiroindia.com/api/v1
```

### 4. Build backend
```bash
cd /var/www/ghumo-phiro/backend
npm install
npm run build
```

### 5. Build frontend
```bash
cd /var/www/ghumo-phiro/frontend
npm install
npm run build
```

### 6. Create log directories
```bash
mkdir -p /var/www/ghumo-phiro/backend/logs
mkdir -p /var/www/ghumo-phiro/frontend/logs
```

### 7. Start with PM2
```bash
cd /var/www/ghumo-phiro
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 8. Run database migrations
Connect to your PostgreSQL database and run all files in order:
```
backend/src/core/database/migrations/001_*.sql
backend/src/core/database/migrations/002_*.sql
...
backend/src/core/database/migrations/007_banners.sql
```

Grant permissions:
```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO your_db_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO your_db_user;
```

### 9. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/ghumofiroindia
```
```nginx
server {
    listen 80;
    server_name ghumofiroindia.com www.ghumofiroindia.com 161.118.176.26;

    # Allow image uploads (nginx default is only 1MB -> causes HTTP 413).
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/ghumofiroindia /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 10. Install SSL (HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d ghumofiroindia.com -d www.ghumofiroindia.com --email your@email.com --agree-tos --non-interactive
```

---

## Updating Code (Every Deploy)

```bash
cd /var/www/ghumo-phiro

# Pull latest
git checkout -- deploy.sh ecosystem.config.js
git pull origin main

# Build backend
cd backend && npm install && npm run build && cd ..

# Build frontend
cd frontend && npm install && npm run build && cd ..

# Restart
pm2 restart all
pm2 status
```

Or just run the deploy script:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Useful Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs
pm2 logs ghumo-phiro-backend --lines 50
pm2 logs ghumo-phiro-frontend --lines 50

# Restart apps
pm2 restart all
pm2 restart ghumo-phiro-backend
pm2 restart ghumo-phiro-frontend

# Test services
curl http://localhost:4000/api/v1/health
curl http://localhost:3000

# Nginx
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl status nginx
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| 502 Bad Gateway | PM2 apps not running — `pm2 status` then `pm2 start ecosystem.config.js` |
| CORS errors | Check `CORS_ORIGIN` in `backend/.env` includes your domain/IP |
| API not working | Check Nginx has `/api/` location block pointing to port 4000 |
| Frontend not updating | Must rebuild after `.env.local` changes — `npm run build` |
| DB permission denied | Run `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;` |
| PM2 not starting frontend | Check `frontend/.next` exists — run `npm run build` first |

---

## CI/CD (GitHub Actions)

Two workflows live in `.github/workflows/`:

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `ci.yml` | Pull requests to `main`, pushes to any non-`main` branch | `npm ci` → lint → typecheck → build (both workspaces). Acts as the merge gate. |
| `deploy.yml` | Push to `main` (e.g. PR merge) or manual run | Verifies the build, then SSHes into the VPS and deploys: `git reset --hard origin/main` → install → build → `pm2 startOrReload` → health check. |

### One-time setup

**1. Create a deploy SSH key (on your machine or the server):**
```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/gha_deploy -N ""
```

**2. Authorize the public key on the VPS:**
```bash
# Copy the contents of ~/gha_deploy.pub into the server's authorized_keys
cat ~/gha_deploy.pub >> /root/.ssh/authorized_keys   # or the deploy user's ~/.ssh/authorized_keys
```

**3. Add repository secrets** in GitHub → Settings → Secrets and variables → Actions → *New repository secret*:

| Secret | Value |
|--------|-------|
| `VPS_HOST` | `161.118.176.26` (or `ghumofiroindia.com`) |
| `VPS_USER` | `root` (or your deploy user) |
| `VPS_SSH_KEY` | The **private** key — full contents of `~/gha_deploy` |
| `VPS_PORT` | `22` |

**4. (Recommended) Protect production:** Settings → Environments → create `production` and add required reviewers so deploys need approval.

### Notes
- The deploy does `git reset --hard origin/main`, so **do not keep local edits to tracked files on the server** — they'll be overwritten. `.env` / `.env.local` are git-ignored and are preserved.
- **Database migrations are NOT run automatically** (they require table-owner privileges). After a deploy that adds a migration, run it manually as the DB owner:
  ```bash
  sudo -u postgres psql -d <dbname> -f backend/src/core/database/migrations/<file>.sql
  ```
- To deploy manually without merging, use the **Run workflow** button on the Deploy action (workflow_dispatch).
- If the SSH step can't find `pm2`/`npm`, the runner shell isn't loading your Node install. Confirm Node was installed via nvm (`~/.nvm`) or system packages; the script sources nvm and falls back to standard PATHs.
