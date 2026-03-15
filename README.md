# Ghumo Phiro India - Travel Tour Platform

A modern, high-conversion travel tour website built with Next.js 14, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Modern UI/UX**: Clean, mobile-first design inspired by leading travel platforms
- **Smart Tour Search**: Advanced filtering and search capabilities
- **Custom Tour Builder**: Interactive multi-step form for personalized itineraries
- **Tour Management**: Complete CRUD operations for tours
- **Booking System**: Integrated booking and inquiry management
- **Responsive Design**: Optimized for all devices
- **Performance**: Fast loading with Next.js optimizations
- **SEO Optimized**: Server-side rendering and meta tags

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Radix UI

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── tours/             # Tour pages
│   ├── custom-tour/       # Custom tour builder
│   ├── contact/           # Contact page
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utilities and database
│   └── db/               # Database schema and config
└── public/               # Static assets
```

## 🎨 Key Features

### Homepage
- Hero section with search
- Featured tours grid
- Popular destinations
- Trust indicators
- Testimonials

### Tour Discovery
- Smart search and filters
- Tour listing cards
- Destination pages

### Custom Tour Builder
- Multi-step wizard
- Destination selection
- Budget and duration options

### Booking System
- Booking form
- Date selection
- Price calculation

## 📝 Available Scripts

```bash
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Run linter
npm run db:generate     # Generate migrations
npm run db:push         # Push schema to DB
npm run db:studio       # Open database studio
```

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables

Required environment variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/database
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```

## 📄 License

Proprietary - All rights reserved

## 🤝 Support

For support, email info@ghumophiroindia.com or call +91 98765 43210

---

**Built with ❤️ for travelers exploring India**
