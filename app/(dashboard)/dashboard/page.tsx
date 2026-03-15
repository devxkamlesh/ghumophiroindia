import { Calendar, DollarSign, MapPin, MessageSquare, TrendingUp, Users, LucideIcon } from 'lucide-react'
import StatsCard from '@/components/dashboard/analytics/StatsCard'
import RecentBookings from '@/components/dashboard/bookings/RecentBookings'
import PopularToursWidget from '@/components/dashboard/tours/PopularToursWidget'

export const metadata = {
  title: 'Dashboard | Ghumo Phiro India',
  description: 'Admin dashboard for managing tours and bookings',
}

export default function DashboardPage() {
  // TODO: Fetch real data from API
  const stats: Array<{
    title: string
    value: string
    change: string
    trend: 'up' | 'down'
    icon: LucideIcon
    color: 'green' | 'blue' | 'purple' | 'orange' | 'pink' | 'teal'
  }> = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Total Bookings',
      value: '156',
      change: '+12.5%',
      trend: 'up',
      icon: Calendar,
      color: 'blue',
    },
    {
      title: 'Active Tours',
      value: '24',
      change: '+2',
      trend: 'up',
      icon: MapPin,
      color: 'purple',
    },
    {
      title: 'New Inquiries',
      value: '38',
      change: '+8',
      trend: 'up',
      icon: MessageSquare,
      color: 'orange',
    },
    {
      title: 'Total Customers',
      value: '892',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'pink',
    },
    {
      title: 'Conversion Rate',
      value: '68%',
      change: '+5.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'teal',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your tours today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
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
