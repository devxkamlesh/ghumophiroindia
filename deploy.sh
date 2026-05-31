#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest code
echo "📥 Pulling latest code from Git..."
git pull origin main

# Backend
echo "🔧 Building backend..."
cd backend
npm install
npm run build
cd ..

# Frontend
echo "🎨 Building frontend..."
cd frontend
npm install
npm run build

# Copy static files for standalone mode
echo "📦 Copying static files for standalone mode..."
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

cd ..

# Restart PM2
echo "🔄 Restarting PM2 processes..."
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js --env production

# Show status
echo "✅ Deployment complete!"
pm2 status
pm2 logs --lines 20
