# Ghumo Phiro India - Project Structure

## Root Directory
```
ghumo-phiro/
├── backend/                    # Node.js + Express + TypeScript API
├── frontend/                   # Next.js 16 + React + TypeScript
├── docs/                       # Documentation
├── infrastructure/             # Docker & deployment configs
├── ecosystem.config.js         # PM2 configuration
├── deploy.sh                   # Deployment script
├── run-banner-migration.sh     # Banner migration script
└── README.md
```

## Backend Structure
```
backend/
├── src/
│   ├── core/                   # Core infrastructure
│   │   ├── config/            # Environment & app config
│   │   ├── database/          # Database setup & migrations
│   │   │   ├── migrations/    # SQL migration files
│   │   │   │   ├── 001_users.sql
│   │   │   │   ├── 002_tours.sql
│   │   │   │   ├── 003_bookings.sql
│   │   │   │   ├── 004_inquiries.sql
│   │   │   │   ├── 005_custom_tours.sql
│   │   │   │   ├── 006_locations.sql
│   │   │   │   └── 007_banners.sql
│   │   │   ├── seeds/         # Seed data files
│   │   │   ├── schema.ts      # Drizzle ORM schema
│   │   │   └── index.ts       # Database connection
│   │   ├── logger/            # Winston logger
│   │   ├── redis/             # Redis cache setup
│   │   ├── events.ts          # Event emitter
│   │   ├── server.ts          # Express server setup
│   │   └── cache-invalidator.ts
│   │
│   ├── modules/               # Feature modules
│   │   ├── auth/             # Authentication & authorization
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.validator.ts
│   │   │   ├── auth.model.ts
│   │   │   └── admin-management.routes.ts
│   │   ├── tours/            # Tour management
│   │   │   ├── tour.controller.ts
│   │   │   ├── tour.service.ts
│   │   │   ├── tour.routes.ts
│   │   │   └── tour.validator.ts
│   │   ├── bookings/         # Booking management
│   │   ├── inquiries/        # Inquiry management
│   │   ├── custom-tour/      # Custom tour requests
│   │   ├── locations/        # Location & map management
│   │   ├── banners/          # Banner management (NEW)
│   │   │   ├── banner.service.ts
│   │   │   ├── banner.routes.ts
│   │   │   └── banner.validator.ts
│   │   ├── gallery/          # Cloudinary gallery
│   │   └── upload/           # File upload
│   │
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.ts
│   │   ├── notFoundHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── validate.middleware.ts
│   │
│   ├── shared/              # Shared utilities
│   │   ├── errors.ts        # Custom error classes
│   │   ├── jwt.ts           # JWT utilities
│   │   ├── password.ts      # Password hashing
│   │   ├── email.ts         # Email service
│   │   └── response.ts      # Response helpers
│   │
│   ├── jobs/                # Background jobs
│   │   └── workers.ts       # Scheduled tasks
│   │
│   └── app.ts               # Main application entry
│
├── dist/                    # Compiled JavaScript (build output)
├── logs/                    # Application logs
├── drizzle/                 # Drizzle ORM generated files
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json
├── tsconfig.json
├── drizzle.config.ts
└── ecosystem.config.js      # PM2 config (backend only)
```

