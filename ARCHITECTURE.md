# Ghumo Phiro India - Complete Folder Architecture

## 📁 Project Structure Overview

```
ghumophiroindia/
├── 📂 app/                          # Next.js App Router (Pages & API)
│   ├── 📂 (auth)/                   # Authentication Route Group
│   │   ├── layout.tsx               # Auth-specific layout (centered, minimal)
│   │   ├── 📂 login/
│   │   │   └── page.tsx             # Login form with JWT authentication
│   │   ├── 📂 register/
│   │   │   └── page.tsx             # User registration form
│   │   └── 📂 forgot-password/
│   │       └── page.tsx             # Password recovery flow
│   │
│   ├── 📂 (dashboard)/              # Admin Dashboard Route Group
│   │   ├── layout.tsx               # Dashboard layout (sidebar + header)
│   │   └── 📂 dashboard/
│   │       ├── page.tsx             # Dashboard overview with stats
│   │       ├── 📂 analytics/
│   │       │   └── page.tsx         # Revenue, bookings, conversion metrics
│   │       ├── 📂 bookings/
│   │       │   └── page.tsx         # Booking management table
│   │       ├── 📂 tours/
│   │       │   └── page.tsx         # Tour CRUD operations
│   │       ├── 📂 inquiries/
│   │       │   └── page.tsx         # Inquiry management
│   │       └── 📂 custom-requests/
│   │           └── page.tsx         # Custom tour request management
│   │
│   ├── 📂 (public)/                 # Public Pages Route Group
│   │   ├── layout.tsx               # Public layout (header + footer)
│   │   └── page.tsx                 # Homepage (hero, featured tours, testimonials)
│   │
│   ├── 📂 (user-panel)/             # User Account Route Group
│   │   ├── layout.tsx               # User panel layout (user nav + header)
│   │   └── 📂 my-account/
│   │       ├── page.tsx             # User dashboard (stats, upcoming trips)
│   │       └── 📂 bookings/
│   │           └── page.tsx         # User's booking history
│   │
│   ├── 📂 about/
│   │   ├── layout.tsx               # About page layout
│   │   └── page.tsx                 # Company information
│   │
│   ├── 📂 admin/
│   │   ├── layout.tsx               # Admin entry layout
│   │   └── page.tsx                 # Admin panel entry point
│   │
│   ├── 📂 contact/
│   │   ├── layout.tsx               # Contact page layout
│   │   └── page.tsx                 # Contact form
│   │
│   ├── 📂 custom-tour/
│   │   ├── layout.tsx               # Custom tour page layout
│   │   └── page.tsx                 # Custom tour request form
│   │
│   ├── 📂 tours/
│   │   ├── layout.tsx               # Tours page layout
│   │   ├── page.tsx                 # Tour listing with search/filter
│   │   ├── loading.tsx              # Loading state
│   │   └── 📂 [id]/
│   │       ├── page.tsx             # Tour detail page
│   │       └── loading.tsx          # Detail loading state
│   │
│   ├── 📂 api/                      # API Routes
│   │   ├── 📂 v1/
│   │   │   └── 📂 auth/             # Authentication Endpoints
│   │   │       ├── 📂 login/
│   │   │       │   └── route.ts     # POST: Login, returns JWT
│   │   │       ├── 📂 register/
│   │   │       │   └── route.ts     # POST: User registration
│   │   │       ├── 📂 forgot-password/
│   │   │       │   └── route.ts     # POST: Password reset
│   │   │       ├── 📂 session/
│   │   │       │   └── route.ts     # GET: Verify session
│   │   │       └── 📂 logout/
│   │   │           └── route.ts     # POST: Logout
│   │   │
│   │   ├── 📂 tours/                # Tour Management
│   │   │   ├── route.ts             # GET: List, POST: Create
│   │   │   ├── 📂 [id]/
│   │   │   │   └── route.ts         # GET, PATCH, DELETE
│   │   │   ├── 📂 featured/
│   │   │   │   └── route.ts         # GET: Featured tours
│   │   │   └── 📂 search/
│   │   │       └── route.ts         # GET: Search with filters
│   │   │
│   │   ├── 📂 bookings/             # Booking Management
│   │   │   ├── route.ts             # GET: List, POST: Create
│   │   │   ├── 📂 [id]/
│   │   │   │   └── route.ts         # GET, PATCH
│   │   │   └── 📂 user/
│   │   │       └── 📂 [userId]/
│   │   │           └── route.ts     # GET: User bookings
│   │   │
│   │   ├── 📂 inquiries/            # Inquiry Management
│   │   │   ├── route.ts             # GET: List, POST: Create
│   │   │   └── 📂 [id]/
│   │   │       └── route.ts         # GET, PATCH
│   │   │
│   │   ├── 📂 custom-tour/          # Custom Tour Requests
│   │   │   ├── route.ts             # GET: List, POST: Create
│   │   │   └── 📂 [id]/
│   │   │       └── route.ts         # GET, PATCH
│   │   │
│   │   └── 📂 dashboard/            # Dashboard Data
│   │       ├── 📂 stats/
│   │       │   └── route.ts         # GET: Dashboard statistics
│   │       └── 📂 recent/
│   │           └── route.ts         # GET: Recent activity
│   │
│   ├── layout.tsx                   # Root layout (fonts, providers)
│   ├── globals.css                  # Global Tailwind styles
│   ├── loading.tsx                  # Global loading fallback
│   ├── error.tsx                    # Global error boundary
│   └── not-found.tsx                # 404 page
│
├── 📂 components/                   # React Components
│   ├── 📂 dashboard/                # Admin Dashboard Components
│   │   ├── 📂 analytics/
│   │   │   └── StatsCard.tsx        # Reusable stat display card
│   │   ├── 📂 bookings/
│   │   │   ├── BookingsTable.tsx    # Full bookings table
│   │   │   └── RecentBookings.tsx   # Recent bookings widget
│   │   ├── 📂 custom-requests/
│   │   │   └── CustomRequestsTable.tsx
│   │   ├── 📂 inquiries/
│   │   │   └── InquiriesTable.tsx
│   │   ├── 📂 tours/
│   │   │   ├── ToursTable.tsx
│   │   │   └── PopularToursWidget.tsx
│   │   └── 📂 layout/
│   │       ├── DashboardHeader.tsx  # Top navigation bar
│   │       └── DashboardSidebar.tsx # Left sidebar navigation
│   │
│   ├── 📂 public/                   # Public-Facing Components
│   │   ├── 📂 home/                 # Homepage Sections
│   │   │   ├── Hero.tsx             # Hero banner
│   │   │   ├── FeaturedTours.tsx    # Featured tours showcase
│   │   │   ├── PopularDestinations.tsx
│   │   │   ├── HowItWorks.tsx       # Process explanation
│   │   │   ├── WhyChooseUs.tsx      # Value proposition
│   │   │   ├── Testimonials.tsx     # Customer reviews
│   │   │   ├── FAQ.tsx              # Frequently asked questions
│   │   │   └── CTABand.tsx          # Call-to-action section
│   │   ├── 📂 booking/
│   │   │   └── BookingForm.tsx      # Tour booking form
│   │   ├── 📂 shared/
│   │   │   ├── SearchBar.tsx        # Tour search component
│   │   │   ├── SuccessModal.tsx     # Success confirmation
│   │   │   └── WhatsAppButton.tsx   # WhatsApp contact button
│   │   └── 📂 layout/
│   │       ├── Header.tsx           # Main navigation header
│   │       ├── ModernHeader.tsx     # Alternative header
│   │       └── Footer.tsx           # Site footer
│   │
│   ├── 📂 user-panel/               # User Account Components
│   │   └── 📂 layout/
│   │       ├── UserPanelHeader.tsx  # User panel header
│   │       └── UserPanelSidebar.tsx # User navigation
│   │
│   └── 📂 ui/                       # Reusable UI Primitives
│       ├── navigation-menu.tsx      # Navigation menu
│       └── README.md                # UI component docs
│
├── 📂 lib/                          # Core Business Logic
│   ├── 📂 auth/                     # Authentication & Authorization
│   │   ├── config.ts                # JWT configuration
│   │   ├── session.ts               # Session management, JWT
│   │   └── permissions.ts           # Role-based access control
│   │
│   ├── 📂 db/                       # Database Layer
│   │   ├── index.ts                 # Drizzle ORM connection
│   │   └── schema.ts                # Complete database schema
│   │                                # (users, tours, bookings, inquiries, etc.)
│   │
│   ├── 📂 services/                 # Business Logic Layer
│   │   ├── users.service.ts         # User CRUD, authentication
│   │   ├── tours.service.ts         # Tour CRUD, search, filtering
│   │   ├── bookings.service.ts      # Booking operations
│   │   ├── inquiries.service.ts     # Inquiry management
│   │   ├── custom-tour.service.ts   # Custom request handling
│   │   └── destinations.service.ts  # Destination data
│   │
│   ├── 📂 mappers/                  # Data Transformation
│   │   ├── tour.mapper.ts           # Tour entity → API response
│   │   ├── booking.mapper.ts        # Booking entity → API response
│   │   ├── inquiry.mapper.ts        # Inquiry entity → API response
│   │   └── custom-tour.mapper.ts    # Custom request → API response
│   │
│   ├── 📂 validations/              # Zod Validation Schemas
│   │   ├── user.schema.ts           # Login, register schemas
│   │   ├── tour.schema.ts           # Tour creation/update
│   │   ├── booking.schema.ts        # Booking creation
│   │   └── inquiry.schema.ts        # Inquiry submission
│   │
│   ├── 📂 utils/                    # Utility Functions
│   │   ├── cn.ts                    # className utility
│   │   ├── date.ts                  # Date formatting
│   │   └── format.ts                # Number/currency formatting
│   │
│   ├── types.ts                     # TypeScript Interfaces
│   ├── constants.ts                 # App-wide constants
│   └── seo.ts                       # SEO utilities
│
├── 📂 hooks/                        # Custom React Hooks
│   ├── useBookings.ts               # Fetch bookings (SWR)
│   ├── useTours.ts                  # Fetch tours (SWR)
│   ├── useDebounce.ts               # Debounce utility
│   ├── useLocalStorage.ts           # Local storage state
│   └── useMediaQuery.ts             # Responsive breakpoints
│
├── 📂 config/                       # Configuration Files
│   ├── site.ts                      # Site metadata, social links
│   ├── navigation.ts                # Navigation menus
│   └── dashboard.ts                 # Dashboard navigation
│
├── 📂 scripts/                      # Utility Scripts
│   ├── seed.ts                      # Database seeding
│   ├── test-auth.ts                 # Auth testing
│   └── test-db.ts                   # Database connection test
│
├── 📂 docs/                         # Documentation
│   ├── README.md                    # Documentation index
│   ├── getting-started.md           # Setup guide
│   ├── architecture.md              # Architecture overview
│   ├── api-reference.md             # API documentation
│   ├── database.md                  # Database schema docs
│   └── core-architecture.md         # Core architecture details
│
├── 📂 drizzle/                      # Database Migrations
│   └── migrations/                  # Generated migration files
│
├── 📂 public/                       # Static Assets
│   ├── 📂 images/                   # Image assets
│   └── 📂 icons/                    # Icon files
│
├── .env.local                       # Environment variables (not in git)
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
├── drizzle.config.ts                # Drizzle ORM configuration
├── middleware.ts                    # Next.js middleware (auth)
├── next.config.js                   # Next.js configuration
├── package.json                     # Dependencies
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── CHANGELOG.md                     # Version history
└── README.md                        # Project README
```

