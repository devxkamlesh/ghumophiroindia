# 🚀 Tech Stack - Ghumo Firo India

## 📊 Complete Technology Stack

---

## 🎨 Frontend (Client-Side)

### Core Framework
- **Next.js** `16.2.3` - React framework with server-side rendering
- **React** `19.2.5` - UI library
- **TypeScript** `5.8.3` - Type-safe JavaScript

### UI & Styling
- **Tailwind CSS** `3.4.17` - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
  - Dialog `1.1.6`
  - Dropdown Menu `2.1.6`
  - Select `2.1.6`
  - Toast `1.2.5`
  - Tooltip `1.2.0`
  - Navigation Menu `1.2.3`
  - Label `2.1.2`
  - Separator `1.1.2`
  - Slot `1.2.0`
- **Lucide React** `0.508.0` - Icon library
- **class-variance-authority** `0.7.1` - Component variants
- **clsx** `2.1.1` - Conditional classnames
- **tailwind-merge** `3.2.0` - Merge Tailwind classes

### Animation & Motion
- **Motion** `12.6.0` - Animation library (Framer Motion)

### Forms & Validation
- **React Hook Form** `7.54.2` - Form management
- **Zod** `3.24.4` - Schema validation
- **@hookform/resolvers** `3.10.0` - Form validation resolvers

### State Management & Data Fetching
- **Zustand** `5.0.3` - State management
- **SWR** `2.4.1` - Data fetching & caching
- **Axios** `1.7.9` - HTTP client
- **nuqs** `2.4.3` - URL state management

### Utilities
- **next-themes** `0.4.6` - Dark mode support
- **date-fns** `4.1.0` - Date manipulation
- **Sharp** `0.33.5` - Image optimization
- **Sonner** `2.0.3` - Toast notifications

### Development Tools
- **ESLint** `9.26.0` - Code linting
- **PostCSS** `8.5.8` - CSS processing
- **Autoprefixer** `10.4.27` - CSS vendor prefixes

### Testing
- **Jest** `29.7.0` - Testing framework
- **@testing-library/react** `16.1.0` - React testing utilities
- **@testing-library/jest-dom** `6.6.3` - DOM matchers

---

## 🔧 Backend (Server-Side)

### Core Framework
- **Node.js** `>=24.0.0` - JavaScript runtime
- **Express** `4.19.2` - Web framework
- **TypeScript** `5.8.3` - Type-safe JavaScript

### Database & ORM
- **PostgreSQL** - Relational database
- **Drizzle ORM** `0.43.1` - TypeScript ORM
- **Drizzle Kit** `0.31.1` - Database migrations
- **postgres** `3.4.5` - PostgreSQL client

### Caching & Queue
- **Redis** - In-memory cache
- **@upstash/redis** `1.34.3` - Redis client
- **ioredis** `5.4.2` - Redis client
- **BullMQ** `5.34.3` - Job queue system

### Authentication & Security
- **bcryptjs** `3.0.3` - Password hashing
- **jose** `5.10.0` - JWT tokens
- **helmet** `7.1.0` - Security headers
- **cors** `2.8.5` - Cross-origin resource sharing
- **express-rate-limit** `7.5.0` - Rate limiting
- **cookie-parser** `1.4.7` - Cookie parsing

### Validation
- **Zod** `3.24.4` - Schema validation
- **express-validator** `7.2.2` - Request validation

### File Upload & Storage
- **Cloudinary** `2.5.1` - Image hosting & CDN

### Email
- **Nodemailer** `6.9.17` - Email sending

### Utilities
- **dotenv** `16.5.0` - Environment variables
- **compression** `1.7.4` - Response compression
- **morgan** `1.10.0` - HTTP request logger
- **winston** `3.17.0` - Application logger
- **date-fns** `4.1.0` - Date manipulation

### Development Tools
- **tsx** `4.19.3` - TypeScript execution
- **ESLint** `9.26.0` - Code linting
- **@typescript-eslint** `8.20.0` - TypeScript linting

### Testing
- **Jest** `29.7.0` - Testing framework
- **ts-jest** `29.2.5` - TypeScript Jest transformer

---

## 💾 Database

### Primary Database
- **PostgreSQL** `16+` - Relational database
  - ACID compliant
  - JSON support
  - Full-text search
  - Geospatial data

### Cache Layer
- **Redis** `7+` - In-memory data store
  - Session storage
  - API response caching
  - Rate limiting
  - Job queue

---

## 🚀 Deployment & DevOps

### Hosting
- **VPS Server** - 187.127.151.137
- **Operating System** - Linux (Ubuntu/Debian)

### Process Management
- **PM2** - Node.js process manager
  - Auto-restart
  - Load balancing
  - Log management
  - Monitoring

### Web Server
- **Nginx** - Reverse proxy & static file serving
  - SSL/TLS termination
  - Load balancing
  - Gzip compression

### Containerization
- **Docker** - Container platform
- **Docker Compose** - Multi-container orchestration

### Version Control
- **Git** - Source control
- **GitHub** - Code repository

---

## 🛠️ Development Tools

### Code Editor
- **VS Code** - Primary IDE
- **Kiro AI** - AI-powered development assistant

### Package Managers
- **npm** `>=11.0.0` - Node package manager
- **pnpm** (optional) - Fast package manager

### API Testing
- **Postman** / **Thunder Client** - API testing
- **curl** - Command-line HTTP client

### Database Tools
- **Drizzle Studio** - Database GUI
- **pgAdmin** / **DBeaver** - PostgreSQL management

---

## 📦 Build Tools

### Frontend
- **Turbopack** - Next.js bundler (faster than Webpack)
- **PostCSS** - CSS processing
- **Tailwind CSS** - CSS framework

