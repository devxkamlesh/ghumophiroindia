'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search, Bell, LogOut, User, Settings,
  ExternalLink, ChevronDown, MenuIcon,
  LayoutDashboard, MapPin, Calendar, MessageSquare,
  Wand2, Star, FileText, BarChart3, UserCircle,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { getUser, clearAuth } from '@/lib/auth'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tours', href: '/dashboard/tours', icon: MapPin },
  { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
  { name: 'Inquiries', href: '/dashboard/inquiries', icon: MessageSquare },
  { name: 'Custom Requests', href: '/dashboard/custom-requests', icon: Wand2 },
  { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
  { name: 'Destinations', href: '/dashboard/destinations', icon: MapPin },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Blog', href: '/dashboard/blog', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userName, setUserName] = useState('Admin')
  const [userEmail, setUserEmail] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const user = getUser()
    if (user) {
      setUserName(user.name)
      setUserEmail(user.email)
    }
  }, [])

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
    : 'A'

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16">
      <div className="flex items-center h-full px-4 lg:px-6 gap-4">

        {/* ── Left: mobile menu + logo ── */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile sidebar */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-gray-600">
                <MenuIcon className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="px-5 py-4 border-b border-gray-100">
                <SheetTitle asChild>
                  <Link href="/dashboard" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">GP</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-none">Ghumo Phiro India</p>
                      <p className="text-xs text-orange-500 font-medium mt-0.5">Admin Panel</p>
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              {/* Admin info */}
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
                      Administrator
                    </span>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <nav className="px-3 py-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-200px)]">
                {navigation.map(({ name, href, icon: Icon }) => {
                  const active = pathname === href || pathname?.startsWith(href + '/')
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        active
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-primary-600' : 'text-gray-400')} />
                      {name}
                    </Link>
                  )
                })}
              </nav>

              {/* Bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-gray-100 space-y-1">
                <Link
                  href="/my-account"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors font-medium"
                >
                  <UserCircle className="w-4 h-4" />
                  My Account
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Site
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
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">GP</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-none">Ghumo Phiro India</p>
              <p className="text-xs text-orange-500 font-medium">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* ── Centre: search ── */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tours, bookings, customers…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* ── Right: actions + user ── */}
        <div className="flex items-center gap-2 ml-auto">
          <Link
            href="/"
            target="_blank"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Site
          </Link>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {/* User dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(v => !v)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800 leading-none max-w-[100px] truncate">{userName}</p>
                <p className="text-xs text-orange-500 font-medium mt-0.5">Admin</p>
              </div>
              <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform hidden md:block', showUserMenu && 'rotate-180')} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50">
                {/* Info */}
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                  <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
                    Administrator
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-gray-400" />
                    Dashboard
                  </Link>
                  <Link
                    href="/my-account"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserCircle className="w-4 h-4 text-gray-400" />
                    My Account
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Settings
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
