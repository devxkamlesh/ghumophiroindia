# Project Folder Structure

## Overview
This document outlines the organized folder structure for the Ghumo Phiro India travel website, featuring separate user and admin panels with feature-based organization.

## New Folder Structure

```
app/
├── (public)/                          # Public-facing pages (user panel)
│   ├── layout.tsx                     # Public layout with header/footer
│   ├── page.tsx                       # Home page
│   ├── about/
│   │   └── page.tsx
│   ├── tours/
│   │   ├── page.tsx                   # Tours listing
│   │   └── [id]/
│   │       └── page.tsx               # Tour details
│   ├── destinations/
│   │   ├── page.tsx                   # All destinations
│   │   └── [slug]/
│   │       └── page.tsx               # Destination details
│   ├── custom-tour/
│   │   └── page.tsx                   # Custom tour builder
│   ├── contact/
│   │   └── page.tsx
│   ├── blog/
│   │   ├── page.tsx                   # Blog listing
│   │   └── [slug]/
│   │       └── page.tsx               # Blog post
│   └── booking/
│       ├── [tourId]/
│       │   └── page.tsx               # Booking form
│       └── confirmation/
│           └── page.tsx               # Booking confirmation
│
├── (dashboard)/                       # Admin panel
│   ├── layout.tsx                     # Dashboard layout with sidebar
│   ├── dashboard/
│   │   ├── page.tsx                   # Dashboard home
│   │   ├── tours/
│   │   │   ├── page.tsx               # Tours management
│   │   │   ├── new/
│   │   │   │   └── page.tsx           # Create new tour
│   │   │   └── [id]/
│   │   │       ├── page.tsx           # Edit tour
│   │   │       └── analytics/
│   │   │           └── page.tsx       # Tour analytics
│   │   ├── bookings/
│   │   │   ├── page.tsx               # Bookings list
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Booking details
│   │   ├── inquiries/
│   │   │   ├── page.tsx               # Inquiries list
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Inquiry details
│   │   ├── custom-requests/
│   │   │   ├── page.tsx               # Custom tour requests
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Request details
│   │   ├── reviews/
│   │   │   ├── page.tsx               # Reviews management
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Review moderation
│   │   ├── destinations/
│   │   │   ├── page.tsx               # Destinations management
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx               # Blog posts management
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx               # Analytics dashboard
│   │   └── settings/
│   │       ├── page.tsx               # General settings
│   │       ├── profile/
│   │       │   └── page.tsx
│   │       └── team/
│   │           └── page.tsx
│   │
│   └── auth/                          # Authentication pages
│       ├── login/
│       │   └── page.tsx
│       └── forgot-password/
│           └── page.tsx
│
├── api/                               # API routes (organized by feature)
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts
│   │   └── logout/
│   │       └── route.ts
│   ├── tours/
│   │   ├── route.ts                   # GET all, POST create
│   │   └── [id]/
│   │       └── route.ts               # GET, PUT, DELETE
│   ├── bookings/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   ├── inquiries/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   ├── custom-tour/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   ├── reviews/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   ├── destinations/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   ├── blog/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   └── analytics/
│       └── route.ts
│
├── globals.css
├── layout.tsx                         # Root layout
└── not-found.tsx

components/
├── public/                            # Public-facing components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── ModernHeader.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── FeaturedTours.tsx
│   │   ├── PopularDestinations.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   └── CTABand.tsx
│   ├── tours/
│   │   ├── TourCard.tsx
│   │   ├── TourGrid.tsx
│   │   ├── TourFilters.tsx
│   │   ├── TourDetails.tsx
│   │   └── TourGallery.tsx
│   ├── booking/
│   │   ├── BookingForm.tsx
│   │   ├── BookingSummary.tsx
│   │   └── PaymentForm.tsx
│   ├── destinations/
│   │   ├── DestinationCard.tsx
│   │   └── DestinationGrid.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   ├── BlogGrid.tsx
│   │   └── BlogPost.tsx
│   └── shared/
│       ├── SearchBar.tsx
│       ├── WhatsAppButton.tsx
│       ├── SuccessModal.tsx
│       └── ContactForm.tsx
│
├── dashboard/                         # Admin dashboard components
│   ├── layout/
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardHeader.tsx
│   │   └── DashboardNav.tsx
│   ├── tours/
│   │   ├── TourTable.tsx
│   │   ├── TourForm.tsx
│   │   ├── TourStats.tsx
│   │   └── TourActions.tsx
│   ├── bookings/
│   │   ├── BookingTable.tsx
│   │   ├── BookingDetails.tsx
│   │   ├── BookingStatus.tsx
│   │   └── BookingFilters.tsx
│   ├── inquiries/
│   │   ├── InquiryTable.tsx
│   │   ├── InquiryDetails.tsx
│   │   └── InquiryActions.tsx
│   ├── reviews/
│   │   ├── ReviewTable.tsx
│   │   ├── ReviewCard.tsx
│   │   └── ReviewModeration.tsx
│   ├── analytics/
│   │   ├── StatsCard.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── BookingsChart.tsx
│   │   └── PopularToursChart.tsx
│   └── shared/
│       ├── DataTable.tsx
│       ├── StatusBadge.tsx
│       ├── ActionMenu.tsx
│       └── ConfirmDialog.tsx
│
└── ui/                                # Shared UI components
    ├── button.tsx
    ├── input.tsx
    ├── select.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    ├── navigation-menu.tsx
    ├── table.tsx
    ├── badge.tsx
    ├── card.tsx
    ├── tabs.tsx
    └── README.md

lib/
├── db/
│   ├── index.ts                       # Database connection
│   └── schema.ts                      # Database schema
├── api/
│   ├── tours.ts                       # Tour API functions
│   ├── bookings.ts                    # Booking API functions
│   ├── inquiries.ts                   # Inquiry API functions
│   ├── reviews.ts                     # Review API functions
│   └── analytics.ts                   # Analytics functions
├── auth/
│   ├── session.ts                     # Session management
│   ├── middleware.ts                  # Auth middleware
│   └── utils.ts                       # Auth utilities
├── validations/
│   ├── tour.ts                        # Tour validation schemas
│   ├── booking.ts                     # Booking validation schemas
│   └── inquiry.ts                     # Inquiry validation schemas
├── hooks/
│   ├── useTours.ts
│   ├── useBookings.ts
│   └── useAuth.ts
├── types.ts                           # TypeScript types
├── utils.ts                           # Utility functions
├── constants.ts                       # Constants
└── seo.ts                             # SEO utilities

```

## Key Features of This Structure

### 1. Route Groups
- `(public)` - Public-facing pages with public layout
- `(dashboard)` - Admin panel with dashboard layout
- Allows different layouts without affecting URL structure

### 2. Feature-Based Organization
- Each feature has its own folder
- Related components grouped together
- Easy to find and maintain

### 3. Separation of Concerns
- Public components separate from dashboard components
- Shared UI components in dedicated folder
- API routes organized by feature

### 4. Scalability
- Easy to add new features
- Clear structure for team collaboration
- Modular and maintainable

### 5. Type Safety
- Centralized types in lib/types.ts
- Validation schemas for data integrity
- TypeScript throughout

## Migration Plan

1. Create new folder structure
2. Move existing files to appropriate locations
3. Update imports across the project
4. Test all routes and components
5. Update documentation
