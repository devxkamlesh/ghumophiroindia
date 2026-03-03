import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react'
import StatsCard from '@/components/dashboard/analytics/StatsCard'

export const metadata = {
  title: 'Analytics | Dashboard',
  description: 'View detailed analytics and reports',
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-1">Detailed insights into your business performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Revenue This Month"
          value="$45,231"
          change="+20.1%"
          trend="up"
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Bookings This Month"
          value="156"
          change="+12.5%"
          trend="up"
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="New Customers"
          value="89"
          change="+15.3%"
          trend="up"
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Conversion Rate"
          value="68%"
          change="+5.2%"
          trend="up"
          icon={TrendingUp}
          color="teal"
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart will be implemented here</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Bookings by Tour</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart will be implemented here</p>
          </div>
        </div>
      </div>

      {/* More Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Top Performing Tours</h2>
        <div className="space-y-4">
          {[
            { name: 'Golden Triangle Tour', bookings: 45, revenue: '$26,955' },
            { name: 'Jaisalmer Desert Safari', bookings: 38, revenue: '$12,502' },
            { name: 'Udaipur Lake City', bookings: 32, revenue: '$7,968' },
          ].map((tour) => (
            <div key={tour.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold">{tour.name}</div>
                <div className="text-sm text-gray-600">{tour.bookings} bookings</div>
              </div>
              <div className="text-lg font-bold text-green-600">{tour.revenue}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
