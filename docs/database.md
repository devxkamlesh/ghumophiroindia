# Database

Database schema and configuration for Ghumo Firo India.

## Overview

- **Database:** PostgreSQL
- **Hosting:** Supabase
- **ORM:** Drizzle ORM 0.43.1
- **Driver:** postgres 3.4.5 with SSL

## Connection

### Environment Variable
```bash
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### Configuration
```typescript
// lib/db/index.ts
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

const client = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  max: 10, // Connection pool
})

export const db = drizzle(client, { schema })
```

## Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  avatar TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Roles:** `admin`, `user`

### Tours Table
```sql
CREATE TABLE tours (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  max_group_size INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  images JSONB NOT NULL,
  highlights JSONB,
  included JSONB,
  excluded JSONB,
  itinerary JSONB,
  destinations JSONB,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Difficulty:** `easy`, `moderate`, `challenging`  
**Category:** `heritage`, `beach`, `nature`, `desert`, `adventure`

### Bookings Table
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  tour_id INTEGER REFERENCES tours(id),
  user_id INTEGER REFERENCES users(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_country TEXT,
  number_of_travelers INTEGER NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  special_requests TEXT,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Status:** `pending`, `confirmed`, `cancelled`, `completed`  
**Payment Status:** `pending`, `paid`, `refunded`

### Inquiries Table
```sql
CREATE TABLE inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT,
  tour_interest TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Status:** `new`, `contacted`, `converted`, `closed`

### Custom Tour Requests Table
```sql
CREATE TABLE custom_tour_requests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT,
  number_of_travelers INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  budget TEXT,
  destinations JSONB,
  interests JSONB,
  start_date TIMESTAMP,
  additional_info TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Status:** `pending`, `in_progress`, `completed`, `cancelled`

### Destinations Table
```sql
CREATE TABLE destinations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  description TEXT,
  image TEXT,
  tour_count INTEGER DEFAULT 0,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  tour_id INTEGER REFERENCES tours(id),
  user_id INTEGER REFERENCES users(id),
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Blog Posts Table
```sql
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id INTEGER REFERENCES users(id),
  featured_image TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Relationships

```
users
  ├─→ bookings (one-to-many)
  ├─→ reviews (one-to-many)
  └─→ blog_posts (one-to-many)

tours
  ├─→ bookings (one-to-many)
  └─→ reviews (one-to-many)
```

## Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Tours
CREATE INDEX idx_tours_slug ON tours(slug);
CREATE INDEX idx_tours_category ON tours(category);
CREATE INDEX idx_tours_is_featured ON tours(is_featured);

-- Bookings
CREATE INDEX idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Inquiries
CREATE INDEX idx_inquiries_status ON inquiries(status);

-- Custom Tour Requests
CREATE INDEX idx_custom_tour_status ON custom_tour_requests(status);
```

## Migrations

### Generate Migration
```bash
npm run db:generate
```

### Run Migration
```bash
npm run db:migrate
```

### Push Schema (Development)
```bash
npm run db:push
```

### Pull Schema
```bash
npm run db:pull
```

## Drizzle Studio

Visual database management:

```bash
npm run db:studio
```

Opens at `http://localhost:4983`

## Seeding

### Seed Script
```bash
npm run seed
```

Creates:
- 2 users (admin + regular)
- 5 destinations
- 5 sample tours

### Manual Seeding
```typescript
// scripts/seed.ts
import { db } from '@/lib/db'
import { users, tours, destinations } from '@/lib/db/schema'
import { hash } from 'bcryptjs'

async function seed() {
  // Create admin
  const hashedPassword = await hash('admin123', 10)
  await db.insert(users).values({
    name: 'Admin User',
    email: 'admin@ghumophiroindia.com',
    password: hashedPassword,
    role: 'admin',
  })
  
  // Create tours
  await db.insert(tours).values([
    {
      title: 'Golden Triangle Tour',
      slug: 'golden-triangle-tour',
      // ...
    }
  ])
}

seed()
```

## Queries

### Using Drizzle ORM

```typescript
import { db } from '@/lib/db'
import { tours, bookings } from '@/lib/db/schema'
import { eq, and, gte, lte } from 'drizzle-orm'

// Select all
const allTours = await db.select().from(tours)

// Select with condition
const tour = await db.query.tours.findFirst({
  where: eq(tours.id, 1)
})

// Select with relations
const booking = await db.query.bookings.findFirst({
  where: eq(bookings.id, 1),
  with: {
    tour: true,
    user: true
  }
})

// Insert
await db.insert(tours).values({
  title: 'New Tour',
  // ...
})

// Update
await db.update(tours)
  .set({ price: '2000.00' })
  .where(eq(tours.id, 1))

// Delete
await db.delete(tours)
  .where(eq(tours.id, 1))
```

## Backup

### Manual Backup (Supabase)
1. Go to Supabase Dashboard
2. Database → Backups
3. Download backup

### Automated Backups
Supabase provides daily automated backups.

## Security

### Connection
- SSL required for all connections
- Connection pooling (max 10)
- Environment variable for credentials

### Access Control
- Row Level Security (RLS) can be enabled
- Application-level authorization via services
- Role-based access in application

### Data Protection
- Passwords hashed with bcryptjs
- Sensitive data encrypted at rest (Supabase)
- No raw SQL queries (ORM protection)

---

**Last Updated:** April 1, 2026
