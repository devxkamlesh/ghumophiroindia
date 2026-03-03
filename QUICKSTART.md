# Quick Start Guide

Get your Rajasthan Tours platform up and running in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/rajasthan_tours
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```

Replace with your actual database credentials.

## Step 3: Set Up Database

```bash
# Generate migration files
npm run db:generate

# Push schema to database
npm run db:push
```

## Step 4: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your site!

## What You'll See

- **Homepage** with hero, search, featured tours
- **Tour pages** with detailed information
- **Custom tour builder** with multi-step form
- **Contact page** with inquiry form
- **Admin dashboard** at `/admin`

## Next Steps

### 1. Customize Content

Edit the tour data in `components/FeaturedTours.tsx` to add your actual tours.

### 2. Update Images

Replace placeholder images with your own:
- Use Unsplash or your own photography
- Optimize images before uploading
- Update image URLs in components

### 3. Configure WhatsApp

Update the WhatsApp number in:
- `.env.local` file
- `components/WhatsAppButton.tsx`

### 4. Customize Branding

Update colors in `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    // Your brand colors
  }
}
```

### 5. Add Real Tours

Use the admin dashboard or API to add tours:

```bash
POST /api/tours
{
  "title": "Your Tour Name",
  "description": "Tour description",
  "duration": 5,
  "price": 499,
  // ... other fields
}
```

## Common Issues

### Database Connection Error

Make sure PostgreSQL is running and credentials are correct:
```bash
# Check PostgreSQL status
sudo service postgresql status

# Start PostgreSQL
sudo service postgresql start
```

### Port Already in Use

Change the port in `package.json`:
```json
"dev": "next dev -p 3001"
```

### Module Not Found

Clear cache and reinstall:
```bash
rm -rf node_modules .next
npm install
```

## Development Tips

### Hot Reload

The dev server supports hot reload. Changes to files will automatically refresh the browser.

### Database Studio

View and edit database with Drizzle Studio:
```bash
npm run db:studio
```

### Type Checking

Run TypeScript type checking:
```bash
npx tsc --noEmit
```

### Linting

Check code quality:
```bash
npm run lint
```

## Production Build

Test production build locally:

```bash
# Build
npm run build

# Start production server
npm start
```

## Need Help?

- Check `README.md` for detailed documentation
- Review `ARCHITECTURE.md` for system design
- See `DEPLOYMENT.md` for production deployment
- Read `FEATURES.md` for feature list

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Database
npm run db:generate     # Generate migrations
npm run db:push         # Push schema to DB
npm run db:studio       # Open database studio

# Code Quality
npm run lint            # Run linter
npx tsc --noEmit       # Type check
```

---

**You're all set! Start building your travel empire! 🚀**
