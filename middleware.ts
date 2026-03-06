import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth/session'
import { canAccessRoute } from '@/lib/auth/permissions'

// Routes that don't require authentication
const publicRoutes = ['/', '/tours', '/about', '/contact', '/custom-tour']

// Auth routes (redirect to dashboard/my-account if already logged in)
const authRoutes = ['/login', '/register', '/forgot-password']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Allow all auth API routes without session check
  if (pathname.startsWith('/api/v1/auth/')) {
    return NextResponse.next()
  }
  
  // Allow public API routes (POST endpoints for bookings, inquiries, custom tours)
  if (
    (pathname.startsWith('/api/tours') && req.method === 'GET') ||
    (pathname.startsWith('/api/bookings') && req.method === 'POST') ||
    (pathname.startsWith('/api/inquiries') && req.method === 'POST') ||
    (pathname.startsWith('/api/custom-tour') && req.method === 'POST')
  ) {
    return NextResponse.next()
  }
  
  const session = await getSessionFromRequest(req)

  // Check if route is public (pages only, API routes handled above)
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith('/tours/')

  // Check if route is auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // If user is logged in and trying to access auth routes, redirect
  if (session && isAuthRoute) {
    const redirectUrl =
      session.role === 'admin'
        ? new URL('/dashboard', req.url)
        : new URL('/my-account', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If route is public, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If user is not logged in and trying to access protected route
  if (!session && !isAuthRoute) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access
  if (session && !canAccessRoute(session.role, pathname)) {
    // If user tries to access admin route, redirect to user panel
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/my-account', req.url))
    }
    // If admin tries to access user panel, allow (admins can access everything)
    // Otherwise, redirect to appropriate panel
    return NextResponse.redirect(
      new URL(session.role === 'admin' ? '/dashboard' : '/my-account', req.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|images|icons|fonts).*)',
  ],
}
