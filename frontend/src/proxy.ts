import { NextResponse, type NextRequest } from 'next/server'

/**
 * Server-side route gate (Next 16 "proxy" convention, formerly middleware).
 *
 * Protected areas now require the httpOnly auth cookie to even be served — the
 * page no longer ships to anonymous users who only get redirected after
 * hydration. Role enforcement still happens in the client guards
 * (DashboardGuard / UserPanelGuard) + the server on each API call; this just
 * blocks unauthenticated access early based on cookie presence.
 */
const ACCESS_COOKIE = 'gpi_at'
const REFRESH_COOKIE = 'gpi_rt'

export default function proxy(req: NextRequest) {
  const hasSession =
    req.cookies.has(ACCESS_COOKIE) || req.cookies.has(REFRESH_COOKIE)

  if (!hasSession) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/my-account/:path*'],
}
