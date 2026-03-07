# Software Versions - Ghumo Phiro India

Last Updated: April 13, 2026

## Production Stack Versions

### Runtime & Language
- **Node.js**: 24.x LTS (Krypton)
  - Release: October 2025
  - LTS Support: Until April 2028
  - npm: 11.x (bundled)
  - Why: Latest LTS with enhanced security and Web API support

### Database
- **PostgreSQL**: 18.x
  - Release: September 2025
  - Latest Minor: 18.3 (February 2026)
  - Why: Async I/O improvements, better performance
  - Support: Active development + security updates

### Cache & Queue
- **Redis**: 8.x
  - Latest: 8.6 (February 2026)
  - Why: 5x throughput improvement over Redis 7.2
  - Features: Hot key detection, improved Streams

### Process Manager
- **PM2**: 6.x
  - Latest: 6.0.14 (November 2025)
  - Why: 80% reduced bandwidth, improved monitoring
  - Features: Cluster mode, zero-downtime reload

### Web Server
- **Nginx**: 1.28.x stable
  - Latest: 1.28.3 (March 2026)
  - Why: Production-stable, proven reliability
  - Alternative: 1.29.x mainline (for latest features)

### Operating System
- **Ubuntu**: 24.04.4 LTS
  - Support: Until April 2029
  - Kernel: 6.8.x
  - Why: Latest LTS with long-term support

---

## Backend Dependencies

### Core Framework
- **Express**: ^4.19.2
- **TypeScript**: ^5.8.3
- **tsx**: ^4.19.3 (dev server)

### Database & ORM
- **Drizzle ORM**: ^0.43.1
- **postgres**: ^3.4.5 (PostgreSQL driver)
- **drizzle-kit**: ^0.31.1

### Authentication & Security
- **jose**: ^5.10.0 (JWT)
- **bcryptjs**: ^3.0.3 (password hashing)
- **helmet**: ^7.1.0 (security headers)
- **cors**: ^2.8.5
- **express-rate-limit**: ^7.5.0

### Caching & Queue
- **@upstash/redis**: ^1.34.3
- **ioredis**: ^5.4.2
- **bullmq**: ^5.34.3

### Validation & Utilities
- **zod**: ^3.24.4
- **date-fns**: ^4.1.0
- **winston**: ^3.17.0 (logging)
- **morgan**: ^1.10.0 (HTTP logging)

### File Upload
- **cloudinary**: ^2.5.1

---

## Frontend Dependencies

### Core Framework
- **Next.js**: ^16.2.3
- **React**: ^19.2.5
- **TypeScript**: ^5.8.3

### UI Components
- **Radix UI**: Various ^1.x - ^2.x
- **Tailwind CSS**: ^3.4.17
- **lucide-react**: ^0.508.0 (icons)
- **motion**: ^12.6.0 (animations)

### State & Data
- **zustand**: ^5.0.3 (state management)
- **swr**: ^2.4.1 (data fetching)
- **axios**: ^1.7.9
- **nuqs**: ^2.4.3 (URL state)

### Forms & Validation
- **react-hook-form**: ^7.54.2
- **zod**: ^3.24.4
- **@hookform/resolvers**: ^3.10.0

### Utilities
- **date-fns**: ^4.1.0
- **clsx**: ^2.1.1
- **tailwind-merge**: ^3.2.0
- **next-themes**: ^0.4.6
- **sonner**: ^2.0.3 (toast notifications)

---

## Development Tools

### Linting & Formatting
- **ESLint**: ^9.26.0
- **@typescript-eslint/eslint-plugin**: ^8.20.0
- **@typescript-eslint/parser**: ^8.20.0

### Testing
- **Jest**: ^29.7.0
- **@testing-library/react**: ^16.1.0
- **@testing-library/jest-dom**: ^6.6.3
- **ts-jest**: ^29.2.5

---

## Version Compatibility Matrix

| Component | Minimum | Recommended | Latest |
|-----------|---------|-------------|--------|
| Node.js | 24.0.0 | 24.11.0 | 24.11.0 |
| npm | 11.0.0 | 11.x | 11.x |
| PostgreSQL | 18.0 | 18.3 | 18.3 |
| Redis | 8.0 | 8.6 | 8.6 |
| PM2 | 6.0.0 | 6.0.14 | 6.0.14 |
| Nginx | 1.28.0 | 1.28.3 | 1.28.3 |
| Ubuntu | 24.04 | 24.04.4 | 24.04.4 |

---

## Update Schedule

### Critical Updates (Apply Immediately)
- Security patches for Node.js, PostgreSQL, Redis
- Critical bug fixes in dependencies
- Zero-day vulnerability patches

### Regular Updates (Monthly)
- Minor version updates for dependencies
- PostgreSQL quarterly releases
- Redis minor releases
- PM2 updates

### Major Updates (Quarterly Review)
- Node.js LTS transitions
- PostgreSQL major versions
- Framework major versions (Next.js, Express)

---

## Upgrade Paths

### Node.js
- Current: 24.x LTS (until April 2028)
- Next LTS: 26.x (October 2026)
- Migration: Test in staging, update package.json engines

### PostgreSQL
- Current: 18.x
- Next Major: 19.x (expected September 2026)
- Migration: Test with pg_upgrade, backup first

### Redis
- Current: 8.x
- Stable: Regular minor updates
- Migration: Usually backward compatible

---

## Version Check Commands

```bash
# Check installed versions
node --version
npm --version
psql --version
redis-cli --version
pm2 --version
nginx -v

# Check package versions
npm list --depth=0
npm outdated

# Check for security vulnerabilities
npm audit
npm audit fix
```

---

## References

- [Node.js Releases](https://nodejs.org/en/about/previous-releases)
- [PostgreSQL Versioning](https://www.postgresql.org/support/versioning/)
- [Redis Releases](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Releases](https://nginx.org/en/download.html)

---

## Notes

- All versions listed are production-ready and actively maintained
- LTS versions are preferred for production deployments
- Regular security updates are essential
- Test all updates in staging before production
- Keep dependencies up to date for security patches
