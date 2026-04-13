# Core Architecture - Ghumo Firo India

## Overview

Ghumo Firo India is an **enterprise-grade travel booking platform** built with modern web technologies, following **clean architecture principles** and **separation of concerns**.

---

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  (UI Components, Pages, Client-Side Logic)                  │
│                                                              │
│  • React Components (components/)                           │
│  • Next.js Pages (app/)                                     │
│  • Custom Hooks (hooks/)                                    │
│  • Client-Side State Management (SWR)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  (API Routes, Request/Response Handling)                    │
│                                                              │
│  • API Routes (app/api/)                                    │
│  • Middleware (middleware.ts)                               │
│  • Request Validation (Zod Schemas)                         │
│  • Response Formatting                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                       │
│  (Services, Business Rules, Domain Logic)                   │
│                                                              │
│  • Services (lib/services/)                                 │
│  • Authentication Logic (lib/auth/)                         │
│  • Business Rules & Validations                             │
│  • Data Transformations                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                          │
│  (Mappers, Database Operations)                             │
│                                                              │
│  • Mappers (lib/mappers/)                                   │
│  • Database Schema (lib/db/schema.ts)                       │
│  • ORM Queries (Drizzle)                                    │
│  • Type Conversions                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  (Database, External Services)                              │
│                                                              │
│  • PostgreSQL Database (Supabase)                           │
│  • Connection Pool                                          │
│  • SSL Connections                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow

### Example: User Books a Tour

```
1. USER ACTION
   └─> User fills booking form and clicks "Book Now"

2. PRESENTATION LAYER
   └─> BookingForm.tsx validates input with React Hook Form
       └─> Calls POST /api/bookings

3. APPLICATION LAYER
   └─> app/api/bookings/route.ts receives request
       └─> Validates with Zod schema (createBookingSchema)
       └─> Checks user session (if logged in)

4. BUSINESS LOGIC LAYER
   └─> bookingsService.create(data)
       └─> Applies business rules
       └─> Checks tour availability
       └─> Calculates pricing

5. DATA ACCESS LAYER
   └─> booking.mapper.toBookingEntity(data)
       └─> Converts API format to DB format
       └─> Transforms dates, prices, IDs

6. DATA LAYER
   └─> Drizzle ORM inserts into PostgreSQL
       └─> Returns created booking

7. RESPONSE FLOW (Reverse)
   └─> DB → Mapper → Service → API → Component
       └─> booking.mapper.toBookingResponse(dbBooking)
       └─> Returns JSON to client
       └─> Component updates UI
```

---

## 🎯 Core Design Patterns

### 1. Service Pattern
**Purpose:** Encapsulate business logic in reusable service modules

```typescript
// lib/services/tours.service.ts
export const toursService = {
  async getAll(query) { /* business logic */ },
  async getById(id) { /* business logic */ },
  async create(data) { /* business logic */ },
  async update(id, data) { /* business logic */ },
  async delete(id) { /* business logic */ },
}
```

**Benefits:**
- Reusable across multiple API routes
- Testable in isolation
- Centralized business rules
- Easy to maintain

### 2. Mapper Pattern
**Purpose:** Transform data between API and database formats

```typescript
// lib/mappers/tour.mapper.ts
export function toTourEntity(apiData) {
  return {
    id: parseInt(apiData.id),        // string → number
    price: apiData.price.toString(), // number → decimal string
    startDate: new Date(apiData.startDate), // string → Date
  }
}

export function toTourResponse(dbData) {
  return {
    id: dbData.id.toString(),        // number → string
    price: parseFloat(dbData.price), // decimal string → number
    startDate: dbData.startDate.toISOString(), // Date → string
  }
}
```

**Benefits:**
- Type safety between layers
- Consistent data formats
- Easy to modify without breaking APIs
- Handles complex transformations

### 3. Repository Pattern
**Purpose:** Abstract database operations

```typescript
// Services act as repositories
export const toursService = {
  async getAll() {
    return await db.select().from(tours)
  }
}
```

**Benefits:**
- Database-agnostic business logic
- Easy to swap ORMs
- Centralized query logic

### 4. Middleware Pattern
**Purpose:** Cross-cutting concerns (auth, logging, validation)

```typescript
// middleware.ts
export async function middleware(req) {
  // 1. Check authentication
  const session = await getSession()
  
  // 2. Check authorization
  if (!canAccessRoute(session.role, pathname)) {
    return redirect('/login')
  }
  
  // 3. Allow request
  return NextResponse.next()
}
```

**Benefits:**
- Centralized auth logic
- Runs before all routes
- Easy to add logging, rate limiting

---

## 🔐 Authentication Architecture

