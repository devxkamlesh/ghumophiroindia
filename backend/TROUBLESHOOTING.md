# Backend Troubleshooting Guide

## Quick Start Test

Before running the server, test your setup:

```bash
cd backend
npm run test:startup
```

This will check:
- ✅ Environment variables
- ✅ Node modules
- ✅ TypeScript compilation
- ✅ Database connection

---

## Common Runtime Errors & Fixes

### 1. Missing Environment Variables

**Error:**
```
Missing required config: database.url, jwt.secret
```

**Fix:**
```bash
# Create .env file
cp .env.example .env

# Edit .env and add:
DATABASE_URL="your-database-url"
JWT_SECRET="your-secret-key-min-32-chars"
```

Generate JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

### 2. Database Connection Error

**Error:**
```
Error: connect ECONNREFUSED
Database connection failed
```

**Fix:**

Check your DATABASE_URL format:
```env
# Supabase (pooling)
DATABASE_URL="postgresql://user:password@host:6543/database?pgbouncer=true"

# Supabase (direct)
DIRECT_URL="postgresql://user:password@host:5432/database"

# Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/ghumo_phiro"
```

Test connection:
```bash
# Using psql
psql "postgresql://user:password@host:5432/database"

# Using node
node -e "const postgres = require('postgres'); const sql = postgres(process.env.DATABASE_URL); sql\`SELECT 1\`.then(() => console.log('✅ Connected')).catch(e => console.error('❌', e.message))"
```

---

### 3. Module Not Found

**Error:**
```
Cannot find module 'express'
Error: Cannot find module '@upstash/redis'
```

**Fix:**
```bash
# Install dependencies
npm install

# If still failing, clean install
rm -rf node_modules package-lock.json
npm install
```

---

### 4. TypeScript Compilation Errors

**Error:**
```
TS2307: Cannot find module './core/config'
TS2345: Argument of type 'string' is not assignable
```

**Fix:**
```bash
# Check TypeScript errors
npm run typecheck

# Common fixes:
# 1. Check import paths (use @/ alias)
# 2. Ensure all files are in src/ directory
# 3. Check tsconfig.json paths configuration
```

---

### 5. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Fix:**
```bash
# Find process using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=4001
```

---

### 6. Redis Connection Warning

**Warning:**
```
Redis not configured, skipping cache
```

**Fix:**

This is not an error! Redis is optional. The app works without it.

To enable Redis:

**Option 1: Upstash (Serverless)**
```env
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

**Option 2: Local Redis**
```bash
# Install Redis
# Ubuntu: sudo apt install redis-server
# Mac: brew install redis

# Start Redis
redis-server

# Update .env
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
```

---

### 7. Logs Directory Error

**Error:**
```
ENOENT: no such file or directory, open './logs/error.log'
```

**Fix:**
```bash
# Create logs directory
mkdir -p logs

# Or the logger will create it automatically on next run
```

---

### 8. Drizzle Migration Errors

**Error:**
```
Error: relation "users" does not exist
```

**Fix:**
```bash
# Push schema to database
npm run db:push

# Or generate and run migrations
npm run db:generate
npm run db:migrate
```

---

### 9. CORS Errors (from Frontend)

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:**

Update .env:
```env
FRONTEND_URL="http://localhost:3000"
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
```

---

### 10. JWT Token Errors

**Error:**
```
Invalid or expired token
JsonWebTokenError: jwt malformed
```

**Fix:**

1. Check JWT_SECRET is set in .env
2. Ensure JWT_SECRET is at least 32 characters
3. Token format: `Bearer <token>`
4. Check token expiration (default: 7 days)

---

## Development Workflow

### 1. First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your credentials

# 3. Test setup
npm run test:startup

# 4. Push database schema
npm run db:push

# 5. Start development server
npm run dev
```

### 2. Daily Development

```bash
# Start server with auto-reload
npm run dev

# In another terminal, watch logs
tail -f logs/combined.log

# Check for TypeScript errors
npm run typecheck
```

### 3. Before Deployment

```bash
# 1. Run type check
npm run typecheck

# 2. Run linter
npm run lint

# 3. Build for production
npm run build

# 4. Test production build
NODE_ENV=production node dist/app.js
```

---

## Debugging Tips

### Enable Debug Logging

```env
LOG_LEVEL="debug"
```

### Check Health Endpoint

```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-04-13T...",
  "uptime": 123.45,
  "environment": "development",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### Test API Endpoints

```bash
# Test auth
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!@#"}'

# Test tours
curl http://localhost:4000/api/v1/tours

# Test with authentication
curl http://localhost:4000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Database Queries

```bash
# Open Drizzle Studio (GUI)
npm run db:studio

# Or use psql
psql $DATABASE_URL

# Check tables
\dt

# Check users
SELECT * FROM users;
```

---

## Performance Issues

### Slow Database Queries

```bash
# Check database connections
SELECT count(*) FROM pg_stat_activity;

# Check slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### High Memory Usage

```bash
# Check Node.js memory
node --max-old-space-size=4096 dist/app.js

# Monitor memory
watch -n 1 'ps aux | grep node'
```

### Redis Cache Not Working

```bash
# Check Redis connection
redis-cli ping

# Check cache keys
redis-cli KEYS "tour:*"

# Clear cache
redis-cli FLUSHALL
```

---

## Getting Help

If you're still stuck:

1. **Check logs**: `tail -f logs/error.log`
2. **Run test**: `npm run test:startup`
3. **Check health**: `curl http://localhost:4000/health`
4. **Enable debug**: Set `LOG_LEVEL="debug"` in .env
5. **Check GitHub issues**: Search for similar errors

---

## Quick Reference

```bash
# Start server
npm run dev

# Test setup
npm run test:startup

# Check types
npm run typecheck

# Database
npm run db:push        # Push schema
npm run db:studio      # Open GUI

# Logs
tail -f logs/combined.log
tail -f logs/error.log

# Health check
curl http://localhost:4000/health
```
