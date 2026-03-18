# Current Folder Architecture - Ghumo Phiro India

## Project Overview
**Framework:** Next.js 15.5.12 with React 19  
**Database:** PostgreSQL with Drizzle ORM  
**Styling:** Tailwind CSS  
**Animations:** Framer Motion  

---

## Root Structure

```
ghumophiroindia/
├── app/                          # Next.js 15 App Directory
├── components/                   # React Components (Feature-based)
├── lib/                         # Utilities & Database
├── node_modules/                # Dependencies
├── public/                      # Static Assets
├── .next/                       # Build Output
├── drizzle/                     # Database Migrations
├── Configuration Files
└── Documentation Files
```

---

## App Directory Structure (Routes)

### 1. Public Website Routes - `app/(public)/`
```
app/(public)/
├── layout.tsx                   # Public layout (Header + Footer)
├── page.tsx                     # Home page (/)
├── about/
│   └── page.tsx                # About page (/about)
├── contact/
│   └── page.tsx                # Contact page (/contact)
├── tours/
│   ├── page.tsx                # Tours listing (/tours)
│   └── [id]/
│       └── page.tsx            # Tour details (/tours/[id])
└── custom-tour/
    └── page.tsx                # Custom tour builder (/custom-tour)
```

### 2. Admin Dashboard Routes - `app/(dashboard)/`
```
app/(dashboard)/
├── layout.tsx                   # Dashboard layout (Sidebar + Header, NO FOOTER)
└── dashboard/
    ├── page.tsx                # Dashboard home (/dashboard)
    ├── tours/
    │   └── page.tsx            # Manage tours (/dashboard/tours)
    ├── bookings/
    │   └── page.tsx            # Manage bookings (/dashboard/bookings)
    ├── inquiries/
    │   └── page.tsx            # Manage inquiries (/dashboard/inquiries)
    ├── custom-requests/
    │   └── page.tsx            # Manage custom requests (/dashboard/custom-requests)
    └── analytics/
        └── page.tsx            # Analytics dashboard (/dashboard/analytics)
```

### 3. User Panel Routes - `app/(user-panel)/`
```
app/(user-panel)/
├── layout.tsx                   # User panel layout (Sidebar + Header, NO FOOTER)
└── my-account/
    ├── page.tsx                # User profile (/my-account)
    └── bookings/
        └── page.tsx            # User bookings (/my-account/bookings)
```

### 4. API Routes - `app/api/`
```
app/api/
├── tours/
│   └── route.ts                # Tours API endpoint
├── bookings/
│   └── route.ts                # Bookings API endpoint
├── inquiries/
│   └── route.ts                # Inquiries API endpoint
└── custom-tour/
    └── route.ts                # Custom tour API endpoint
```

### 5. Root App Files
```
app/
├── layout.tsx                   # Root layout
├── page.tsx                    # Redirects to public home
├── globals.css                 # Global styles
└── not-found.tsx               # 404 page
```

---

## Components Directory Structure (Feature-based)

### 1. Public Components - `components/public/`
```
components/public/
├── home/                       # Home page sections
│   ├── Hero.tsx               # Hero with search
│   ├── FeaturedTours.tsx      # Featured tours section
│   ├── PopularDestinations.tsx # Destinations grid
│   ├── WhyChooseUs.tsx        # Features section
│   ├── Testimonials.tsx       # Customer reviews
│   ├── CTABand.tsx            # Call-to-action with featured platforms
│   ├── HowItWorks.tsx         # Process steps
│   └── FAQ.tsx                # FAQ accordion
├── layout/                     # Public layout components
│   ├── ModernHeader.tsx       # Navigation header
│   └── Footer.tsx             # Footer
├── booking/
│   └── BookingForm.tsx        # Tour booking form
└── shared/                     # Shared public components
    ├── SearchBar.tsx          # Search functionality
    ├── SuccessModal.tsx       # Success notifications
    └── WhatsAppButton.tsx     # WhatsApp floating button
```

### 2. Dashboard Components - `components/dashboard/`
```
components/dashboard/
├── layout/                     # Dashboard layout components
│   ├── DashboardSidebar.tsx   # Admin sidebar navigation
│   └── DashboardHeader.tsx    # Admin header
├── tours/
│   ├── ToursTable.tsx         # Tours management table
│   └── PopularToursWidget.tsx # Popular tours widget
├── bookings/
│   ├── BookingsTable.tsx      # Bookings management table
│   └── RecentBookings.tsx     # Recent bookings widget
├── inquiries/
│   └── InquiriesTable.tsx     # Inquiries management table
├── custom-requests/
│   └── CustomRequestsTable.tsx # Custom requests table
└── analytics/
    └── StatsCard.tsx          # Analytics stat cards
```

