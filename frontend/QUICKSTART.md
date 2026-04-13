# Quick Start Guide - Ghumo Firo India Frontend

## Prerequisites

- Node.js 24.x or higher
- npm 11.x or higher
- Backend API running at `http://187.127.151.137/api/v1`

## Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

The `.env.local` file is already configured with:

```env
NEXT_PUBLIC_API_URL="http://187.127.151.137/api/v1"
NEXT_PUBLIC_APP_NAME="Ghumo Firo India"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="djoqjwwid"
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

## Available Pages

- **Home**: `http://localhost:3000/` - Hero section with featured tours
- **Tours**: `http://localhost:3000/tours` - All tours with filters
- **Tour Detail**: `http://localhost:3000/tours/[id]` - Tour details with booking
- **About**: `http://localhost:3000/about` - Company information
- **Contact**: `http://localhost:3000/contact` - Contact form

## Features Implemented

✅ Responsive design (mobile-first)
✅ Modern UI with Radix components
✅ Tour filtering (category, price, duration)
✅ Booking form with validation
✅ Contact form with validation
✅ Image optimization
✅ TypeScript type safety
✅ SEO-friendly structure

## API Integration

The frontend connects to these backend endpoints:

- `GET /api/v1/tours` - List all tours
- `GET /api/v1/tours/featured` - Featured tours
- `GET /api/v1/tours/:id` - Single tour
- `POST /api/v1/bookings` - Create booking
- `POST /api/v1/inquiries` - Submit inquiry

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── tours/              # Tours pages
│   │   ├── about/              # About page
│   │   └── contact/            # Contact page
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   └── public/             # Header, Footer
│   ├── lib/                    # Utilities
│   ├── services/               # API services
│   └── types/                  # TypeScript types
└── public/                     # Static assets
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack

# Production
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run typecheck        # Check TypeScript types

# Testing
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
npm run dev -- -p 3001
```

### API Connection Issues

1. Verify backend is running at `http://187.127.151.137/api/v1`
2. Check CORS settings in backend
3. Verify `.env.local` has correct API URL

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Next Steps

1. **Add Images**: Place tour images in `public/images/`
2. **Customize Styling**: Edit `tailwind.config.ts` for brand colors
3. **Add Analytics**: Configure Google Analytics in `.env.local`
4. **SEO Optimization**: Add metadata to each page
5. **Performance**: Enable image optimization and caching

## Support

For issues or questions:
- Check the main [README.md](./README.md)
- Review [Next.js documentation](https://nextjs.org/docs)
- Check backend API documentation

## Brand Information

- **Name**: Ghumo Firo India (not Phiro)
- **Domain**: ghumofiroindia.com
- **Focus**: Rajasthan tour packages
- **API**: http://187.127.151.137/api/v1

---

**Status**: ✅ Ready for development and testing
**Last Updated**: 2026-04-13
