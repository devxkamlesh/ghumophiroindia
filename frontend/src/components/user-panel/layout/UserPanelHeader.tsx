'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LogOut, User, ChevronDown, ExternalLink,
  LayoutDashboard, Calendar, MessageSquare, Settings, MenuIcon, Home,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { getUser, clearAuth } from '@/lib/auth'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { bookingService } from '@/services/api'
import type { Booking } from '@/types'

const navigation = [
  { name: 'Dashboard', href: '/my-account', icon: LayoutDashboard },
  { name: 'My Bookings', href: '/my-account/bookings', icon: Calendar },
  { name: 'Profile', href: '/my-account/profile', icon: User },
  { name: 'Reviews', href: '/my-account/reviews', icon: MessageSquare },
  { name: 'Settings', href: '/my-account/settings', icon: Settings },
]

export default function UserPanelHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [stats, setStats] = useState({ total: 0, upcoming: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const user = getUser()
    if (user) {
      setUserName(user.name)
      setUserEmail(user.email)
    }
  }, [])

  useEffect(() => {
    bookingService.getMyBookings()
      .then((bookings: Booking[]) => {
        const upcoming = bookings.filter(
          b => new Date(b.startDate) > new Date() && b.status !== 'cancelled'
        ).length
        setStats({ total: bookings.length, upcoming })
      })
      .catch(() => {})
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  const initials = userName
    ? userName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6 gap-4">

        {/* ── Left: mobile menu + logo ── */}
        <div className="flex items-center gap-3">
          {/* Mobile sidebar trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-gray-600">
                <MenuIcon className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="px-5 py-4 border-b border-gray-100">
                <SheetTitle asChild>
                  <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">GP</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-none">Ghumo Phiro India</p>
                      <p className="text-xs text-gray-500 mt-0.5">My Account</p>
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              {/* User info strip */}
              <div className="px-5 py-3 bg-primary-50 border-b border-primary-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-3 text-xs text-gray-600">
                  <span><span className="font-bold text-gray-900">{stats.total}</span> bookings</span>
                  <span><span className="font-bold text-primary-600">{stats.upcoming}</span> upcoming</span>
                </div>
              </div>

              {/* Nav links */}
              <nav className="px-3 py-3 space-y-0.5">
                {navigation.map(({ name, href, icon: Icon }) => {
                  const active = pathname === href
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        active
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {name}
                    </Link>
                  )
                })}
              </nav>

              {/* Bottom actions */}
              <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-gray-100 space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go to Home
                </Link>
                <Link
                  href="/tours"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Browse Tours
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/my-account" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">GP</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-none">Ghumo Phiro India</p>
              <p className="text-xs text-gray-400">My Account</p>
            </div>
          </Link>
        </div>

        {/* ── Right: browse link + user menu ── */}
        <div className="flex items-center gap-2">
          <Link
            href="/tours"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Browse Tours
          </Link>

          {/* User dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(v => !v)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-800 max-w-[180px]">
                {userName}
              </span>
              <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform hidden md:block', showUserMenu && 'rotate-180')} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50">
                {/* User info */}
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                  <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                </div>

                {/* Stats */}
                <div className="px-4 py-2 border-b border-gray-100 flex gap-4 text-xs text-gray-500">
                  <span><span className="font-bold text-gray-800">{stats.total}</span> bookings</span>
                  <span><span className="font-bold text-primary-600">{stats.upcoming}</span> upcoming</span>
                </div>

                {/* Links */}
                <div className="py-1">
                  <Link
                    href="/"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Home className="w-4 h-4 text-gray-400" />
                    Home
                  </Link>
                  <Link
                    href="/my-account"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-gray-400" />
                    Dashboard
                  </Link>
                  <Link
                    href="/my-account/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    Profile
                  </Link>
                  <Link
                    href="/my-account/bookings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-gray-400" />
                    My Bookings
                  </Link>
                </div>

                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  )
}