### JWT-Based Session Management

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ 1. POST /api/v1/auth/login
       │    { email, password }
       ▼
┌──────────────────────────────────┐
│   Login API Route                │
│   • Validate credentials         │
│   • Hash password comparison     │
└──────┬───────────────────────────┘
       │ 2. Call usersService.verifyPassword()
       ▼
┌──────────────────────────────────┐
│   Users Service                  │
│   • Query database               │
│   • Compare with bcryptjs        │
└──────┬───────────────────────────┘
       │ 3. User authenticated
       ▼
┌──────────────────────────────────┐
│   Session Management             │
│   • Create JWT with jose         │
│   • Sign with secret             │
│   • Set HTTP-only cookie         │
└──────┬───────────────────────────┘
       │ 4. Return user data + cookie
       ▼
┌──────────────┐
│   Browser    │
│   • Stores cookie automatically  │
│   • Sends with every request     │
└──────────────┘
```

### Session Verification Flow

```
┌──────────────┐
│   Browser    │
│   • Cookie: session=jwt_token    │
└──────┬───────┘
       │ Request to protected route
       ▼
┌──────────────────────────────────┐
│   Middleware                     │
│   • Extract JWT from cookie      │
│   • Verify signature             │
│   • Check expiration             │
└──────┬───────────────────────────┘
       │
       ├─> Valid: Continue to route
       │
       └─> Invalid: Redirect to /login
```

---

## 📊 Data Flow Architecture

### Read Operation (GET)

```
Component
  └─> useTours() hook (SWR)
      └─> GET /api/tours?page=1&limit=10
          └─> API Route validates query params
              └─> toursService.getAll(query)
                  └─> Drizzle ORM query
                      └─> PostgreSQL
                          └─> Returns rows
                              └─> tour.mapper.toTourResponse()
                                  └─> JSON response
                                      └─> SWR caches
                                          └─> Component renders
```

### Write Operation (POST)

```
Component
  └─> Form submission
      └─> POST /api/tours with JSON body
          └─> Zod validates input
              └─> tour.mapper.toTourEntity()
                  └─> toursService.create(entity)
                      └─> Drizzle ORM insert
                          └─> PostgreSQL
                              └─> Returns created row
                                  └─> tour.mapper.toTourResponse()
                                      └─> JSON response
                                          └─> Component updates
```

---

## 🗄️ Database Architecture

### Schema Design

```
users (authentication & profiles)
  ├─> bookings (one-to-many)
  └─> reviews (one-to-many)

tours (tour packages)
  ├─> bookings (one-to-many)
  └─> reviews (one-to-many)

destinations (locations)
  └─> tours (many-to-many via JSONB)

inquiries (contact forms)
  └─> standalone

custom_tour_requests (custom itineraries)
  └─> standalone

blog_posts (content)
  └─> standalone
```

### Connection Management

```typescript
// lib/db/index.ts
const client = postgres(DATABASE_URL, {
  ssl: 'require',      // Supabase requires SSL
  max: 10,             // Connection pool size
})

export const db = drizzle(client, { schema })
```

**Benefits:**
- Connection pooling (max 10 concurrent)
- SSL encryption
- Automatic reconnection
- Query optimization

---

## 🔒 Security Architecture

### Defense in Depth

```
1. INPUT VALIDATION
   └─> Zod schemas validate all inputs
       └─> Type checking
       └─> Format validation
       └─> Range checking

2. AUTHENTICATION
   └─> JWT tokens (7-day expiry)
       └─> HTTP-only cookies (XSS protection)
       └─> Secure flag in production
       └─> bcryptjs password hashing (10 rounds)

3. AUTHORIZATION
   └─> Role-based access control
       └─> Middleware checks routes
       └─> Service-level checks
       └─> Permission system

4. DATABASE SECURITY
   └─> Drizzle ORM (SQL injection prevention)
       └─> Parameterized queries
       └─> Type-safe operations
       └─> SSL connections

5. API SECURITY
   └─> CORS configuration
       └─> Rate limiting (TODO)
       └─> CSRF protection (TODO)
