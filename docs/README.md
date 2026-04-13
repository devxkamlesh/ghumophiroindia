# Ghumo Phiro India - Documentation

Complete documentation for the tour booking platform.

---

## 📁 Documentation Structure

### 🚀 Deployment
Guides for deploying the application to production VPS.

- **[VPS-SETUP.md](./deployment/VPS-SETUP.md)** - Complete VPS setup guide with PM2
- **[MANUAL-DEPLOY-COMMANDS.md](./deployment/MANUAL-DEPLOY-COMMANDS.md)** - Quick command reference
- **[DEPLOYMENT.md](./deployment/DEPLOYMENT.md)** - Docker deployment guide (optional)

### 💻 Development
Guides for local development setup.

- **[DEVELOPMENT.md](./development/DEVELOPMENT.md)** - Local development setup guide

### 📦 Versions
Version information and compatibility.

- **[VERSION-INFO.md](./versions/VERSION-INFO.md)** - Complete version reference

---

## 🎯 Quick Start Guides

### For Production Deployment (VPS)

1. **[Setup VPS](./deployment/VPS-SETUP.md)** - Install and configure all services
2. **[Deploy Application](./deployment/MANUAL-DEPLOY-COMMANDS.md)** - Deploy backend and frontend

### For Local Development

1. **[Development Setup](./development/DEVELOPMENT.md)** - Setup local environment
2. Check **[Version Info](./versions/VERSION-INFO.md)** - Ensure correct versions

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx (Port 80/443)                  │
│                   Reverse Proxy + SSL                   │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌──────────────┐
│   Frontend    │         │   Backend    │
│   Next.js 16  │         │  Express API │
│   Port 3000   │         │   Port 5000  │
└───────────────┘         └──────┬───────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
            ┌──────────┐  ┌──────────┐  ┌──────────┐
            │PostgreSQL│  │  Redis   │  │Cloudinary│
            │   18.x   │  │   8.x    │  │  Images  │
            └──────────┘  └──────────┘  └──────────┘
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 24.x LTS
- **Framework**: Express 4.x
- **Language**: TypeScript 5.8
- **Database**: PostgreSQL 18.x
- **Cache**: Redis 8.x
- **ORM**: Drizzle ORM
- **Process Manager**: PM2 6.x

### Frontend
- **Framework**: Next.js 16.2
- **UI Library**: React 19.2
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 3.4
- **Components**: Radix UI
- **State**: Zustand + SWR

### Infrastructure
- **Web Server**: Nginx 1.28.x
- **OS**: Ubuntu 24.04 LTS
- **VPS**: Hostinger Mumbai (4 vCPU, 15.6GB RAM)

---

## 📋 Prerequisites

### For Production
- Ubuntu 24.04 LTS VPS
- Root or sudo access
- Domain name (optional, for SSL)
- Cloudinary account

### For Development
- Node.js 24.x LTS
- PostgreSQL 18.x
- Redis 8.x (optional)
- Git

---

## 🔐 Security Checklist

- [ ] Non-root user created
- [ ] SSH key authentication enabled
- [ ] Root SSH login disabled
- [ ] Firewall (UFW) configured
- [ ] Strong database passwords
- [ ] Redis password set
- [ ] JWT secrets generated
- [ ] Environment variables secured
- [ ] SSL certificate installed (production)
- [ ] Regular backups configured

---

## 📞 Support & Resources

### Documentation
- Backend API: `/backend/README.md`
- Frontend: `/frontend/README.md`
- API Documentation: `/backend/API.md`

### Troubleshooting
- Backend: `/backend/TROUBLESHOOTING.md`
- Check logs: `pm2 logs`
- Database: `psql -U user -d database`

### Version Information
- [Current Versions](./versions/VERSION-INFO.md)
- [Update History](./versions/VERSIONS-UPDATED.md)

---

## 🚦 Deployment Status

### Current Setup
- **VPS IP**: 187.127.151.137
- **Location**: Mumbai, India
- **Provider**: Hostinger
- **Status**: Ready for deployment

### Next Steps
1. ✅ Documentation organized
2. ⏳ Create non-root user
3. ⏳ Install software stack
4. ⏳ Deploy backend
5. ⏳ Deploy frontend
6. ⏳ Configure SSL

---

## 📝 Notes

- All commands assume Ubuntu 24.04 LTS
- PostgreSQL 18 requires official PostgreSQL repository
- Redis 8.x available in Ubuntu 24.04 default repos
- PM2 should be installed per-user, not globally as root
- Always test in staging before production

---

**Last Updated**: April 13, 2026  
**Documentation Version**: 1.0.0
