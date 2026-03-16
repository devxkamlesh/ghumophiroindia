'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, MapPin, Calendar, MessageSquare,
  Wand2, Star, FileText, BarChart3, Settings,
  LogOut, ExternalLink, UserCircle, Globe,
} from 'lucide-react'
import { clearAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

const groups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Content',
    items: [
      { name: 'Tours',        href: '/dashboard/tours',        icon: MapPin },
      { name: 'Destinations', href: '/dashboard/destinations', icon: MapPin },
      { name: 'Locations',    href: '/dashboard/locations',    icon: Globe },
      { name: 'Blog',         href: '/dashboard/blog',         icon: FileText },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
      { name: 'Inquiries', href: '/dashboard/inquiries', icon: MessageSquare },
      { name: 'Custom Requests', href: '/dashboard/custom-requests', icon: Wand2 },
      { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col z-40">

      {/* Admin badge */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-100">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Admin Panel</span>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {groups.map(({ label, items }) => (
          <div key={label}>
            <p className="px-3 mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {label}
            </p>
            <div className="space-y-0.5">
              {items.map(({ name, href, icon: Icon }) => {
                // Exact match for /dashboard, prefix match for sub-routes
                const active = href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === href || pathname?.startsWith(href + '/')

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-2',
                      active
                        ? 'bg-primary-50 text-primary-700 border-primary-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-primary-600' : 'text-gray-400')} />
                    {name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-0.5">
        <Link
          href="/my-account"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors border-l-2 border-transparent"
        >
          <UserCircle className="w-4 h-4 flex-shrink-0" />
          My Account
        </Link>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors border-l-2 border-transparent"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0 text-gray-400" />
          View Live Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors w-full border-l-2 border-transparent"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign out
        </button>
      </div>

    </aside>
  )
}