## Frontend Structure
```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Auth pages group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   │
│   │   ├── (dashboard)/    # Admin dashboard group
│   │   │   └── dashboard/
│   │   │       ├── page.tsx           # Dashboard home
│   │   │       ├── analytics/
│   │   │       ├── tours/
│   │   │       ├── bookings/
│   │   │       ├── inquiries/
│   │   │       ├── custom-requests/
│   │   │       ├── locations/
│   │   │       ├── banners/           # Banner management (NEW)
│   │   │       ├── gallery/
│   │   │       ├── admins/            # User management (superadmin)
│   │   │       └── settings/
│   │   │
│   │   ├── (user-panel)/   # User account group
│   │   │   └── my-account/
│   │   │       ├── page.tsx           # User dashboard
│   │   │       ├── bookings/
│   │   │       ├── profile/
│   │   │       ├── reviews/
│   │   │       └── settings/
│   │   │
│   │   ├── (public)/       # Public pages group
│   │   │   ├── page.tsx               # Homepage
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── tours/
│   │   │   ├── destinations/
│   │   │   └── custom-tour/
│   │   │
│   │   ├── layout.tsx      # Root layout
│   │   ├── globals.css     # Global styles
│   │   ├── error.tsx       # Error boundary
│   │   └── not-found.tsx   # 404 page
│   │
│   ├── components/         # React components
│   │   ├── dashboard/     # Dashboard components
│   │   │   ├── layout/
│   │   │   │   ├── DashboardHeader.tsx
│   │   │   │   ├── DashboardSidebar.tsx
│   │   │   │   └── DashboardGuard.tsx
│   │   │   ├── analytics/
│   │   │   ├── tours/
│   │   │   ├── bookings/
│   │   │   └── inquiries/
│   │   │
│   │   ├── user-panel/    # User panel components
│   │   │   └── layout/
│   │   │       ├── UserPanelHeader.tsx
│   │   │       ├── UserPanelSidebar.tsx
│   │   │       └── UserPanelGuard.tsx
│   │   │
│   │   ├── public/        # Public site components
│   │   │   ├── layout/
│   │   │   │   ├── ModernHeader.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── home/
│   │   │   │   ├── Hero.tsx           # Homepage hero (uses banners)
│   │   │   │   ├── FeaturedTours.tsx
│   │   │   │   ├── PopularDestinations.tsx
│   │   │   │   ├── Testimonials.tsx
│   │   │   │   ├── WhyChooseUs.tsx
│   │   │   │   ├── HowItWorks.tsx
│   │   │   │   ├── FAQ.tsx
│   │   │   │   └── CTABand.tsx
│   │   │   ├── tours/
│   │   │   ├── booking/
│   │   │   └── shared/
│   │   │
│   │   └── ui/            # Reusable UI components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       └── ...
│   │
│   ├── lib/               # Utilities & helpers
│   │   ├── auth.ts        # Auth helpers (localStorage, tokens)
│   │   ├── utils.ts       # General utilities
│   │   └── constants.ts   # Constants
│   │
│   ├── services/          # API services
│   │   └── api.ts         # Axios instance & all API calls
│   │
│   ├── types/             # TypeScript types
│   │   └── index.ts       # All type definitions
│   │
│   └── hooks/             # Custom React hooks
│       ├── useAuth.ts
│       ├── useTours.ts
│       └── useBookings.ts
│
├── public/                # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── .next/                 # Next.js build output
├── .env.local             # Environment variables
├── .env.example           # Environment template
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS config
├── tsconfig.json          # TypeScript config
└── package.json
```

## Documentation Structure
```
docs/
├── README.md                      # Documentation index
├── FOLDER_ORGANIZATION.md         # Folder structure guide
├── CSV_IMPORT_FEATURE.md          # CSV import documentation
├── deployment/
│   └── VPS_DOCKER_DEPLOYMENT.md   # Deployment guide
├── guides/
│   ├── getting-started.md
│   ├── api-reference.md
│   └── architecture.md
├── database/
│   ├── schema.md
│   └── migrations.md
└── archive/                       # Old documentation
    └── (26 archived files)
```

## Infrastructure Structure
```
infrastructure/
├── docker/
│   ├── Dockerfile.backend         # Backend Docker image
│   ├── Dockerfile.frontend        # Frontend Docker image
│   ├── docker-compose.yml         # Docker Compose config
│   └── postgres/
│       └── init.sql               # PostgreSQL init script
└── nginx/
    └── nginx.conf                 # Nginx configuration
```

## Key Files

### Root Level
- `ecosystem.config.js` - PM2 process manager configuration
- `deploy.sh` - Automated deployment script
- `run-banner-migration.sh` - Banner table migration script
- `.gitignore` - Git ignore rules
- `README.md` - Project overview

### Backend
- `.env` - Environment variables (DATABASE_URL, JWT_SECRET, etc.)
- `drizzle.config.ts` - Drizzle ORM configuration
- `tsconfig.json` - TypeScript compiler options

### Frontend
- `.env.local` - Environment variables (NEXT_PUBLIC_API_URL, etc.)
- `next.config.ts` - Next.js configuration (standalone mode enabled)
- `tailwind.config.ts` - Tailwind CSS configuration

## Database Tables

1. **users** - User accounts (admin, superadmin, user)
2. **tours** - Tour packages
3. **bookings** - Tour bookings
4. **inquiries** - General inquiries
5. **custom_tours** - Custom tour requests
6. **locations** - Hierarchical location data
7. **banners** - Homepage hero banners (NEW)