```

---

## 🚀 Performance Architecture

### Optimization Strategies

**1. Server Components (Default)**
```typescript
// app/tours/page.tsx
export default async function ToursPage() {
  // Runs on server, no client JS
  const tours = await toursService.getAll()
  return <TourList tours={tours} />
}
```

**2. Dynamic Server Components (Public Pages with Database)**
```typescript
// app/page.tsx
// Force dynamic rendering - database not available at build time
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default async function Home() {
  let featuredTours: any[] = []
  try {
    featuredTours = await toursService.getFeatured(6)
  } catch (error) {
    console.error('Failed to fetch featured tours:', error)
  }
  return <FeaturedTours tours={featuredTours} />
}
```

**3. Client Components (Interactive/Dashboard Pages)**
```typescript
// app/(dashboard)/dashboard/page.tsx
'use client'
export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    fetch('/api/dashboard/stats').then(/* ... */)
  }, [])
  return <Dashboard stats={stats} />
}
```

**4. Client-Side Caching (SWR)**
```typescript
// hooks/useTours.ts
export function useTours() {
  const { data } = useSWR('/api/tours', fetcher)
  // Automatic caching, revalidation, deduplication
}
```

**5. Database Optimization**
- Indexed columns (email, slug, status)
- Connection pooling
- Prepared statements via Drizzle

**6. Code Splitting**
- Route-based splitting (Next.js automatic)
- Dynamic imports for heavy components
- Lazy loading

---

## 📁 File Organization

### Feature-Based Structure

```
app/
├── (auth)/           # Auth feature
│   ├── login/
│   ├── register/
│   └── layout.tsx    # Auth-specific layout
├── (dashboard)/      # Admin feature
│   └── dashboard/
│       ├── tours/
│       ├── bookings/
│       └── layout.tsx # Dashboard layout
└── (public)/         # Public feature
    └── tours/

components/
├── dashboard/        # Dashboard-specific
├── public/           # Public-specific
└── ui/               # Shared primitives

lib/
├── services/         # Business logic by domain
├── mappers/          # Data transformations by domain
└── validations/      # Validation schemas by domain
```

**Benefits:**
- Easy to find related code
- Clear boundaries
- Scalable structure
- Team-friendly

---

## 🔄 State Management

### Server State (SWR)
```typescript
// Automatic caching, revalidation
const { data, error, isLoading } = useSWR('/api/tours', fetcher)
```

### URL State (nuqs)
```typescript
// Sync state with URL params
const [search, setSearch] = useQueryState('q')
```

### Form State (React Hook Form)
```typescript
// Optimized form handling
const { register, handleSubmit } = useForm()
```

### Local State (React useState)
```typescript
// Component-level state
const [isOpen, setIsOpen] = useState(false)
```

---

## 🧪 Testing Strategy

### Unit Tests
- Services (business logic)
- Mappers (data transformations)
- Utilities

### Integration Tests
- API routes
- Database operations
- Authentication flow

### E2E Tests
- Critical user flows
- Booking process
- Admin operations

---

## 📈 Scalability Considerations

### Horizontal Scaling
- Stateless API (JWT in cookies)
- Database connection pooling
- CDN for static assets

### Vertical Scaling
- Efficient queries (indexed columns)
- Pagination on all lists
- Lazy loading

### Caching Strategy
- SWR for client-side
- Redis for server-side (TODO)
- CDN for static content

---

## 🔧 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15 + React 19 | Server/Client rendering |
| **Language** | TypeScript 5.8 | Type safety |
| **Styling** | Tailwind CSS + Radix UI | UI components |
| **Database** | PostgreSQL (Supabase) | Data persistence |
| **ORM** | Drizzle 0.43 | Type-safe queries |
| **Auth** | JWT (jose) + bcryptjs | Authentication |
| **Validation** | Zod 3.24 | Schema validation |
| **Forms** | React Hook Form | Form management |
| **Data Fetching** | SWR 2.4 | Client-side caching |
| **Animations** | Motion 12.6 | UI animations |

---

## 🎯 Key Architectural Decisions

### 1. Why Next.js App Router?
- Server components by default (better performance)
- Built-in routing
- API routes in same codebase
- Excellent TypeScript support

### 2. Why Drizzle ORM?
- Type-safe queries
- Lightweight (no runtime overhead)
- SQL-like syntax
- Excellent TypeScript inference

### 3. Why JWT + Cookies?
- Stateless (scalable)
- HTTP-only cookies (secure)
- No session storage needed
- Works with server components

### 4. Why Service Layer?
- Reusable business logic
- Testable in isolation
- Clear separation of concerns
- Easy to maintain

### 5. Why Mapper Layer?
- Type safety between layers
- Flexible API contracts
- Easy to refactor
- Handles complex transformations

### 6. Why Mixed Rendering Strategy?
- **Dynamic Server Components** for public pages (SEO + graceful degradation)
- **Client Components** for dashboards (loading states + interactivity)
- **Static Generation** for marketing pages (performance)
- Balances performance, SEO, and reliability

---

## 📚 Further Reading

- [Getting Started](./getting-started.md)
- [API Reference](./api-reference.md)
- [Database Schema](./database.md)
- [Fixes Applied](./fixes-applied.md)

---

**Last Updated:** April 13, 2026  
**Version:** 1.1.0