---

## 🔄 Data Flow Architecture

### 1. Authentication Flow
```
User Login
  ↓
/api/v1/auth/login
  ↓
users.service.ts (validate credentials)
  ↓
lib/auth/session.ts (create JWT)
  ↓
HTTP-only cookie set
  ↓
Protected routes check via getSession()
```

### 2. API Request Flow
```
Client Request
  ↓
/api/[resource]/route.ts
  ↓
Zod validation (lib/validations/)
  ↓
Service method (lib/services/)
  ↓
Drizzle ORM query (lib/db/)
  ↓
Mapper transformation (lib/mappers/)
  ↓
JSON response
```

### 3. Component Data Fetching
```
Server Components → Direct service calls
Client Components → SWR hooks (hooks/)
Forms → React Hook Form + Zod
URL State → nuqs library
```

---

## 🎯 Key Design Patterns

### Route Groups
- **(auth)** - Authentication pages with minimal layout
- **(dashboard)** - Admin interface with sidebar
- **(public)** - Public pages with header/footer
- **(user-panel)** - User account with user navigation

### Service Layer Pattern
- All business logic in `lib/services/`
- Services call database via Drizzle ORM
- API routes are thin controllers
- Validation at API route level

### Component Organization
- **dashboard/** - Admin-only components
- **public/** - Public-facing components
- **user-panel/** - User account components
- **ui/** - Reusable UI primitives

---

## 🔐 Security & Access Control

### Role-Based Access
- **Public**: Browse tours, submit inquiries
- **User**: Booking history, account management
- **Admin**: Full dashboard access

### Enforcement Layers
1. **Middleware** - Route-level protection
2. **API Routes** - Permission checks
3. **Services** - Business logic validation
4. **Components** - Conditional rendering

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16.2.3 (App Router, RSC)
- **Database**: PostgreSQL (Supabase) + Drizzle ORM
- **Auth**: JWT tokens + HTTP-only cookies
- **Validation**: Zod schemas
- **UI**: Tailwind CSS + Radix UI + Lucide icons
- **Forms**: React Hook Form
- **Data Fetching**: SWR (client), direct queries (server)
- **Animations**: Motion library
- **Dark Mode**: next-themes

---

## 📊 Database Schema

### Core Tables
- **users** - User accounts with roles
- **tours** - Tour listings with itineraries
- **bookings** - Tour bookings with status
- **inquiries** - Contact form submissions
- **custom_tour_requests** - Custom tour requests
- **destinations** - Popular destinations
- **reviews** - Tour reviews

### Relationships
```
users ←→ bookings (one-to-many)
tours ←→ bookings (one-to-many)
tours ←→ reviews (one-to-many)
bookings ←→ reviews (one-to-one)
```

---

## 🚀 Quick Start Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm start                # Start production server

# Database
npm run db:push          # Push schema changes
npm run db:studio        # Open Drizzle Studio
npm run seed             # Seed database

# Testing
npm run test:auth        # Test authentication
npm run test:db          # Test database connection
```

---

## 📝 Environment Variables

Required in `.env.local`:
- `DATABASE_URL` - PostgreSQL connection (pooling)
- `DIRECT_URL` - Direct database connection (migrations)
- `AUTH_SECRET` - JWT secret key (32+ characters)
- `NEXT_PUBLIC_APP_URL` - Application URL
- `NEXT_PUBLIC_WHATSAPP_NUMBER` - WhatsApp contact

---

## 📚 Additional Resources

- **API Documentation**: `/docs/api-reference.md`
- **Database Schema**: `/docs/database.md`
- **Getting Started**: `/docs/getting-started.md`
- **Architecture Details**: `/docs/core-architecture.md`
