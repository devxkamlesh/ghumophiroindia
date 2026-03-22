#!/bin/bash
set -e

PROJECT_DIR="/var/www/ghumo-phiro"

echo "🚀 Starting deployment..."

cd $PROJECT_DIR

# Pull latest code
echo "📥 Pulling latest code from Git..."
git pull origin main

# Build backend
echo "🔧 Building backend..."
cd $PROJECT_DIR/backend
npm install --production=false
npm run build

# Build frontend
echo "🎨 Building frontend..."
cd $PROJECT_DIR/frontend
npm install --production=false
npm run build

# Copy static files for standalone mode (REQUIRED)
echo "📦 Copying static files for standalone mode..."
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# Create logs directories
mkdir -p $PROJECT_DIR/backend/logs
mkdir -p $PROJECT_DIR/frontend/logs

# Restart PM2
echo "🔄 Restarting PM2 processes..."
cd $PROJECT_DIR
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# Show status
echo ""
echo "✅ Deployment complete!"
pm2 status
echo ""
echo "🔍 Testing services..."
sleep 3
curl -s http://localhost:4000/api/v1/health && echo " ✅ Backend OK" || echo " ❌ Backend not responding"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|304" && echo "✅ Frontend OK" || echo "❌ Frontend not responding"
