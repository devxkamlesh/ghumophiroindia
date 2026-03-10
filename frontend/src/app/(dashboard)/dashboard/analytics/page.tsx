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
          value="₹0"
          change="0%"
          trend="up"
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Bookings This Month"
          value="0"
          change="0%"
          trend="up"
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="New Customers"
          value="0"
          change="0%"
          trend="up"
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Conversion Rate"
          value="0%"
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

      {/* Top Tours */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Top Performing Tours</h2>
        <p className="text-gray-500 text-center py-8">No booking data available yet</p>
      </div>
    </div>
  )
}
