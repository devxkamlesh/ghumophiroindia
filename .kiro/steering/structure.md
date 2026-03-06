# Project Structure

## Directory Organization

```
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (login, register, forgot-password)
│   ├── (dashboard)/              # Admin dashboard route group
│   │   └── dashboard/            # Dashboard pages (analytics, bookings, tours, etc.)
│   ├── (public)/                 # Public homepage route group
│   ├── (user-panel)/             # User account route group
│   │   └── my-account/           # User bookings and profile
│   ├── about/                    # About page
│   ├── admin/                    # Admin panel
│   ├── api/                      # API routes
│   │   ├── bookings/             # Booking endpoints
│   │   ├── custom-tour/          # Custom tour request endpoints
│   │   ├── dashboard/            # Dashboard stats endpoints
│   │   ├── inquiries/            # Inquiry endpoints
│   │   ├── tours/                # Tour endpoints
│   │   └── v1/auth/              # Authentication endpoints
│   ├── contact/                  # Contact page
│   ├── custom-tour/              # Custom tour request page
│   ├── tours/                    # Tour listing and detail pages
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with header/footer
│   ├── loading.tsx               # Global loading state
│   ├── error.tsx                 # Global error boundary
│   └── not-found.tsx             # 404 page
├── components/                   # React components
│   ├── dashboard/                # Admin dashboard components
│   │   ├── analytics/            # Stats cards
│   │   ├── bookings/             # Booking tables
│   │   ├── custom-requests/      # Custom request tables
│   │   ├── inquiries/            # Inquiry tables
│   │   ├── layout/               # Dashboard layout components
│   │   └── tours/                # Tour management components
│   ├── public/                   # Public-facing components
│   │   ├── booking/              # Booking form
│   │   ├── home/                 # Homepage sections
│   │   ├── layout/               # Header, footer, navigation
│   │   └── shared/               # Shared public components
│   ├── ui/                       # Reusable UI components (Radix-based)
│   └── user-panel/               # User account components
├── config/                       # Configuration files
│   ├── dashboard.ts              # Dashboard navigation config
│   ├── navigation.ts             # Site navigation config
│   └── site.ts                   # Site metadata config
├── hooks/                        # Custom React hooks
│   ├── useBookings.ts            # Booking data fetching
│   └── useDebounce.ts            # Debounce utility
├── lib/                          # Core library code
│   ├── auth/                     # Authentication utilities
│   │   ├── config.ts             # Auth configuration
│   │   ├── session.ts            # Session management (JWT)
│   │   └── validation.ts         # Auth validation schemas
│   ├── db/                       # Database layer
│   │   ├── index.ts              # Database connection
│   │   └── schema.ts             # Drizzle schema definitions
│   ├── services/                 # Business logic layer
│   │   ├── auth.service.ts       # Authentication service
│   │   ├── booking.service.ts    # Booking operations
│   │   ├── custom-tour.service.ts
│   │   ├── inquiry.service.ts
│   │   └── tour.service.ts
│   ├── utils/                    # Utility functions
│   └── validations/              # Zod validation schemas
├── scripts/                      # Utility scripts
│   ├── seed.ts                   # Database seeding
│   └── test-auth.ts              # Auth testing
├── .kiro/                        # Kiro configuration
│   ├── hooks/                    # Agent hooks
│   └── steering/                 # Steering rules
└── drizzle/                      # Database migrations
```

## Architecture Patterns

### Route Groups

Next.js route groups organize pages by layout without affecting URLs:
- `(auth)` - Authentication pages with auth-specific layout
- `(dashboard)` - Admin dashboard with sidebar navigation
- `(public)` - Public pages with standard header/footer
- `(user-panel)` - User account pages with user navigation

### API Layer Structure

API routes follow RESTful conventions:
- `GET /api/tours` - List resources
- `GET /api/tours/[id]` - Get single resource
- `POST /api/tours` - Create resource
- `PATCH /api/tours/[id]` - Update resource
- `DELETE /api/tours/[id]` - Delete resource

### Service Layer Pattern

Business logic is separated into service files in `lib/services/`:
- Services handle database operations via Drizzle ORM
- API routes call services (thin controller layer)
- Services return typed data or throw errors
- Validation happens at API route level using Zod schemas

### Component Organization

Components are organized by feature and visibility:
- `components/dashboard/` - Admin-only components
- `components/public/` - Public-facing components
- `components/user-panel/` - User account components
- `components/ui/` - Reusable UI primitives

### Authentication Flow

1. User submits credentials to `/api/v1/auth/login`
2. Service validates credentials and creates JWT
3. JWT stored in HTTP-only cookie
4. Protected routes check session via `getSession()`
5. Admin routes additionally check `role === 'admin'`

### Data Fetching Patterns

- **Server Components**: Direct database queries via services
- **Client Components**: SWR for caching and revalidation
- **Forms**: React Hook Form + Zod validation
- **URL State**: nuqs for search params

## File Naming Conventions

- **Pages**: `page.tsx` (Next.js convention)
- **Layouts**: `layout.tsx` (Next.js convention)
- **Loading**: `loading.tsx` (Next.js convention)
- **API Routes**: `route.ts` (Next.js convention)
- **Components**: PascalCase (e.g., `BookingForm.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Services**: `*.service.ts` pattern
- **Schemas**: `schema.ts` or `validation.ts`

## Import Alias

Use `@/` for all imports from project root:
```typescript
import { db } from '@/lib/db'
import { BookingForm } from '@/components/public/booking/BookingForm'
```

## Key Conventions

- Server Components by default (use `'use client'` only when needed)
- Async Server Components for data fetching
- Services throw errors, API routes catch and return appropriate status codes
- All database queries use Drizzle ORM (no raw SQL)
- Validation schemas defined with Zod, reused across client and server
- TypeScript strict mode enabled - all types must be explicit
