# Architecture

System architecture and design patterns for Ghumo Firo India.

## Overview

Enterprise-grade Next.js application with clean architecture principles.

## Technology Stack

### Core
- **Next.js 15.3.2** - App Router with React Server Components
- **React 19.1.0** - UI library
- **TypeScript 5.8.3** - Type safety
- **Tailwind CSS 3.4.17** - Styling

### Database
- **PostgreSQL** - Primary database (Supabase hosted)
- **Drizzle ORM 0.43.1** - Type-safe queries
- **postgres** driver with SSL

### Authentication
- **jose** - JWT token management
- **bcryptjs** - Password hashing
- HTTP-only cookies for sessions

### UI Components
- **Radix UI** - Accessible primitives
- **Lucide React** - Icons
- **Motion 12.6.0** - Animations
- **next-themes** - Dark mode

### Data Fetching
- **SWR 2.4.1** - Client-side caching
- **nuqs 2.4.3** - URL state management

### Validation
- **Zod 3.24.4** - Schema validation
- **React Hook Form 7.54.2** - Form management

## Architecture Layers

### 1. Presentation Layer (UI)
```
components/
├── dashboard/        # Admin components
├── public/           # Public-facing components
├── user-panel/       # User account components
└── ui/               # Reusable primitives
```

**Responsibilities:**
- Render UI
- Handle user interactions
- Display data from hooks/services

### 2. Application Layer (Pages & API)
```
app/
├── (auth)/           # Auth pages
├── (dashboard)/      # Admin pages
├── (public)/         # Public pages
├── (user-panel)/     # User pages
└── api/              # API routes
```

**Responsibilities:**
- Route handling
- Request/response management
- Call services layer
- Return formatted data

### 3. Business Logic Layer (Services)
```
lib/services/
├── auth.service.ts
├── tours.service.ts
├── bookings.service.ts
├── inquiries.service.ts
├── custom-tour.service.ts
└── destinations.service.ts
```

**Responsibilities:**
- Business rules
- Data validation
- Database operations
- Error handling

### 4. Data Access Layer (Mappers)
```
lib/mappers/
├── tour.mapper.ts
├── booking.mapper.ts
├── inquiry.mapper.ts
└── custom-tour.mapper.ts
```

**Responsibilities:**
- API ↔ Database type conversions
- ID transformations (string ↔ integer)
- Date/time formatting
- Price formatting

### 5. Validation Layer
```
lib/validations/
├── user.schema.ts
├── tour.schema.ts
├── booking.schema.ts
└── inquiry.schema.ts
```

**Responsibilities:**
- Input validation
- Type inference
- Error messages

### 6. Data Layer (Database)
```
lib/db/
├── index.ts          # Connection
└── schema.ts         # Drizzle schema
```

**Responsibilities:**
- Database connection
- Schema definitions
- Migrations

## Design Patterns

### Service Pattern
Encapsulates business logic in reusable service modules.

```typescript
// Service interface
class ToursService {
  async getAll(query: TourQuery) { }
  async getById(id: number) { }
  async create(data: CreateTourInput) { }
  async update(id: number, data: UpdateTourInput) { }
  async delete(id: number) { }
}
```

### Mapper Pattern
Handles type conversions between layers.

```typescript
// API → Database
toDatabase(apiData: ApiTour): DbTour {
  return {
    id: parseInt(apiData.id),
    price: apiData.price.toString(),
    // ...
  }
}

// Database → API
toApi(dbData: DbTour): ApiTour {
  return {
    id: dbData.id.toString(),
    price: parseFloat(dbData.price),
    // ...
  }
}
```

### Repository Pattern
Services act as repositories for data access.

```typescript
// Service uses Drizzle ORM
async getAll() {
  return await db.select().from(tours)
}
```

### Middleware Pattern
Route protection and authentication.

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const session = await getSession()
  if (!session) return redirect('/login')
  if (isAdminRoute && session.role !== 'admin') {
    return redirect('/unauthorized')
  }
}
```

## Data Flow

### Read Operation
```
User Request
  ↓
Page/Component
  ↓
Hook (SWR) or Server Component
  ↓
API Route
  ↓
Service Layer
  ↓
Database (Drizzle ORM)
  ↓
Mapper (DB → API)
  ↓
Response
```

### Write Operation
```
User Input
  ↓
Form (React Hook Form)
  ↓
Validation (Zod)
  ↓
API Route
  ↓
Mapper (API → DB)
  ↓
Service Layer
  ↓
Database (Drizzle ORM)
  ↓
Response
```

## Authentication Flow

```
1. User submits credentials
   ↓
2. API validates with bcryptjs
   ↓
3. Generate JWT with jose
   ↓
4. Set HTTP-only cookie
   ↓
5. Middleware validates on protected routes
   ↓
6. Session available in components
```

## Route Groups

Next.js route groups organize pages by layout:

- `(auth)` - Auth pages with minimal layout
- `(dashboard)` - Admin pages with sidebar
- `(public)` - Public pages with header/footer
- `(user-panel)` - User pages with account nav

## API Design

RESTful conventions:
- `GET /api/resource` - List
- `GET /api/resource/:id` - Get one
- `POST /api/resource` - Create
- `PATCH /api/resource/:id` - Update
- `DELETE /api/resource/:id` - Delete

## Security

### Authentication
- JWT tokens with 7-day expiry
- HTTP-only cookies (XSS protection)
- Secure flag in production
- Password hashing with bcryptjs (10 rounds)

### Authorization
- Role-based access control
- Middleware protection
- Service-level checks

### Input Validation
- Zod schemas on all inputs
- Type safety with TypeScript
- SQL injection prevention (Drizzle ORM)

## Performance

### Server Components
- Default for all pages
- Direct database access
- No client-side JavaScript

### Client Components
- Only when needed (interactivity)
- SWR for caching
- Debounced inputs

### Database
- Indexed columns
- Connection pooling
- Prepared statements

## Error Handling

### API Routes
```typescript
try {
  const result = await service.method()
  return NextResponse.json(result)
} catch (error) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.errors },
      { status: 400 }
    )
  }
  return NextResponse.json(
    { error: error.message },
    { status: 500 }
  )
}
```

### Services
```typescript
async getById(id: number) {
  const tour = await db.query.tours.findFirst({
    where: eq(tours.id, id)
  })
  
  if (!tour) {
    throw new Error('Tour not found')
  }
  
  return tour
}
```

## Testing Strategy

### Unit Tests
- Services layer
- Mappers
- Utilities

### Integration Tests
- API routes
- Database operations

### E2E Tests
- Critical user flows
- Authentication
- Booking process

---

**Last Updated:** April 1, 2026
