# Setup Guide - Ghumo Phiro India

Complete setup guide for the enterprise-grade travel booking platform.

---

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Git

---

## 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd travel-kiro

# Install dependencies
npm install
```

---

## 2. Environment Setup

Create `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ghumophiro"

# Authentication (generate with: openssl rand -base64 32)
AUTH_SECRET="your-32-character-secret-key-here"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Email (for notifications)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@ghumophiroindia.com"

# Optional: WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="+919876543210"
```

---

## 3. Database Setup

### Option A: Using Drizzle Studio (Recommended)

```bash
# Generate migration files
npx drizzle-kit generate:pg

# Push schema to database
npx drizzle-kit push:pg

# Open Drizzle Studio to manage data
npx drizzle-kit studio
```

### Option B: Manual SQL

Run the SQL from `lib/db/schema.ts` manually in your PostgreSQL client.

---

## 4. Seed Database (Optional)

Create a seed script `scripts/seed.ts`:

```typescript
import { db } from '@/lib/db'
import { tours, destinations, users } from '@/lib/db/schema'
import { hash } from 'bcryptjs'

async function seed() {
  // Create admin user
  const hashedPassword = await hash('admin123', 10)
  await db.insert(users).values({
    name: 'Admin User',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
  })

  // Create sample destinations
  await db.insert(destinations).values([
    {
      name: 'Delhi',
      slug: 'delhi',
      subtitle: 'The Capital City',
      description: 'Historic capital with rich heritage',
      image: '/images/delhi.jpg',
      isPopular: true,
    },
    // Add more destinations...
  ])

  // Create sample tours
  await db.insert(tours).values([
    {
      title: 'Golden Triangle Tour',
      slug: 'golden-triangle-tour',
      description: 'Visit Delhi, Agra, and Jaipur',
      longDescription: 'Experience the best of North India...',
      duration: 7,
      price: '1500.00',
      maxGroupSize: 15,
      difficulty: 'easy',
      category: 'heritage',
      images: ['/images/tour1.jpg'],
      highlights: ['Taj Mahal', 'Red Fort', 'Amber Fort'],
      included: ['Accommodation', 'Meals', 'Transport'],
      excluded: ['Flights', 'Personal expenses'],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Delhi',
          description: 'Welcome to Delhi',
          activities: ['Airport pickup', 'Hotel check-in'],
        },
      ],
      destinations: ['Delhi', 'Agra', 'Jaipur'],
      rating: '4.8',
      reviewCount: 120,
      isActive: true,
      isFeatured: true,
    },
    // Add more tours...
  ])

  console.log('Database seeded successfully!')
}

seed().catch(console.error)
```

Run the seed script:
```bash
npx tsx scripts/seed.ts
```

---

## 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 6. Test Authentication

### Register Admin User
1. Go to `http://localhost:3000/register`
2. Create an account
3. Manually update the user's role to 'admin' in the database:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```

### Login
1. Go to `http://localhost:3000/login`
2. Login with your credentials
3. Access dashboard at `http://localhost:3000/dashboard`

---

## 7. API Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","confirmPassword":"password123"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Get Tours
curl http://localhost:3000/api/tours

# Get Featured Tours
curl http://localhost:3000/api/tours/featured

# Create Booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "tourId":"1",
    "name":"John Doe",
    "email":"john@example.com",
    "phone":"+919876543210",
    "country":"India",
    "numberOfTravelers":2,
    "startDate":"2024-06-01",
    "endDate":"2024-06-08",
    "totalPrice":3000
  }'
```

### Using Postman/Thunder Client

Import the API endpoints from `API_DOCUMENTATION.md`

---

## 8. Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (dashboard)/         # Admin dashboard
│   ├── (public)/            # Public pages
│   ├── (user-panel)/        # User account pages
│   └── api/                 # API routes
│       ├── v1/auth/         # Auth endpoints
│       ├── tours/           # Tours endpoints
│       ├── bookings/        # Bookings endpoints
│       ├── inquiries/       # Inquiries endpoints
│       ├── custom-tour/     # Custom tour endpoints
│       └── dashboard/       # Dashboard endpoints
├── components/              # React components
│   ├── dashboard/           # Dashboard components
│   ├── public/              # Public components
│   ├── ui/                  # UI primitives
│   └── user-panel/          # User panel components
├── lib/                     # Core libraries
│   ├── auth/                # Authentication logic
│   ├── db/                  # Database config & schema
│   ├── services/            # Business logic services
│   ├── mappers/             # API ↔ DB mappers
│   ├── validations/         # Zod validation schemas
│   └── utils.ts             # Utility functions
├── config/                  # App configuration
├── hooks/                   # Custom React hooks
├── middleware.ts            # Route protection
└── public/                  # Static assets
```

---

## Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npx drizzle-kit generate:pg    # Generate migrations
npx drizzle-kit push:pg        # Push schema to DB
npx drizzle-kit studio         # Open Drizzle Studio

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript check
```

---

## Key Features Implemented

✅ JWT-based authentication  
✅ Role-based access control (admin, user)  
✅ Protected routes with middleware  
✅ Services layer with business logic  
✅ Mapper layer for type conversions  
✅ Zod validation for all inputs  
✅ RESTful API with proper error handling  
✅ Dashboard for admin management  
✅ User account panel  
✅ Tour browsing and booking  
✅ Inquiry and custom tour requests  

---

## Next Steps

### Phase 1: Content
1. Add real tour data
2. Upload tour images
3. Create destination pages
4. Add testimonials

### Phase 2: Features
1. Payment integration (Stripe/Razorpay)
2. Email notifications (Resend)
3. File uploads (Cloudinary/S3)
4. Search with filters
5. Reviews and ratings

### Phase 3: Enhancement
1. Admin CRUD interfaces
2. Analytics dashboard
3. Booking calendar
4. PDF invoice generation
5. Multi-language support

### Phase 4: DevOps
1. Docker containerization
2. CI/CD pipeline
3. Environment configs
4. Monitoring & logging
5. Performance optimization

---

## Troubleshooting

### Database Connection Error
- Check DATABASE_URL in `.env.local`
- Ensure PostgreSQL is running
- Verify database exists

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

### Authentication Issues
- Check AUTH_SECRET is set
- Clear browser cookies
- Verify user exists in database

### API Errors
- Check browser console for errors
- Check server logs in terminal
- Verify request payload matches schema

---

## Support

For issues or questions:
1. Check `API_DOCUMENTATION.md`
2. Check `ENTERPRISE_MIGRATION_SUMMARY.md`
3. Review error logs in terminal
4. Check browser console

---

## License

Private - All Rights Reserved

---

**Last Updated:** March 18, 2026  
**Version:** 1.0.0
