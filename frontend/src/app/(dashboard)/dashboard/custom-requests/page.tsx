'use client'

import { useState } from 'react'
import { Search, Wand2, Clock, Loader, CheckCircle } from 'lucide-react'
import CustomRequestsTable from '@/components/dashboard/custom-requests/CustomRequestsTable'

export default function CustomRequestsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [stats, setStats] = useState({ total: 0, pending: 0, processing: 0, confirmed: 0 })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Custom Tour Requests</h1>
        <p className="text-gray-500 mt-1 text-sm">Review and respond to personalised tour requests</p>
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: Wand2, color: 'text-gray-700', bg: 'bg-gray-50' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-700', bg: 'bg-yellow-50' },
          { label: 'Processing', value: stats.processing, icon: Loader, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or destination…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="quoted">Quoted</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <CustomRequestsTable
          search={search}
          statusFilter={statusFilter}
          onStatsChange={setStats}
        />
      </div>
    </div>
  )
}
