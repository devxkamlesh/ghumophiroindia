'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Heart,
  MessageSquare,
  User,
  Settings,
  CreditCard,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/my-account', icon: LayoutDashboard },
  { name: 'My Bookings', href: '/my-account/bookings', icon: Calendar },
  { name: 'Wishlist', href: '/my-account/wishlist', icon: Heart },
  { name: 'My Reviews', href: '/my-account/reviews', icon: MessageSquare },
  { name: 'Profile', href: '/my-account/profile', icon: User },
  { name: 'Payment Methods', href: '/my-account/payments', icon: CreditCard },
  { name: 'Settings', href: '/my-account/settings', icon: Settings },
]

export default function UserPanelSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto z-40 hidden lg:block">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Quick Info */}
      <div className="p-4 mt-6 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Account Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Bookings</span>
            <span className="font-bold text-gray-900">5</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Upcoming Trips</span>
            <span className="font-bold text-primary-600">2</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Wishlist Items</span>
            <span className="font-bold text-gray-900">8</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
