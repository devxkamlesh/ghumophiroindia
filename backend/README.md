# Backend API - Ghumo Phiro India

Domain-driven architecture with modular design.

## Prerequisites

- **Node.js**: 24.x LTS or higher
- **npm**: 11.x or higher
- **PostgreSQL**: 18.x
- **Redis**: 8.x (optional, but recommended for caching)
- **Cloudinary**: Account for image uploads

## Quick Start

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

Server will start at: `http://localhost:4000`

## Environment Setup

Required variables in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT (min 32 chars)

Optional:
- `UPSTASH_REDIS_REST_URL` - Redis cache (optional)
- `CLOUDINARY_*` - Image upload (optional)

Generate secrets:
```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run test:startup     # Test configuration
npm run db:push          # Push schema to database
npm run db:studio        # Open database GUI
npm run typecheck        # Check TypeScript
npm run lint             # Run ESLint
```

## API Documentation

See `API.md` for complete endpoint documentation.

Base URL: `http://localhost:4000/api/v1`

### Quick Test

```bash
# Health check
curl http://localhost:4000/health

# Get tours
curl http://localhost:4000/api/v1/tours

# Register user
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test123!@#"}'
```

## Troubleshooting

Having issues? See `TROUBLESHOOTING.md` for common errors and fixes.

Quick checks:
```bash
npm run test:startup     # Test everything
npm run typecheck        # Check TypeScript
tail -f logs/error.log   # View error logs
```

## Project Structure

```
backend/
├── src/
│   ├── core/           # Core systems (config, database, redis, logger)
│   ├── modules/        # Domain modules (auth, tours, bookings, etc.)
│   ├── middleware/     # Express middleware
│   ├── shared/         # Shared utilities
│   └── app.ts          # Main application
├── drizzle/            # Database migrations
└── logs/               # Application logs
```

## Tech Stack

- **Framework**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Cache**: Redis (Upstash)
- **Auth**: JWT (jose)
- **Validation**: Zod
- **Logging**: Winston

## Development

```bash
# Watch mode (auto-reload)
npm run dev

# Check for errors
npm run typecheck
npm run lint

# View logs
tail -f logs/combined.log
```

## Production

```bash
# Build
npm run build

# Start
NODE_ENV=production npm start
```

## Support

- Documentation: `API.md`, `TROUBLESHOOTING.md`
- Health check: `http://localhost:4000/health`
- Database GUI: `npm run db:studio`