### Backend
- **TypeScript Compiler** - Transpile TS to JS
- **tsx** - TypeScript execution for development

---

## 🔐 Security Stack

### Authentication
- **JWT (JSON Web Tokens)** - Stateless authentication
- **bcrypt** - Password hashing (10 rounds)
- **HTTP-only cookies** - Secure token storage

### Security Headers
- **Helmet.js** - Security headers
  - Content Security Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Strict-Transport-Security

### Rate Limiting
- **express-rate-limit** - API rate limiting
- **Redis** - Distributed rate limiting

### Input Validation
- **Zod** - Schema validation
- **express-validator** - Request validation

---

## 📊 Monitoring & Logging

### Application Logging
- **Winston** - Structured logging
  - File rotation
  - Multiple transports
  - Log levels

### HTTP Logging
- **Morgan** - HTTP request logging

### Error Tracking
- **Custom error handlers** - Centralized error handling
- **Winston** - Error logging to files

---

## 🌐 API & Communication

### REST API
- **Express.js** - RESTful API
- **JSON** - Data format
- **Axios** - HTTP client

### API Documentation
- **Markdown** - API.md file
- **Postman Collections** (optional)

---

## 🎯 Performance Optimization

### Frontend
- **Next.js Image Optimization** - Automatic image optimization
- **Code Splitting** - Automatic route-based splitting
- **Server-Side Rendering** - Faster initial page load
- **Static Generation** - Pre-rendered pages
- **SWR** - Client-side caching

### Backend
- **Redis Caching** - API response caching
- **Database Indexing** - Optimized queries
- **Compression** - Gzip response compression
- **Connection Pooling** - Database connection reuse

### CDN
- **Cloudinary** - Image CDN
- **Next.js CDN** - Static asset delivery

---

## 📱 Browser Support

### Modern Browsers
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Mobile
- iOS Safari (latest 2 versions)
- Chrome Mobile (latest 2 versions)

---

## 🔄 CI/CD (Future)

### Planned Tools
- **GitHub Actions** - Automated testing & deployment
- **Docker Hub** - Container registry
- **Automated Testing** - Jest test suites
- **Code Quality** - ESLint, TypeScript checks

---

## 📈 Analytics (Future)

### Planned Integration
- **Google Analytics** - User analytics
- **Sentry** - Error tracking
- **LogRocket** - Session replay

---

## 🎨 Design System

### Component Library
- **Custom Components** - Built with Radix UI
- **Tailwind CSS** - Utility classes
- **Design Tokens** - Consistent colors, spacing

### Typography
- **System Fonts** - Native font stack
- **Font Optimization** - Next.js font optimization

### Colors
- **Orange** `#f97316` - Primary
- **Pink** `#ec4899` - Secondary
- **Gradients** - Orange to Pink

---

## 📊 Tech Stack Summary

```
┌─────────────────────────────────────────┐
│           FRONTEND STACK                │
├─────────────────────────────────────────┤
│ Next.js 16 + React 19 + TypeScript      │
│ Tailwind CSS + Radix UI + Motion        │
│ Axios + SWR + Zustand                   │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│           BACKEND STACK                 │
├─────────────────────────────────────────┤
│ Node.js 24 + Express + TypeScript       │
│ Drizzle ORM + PostgreSQL                │
│ Redis + BullMQ + JWT                    │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         INFRASTRUCTURE                  │
├─────────────────────────────────────────┤
│ VPS + Nginx + PM2 + Docker              │
│ PostgreSQL + Redis                      │
│ Cloudinary CDN                          │
└─────────────────────────────────────────┘
```

---

## 🎯 Why These Technologies?

### Next.js
- ✅ Server-side rendering for SEO
- ✅ Automatic code splitting
- ✅ Built-in image optimization
- ✅ File-based routing
- ✅ API routes support

### TypeScript
- ✅ Type safety
- ✅ Better IDE support
- ✅ Fewer runtime errors
- ✅ Better refactoring

### PostgreSQL
- ✅ ACID compliance
- ✅ JSON support
- ✅ Mature & stable
- ✅ Great performance
- ✅ Open source

### Redis
- ✅ Fast in-memory cache
- ✅ Session storage
- ✅ Rate limiting
- ✅ Job queue support

### Tailwind CSS
- ✅ Utility-first approach
- ✅ Fast development
- ✅ Small bundle size
- ✅ Responsive design
- ✅ Dark mode support

### Drizzle ORM
- ✅ Type-safe queries
- ✅ Lightweight
- ✅ Great TypeScript support
- ✅ SQL-like syntax
- ✅ Migration support

---

## 📝 Version Requirements

```
Node.js:     >= 24.0.0
npm:         >= 11.0.0
PostgreSQL:  >= 16.0
Redis:       >= 7.0
```

---

## 🔗 Useful Links

- **Next.js**: https://nextjs.org
- **React**: https://react.dev
- **TypeScript**: https://typescriptlang.org
- **Tailwind CSS**: https://tailwindcss.com
- **Drizzle ORM**: https://orm.drizzle.team
- **PostgreSQL**: https://postgresql.org
- **Redis**: https://redis.io
- **Express**: https://expressjs.com

---

## 📦 Installation Commands

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Database
```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio
npm run db:studio
```

---

## 🎓 Learning Resources

### Frontend
- Next.js Documentation
- React Documentation
- Tailwind CSS Documentation
- TypeScript Handbook

### Backend
- Express.js Guide
- Drizzle ORM Documentation
- PostgreSQL Tutorial
- Redis Documentation

---

**Last Updated**: April 2026
**Node Version**: 24.0.0
**Next.js Version**: 16.2.3
**React Version**: 19.2.5
