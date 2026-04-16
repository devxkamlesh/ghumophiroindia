'use client'

import { useState } from 'react'
import { Search, Plus, MapPin, Activity, Star } from 'lucide-react'
import Link from 'next/link'
import ToursTable from '@/components/dashboard/tours/ToursTable'

export default function ToursManagementPage() {
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState({ total: 0, active: 0, featured: 0 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tours</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage all tour packages</p>
        </div>
        <Link
          href="/dashboard/tours/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Tour
        </Link>
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Tours', value: stats.total, icon: MapPin, color: 'text-gray-700', bg: 'bg-gray-50' },
          { label: 'Active', value: stats.active, icon: Activity, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Featured', value: stats.featured, icon: Star, color: 'text-primary-700', bg: 'bg-primary-50' },
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

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tours by name or category…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <ToursTable search={search} onStatsChange={setStats} />
      </div>
    </div>
  )
}
