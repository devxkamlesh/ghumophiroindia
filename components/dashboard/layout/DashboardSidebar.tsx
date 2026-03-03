'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  MessageSquare,
  Wand2,
  Star,
  FileText,
  BarChart3,
  Settings,
  Users,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tours', href: '/dashboard/tours', icon: MapPin },
  { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
  { name: 'Inquiries', href: '/dashboard/inquiries', icon: MessageSquare },
  { name: 'Custom Requests', href: '/dashboard/custom-requests', icon: Wand2 },
  { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
  { name: 'Destinations', href: '/dashboard/destinations', icon: MapPin },
  { name: 'Blog', href: '/dashboard/blog', icon: FileText },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div className="lg:hidden fixed inset-0 bg-black/50 z-40 hidden" id="sidebar-backdrop" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto z-40 hidden lg:block">
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
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

        {/* Quick Stats */}
        <div className="p-4 mt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Active Tours</span>
              <span className="font-bold text-gray-900">24</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Pending Bookings</span>
              <span className="font-bold text-orange-600">8</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">New Inquiries</span>
              <span className="font-bold text-blue-600">12</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
