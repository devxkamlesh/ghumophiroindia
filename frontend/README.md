# Ghumo Firo India - Frontend

Modern Next.js 16 frontend for the Ghumo Firo India tour booking platform.

## Features

- **Home Page**: Hero section with featured tours
- **Tours Listing**: Browse all tours with filters (category, price, duration)
- **Tour Details**: Detailed tour information with booking form
- **About Page**: Company information and mission
- **Contact Page**: Contact form and information
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Radix UI components for accessibility

## Tech Stack

- Next.js 16.2 with App Router
- React 19
- TypeScript 5.8
- Tailwind CSS 3.4
- Radix UI Components
- SWR for data fetching
- Axios for API calls

## Getting Started

### Prerequisites

- Node.js 24.x or higher
- npm 11.x or higher

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your API URL:
```env
NEXT_PUBLIC_API_URL="http://187.127.151.137/api/v1"
NEXT_PUBLIC_APP_NAME="Ghumo Firo India"
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm run start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout with header/footer
│   │   ├── page.tsx         # Home page
│   │   ├── tours/           # Tours pages
│   │   ├── about/           # About page
│   │   └── contact/         # Contact page
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components
│   │   └── public/          # Public-facing components
│   ├── lib/                 # Utilities
│   ├── services/            # API services
│   └── types/               # TypeScript types
├── public/                  # Static assets
└── tailwind.config.ts       # Tailwind configuration
```

## API Integration

The frontend connects to the backend API at `http://187.127.151.137/api/v1`.

### Available Endpoints

- `GET /tours` - List all tours
- `GET /tours/featured` - Featured tours
- `GET /tours/:id` - Single tour details
- `POST /bookings` - Create booking
- `POST /inquiries` - Submit inquiry

## Pages

### Home (`/`)
- Hero section with call-to-action
- Featured tours grid (6 tours)
- Why choose us section

### Tours (`/tours`)
- All tours listing
- Filters: category, price range, duration
- Tour cards with key information

### Tour Detail (`/tours/[id]`)
- Full tour information
- Image gallery
- Highlights, included/excluded items
- Day-by-day itinerary
- Booking form

### About (`/about`)
- Company information
- Mission and values
- Key features

### Contact (`/contact`)
- Contact information
- Contact form
- Office details

## Styling

The project uses Tailwind CSS with a custom design system:

- Primary color: Blue (#3B82F6)
- Responsive breakpoints: sm, md, lg, xl
- Custom components using Radix UI
- Dark mode support (configured but not enabled)

## Type Safety

All API responses and form data are fully typed using TypeScript interfaces defined in `src/types/index.ts`.

## Performance

- Server-side rendering for SEO
- Image optimization with Next.js Image
- Code splitting and lazy loading
- SWR for efficient data fetching

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
