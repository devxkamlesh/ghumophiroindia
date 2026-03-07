# Ghumo Phiro India - Tour Booking Platform

A modern, full-stack tour booking platform for exploring India's diverse destinations.

---

## 🚀 Quick Links

- **[📚 Complete Documentation](./docs/README.md)** - All guides and references
- **[🔧 VPS Setup Guide](./docs/deployment/VPS-SETUP.md)** - Deploy to production
- **[👤 User Setup](./docs/deployment/USER-SETUP.md)** - Create secure user
- **[💻 Development Guide](./docs/development/DEVELOPMENT.md)** - Local setup

---

## 📁 Project Structure

```
ghumo-phiro-india/
├── backend/              # Express API server
│   ├── src/
│   │   ├── core/        # Database, Redis, Logger, Config
│   │   ├── modules/     # Auth, Tours, Bookings, etc.
│   │   ├── middleware/  # Auth, Validation, Error handling
│   │   └── shared/      # Utilities, Errors, Response helpers
│   ├── drizzle/         # Database migrations
│   └── ecosystem.config.js  # PM2 configuration
│
├── frontend/            # Next.js 16 application
│   ├── src/
│   │   ├── app/        # App Router pages
│   │   ├── components/ # React components
│   │   ├── lib/        # Utilities
│   │   └── services/   # API clients
│   └── public/         # Static assets
│
├── docs/               # Documentation
│   ├── deployment/     # VPS setup, deployment guides
│   ├── development/    # Local development guides
│   └── versions/       # Version information
│
└── infrastructure/     # Docker, Nginx configs (optional)
```

---

## 🛠️ Technology Stack

### Backend
- Node.js 24.x LTS + Express
- TypeScript 5.8
- PostgreSQL 18.x + Drizzle ORM
- Redis 8.x (caching)
- JWT Authentication
- PM2 Process Manager

### Frontend
- Next.js 16.2 + React 19
- TypeScript 5.8
- Tailwind CSS 3.4
- Radix UI Components
- SWR + Zustand

### Infrastructure
- Ubuntu 24.04 LTS
- Nginx 1.28.x
- PM2 6.x
- Hostinger VPS (Mumbai)

---

## 🎯 Features

### For Customers
- Browse tours by category, destination, difficulty
- Advanced search and filtering
- Detailed tour information with itineraries
- Secure booking system
- User account management
- Custom tour requests
- Contact and inquiry forms

### For Admins
- Complete tour management (CRUD)
- Booking management and tracking
- Customer inquiry handling
- Analytics and statistics
- Custom tour request workflow
- User management

---

## 🚦 Getting Started

### For Production Deployment

1. **Create User** (Security best practice)
   ```bash
   ssh root@187.127.151.137
   # Follow: docs/deployment/USER-SETUP.md
   ```

2. **Setup VPS** (Install all services)
   ```bash
   ssh ghumo@187.127.151.137
   # Follow: docs/deployment/VPS-SETUP.md
   ```

3. **Deploy Application**
   ```bash
   # Follow: docs/deployment/MANUAL-DEPLOY-COMMANDS.md
   ```

### For Local Development

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd ghumo-phiro-india
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm run db:push
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with API URL
   npm run dev
   ```

---

## 📋 Prerequisites

### Production
- Ubuntu 24.04 LTS VPS
- 4+ vCPU, 8GB+ RAM
- Root/sudo access
- Domain name (optional)

### Development
- Node.js 24.x LTS
- PostgreSQL 18.x
- Redis 8.x (optional)
- npm 11.x

---

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 📚 Documentation

### Deployment
- [User Setup Guide](./docs/deployment/USER-SETUP.md) - Create non-root user
- [VPS Setup Guide](./docs/deployment/VPS-SETUP.md) - Complete server setup
- [Manual Deploy Commands](./docs/deployment/MANUAL-DEPLOY-COMMANDS.md) - Quick reference
- [Docker Deployment](./docs/deployment/DEPLOYMENT.md) - Optional Docker setup

### Development
- [Development Guide](./docs/development/DEVELOPMENT.md) - Local setup
- [Backend README](./backend/README.md) - Backend documentation
- [Frontend README](./frontend/README.md) - Frontend documentation
- [API Documentation](./backend/API.md) - API endpoints

### Versions
- [Version Information](./docs/versions/VERSION-INFO.md) - All versions
- [Version Updates](./docs/versions/VERSIONS-UPDATED.md) - Recent changes

---

## 🧪 Testing

### Backend
```bash
cd backend
npm run test:startup  # Test environment setup
npm run typecheck     # TypeScript validation
npm test             # Run tests
```

### Frontend
```bash
cd frontend
npm run typecheck    # TypeScript validation
npm test            # Run tests
```

---

## 📦 Deployment Commands

```bash
# Build backend
cd backend
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Build frontend
cd frontend
npm run build
npm run start
```

---

## 🔧 Management Commands

### PM2 (Backend)
```bash
pm2 status                    # Check status
pm2 logs ghumo-phiro-backend  # View logs
pm2 restart ghumo-phiro-backend  # Restart
pm2 monit                     # Monitor resources
```

### Database
```bash
psql -U user -d database      # Connect
npm run db:push               # Push schema changes
npm run db:studio             # Open Drizzle Studio
```

### Nginx
```bash
sudo nginx -t                 # Test config
sudo systemctl reload nginx   # Reload
sudo systemctl status nginx   # Check status
```

---

## 🐛 Troubleshooting

### Backend Issues
- Check logs: `pm2 logs ghumo-phiro-backend`
- Check environment: `cat backend/.env`
- Test database: `psql -U user -d database`
- See: [backend/TROUBLESHOOTING.md](./backend/TROUBLESHOOTING.md)

### Frontend Issues
- Check build: `npm run build`
- Check environment: `cat frontend/.env.local`
- Check API connection: Test API endpoints

### Server Issues
- Check services: `systemctl status postgresql redis nginx`
- Check ports: `netstat -tulpn | grep -E '5000|3000|5432|6379'`
- Check firewall: `sudo ufw status`

---

## 🔒 Security

- ✅ Non-root user for application
- ✅ SSH key authentication
- ✅ Firewall configured (UFW)
- ✅ Strong passwords for database/Redis
- ✅ JWT for authentication
- ✅ Rate limiting on API
- ✅ Helmet.js security headers
- ⏳ SSL certificate (setup with Let's Encrypt)

---

## 📊 VPS Information

- **Provider**: Hostinger
- **Location**: Mumbai, India
- **IP**: 187.127.151.137
- **CPU**: AMD EPYC 9355P (4 vCPU @ 3.5 GHz)
- **RAM**: 15.6 GB
- **Storage**: 193.7 GB NVMe SSD
- **OS**: Ubuntu 24.04.4 LTS

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Team

Ghumo Phiro India Development Team

---

## 📞 Support

For issues and questions:
- Check [Documentation](./docs/README.md)
- Review [Troubleshooting Guide](./backend/TROUBLESHOOTING.md)
- Check logs: `pm2 logs`

---

**Last Updated**: April 13, 2026  
**Version**: 1.0.0  
**Status**: Ready for deployment