### 3. User Panel Components - `components/user-panel/`
```
components/user-panel/
└── layout/                     # User panel layout components
    ├── UserPanelSidebar.tsx   # User sidebar navigation
    └── UserPanelHeader.tsx    # User panel header
```

### 4. UI Components - `components/ui/`
```
components/ui/
├── navigation-menu.tsx         # Radix UI navigation menu
└── README.md                  # UI components documentation
```

---

## Library Directory - `lib/`

```
lib/
├── db/
│   ├── index.ts               # Database connection
│   └── schema.ts              # Drizzle ORM schema (7 tables)
├── types.ts                   # TypeScript type definitions
├── utils.ts                   # Utility functions (cn, etc.)
└── seo.ts                     # SEO utilities
```

### Database Schema (7 Tables)
1. **tours** - Tour packages
2. **bookings** - Tour bookings
3. **inquiries** - Contact inquiries
4. **customTourRequests** - Custom tour requests
5. **users** - User accounts
6. **reviews** - Tour reviews
7. **destinations** - Destination data

---

## Configuration Files

```
Root/
├── package.json               # Dependencies (Next.js 15, React 19)
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── next.config.js             # Next.js configuration
├── drizzle.config.ts          # Drizzle ORM configuration
├── .eslintrc.json             # ESLint configuration
├── .gitignore                 # Git ignore rules
└── .env.example               # Environment variables template
```

---

## Documentation Files

```
Root/
├── README.md                  # Project overview
├── ARCHITECTURE.md            # Architecture documentation
├── FOLDER_STRUCTURE.md        # Folder structure guide
├── PANEL_STRUCTURE_GUIDE.md   # Panel structure details
├── COMPLETE_PANEL_STRUCTURE.md # Complete panel documentation
├── PANEL_COMPARISON.md        # Panel comparison
├── IMPLEMENTATION_SUMMARY.md  # Implementation summary
├── DEPLOYMENT_GUIDE.md        # Deployment instructions
├── DEPLOYMENT.md              # Deployment details
├── PROJECT_READY.md           # Project readiness checklist
├── GIT_UPLOAD_CHECKLIST.md    # Git upload checklist
├── QUICKSTART.md              # Quick start guide
├── FEATURES.md                # Features list
├── DESIGN_SYSTEM.md           # Design system guide
├── IMPROVEMENT_SUGGESTIONS.md # Improvement suggestions
├── LATEST_IMPROVEMENTS.md     # Latest improvements
├── NAVIGATION_UPDATE.md       # Navigation updates
├── SUMMARY.md                 # Project summary
└── PROJECT_OVERVIEW.md        # Project overview
```

---

## Key Features by Panel

### Public Website (6 Pages)
- ✅ Home page with 8 sections
- ✅ Tours listing with search/filter
- ✅ Tour details page
- ✅ Custom tour builder (4-step form)
- ✅ About page
- ✅ Contact page
- ✅ Header + Footer on all pages

### Admin Dashboard (6 Pages)
- ✅ Dashboard overview with stats
- ✅ Tours management
- ✅ Bookings management
- ✅ Inquiries management
- ✅ Custom requests management
- ✅ Analytics dashboard
- ✅ Sidebar + Header (NO FOOTER)

### User Panel (2 Pages)
- ✅ User profile/account
- ✅ User bookings history
- ✅ Sidebar + Header (NO FOOTER)

---

## Technology Stack

### Frontend
- **Framework:** Next.js 15.5.12 (App Router)
- **React:** 19.0.0
- **TypeScript:** 5.7.2
- **Styling:** Tailwind CSS 3.4.17
- **Animations:** Framer Motion 11.15.0
- **Icons:** Lucide React 0.468.0
- **UI Components:** Radix UI

### Backend
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM 0.38.3
- **API:** Next.js API Routes
- **Forms:** React Hook Form 7.54.2
- **Validation:** Zod 3.24.1

### Development
- **Linting:** ESLint 9.17.0
- **Package Manager:** npm
- **Build Tool:** Next.js built-in

---

## Build Information

**Total Pages:** 21  
**Build Status:** ✅ Successful  
**Latest Commit:** Update to Next.js 15 and React 19, redesign CTA section with featured platforms  
**Repository:** https://github.com/devxkamlesh/ghumophiroindia  

---

## Recent Updates

1. ✅ Updated to Next.js 15.5.12 and React 19
2. ✅ Redesigned CTA section with animated "As Featured On" platforms
3. ✅ Fixed all ESLint errors (replaced `<a>` with `<Link>`)
4. ✅ Updated Drizzle config for newer version
5. ✅ All dependencies updated to latest versions
6. ✅ Build successful with no errors

---

**Last Updated:** March 18, 2026  
**Project Status:** Production Ready ✅
