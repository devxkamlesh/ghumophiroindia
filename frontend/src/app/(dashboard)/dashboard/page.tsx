'use client'

import { Calendar, DollarSign, MapPin, MessageSquare, TrendingUp, Users, Wand2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import RecentBookings from '@/components/dashboard/bookings/RecentBookings'
import PopularToursWidget from '@/components/dashboard/tours/PopularToursWidget'
import { useEffect, useState } from 'react'
import { bookingService } from '@/services/api'

interface Stats {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  totalRevenue: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookingService.getStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const fmt = (n: number) => loading ? '…' : String(n ?? 0)
  const fmtMoney = (n: number) => loading ? '…' : `₹${Number(n ?? 0).toLocaleString('en-IN')}`

  const cards = [
    { title: 'Total Revenue', value: fmtMoney(stats?.totalRevenue ?? 0), icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { title: 'Total Bookings', value: fmt(stats?.total ?? 0), icon: Calendar, color: 'bg-blue-50 text-blue-600' },
    { title: 'Pending', value: fmt(stats?.pending ?? 0), icon: MapPin, color: 'bg-yellow-50 text-yellow-600' },
    { title: 'Confirmed', value: fmt(stats?.confirmed ?? 0), icon: TrendingUp, color: 'bg-primary-50 text-primary-600' },
    { title: 'Completed', value: fmt(stats?.completed ?? 0), icon: Users, color: 'bg-purple-50 text-purple-600' },
    { title: 'Cancelled', value: fmt(stats?.cancelled ?? 0), icon: MessageSquare, color: 'bg-red-50 text-red-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Here's what's happening with your tours today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(({ title, value, icon: Icon, color }) => (
          <div key={title} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Recent Bookings</h2>
            <Link href="/dashboard/bookings" className="text-sm text-primary-600 hover:underline font-medium">View all</Link>
          </div>
          <RecentBookings />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Top Tours</h2>
            <Link href="/dashboard/tours" className="text-sm text-primary-600 hover:underline font-medium">View all</Link>
          </div>
          <PopularToursWidget />
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/dashboard/tours/new', icon: MapPin, title: 'New Tour', desc: 'Add a tour package' },
            { href: '/dashboard/bookings', icon: Calendar, title: 'Bookings', desc: 'Manage reservations' },
            { href: '/dashboard/inquiries', icon: MessageSquare, title: 'Inquiries', desc: 'Respond to customers' },
            { href: '/dashboard/custom-requests', icon: Wand2, title: 'Custom Requests', desc: 'Review requests' },
          ].map(({ href, icon: Icon, title, desc }) => (
            <Link key={href} href={href}
              className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors">
              <Icon className="w-6 h-6 mb-2" />
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-xs text-primary-100 mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
