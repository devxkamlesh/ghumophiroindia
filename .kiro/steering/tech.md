# Technology Stack

## Framework & Runtime

- **Next.js 15.3.2** (App Router with React Server Components)
- **React 19.1.0** with React DOM
- **TypeScript 5.8.3** (strict mode enabled)
- **Node.js** runtime

## Database & ORM

- **PostgreSQL** (hosted on Supabase)
- **Drizzle ORM 0.43.1** for type-safe database queries
- **Drizzle Kit 0.31.1** for migrations and schema management
- **postgres** driver (3.4.5) with SSL support

## Authentication

- **JWT** tokens via `jose` library
- **bcryptjs** for password hashing
- Session-based auth with HTTP-only cookies
- Role-based access control (admin/user)

## UI & Styling

- **Tailwind CSS 3.4.17** with custom design tokens
- **Radix UI** components (dialog, dropdown, select, toast, tooltip, etc.)
- **Lucide React** for icons
- **Motion 12.6.0** for animations
- **next-themes** for dark mode support
- Custom color palette: primary (orange), sand (beige)
- Custom fonts: Inter (sans), Playfair Display (display)

## Forms & Validation

- **React Hook Form 7.54.2** with `@hookform/resolvers`
- **Zod 3.24.4** for schema validation
- **drizzle-zod** for database schema validation

## Data Fetching

- **SWR 2.4.1** for client-side data fetching and caching
- **nuqs 2.4.3** for URL state management

## Utilities

- **clsx** and **tailwind-merge** for className management
- **class-variance-authority** for component variants
- **date-fns 4.1.0** for date manipulation
- **sharp 0.33.5** for image optimization
- **sonner 2.0.3** for toast notifications

## Development Tools

- **ESLint** with Next.js config
- **tsx** for running TypeScript scripts
- **dotenv** for environment variables
- **Turbopack** for faster development builds

## Common Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Production build
npm start                # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run typecheck        # TypeScript type checking

# Database
npm run db:generate      # Generate migrations from schema
npm run db:migrate       # Run migrations
npm run db:push          # Push schema changes directly
npm run db:pull          # Pull schema from database
npm run db:studio        # Open Drizzle Studio (GUI)
npm run seed             # Seed database with sample data

# Testing
npm run test:auth        # Test authentication flow
```

## Environment Variables

Required in `.env.local`:
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - JWT secret key (32+ characters)
- `NEXT_PUBLIC_APP_URL` - Application URL
- `NEXT_PUBLIC_WHATSAPP_NUMBER` - WhatsApp contact number

## Build Configuration

- Path alias: `@/*` maps to project root
- Image optimization: AVIF and WebP formats
- Remote image patterns: All HTTPS domains allowed
- Package optimization: lucide-react
- SSL required for database connections
