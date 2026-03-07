# Frontend - Ghumo Phiro India

Next.js 16 frontend application with React 19.

## Prerequisites

- **Node.js**: 24.x LTS or higher
- **npm**: 11.x or higher

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local file
cp .env.example .env.local
# Edit .env.local with your API URL

# 3. Start development server
npm run dev
```

Server will start at: `http://localhost:3000`

## Tech Stack

- Next.js 16.2 with App Router
- React 19.2
- TypeScript 5.8
- Tailwind CSS 3.4
- Radix UI Components
- SWR for data fetching
- Zustand for state management

## Build for Production

```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run tests
