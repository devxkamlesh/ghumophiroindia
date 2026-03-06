# Getting Started

Complete setup guide for Ghumo Firo India.

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

## Installation

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install
```

### 2. Environment Configuration

Create `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ghumofiro"

# Authentication (generate with: openssl rand -base64 32)
AUTH_SECRET="your-32-character-secret-key-here"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="+919876543210"

# Optional: Email notifications
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@ghumofiroindia.com"
```

### 3. Database Setup

```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# Open Drizzle Studio (optional)
npm run db:studio
```

### 4. Seed Database (Optional)

```bash
npm run seed
```

This creates:
- Admin user: `admin@ghumofiroindia.com` / `admin123`
- Regular user: `user@example.com` / `user123`
- 5 sample tours
- 5 destinations

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Available Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Production build
npm start                # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run typecheck        # TypeScript type checking

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:push          # Push schema changes
npm run db:pull          # Pull schema from database
npm run db:studio        # Open Drizzle Studio
npm run seed             # Seed database

# Testing
npm run test:auth        # Test authentication flow
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages
│   ├── (dashboard)/       # Admin dashboard
│   ├── (public)/          # Public pages
│   ├── (user-panel)/      # User account
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Core libraries
│   ├── auth/             # Authentication
│   ├── db/               # Database
│   ├── services/         # Business logic
│   ├── mappers/          # Type conversions
│   └── validations/      # Zod schemas
├── config/               # Configuration
├── hooks/                # Custom hooks
└── public/               # Static assets
```

## Testing the Setup

### 1. Test Authentication

```bash
# Register a new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ghumofiroindia.com",
    "password": "admin123"
  }'
```

### 2. Test API Endpoints

```bash
# Get all tours
curl http://localhost:3000/api/tours

# Get featured tours
curl http://localhost:3000/api/tours/featured

# Search tours
curl http://localhost:3000/api/tours/search?q=golden
```

### 3. Access the Application

- Homepage: `http://localhost:3000`
- Login: `http://localhost:3000/login`
- Dashboard: `http://localhost:3000/dashboard` (admin only)
- User Panel: `http://localhost:3000/my-account`

## Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Check database exists

### Build Errors
```bash
# Clear build cache
rm -rf .next
rm -rf node_modules
npm install
```

### Authentication Issues
- Verify `AUTH_SECRET` is set (32+ characters)
- Clear browser cookies
- Check user exists in database

## Next Steps

1. Review [API Reference](./api-reference.md) for endpoint details
2. Check [Architecture](./architecture.md) for system design
3. See [Database](./database.md) for schema information

---

**Last Updated:** April 1, 2026
