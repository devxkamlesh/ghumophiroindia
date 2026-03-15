import { Package, BookOpen, MessageSquare, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Tours', value: '48', icon: Package, color: 'bg-blue-500' },
    { label: 'Active Bookings', value: '23', icon: BookOpen, color: 'bg-green-500' },
    { label: 'New Inquiries', value: '12', icon: MessageSquare, color: 'bg-yellow-500' },
    { label: 'Revenue (MTD)', value: '$45,230', icon: DollarSign, color: 'bg-purple-500' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="font-medium">Golden Triangle Tour</p>
                <p className="text-sm text-gray-600">John Smith - 2 travelers</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Confirmed</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="font-medium">Jaipur City Tour</p>
                <p className="text-sm text-gray-600">Sarah Johnson - 4 travelers</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Pending</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Inquiries</h2>
          <div className="space-y-4">
            <div className="pb-4 border-b">
              <p className="font-medium">Custom Tour Request</p>
              <p className="text-sm text-gray-600">Marco Rossi - Italy</p>
              <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
            </div>
            <div className="pb-4 border-b">
              <p className="font-medium">Desert Safari Inquiry</p>
              <p className="text-sm text-gray-600">Emma Wilson - UK</p>
              <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