## Technology Stack

### Backend
- **Runtime**: Node.js 24 LTS
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **Cache**: Redis
- **Auth**: JWT (access + refresh tokens)
- **Validation**: Zod
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Process Manager**: PM2

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod

### DevOps
- **Version Control**: Git + GitHub
- **Deployment**: VPS (Ubuntu)
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx (optional)
- **Containerization**: Docker (optional)

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/profile` - Get user profile
- `PATCH /api/v1/auth/profile` - Update profile
- `POST /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Tours
- `GET /api/v1/tours` - List tours (with filters)
- `GET /api/v1/tours/featured` - Featured tours
- `GET /api/v1/tours/:id` - Get tour by ID
- `GET /api/v1/tours/slug/:slug` - Get tour by slug
- `POST /api/v1/tours` - Create tour (admin)
- `PATCH /api/v1/tours/:id` - Update tour (admin)
- `DELETE /api/v1/tours/:id` - Delete tour (admin)

### Bookings
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings/my-bookings` - User's bookings
- `GET /api/v1/bookings` - All bookings (admin)
- `GET /api/v1/bookings/:id` - Get booking
- `PATCH /api/v1/bookings/:id/status` - Update status (admin)
- `PATCH /api/v1/bookings/:id/payment` - Update payment (admin)

### Banners (NEW)
- `GET /api/v1/banners/active` - Get active banners (public)
- `GET /api/v1/banners` - All banners (admin)
- `GET /api/v1/banners/:id` - Get banner (admin)
- `POST /api/v1/banners` - Create banner (admin)
- `PATCH /api/v1/banners/:id` - Update banner (admin)
- `DELETE /api/v1/banners/:id` - Delete banner (admin)
- `POST /api/v1/banners/reorder` - Reorder banners (admin)

### Locations
- `GET /api/v1/locations` - All locations
- `GET /api/v1/locations/:id` - Get location
- `GET /api/v1/locations/slug/:slug` - Get by slug
- `GET /api/v1/locations/map/:slug/full` - Map data
- `POST /api/v1/locations` - Create location (admin)
- `PATCH /api/v1/locations/:id` - Update location (admin)
- `DELETE /api/v1/locations/:id` - Delete location (admin)
- `POST /api/v1/locations/bulk-import` - CSV import (admin)

### Gallery
- `GET /api/v1/gallery` - List images
- `GET /api/v1/gallery/folders` - List folders
- `POST /api/v1/gallery/upload` - Upload images (admin)
- `PATCH /api/v1/gallery/:publicId` - Update image (admin)
- `DELETE /api/v1/gallery/:publicId` - Delete image (admin)

### Admin
- `GET /api/v1/admin/users` - List users (superadmin)
- `PATCH /api/v1/admin/users/:id/role` - Change role (superadmin)
- `DELETE /api/v1/admin/users/:id` - Deactivate user (superadmin)

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

## Deployment

### Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Production (VPS)
```bash
# Pull latest code
git pull origin main

# Run deployment script
chmod +x deploy.sh
./deploy.sh

# Or manual deployment
cd backend && npm install && npm run build
cd ../frontend && npm install && npm run build
pm2 restart all
```

## Recent Features Added

1. ✅ **Banner Management System**
   - Full CRUD API for banners
   - Admin panel at `/dashboard/banners`
   - Homepage hero integration
   - Image upload support
   - Active/inactive toggle
   - Display order management

2. ✅ **Real-time Role Updates**
   - Role changes take effect without logout
   - Periodic checking every 30 seconds
   - Automatic redirect on role demotion
   - Works in both dashboard and user panel

3. ✅ **CSV Import for Locations**
   - Bulk import locations from CSV
   - Parent slug resolution
   - Success/failed/skipped results
   - Template download

4. ✅ **PM2 Configuration**
   - Standalone Next.js support
   - Cluster mode for backend
   - Automated deployment script
   - Proper log management

## Notes

- All passwords are hashed with bcrypt
- JWT tokens expire after 15 minutes (access) and 7 days (refresh)
- Redis is used for caching and rate limiting
- File uploads go to Cloudinary
- Database uses Drizzle ORM with PostgreSQL
- Frontend uses Next.js 16 with App Router and Turbopack
- Role-based access control (user, admin, superadmin)
