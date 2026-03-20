# Restart Backend Server

## The Issue
The `/api/v1/gallery/move` route is not found because the backend server needs to be restarted to load the new route we just added.

## Solution: Restart Backend Server

### Option 1: Using npm (Recommended)
```bash
cd backend
npm run dev
```

### Option 2: Using PM2 (if you're using it)
```bash
cd backend
pm2 restart ecosystem.config.js
```

### Option 3: Kill and Restart
1. Find the backend process:
   ```bash
   # Windows
   netstat -ano | findstr :4000
   taskkill /PID <PID_NUMBER> /F
   
   # Then start again
   cd backend
   npm run dev
   ```

## Verify Backend is Running

After restarting, check:
1. Open browser: http://localhost:4000/api/v1/health
2. Should see: `{"status":"ok",...}`

## Test the Move Route

Once backend is running, test the move endpoint:

```bash
# Test with curl (replace YOUR_TOKEN with actual admin token)
curl -X POST http://localhost:4000/api/v1/gallery/move \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "publicIds": ["ghumo-phiro/general/test.jpg"],
    "targetFolder": "tours"
  }'
```

## Expected Response
```json
{
  "success": true,
  "data": {
    "moved": [
      {
        "oldPublicId": "ghumo-phiro/general/test.jpg",
        "newPublicId": "ghumo-phiro/tours/test.jpg",
        "url": "https://res.cloudinary.com/..."
      }
    ],
    "count": 1
  },
  "message": "1 image(s) moved to \"tours\""
}
```

## Common Issues

### Issue: Port 4000 already in use
**Solution**: Kill the existing process first
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID_NUMBER> /F
```

### Issue: Module not found errors
**Solution**: Reinstall dependencies
```bash
cd backend
npm install
npm run dev
```

### Issue: TypeScript compilation errors
**Solution**: Check the gallery.routes.ts file for syntax errors
```bash
cd backend
npx tsc --noEmit
```

## Quick Restart Commands

### Development (localhost)
```bash
cd backend
npm run dev
```

### Production (VPS)
```bash
cd backend
pm2 restart ecosystem.config.js
# or
pm2 restart all
```

## After Restart

1. ✅ Backend should be running on http://localhost:4000
2. ✅ Frontend should connect to it (already configured in .env.local)
3. ✅ Gallery move feature should work
4. ✅ Test by selecting images and clicking "Move" button

---

**Note**: Every time you make changes to backend code, you need to restart the server for changes to take effect. If using `npm run dev`, it should auto-restart on file changes (if using nodemon).
