'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Calendar, User,
  MessageSquare, Settings, LogOut, ExternalLink, Home,
} from 'lucide-react'
import { clearAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/my-account', icon: LayoutDashboard },
  { name: 'My Bookings', href: '/my-account/bookings', icon: Calendar },
  { name: 'Profile', href: '/my-account/profile', icon: User },
  { name: 'Reviews', href: '/my-account/reviews', icon: MessageSquare },
  { name: 'Settings', href: '/my-account/settings', icon: Settings },
]

export default function UserPanelSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col z-40">

      {/* Section label */}
      <div className="px-5 py-3 border-b border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">My Account</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navigation.map(({ name, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-2 pl-[10px]',
                active
                  ? 'bg-primary-50 text-primary-700 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-primary-600' : 'text-gray-400')} />
              {name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-0.5">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors border-l-2 border-transparent pl-[10px]"
        >
          <Home className="w-4 h-4 flex-shrink-0 text-gray-400" />
          Go to Home
        </Link>
        <Link
          href="/tours"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors border-l-2 border-transparent pl-[10px]"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0 text-gray-400" />
          Browse Tours
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors w-full border-l-2 border-transparent pl-[10px]"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign out
        </button>
      </div>

    </aside>
  )
}
