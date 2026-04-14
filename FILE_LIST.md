# 📁 Complete File List - Ghumo Firo India

## 🎨 Frontend Files (Website)

### 📄 Main Pages
```
frontend/src/app/
├── page.tsx                          # Home page (landing page)
├── layout.tsx                        # Main layout wrapper
├── globals.css                       # Global styles and animations
│
├── (auth)/                           # Login & Registration
│   ├── login/page.tsx               # Login page
│   └── register/page.tsx            # Register page
│
├── (public)/                         # Public pages
│   ├── tours/
│   │   ├── page.tsx                 # All tours listing
│   │   └── [id]/page.tsx            # Single tour details
│   ├── contact/page.tsx             # Contact us page
│   ├── about/page.tsx               # About company page
│   └── custom-tour/page.tsx         # Custom tour request
│
├── (user-panel)/                     # Customer account area
│   └── my-account/
│       ├── page.tsx                 # Profile overview
│       └── bookings/page.tsx        # My bookings list
│
└── (dashboard)/                      # Admin panel
    └── dashboard/
        ├── page.tsx                 # Dashboard overview
        ├── layout.tsx               # Dashboard layout
        ├── tours/page.tsx           # Manage tours
        ├── bookings/page.tsx        # View bookings
        ├── destinations/            # Manage destinations (TBD)
        ├── custom-requests/         # Custom tour requests (TBD)
        ├── inquiries/               # Customer inquiries (TBD)
        └── analytics/               # Analytics dashboard (TBD)
```

### 🧩 Components (Reusable Parts)
```
frontend/src/components/
├── ui/                               # Basic UI elements
│   ├── button.tsx                   # Button component
│   ├── card.tsx                     # Card component
│   ├── badge.tsx                    # Badge component
│   ├── glow.tsx                     # Glow animation effect
│   └── container-scroll.tsx         # Scroll animation gallery
│
├── public/                           # Public website components
│   ├── Header.tsx                   # Main navigation bar
│   └── Footer.tsx                   # Footer section
│
├── dashboard/                        # Admin panel components
│   └── DashboardLayout.tsx          # Admin sidebar & layout
│
├── user-panel/                       # User account components
│   └── UserPanelLayout.tsx          # User sidebar & layout
│
└── ConditionalLayout.tsx            # Controls navbar visibility
```

### 🔧 Services & Utilities
```
frontend/src/
├── services/
│   └── api.ts                       # API calls to backend
│
├── types/
│   └── index.ts                     # TypeScript type definitions
│
├── lib/
│   └── utils.ts                     # Helper functions
│
└── hooks/                            # Custom React hooks (if any)
```

### ⚙️ Configuration Files
```
frontend/
├── package.json                      # Dependencies list
├── next.config.ts                    # Next.js settings
├── tsconfig.json                     # TypeScript settings
├── tailwind.config.ts                # Tailwind CSS settings
├── postcss.config.mjs                # PostCSS settings
├── .env.local                        # Environment variables (local)
├── .env.example                      # Environment variables template
├── .eslintrc.json                    # Code quality rules
└── .gitignore                        # Files to ignore in git
```

---

## 🔧 Backend Files (Server)

### 📡 API Routes
```
backend/src/modules/
├── auth/                             # Login & Registration
│   ├── auth.controller.ts           # Handles requests
│   ├── auth.service.ts              # Business logic
│   ├── auth.routes.ts               # URL paths
│   ├── auth.validator.ts            # Input validation
│   └── auth.model.ts                # Data structure
│
├── tours/                            # Tours management
│   ├── tour.controller.ts           # Handles requests
│   ├── tour.service.ts              # Business logic
│   ├── tour.routes.ts               # URL paths
│   ├── tour.validator.ts            # Input validation
│   ├── tour.model.ts                # Data structure
│   └── tour.cache.ts                # Caching logic
│
├── bookings/                         # Bookings system
│   ├── booking.controller.ts        # Handles requests
│   ├── booking.service.ts           # Business logic
│   ├── booking.routes.ts            # URL paths
│   └── booking.validator.ts         # Input validation
│
├── inquiries/                        # Contact inquiries
│   ├── inquiry.routes.ts            # URL paths
│   └── inquiry.service.ts           # Business logic
│
├── custom-tour/                      # Custom tour requests
│   ├── customTour.routes.ts         # URL paths
│   └── customTour.service.ts        # Business logic
│
└── destinations/                     # Destinations
    ├── destination.routes.ts        # URL paths
    └── destination.service.ts       # Business logic
```

### 🛡️ Middleware (Security & Validation)
```
backend/src/middleware/
├── auth.middleware.ts                # Check if user is logged in
├── validate.middleware.ts            # Validate input data
├── errorHandler.ts                   # Handle errors gracefully
├── notFoundHandler.ts                # Handle 404 errors
└── rateLimiter.ts                    # Prevent spam/abuse
```

### 🏗️ Core System
```
backend/src/core/
├── config/
│   └── index.ts                     # App configuration
│
├── database/
│   ├── index.ts                     # Database connection
│   └── schema.ts                    # Database tables structure
│
├── logger/
│   └── index.ts                     # Logging system
│
├── redis/
│   └── index.ts                     # Cache connection
│
└── server.ts                         # Server setup
```

