'use client'

import { Calendar, DollarSign, MapPin, MessageSquare, TrendingUp, Users } from 'lucide-react'
import StatsCard from '@/components/dashboard/analytics/StatsCard'
import RecentBookings from '@/components/dashboard/bookings/RecentBookings'
import PopularToursWidget from '@/components/dashboard/tours/PopularToursWidget'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth'

interface DashboardStats {
  bookings?: {
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
  }
  inquiries?: {
    new: number
  }
  customTours?: {
    pending: number
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = getToken()
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
        const response = await fetch(`${apiBase}/bookings/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.status === 401) {
          router.push('/login?redirect=/dashboard')
          return
        }
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [router])

  const statsCards = [
    {
      title: 'Total Revenue',
      value: loading ? '...' : stats ? `$${((stats.bookings?.total || 0) * 500).toLocaleString()}` : '$0',
      change: '+20.1%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'green' as const,
    },
    {
      title: 'Total Bookings',
      value: loading ? '...' : (stats?.bookings?.total?.toString() || '0'),
      change: '+12.5%',
      trend: 'up' as const,
      icon: Calendar,
      color: 'blue' as const,
    },
    {
      title: 'Pending Bookings',
      value: loading ? '...' : (stats?.bookings?.pending?.toString() || '0'),
      change: stats?.bookings?.pending ? `${stats.bookings.pending} pending` : 'None',
      trend: 'up' as const,
      icon: MapPin,
      color: 'purple' as const,
    },
    {
      title: 'New Inquiries',
      value: loading ? '...' : (stats?.inquiries?.new?.toString() || '0'),
      change: stats?.inquiries?.new ? `${stats.inquiries.new} new` : 'None',
      trend: 'up' as const,
      icon: MessageSquare,
      color: 'orange' as const,
    },
    {
      title: 'Custom Tour Requests',
      value: loading ? '...' : (stats?.customTours?.pending?.toString() || '0'),
      change: stats?.customTours?.pending ? `${stats.customTours.pending} pending` : 'None',
      trend: 'up' as const,
      icon: Users,
      color: 'pink' as const,
    },
    {
      title: 'Confirmed Bookings',
      value: loading ? '...' : (stats?.bookings?.confirmed?.toString() || '0'),
      change: `${stats?.bookings?.completed || 0} completed`,
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'teal' as const,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening with your tours today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Bookings</h2>
            <a href="/dashboard/bookings" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </a>
          </div>
          <RecentBookings />
        </div>

        {/* Popular Tours */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Popular Tours</h2>
            <a href="/dashboard/tours" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </a>
          </div>
          <PopularToursWidget />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <a
            href="/dashboard/tours/new"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-colors"
          >
            <MapPin className="w-8 h-8 mb-2" />
            <h3 className="font-semibold">Create Tour</h3>
            <p className="text-sm text-primary-100">Add a new tour package</p>
          </a>
          <a
            href="/dashboard/bookings"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-colors"
          >
            <Calendar className="w-8 h-8 mb-2" />
            <h3 className="font-semibold">View Bookings</h3>
            <p className="text-sm text-primary-100">Manage reservations</p>
          </a>
          <a
            href="/dashboard/inquiries"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-colors"
          >
            <MessageSquare className="w-8 h-8 mb-2" />
            <h3 className="font-semibold">Inquiries</h3>
            <p className="text-sm text-primary-100">Respond to customers</p>
          </a>
          <a
            href="/dashboard/analytics"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-colors"
          >
            <TrendingUp className="w-8 h-8 mb-2" />
            <h3 className="font-semibold">Analytics</h3>
            <p className="text-sm text-primary-100">View detailed reports</p>
          </a>
        </div>
      </div>
    </div>
  )
}
