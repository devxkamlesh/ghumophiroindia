# Panel Structure Guide - Ghumo Phiro India

## Overview
This document explains the organized folder structure for both User Panel (public-facing) and Admin Panel (dashboard) with feature-based organization.

## ✅ Implemented Structure

### 1. Route Groups (Next.js 14 App Router)

#### Public Panel: `app/(public)/`
- **Purpose**: Public-facing pages for customers
- **Layout**: Includes header, footer, and WhatsApp button
- **URL**: No prefix (e.g., `/`, `/tours`, `/contact`)

#### Admin Panel: `app/(dashboard)/`
- **Purpose**: Admin dashboard for managing the business
- **Layout**: Includes dashboard sidebar and header
- **URL**: Prefixed with `/dashboard` (e.g., `/dashboard`, `/dashboard/tours`)

### 2. Component Organization

```
components/
├── public/                    # Public-facing components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── ModernHeader.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── FeaturedTours.tsx
│   │   ├── PopularDestinations.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   └── CTABand.tsx
│   ├── booking/
│   │   └── BookingForm.tsx
│   └── shared/
│       ├── SearchBar.tsx
│       ├── WhatsAppButton.tsx
│       └── SuccessModal.tsx
│
├── dashboard/                 # Admin dashboard components
│   ├── layout/
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardHeader.tsx
│   │   └── DashboardNav.tsx
│   ├── tours/
│   │   ├── ToursTable.tsx
│   │   └── PopularToursWidget.tsx
│   ├── bookings/
│   │   ├── BookingsTable.tsx
│   │   └── RecentBookings.tsx
│   └── analytics/
│       └── StatsCard.tsx
│
└── ui/                        # Shared UI components
    └── navigation-menu.tsx
```

### 3. Current Pages

#### Public Pages (Implemented)
- ✅ `/` - Home page
- ✅ `/tours` - Tours listing
- ✅ `/tours/[id]` - Tour details
- ✅ `/contact` - Contact page
- ✅ `/custom-tour` - Custom tour builder
- ✅ `/about` - About page

#### Dashboard Pages (Implemented)
- ✅ `/dashboard` - Dashboard home with stats
- ✅ `/dashboard/tours` - Tours management
- ✅ `/dashboard/bookings` - Bookings management

#### Dashboard Pages (To Be Created)
- ⏳ `/dashboard/inquiries` - Inquiries management
- ⏳ `/dashboard/custom-requests` - Custom tour requests
- ⏳ `/dashboard/reviews` - Reviews management
- ⏳ `/dashboard/destinations` - Destinations management
- ⏳ `/dashboard/blog` - Blog management
- ⏳ `/dashboard/analytics` - Analytics dashboard
- ⏳ `/dashboard/settings` - Settings

## Dashboard Features

### 1. Dashboard Home (`/dashboard`)
**Features:**
- 6 stat cards (Revenue, Bookings, Tours, Inquiries, Customers, Conversion Rate)
- Recent bookings widget
- Popular tours widget
- Quick actions panel

**Components Used:**
- `StatsCard` - Displays key metrics with trend indicators
- `RecentBookings` - Shows latest 4 bookings
- `PopularToursWidget` - Shows top 4 tours by bookings

### 2. Tours Management (`/dashboard/tours`)
**Features:**
- Search tours
- Filter by status/category
- View all tours in table format
- Quick actions: View, Edit, Delete
- Create new tour button

**Components Used:**
- `ToursTable` - Displays all tours with actions

**Data Displayed:**
- Tour title
- Duration
- Price
- Category
- Bookings count
- Rating
- Status (active/inactive)

### 3. Bookings Management (`/dashboard/bookings`)
**Features:**
- Search bookings by customer, tour, or ID
- Filter by status (pending, confirmed, completed, cancelled)
- View booking details
- Quick actions: View, Email, Confirm, Cancel
- Export bookings data

**Components Used:**
- `BookingsTable` - Displays all bookings with actions

**Data Displayed:**
- Booking ID
- Customer name & email
- Tour name
- Start date
- Number of travelers
- Amount
- Booking status
- Payment status

## Navigation Structure

### Public Navigation (Header)
```
- Home
- Tours (Dropdown)
  - Golden Triangle Tour
  - Rajasthan Heritage
  - Custom Tours
- Destinations (Dropdown)
  - Jaipur
  - Udaipur
  - Jodhpur
  - Jaisalmer
- About
- Contact
```

### Dashboard Navigation (Sidebar)
```
- Dashboard
- Tours
- Bookings
- Inquiries
- Custom Requests
- Reviews
- Destinations
- Blog
- Analytics
- Settings
```

## Key Features

### 1. Separation of Concerns
- Public and dashboard components are completely separated
- No mixing of public and admin logic
- Clear boundaries between user-facing and admin features

