# Update Server with Latest Changes

Quick guide to pull latest code and restart services on your VPS.

---

## 🚀 Quick Update (Most Common)

```bash
# 1. SSH into your server
ssh root@187.127.151.137

# 2. Navigate to project directory
cd /opt/ghumo-phiro

# 3. Pull latest changes
git pull origin main

# 4. Navigate to docker directory
cd infrastructure/docker

# 5. Rebuild and restart containers
docker-compose -f docker-compose.production.yml up -d --build

# 6. Check if everything is running
docker ps

# 7. View logs (optional)
docker-compose -f docker-compose.production.yml logs -f
```

**Done!** Your server is now updated with the latest code. 🎉

---

## 📋 Step-by-Step Explanation

### Step 1: Connect to Server
```bash
ssh root@187.127.151.137
```
Enter your password when prompted.

### Step 2: Navigate to Project
```bash
cd /opt/ghumo-phiro
```

### Step 3: Check Current Status
```bash
# See what branch you're on
git branch

# See if there are uncommitted changes
git status
```

### Step 4: Pull Latest Code
```bash
# Pull from main branch
git pull origin main

# If you get merge conflicts, stash local changes first:
git stash
git pull origin main
```

### Step 5: Rebuild Containers
```bash
# Navigate to docker directory
cd infrastructure/docker

# Stop containers
docker-compose -f docker-compose.production.yml down

# Rebuild and start
docker-compose -f docker-compose.production.yml up -d --build
```

### Step 6: Run Database Migrations (if needed)
```bash
# Only run if you added new database migrations
docker exec ghumo-backend npm run db:push
```

### Step 7: Verify Everything Works
```bash
# Check all containers are running
docker ps

# Should show:
# - ghumo-frontend
# - ghumo-backend
# - ghumo-postgres
# - ghumo-redis
# - ghumo-nginx

# Check backend health
curl http://localhost:4000/health

# Check frontend
curl http://localhost:3000
```

---

## 🔍 View Logs

### All Services
```bash
cd /opt/ghumo-phiro/infrastructure/docker
docker-compose -f docker-compose.production.yml logs -f
```

Press `Ctrl+C` to exit logs.

### Specific Service
```bash
# Backend logs
docker logs -f ghumo-backend

# Frontend logs
docker logs -f ghumo-frontend

# Database logs
docker logs -f ghumo-postgres

# Redis logs
docker logs -f ghumo-redis
```

---

## 🛠️ Common Issues & Fixes

### Issue: "Already up to date" but changes not showing

**Solution:** Force rebuild
```bash
cd /opt/ghumo-phiro/infrastructure/docker
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d
```

### Issue: Container won't start

**Solution:** Check logs
```bash
docker logs ghumo-backend
docker logs ghumo-frontend
```

### Issue: Database connection error

**Solution:** Restart database
```bash
docker restart ghumo-postgres
docker restart ghumo-backend
```

### Issue: Frontend shows old version

**Solution:** Clear Next.js cache
```bash
docker exec ghumo-frontend rm -rf .next
docker restart ghumo-frontend
```

### Issue: Port already in use

**Solution:** Stop conflicting containers
```bash
# See what's using the port
netstat -tuln | grep 3000
netstat -tuln | grep 4000

# Stop all containers
docker-compose -f docker-compose.production.yml down

# Start again
docker-compose -f docker-compose.production.yml up -d
```

---

## 🔄 Restart Individual Services

### Restart Backend Only
```bash
docker restart ghumo-backend
```

### Restart Frontend Only
```bash
docker restart ghumo-frontend
```

### Restart Database
```bash
docker restart ghumo-postgres
```

### Restart Redis
```bash
docker restart ghumo-redis
```

### Restart All Services
```bash
cd /opt/ghumo-phiro/infrastructure/docker
docker-compose -f docker-compose.production.yml restart
```

---

## 📊 Check Server Resources

### Container Stats
```bash
docker stats
```

### System Memory
```bash
free -h
```

### Disk Space
```bash
df -h
```

### CPU Usage
```bash
top
# or
htop
```

---

## 🗄️ Database Operations

### Access Database
```bash
docker exec -it ghumo-postgres psql -U ghumo_user -d ghumo_phiro
```

### Run SQL Script
```bash
# Copy SQL file to container
docker cp mark_locations_popular.sql ghumo-postgres:/tmp/

# Execute SQL
docker exec -it ghumo-postgres psql -U ghumo_user -d ghumo_phiro -f /tmp/mark_locations_popular.sql
```

### Backup Database
```bash
docker exec ghumo-postgres pg_dump -U ghumo_user ghumo_phiro > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
docker exec -i ghumo-postgres psql -U ghumo_user ghumo_phiro < backup_20240101.sql
```

---

## 🧹 Clean Up Docker

### Remove Unused Images
```bash
docker image prune -a
```

### Remove Unused Volumes
```bash
docker volume prune
```

### Remove Unused Containers
```bash
docker container prune
```

### Full Cleanup (careful!)
```bash
docker system prune -a --volumes
```

---

## 📝 Update Checklist

Before updating:
- [ ] Backup database (if major changes)
- [ ] Check current version: `git log -1`
- [ ] Note current container status: `docker ps`

After updating:
- [ ] Verify containers running: `docker ps`
- [ ] Check backend health: `curl http://localhost:4000/health`
- [ ] Check frontend: `curl http://localhost:3000`
- [ ] Test website in browser
- [ ] Check logs for errors: `docker-compose logs`

---

## 🆘 Emergency Rollback

If something breaks after update:

```bash
# 1. Go to project directory
cd /opt/ghumo-phiro

# 2. Check git log to find previous commit
git log --oneline -5

# 3. Rollback to previous commit (replace COMMIT_HASH)
git reset --hard COMMIT_HASH

# 4. Rebuild containers
cd infrastructure/docker
docker-compose -f docker-compose.production.yml up -d --build
```

---

## 📞 Need Help?

1. Check logs: `docker-compose logs -f`
2. Check container status: `docker ps`
3. Check system resources: `free -h` and `df -h`
4. Restart services: `docker-compose restart`
5. If still stuck, contact support with:
   - Error messages from logs
   - Output of `docker ps`
   - Output of `git log -1`

---

## 🎯 Quick Commands Reference

```bash
# Update server
cd /opt/ghumo-phiro && git pull && cd infrastructure/docker && docker-compose -f docker-compose.production.yml up -d --build

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Restart all
docker-compose -f docker-compose.production.yml restart

# Check status
docker ps

# Check health
curl http://localhost:4000/health
```

---

**Pro Tip:** Bookmark this page for quick reference! 📌
