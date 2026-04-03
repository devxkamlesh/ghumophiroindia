#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting deployment...${NC}\n"

# Step 1: Pull latest code
echo -e "${YELLOW}📥 Pulling latest code from git...${NC}"
git pull origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Git pull failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Code updated${NC}\n"

# Step 2: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm run install:all
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Dependency installation failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}\n"

# Step 3: Build projects
echo -e "${YELLOW}🔨 Building projects...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build completed${NC}\n"

# Step 4: Update Nginx config (if exists)
if [ -f "infrastructure/nginx/nginx.conf" ]; then
    echo -e "${YELLOW}🔧 Updating Nginx configuration...${NC}"
    sudo cp infrastructure/nginx/nginx.conf /etc/nginx/sites-available/ghumophiroindia.com
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Nginx config copy failed${NC}"
        exit 1
    fi
    
    # Test nginx config
    echo -e "${YELLOW}🧪 Testing Nginx configuration...${NC}"
    sudo nginx -t
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Nginx configuration test failed${NC}"
        exit 1
    fi
    
    # Reload nginx
    echo -e "${YELLOW}🔄 Reloading Nginx...${NC}"
    sudo nginx -s reload
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Nginx reload failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Nginx updated${NC}\n"
else
    echo -e "${YELLOW}⚠️  Nginx config not found, skipping...${NC}\n"
fi

# Step 5: Restart PM2 processes
echo -e "${YELLOW}🔄 Restarting PM2 processes...${NC}"
pm2 restart all
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ PM2 restart failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PM2 processes restarted${NC}\n"

# Step 6: Save PM2 configuration
echo -e "${YELLOW}💾 Saving PM2 configuration...${NC}"
pm2 save
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ PM2 save failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PM2 configuration saved${NC}\n"

# Step 7: Show PM2 status
echo -e "${YELLOW}📊 Current PM2 status:${NC}"
pm2 status

echo -e "\n${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Site: https://ghumophiroindia.com${NC}"