### 2. Feature-Based Organization
- Components grouped by feature (tours, bookings, analytics)
- Easy to find related components
- Scalable structure for adding new features

### 3. Reusable Components
- Shared UI components in `components/ui/`
- Common patterns extracted into reusable components
- Consistent design across the application

### 4. Type Safety
- TypeScript throughout
- Proper type definitions for props
- Type-safe API calls (to be implemented)

## Next Steps

### Phase 1: Complete Dashboard Pages
1. Create Inquiries management page
2. Create Custom Requests management page
3. Create Reviews management page
4. Create Destinations management page
5. Create Blog management page
6. Create Analytics dashboard
7. Create Settings pages

### Phase 2: Add CRUD Operations
1. Implement Create Tour form
2. Implement Edit Tour form
3. Implement Delete confirmation dialogs
4. Add form validation
5. Connect to API endpoints

### Phase 3: Authentication
1. Create login page
2. Implement authentication middleware
3. Add session management
4. Protect dashboard routes
5. Add role-based access control

### Phase 4: API Integration
1. Create API service layer (`lib/api/`)
2. Implement data fetching hooks (`lib/hooks/`)
3. Add loading states
4. Add error handling
5. Implement optimistic updates

### Phase 5: Advanced Features
1. Real-time notifications
2. Advanced analytics with charts
3. Bulk operations
4. Export/Import functionality
5. Email templates
6. SMS notifications

## File Naming Conventions

### Components
- PascalCase for component files: `DashboardSidebar.tsx`
- Descriptive names: `RecentBookings.tsx` not `Bookings.tsx`
- Feature prefix for specificity: `ToursTable.tsx`, `BookingsTable.tsx`

### Pages
- lowercase with hyphens: `custom-tour/page.tsx`
- Dynamic routes in brackets: `[id]/page.tsx`
- Route groups in parentheses: `(dashboard)/`

### API Routes
- lowercase: `route.ts`
- RESTful naming: `/api/tours`, `/api/tours/[id]`

## Import Patterns

### Absolute Imports (Preferred)
```typescript
import DashboardSidebar from '@/components/dashboard/layout/DashboardSidebar'
import { getTours } from '@/lib/api/tours'
import type { Tour } from '@/lib/types'
```

### Relative Imports (Avoid)
```typescript
// ❌ Don't do this
import DashboardSidebar from '../../../components/dashboard/layout/DashboardSidebar'
```

## Component Patterns

### Dashboard Components
```typescript
// Always use 'use client' for interactive components
'use client'

import { useState } from 'react'
import { Icon } from 'lucide-react'

export default function ComponentName() {
  const [state, setState] = useState()
  
  return (
    <div>
      {/* Component content */}
    </div>
  )
}
```

### Page Components
```typescript
// Server components by default
import Component from '@/components/...'

export const metadata = {
  title: 'Page Title',
  description: 'Page description',
}

export default function PageName() {
  return (
    <div>
      {/* Page content */}
    </div>
  )
}
```

## Styling Guidelines

### Tailwind Classes
- Use utility classes for styling
- Group related classes: layout, spacing, colors, typography
- Use responsive prefixes: `md:`, `lg:`
- Extract repeated patterns into components

### Color Palette
- Primary: `primary-50` to `primary-900`
- Success: `green-*`
- Warning: `yellow-*`
- Error: `red-*`
- Info: `blue-*`

## Testing Strategy (To Be Implemented)

### Unit Tests
- Test individual components
- Test utility functions
- Test API service layer

### Integration Tests
- Test page flows
- Test form submissions
- Test API integrations

### E2E Tests
- Test critical user journeys
- Test dashboard workflows
- Test booking process

## Performance Optimization

### Current Optimizations
- Server components by default
- Client components only when needed
- Proper code splitting with route groups

### Future Optimizations
- Image optimization with Next.js Image
- API response caching
- Lazy loading for heavy components
- Database query optimization

## Security Considerations

### To Be Implemented
- Authentication middleware
- CSRF protection
- Input validation
- SQL injection prevention
- XSS protection
- Rate limiting

## Deployment

### Build Command
```bash
npm run build
```

### Environment Variables
```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## Maintenance

### Adding New Features
1. Create feature folder in appropriate location
2. Create components in feature folder
3. Create page in appropriate route group
4. Update navigation if needed
5. Add API routes if needed
6. Update this documentation

### Modifying Existing Features
1. Locate feature folder
2. Update components
3. Test changes
4. Update documentation if structure changes

## Support

For questions or issues with the folder structure:
1. Check this documentation
2. Review FOLDER_STRUCTURE.md
3. Check Next.js 14 App Router documentation
4. Contact the development team

---

**Last Updated**: March 15, 2026
**Version**: 1.0.0
**Maintainer**: Development Team
