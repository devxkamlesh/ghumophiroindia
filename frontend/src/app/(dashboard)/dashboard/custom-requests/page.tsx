import { Search } from 'lucide-react'
import CustomRequestsTable from '@/components/dashboard/custom-requests/CustomRequestsTable'

export const metadata = {
  title: 'Custom Tour Requests | Dashboard',
  description: 'Manage custom tour requests',
}

export default function CustomRequestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Custom Tour Requests</h1>
          <p className="text-gray-600 mt-1">Review and respond to custom tour requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Requests</div>
          <div className="text-2xl font-bold text-gray-900">24</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">New</div>
          <div className="text-2xl font-bold text-blue-600">6</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">In Progress</div>
          <div className="text-2xl font-bold text-yellow-600">12</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Converted</div>
          <div className="text-2xl font-bold text-green-600">6</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, destination, or budget..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="quoted">Quoted</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CustomRequestsTable />
      </div>
    </div>
  )
}