### 🔐 Shared Utilities
```
backend/src/shared/
├── errors.ts                         # Error handling
├── jwt.ts                            # Token generation
├── password.ts                       # Password encryption
└── response.ts                       # API response formatting
```

### ⚙️ Configuration Files
```
backend/
├── package.json                      # Dependencies list
├── tsconfig.json                     # TypeScript settings
├── drizzle.config.ts                 # Database ORM settings
├── ecosystem.config.js               # PM2 process manager
├── .env                              # Environment variables (production)
├── .env.example                      # Environment variables template
├── .eslintrc.json                    # Code quality rules
└── .gitignore                        # Files to ignore in git
```

---

## 💾 Database Structure

```
PostgreSQL Database Tables:
├── users                             # User accounts
├── tours                             # Tour packages
├── bookings                          # Customer bookings
├── destinations                      # Tour locations
├── inquiries                         # Contact messages
├── custom_tour_requests              # Custom trip requests
└── reviews                           # Tour reviews (future)
```

---

## 📚 Documentation Files

```
Root Directory:
├── PROJECT_ARCHITECTURE.md           # This file - project overview
├── FILE_LIST.md                      # Complete file listing
├── ADMIN_PANEL_GUIDE.md              # Admin panel usage guide
├── README.md                         # Project introduction
│
├── docs/
│   ├── README.md                    # Documentation index
│   ├── deployment/
│   │   ├── DEPLOYMENT.md            # How to deploy
│   │   ├── VPS-SETUP.md             # Server setup guide
│   │   └── MANUAL-DEPLOY-COMMANDS.md # Deployment commands
│   ├── development/
│   │   └── DEVELOPMENT.md           # Development guide
│   └── versions/
│       └── VERSION-INFO.md          # Version history
│
├── frontend/
│   ├── README.md                    # Frontend documentation
│   ├── QUICKSTART.md                # Quick start guide
│   ├── DEPLOYMENT.md                # Frontend deployment
│   └── IMPLEMENTATION_SUMMARY.md    # Implementation notes
│
└── backend/
    ├── README.md                    # Backend documentation
    ├── API.md                       # API endpoints list
    └── TROUBLESHOOTING.md           # Common issues & fixes
```

---

## 🔧 Configuration & Setup Files

```
Root Directory:
├── docker-compose.yml                # Docker container setup
├── .gitignore                        # Git ignore rules
│
├── .kiro/                            # Kiro AI settings
│   └── settings/
│       └── mcp.json                 # MCP server config
│
├── .obsidian/                        # Obsidian notes (optional)
│   ├── app.json
│   ├── appearance.json
│   ├── core-plugins.json
│   └── workspace.json
│
└── .vscode/                          # VS Code settings (optional)
```

---

## 📊 File Count Summary

### Frontend
- **Pages**: 15+ files
- **Components**: 10+ files
- **Services**: 3 files
- **Config**: 8 files
- **Total**: ~40 files

### Backend
- **Modules**: 30+ files (controllers, services, routes)
- **Middleware**: 5 files
- **Core**: 8 files
- **Config**: 6 files
- **Total**: ~50 files

### Documentation
- **Guides**: 12+ files
- **README files**: 5 files
- **Total**: ~17 files

### Grand Total: ~110+ files

---

## 🎯 Most Important Files

### For Development
1. `frontend/src/app/page.tsx` - Home page
2. `frontend/src/services/api.ts` - API calls
3. `backend/src/core/database/schema.ts` - Database structure
4. `backend/src/modules/tours/tour.service.ts` - Tour logic
5. `backend/src/modules/auth/auth.service.ts` - Authentication

### For Configuration
1. `frontend/.env.local` - Frontend settings
2. `backend/.env` - Backend settings
3. `docker-compose.yml` - Docker setup
4. `backend/ecosystem.config.js` - PM2 process manager

### For Deployment
1. `docs/deployment/DEPLOYMENT.md` - Deployment guide
2. `docs/deployment/VPS-SETUP.md` - Server setup
3. `backend/drizzle.config.ts` - Database config

---

## 🚀 Quick File Navigation

### Want to change the home page design?
→ `frontend/src/app/page.tsx`

### Want to add a new API endpoint?
→ `backend/src/modules/[module-name]/`

### Want to modify the navbar?
→ `frontend/src/components/public/Header.tsx`

### Want to change database tables?
→ `backend/src/core/database/schema.ts`

### Want to update admin panel?
→ `frontend/src/app/(dashboard)/dashboard/`

### Want to modify user account?
→ `frontend/src/app/(user-panel)/my-account/`

---

## 📝 Notes

- **TBD** = To Be Developed (not yet implemented)
- All TypeScript files end with `.ts` or `.tsx`
- React components use `.tsx` extension
- Configuration files use various extensions (`.json`, `.js`, `.ts`, `.yml`)
- Environment files (`.env`) contain sensitive data - never commit to git!
