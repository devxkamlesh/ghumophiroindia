# 🗄️ Database Management Guide - Best Practices

## 📚 Table of Contents
1. [Overview](#overview)
2. [Current Setup](#current-setup)
3. [How to Create New Tables](#how-to-create-new-tables)
4. [How to Update Existing Tables](#how-to-update-existing-tables)
5. [Migration Workflow](#migration-workflow)
6. [Best Practices](#best-practices)
7. [Common Operations](#common-operations)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Your project uses **Drizzle ORM** - a modern, type-safe database toolkit. It's the BEST method for managing databases because:

✅ **Type-Safe** - Catches errors before runtime
✅ **Migration System** - Tracks all database changes
✅ **Version Control** - All changes are in code (Git)
✅ **Rollback Support** - Can undo changes if needed
✅ **Team Friendly** - Everyone sees the same database structure

---

## 🔧 Current Setup

### Files You Need to Know

```
backend/
├── src/core/database/
│   └── schema.ts              # ⭐ Define tables here
├── drizzle/                   # Auto-generated migrations
│   └── 0001_migration.sql     # SQL files (don't edit manually)
├── drizzle.config.ts          # Drizzle configuration
└── package.json               # Database commands
```

### Database Commands

```bash
# Generate migration files (after changing schema.ts)
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Push changes directly (development only)
npm run db:push

# Pull existing database structure
npm run db:pull

# Open visual database editor
npm run db:studio
```

---

## ✨ How to Create New Tables

### Step-by-Step Process

#### 1️⃣ Edit Schema File

Open: `backend/src/core/database/schema.ts`

Add your new table:

```typescript
import { pgTable, serial, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core'

// Example: Create a new "newsletters" table
export const newsletters = pgTable('newsletters', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  isActive: boolean('is_active').default(true),
  subscribedAt: timestamp('subscribed_at').defaultNow(),
})
```

#### 2️⃣ Generate Migration

```bash
cd backend
npm run db:generate
```

This creates a new SQL file in `drizzle/` folder with your changes.

#### 3️⃣ Review Migration

Check the generated SQL file in `drizzle/` folder:

```sql
-- Example: drizzle/0005_create_newsletters.sql
CREATE TABLE "newsletters" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "is_active" BOOLEAN DEFAULT true,
  "subscribed_at" TIMESTAMP DEFAULT NOW()
);
```

#### 4️⃣ Apply Migration

```bash
npm run db:migrate
```

This runs the SQL and creates the table in your database.

#### 5️⃣ Verify

```bash
npm run db:studio
```

Opens a visual editor where you can see your new table!

---

## 🔄 How to Update Existing Tables

### Common Updates

#### Add a New Column

**1. Edit schema.ts:**

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone'),
  
  // ✨ NEW COLUMN
  dateOfBirth: timestamp('date_of_birth'),
  
  createdAt: timestamp('created_at').defaultNow(),
})
```

**2. Generate & Apply:**

```bash
npm run db:generate
npm run db:migrate
```

#### Rename a Column

**⚠️ Important:** Drizzle sees this as DROP + ADD, which loses data!

**Safe Method:**

```typescript
// Step 1: Add new column
export const users = pgTable('users', {
  // ... existing columns
  fullName: text('full_name'),  // NEW
  name: text('name'),            // OLD (keep for now)
})
```

```bash
npm run db:generate
npm run db:migrate
```

```sql
-- Step 2: Copy data manually
UPDATE users SET full_name = name;
```

```typescript
// Step 3: Remove old column
export const users = pgTable('users', {
  // ... existing columns
  fullName: text('full_name').notNull(),  // NEW
  // name: text('name'),  // REMOVED
})
```

```bash
npm run db:generate
npm run db:migrate
```

#### Change Column Type

**Example: Change price from integer to decimal**

```typescript
// BEFORE
export const tours = pgTable('tours', {
  price: integer('price').notNull(),
})

// AFTER
export const tours = pgTable('tours', {
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
})
```

```bash
npm run db:generate
npm run db:migrate
```

#### Add Foreign Key (Relationship)

```typescript
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  tourId: integer('tour_id').references(() => tours.id),  // 👈 Foreign key
  userId: integer('user_id').references(() => users.id),  // 👈 Foreign key
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
})
```

#### Add Index for Performance

```typescript
import { pgTable, serial, text, index } from 'drizzle-orm/pg-core'

export const tours = pgTable('tours', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category').notNull(),
}, (table) => ({
  // Add indexes for faster queries
  categoryIdx: index('category_idx').on(table.category),
  slugIdx: index('slug_idx').on(table.slug),
}))
```

---

## 🔄 Migration Workflow (Best Practice)

### Development Environment (Your Computer)

```bash
# 1. Make changes to schema.ts
# 2. Generate migration
npm run db:generate

# 3. Review the SQL file
cat drizzle/0001_*.sql

# 4. Apply to local database
npm run db:migrate

# 5. Test your changes
npm run dev

# 6. Commit to Git
git add .
git commit -m "Add newsletters table"
git push
```

### Production Environment (VPS Server)

```bash
# 1. SSH to server
ssh root@187.127.151.137

# 2. Navigate to backend
cd /path/to/backend

# 3. Pull latest code
git pull

# 4. Install dependencies (if needed)
npm install

# 5. Run migrations
npm run db:migrate

# 6. Restart server
pm2 restart ghumo-phiro-backend
```

---

## ✅ Best Practices

### 1. Always Use Migrations (Never Manual SQL)

❌ **BAD:**
```sql
-- Directly in database
ALTER TABLE users ADD COLUMN age INTEGER;
```

✅ **GOOD:**
```typescript
// In schema.ts
export const users = pgTable('users', {
  // ... existing columns
  age: integer('age'),
})
// Then: npm run db:generate && npm run db:migrate
```

**Why?** 
- Migrations are tracked in Git
- Team members get the same changes
- Can rollback if needed
- Type-safe in your code

### 2. Never Edit Generated SQL Files

❌ **BAD:**
```sql
-- Editing drizzle/0001_migration.sql manually
```

✅ **GOOD:**
```typescript
// Edit schema.ts and regenerate
```

**Why?** Drizzle tracks changes. Manual edits break the system.

### 3. Test Migrations Locally First

```bash
# Always test on your computer before production
npm run db:generate
npm run db:migrate
npm run dev  # Test the app
```

### 4. Backup Before Major Changes

```bash
# On VPS server
pg_dump -U postgres ghumo_firo > backup_$(date +%Y%m%d).sql
```

### 5. Use Descriptive Names

✅ **GOOD:**
```typescript
export const tourBookings = pgTable('tour_bookings', {
  customerEmail: text('customer_email'),
  bookingDate: timestamp('booking_date'),
})
```

❌ **BAD:**
```typescript
export const tb = pgTable('tb', {
  ce: text('ce'),
  bd: timestamp('bd'),
})
```

### 6. Add Timestamps to All Tables

```typescript
export const myTable = pgTable('my_table', {
  id: serial('id').primaryKey(),
  // ... other columns
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

### 7. Use Constraints

```typescript
export const users = pgTable('users', {
  email: text('email').notNull().unique(),  // ✅ Unique
  age: integer('age').notNull(),            // ✅ Not null
  role: text('role').notNull().default('user'),  // ✅ Default value
})
```

---

## 🛠️ Common Operations

### View All Tables

```bash
npm run db:studio
# Opens browser at http://localhost:4983
```

### Check Migration Status

```bash
# List all migrations
ls -la drizzle/

# Check which migrations are applied
# (Drizzle tracks this automatically)
```

### Rollback Last Migration

**⚠️ Drizzle doesn't have built-in rollback. Manual process:**

```bash
# 1. Find the migration file
ls drizzle/

# 2. Create reverse SQL manually
# Example: If migration added a column, drop it
psql -U postgres -d ghumo_firo -c "ALTER TABLE users DROP COLUMN age;"

# 3. Delete the migration file
rm drizzle/0005_add_age_column.sql

# 4. Revert schema.ts changes
git checkout schema.ts
```

**Better approach:** Create a new migration to undo changes.

### Reset Database (Development Only)

```bash
# ⚠️ DANGER: Deletes all data!

# Drop all tables
npm run db:push -- --force

# Or manually
psql -U postgres -d ghumo_firo -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Rerun all migrations
npm run db:migrate
```

### Seed Database with Test Data

Create: `backend/src/scripts/seed.ts`

```typescript
import { db } from '../core/database'
import { tours, users } from '../core/database/schema'

async function seed() {
  // Insert test data
  await db.insert(users).values([
    { name: 'Test User', email: 'test@example.com', password: 'hashed' },
  ])
  
  await db.insert(tours).values([
    { title: 'Jaipur Tour', price: '5000', duration: 3 },
  ])
  
  console.log('✅ Database seeded!')
}

seed()
```

```bash
# Run seed script
npx tsx src/scripts/seed.ts
```

---

## 🎓 Column Types Reference

### Text Types
```typescript
text('column_name')              // Unlimited text
varchar('column_name', { length: 255 })  // Limited text
```

### Number Types
```typescript
integer('column_name')           // Whole numbers
serial('column_name')            // Auto-increment integer
decimal('column_name', { precision: 10, scale: 2 })  // Decimals (e.g., 12345.67)
```

### Boolean
```typescript
boolean('column_name')           // true/false
```

### Date & Time
```typescript
timestamp('column_name')         // Date + Time
date('column_name')              // Date only
time('column_name')              // Time only
```

### JSON
```typescript
json('column_name')              // JSON data
jsonb('column_name')             // Binary JSON (faster)
```

### Arrays
```typescript
text('tags').array()             // Array of text
integer('numbers').array()       // Array of integers
```

### Custom Types
```typescript
jsonb('data').$type<{ name: string; age: number }>()  // Typed JSON
```

---

## 🔍 Troubleshooting

### Error: "relation already exists"

**Problem:** Table already exists in database

**Solution:**
```bash
# Option 1: Drop the table manually
psql -U postgres -d ghumo_firo -c "DROP TABLE table_name;"

# Option 2: Use db:push (overwrites)
npm run db:push
```

### Error: "column does not exist"

**Problem:** Code expects column that doesn't exist

**Solution:**
```bash
# Run pending migrations
npm run db:migrate

# Or regenerate
npm run db:generate
npm run db:migrate
```

### Error: "cannot drop column because other objects depend on it"

**Problem:** Foreign key constraint

**Solution:**
```sql
-- Drop constraint first
ALTER TABLE bookings DROP CONSTRAINT bookings_tour_id_fkey;

-- Then drop column
ALTER TABLE tours DROP COLUMN id;
```

### Migration Files Out of Sync

**Problem:** Local and production have different migrations

**Solution:**
```bash
# On production server
cd backend
git pull
npm run db:migrate
```

---

## 📊 Example: Complete Workflow

### Scenario: Add "Reviews" Feature

**1. Define Schema:**

```typescript
// backend/src/core/database/schema.ts
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  tourId: integer('tour_id').references(() => tours.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(),  // 1-5
  title: text('title').notNull(),
  comment: text('comment').notNull(),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})
```

**2. Generate Migration:**

```bash
npm run db:generate
# Creates: drizzle/0006_add_reviews_table.sql
```

**3. Review SQL:**

```sql
-- drizzle/0006_add_reviews_table.sql
CREATE TABLE "reviews" (
  "id" SERIAL PRIMARY KEY,
  "tour_id" INTEGER NOT NULL REFERENCES "tours"("id"),
  "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "rating" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "comment" TEXT NOT NULL,
  "is_verified" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP DEFAULT NOW()
);
```

**4. Apply Migration:**

```bash
npm run db:migrate
# ✅ Table created!
```

**5. Create Service:**

```typescript
// backend/src/modules/reviews/review.service.ts
import { db } from '../../core/database'
import { reviews } from '../../core/database/schema'

export const reviewService = {
  create: async (data: any) => {
    return await db.insert(reviews).values(data).returning()
  },
  
  getByTourId: async (tourId: number) => {
    return await db.select().from(reviews).where(eq(reviews.tourId, tourId))
  },
}
```

**6. Test:**

```bash
npm run dev
# Test API endpoints
```

**7. Deploy:**

```bash
git add .
git commit -m "Add reviews feature"
git push

# On server
ssh root@187.127.151.137
cd /path/to/backend
git pull
npm run db:migrate
pm2 restart ghumo-phiro-backend
```

---

## 🎯 Quick Reference

### Daily Commands

```bash
# Make changes to schema.ts, then:
npm run db:generate    # Create migration
npm run db:migrate     # Apply migration
npm run db:studio      # View database
npm run dev            # Test changes
```

### Production Deployment

```bash
ssh root@187.127.151.137
cd /path/to/backend
git pull
npm run db:migrate
pm2 restart ghumo-phiro-backend
```

### Emergency Rollback

```bash
# Restore from backup
psql -U postgres -d ghumo_firo < backup_20260414.sql
```

---

## 📚 Additional Resources

- **Drizzle ORM Docs**: https://orm.drizzle.team
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Your Schema File**: `backend/src/core/database/schema.ts`
- **Migration Folder**: `backend/drizzle/`

---

## ✅ Summary

**Best Method = Drizzle ORM Migrations**

1. ✏️ Edit `schema.ts`
2. 🔄 Run `npm run db:generate`
3. 👀 Review generated SQL
4. ✅ Run `npm run db:migrate`
5. 🧪 Test locally
6. 🚀 Deploy to production

**Never:**
- ❌ Edit SQL files manually
- ❌ Run SQL directly in production
- ❌ Skip migrations

**Always:**
- ✅ Use migrations for all changes
- ✅ Test locally first
- ✅ Backup before major changes
- ✅ Commit migrations to Git

---

**Need Help?** Check the Drizzle documentation or ask in the team chat!
