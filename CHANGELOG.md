# Changelog

All notable changes to Ghumo Firo India project.

## [1.0.2] - 2026-04-08

### Changed
- **Dashboard Integration:** Removed all mock data and connected to real API endpoints
- **Admin Dashboard:** Now fetches real stats from `/api/dashboard/stats`
- **Recent Bookings Widget:** Fetches actual bookings from `/api/dashboard/recent`
- **Popular Tours Widget:** Fetches actual tours from `/api/tours/featured`
- **User Account Page:** Fetches user's actual bookings and displays real stats

### Added
- Loading states for all dashboard widgets
- Empty states when no data is available
- Authentication checks on dashboard pages
- Server-side data fetching for admin dashboard
- Client-side data fetching for widgets

### Fixed
- Dashboard now shows real booking counts
- User account displays actual user name from session
- Upcoming trips filtered by date correctly

## [1.0.1] - 2026-04-08

### Changed
- **Project Name:** Changed from "Ghumo Phiro India" to "Ghumo Firo India"
- **Package Name:** Updated to `ghumofiroindia` in package.json
- **Social Media Links:** Updated all social media handles to match new name

### Fixed
- **API Path Mismatch:** Fixed hooks to use correct API paths (`/api/tours` instead of `/api/v1/tours`)
- **Custom Tour Status:** Standardized status values to use `'pending'` as default instead of `'new'`
- **Middleware:** Enhanced to properly handle auth API routes and public endpoints

### Removed
- All temporary .md files from root directory (moved to `/docs`)

### Documentation
- Reorganized all documentation into `/docs` folder
- Updated all references to project name
- Added comprehensive fixes documentation

## [1.0.0] - 2026-04-07

### Added
- Initial release of Ghumo Firo India travel booking platform
- JWT-based authentication with role-based access control
- Complete tour booking system
- Admin dashboard for managing tours, bookings, inquiries
- User panel for viewing bookings
- Custom tour request system
- PostgreSQL database with Drizzle ORM
- RESTful API with 18 endpoints
- Comprehensive validation with Zod
- Service layer architecture
- Mapper layer for data transformations

### Features
- Public tour browsing and booking
- User authentication and authorization
- Admin dashboard with analytics
- Custom tour request system
- Inquiry management
- Booking management with status tracking
- Tour management with CRUD operations

---

**Current Version:** 1.0.2  
**Last Updated:** April 8, 2026
