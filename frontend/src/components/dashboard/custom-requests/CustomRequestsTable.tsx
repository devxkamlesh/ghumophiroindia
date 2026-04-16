'use client'

import { Eye, Mail, Loader2, Wand2, RefreshCw, AlertCircle, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { customTourService } from '@/services/api'
import { cn } from '@/lib/utils'

interface CustomRequest {
  id: number
  name: string
  email: string
  phone: string
  country: string
  destinations: string[]
  duration: number
  numberOfTravelers: number
  budget: string
  interests?: string[]
  startDate?: string
  additionalInfo?: string
  status: string
  createdAt: string
  updatedAt: string
}

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  quoted:     'bg-purple-100 text-purple-700',
  confirmed:  'bg-green-100 text-green-700',
  rejected:   'bg-red-100 text-red-700',
}

interface Props {
  search?: string
  statusFilter?: string
  onStatsChange?: (stats: { total: number; pending: number; processing: number; confirmed: number }) => void
}

export default function CustomRequestsTable({ search = '', statusFilter = '', onStatsChange }: Props) {
  const [requests, setRequests] = useState<CustomRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusError, setStatusError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await customTourService.getAll({ page, limit: 15 })
      const list: CustomRequest[] = result.requests ?? []
      setRequests(list)
      setTotal(result.pagination?.total ?? list.length)
      setTotalPages(result.pagination?.totalPages ?? 1)

      onStatsChange?.({
        total: result.pagination?.total ?? list.length,
        pending:    list.filter(r => r.status === 'pending').length,
        processing: list.filter(r => r.status === 'processing').length,
        confirmed:  list.filter(r => r.status === 'confirmed').length,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, onStatsChange])

  useEffect(() => { fetchRequests() }, [fetchRequests])

  const updateStatus = async (id: number, status: string) => {
    setStatusError('')
    try {
      await customTourService.updateStatus(id, status)
      fetchRequests()
    } catch (err: any) {
      setStatusError(err.message || 'Failed to update status')
      setTimeout(() => setStatusError(''), 4000)
    }
  }

  // Client-side filter
  const filtered = requests.filter(r => {
    const matchSearch = !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.destinations.some(d => d.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = !statusFilter || r.status === statusFilter
    return matchSearch && matchStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
        <p className="text-red-600 text-sm">{error}</p>
        <button onClick={fetchRequests} className="flex items-center gap-2 text-sm text-primary-600 hover:underline">
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
        <Wand2 className="w-10 h-10 opacity-30" />
        <p className="text-sm">No custom requests found</p>
      </div>
    )
  }

  return (
    <div>
      {statusError && (
        <div className="flex items-center gap-2 mx-5 mt-4 px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {statusError}
          <button onClick={() => setStatusError('')} className="ml-auto"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Destinations</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trip Details</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">{req.name}</p>
                  <p className="text-xs text-gray-500">{req.email}</p>
                  <p className="text-xs text-gray-400">{req.country}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1 max-w-[180px]">
                    {req.destinations.map(d => (
                      <span key={d} className="px-1.5 py-0.5 bg-primary-50 text-primary-700 text-xs rounded">
                        {d}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-gray-700">{req.duration} days · {req.numberOfTravelers} pax</p>
                  {req.startDate && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      From {new Date(req.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                    {req.budget}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                  {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-5 py-4">
                  <select
                    value={req.status}
                    onChange={e => updateStatus(req.id, e.target.value)}
                    className={cn(
                      'text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-primary-500 outline-none',
                      STATUS_STYLES[req.status] ?? 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {['pending','processing','quoted','confirmed','rejected'].map(s => (
                      <option key={s} value={s} className="bg-white text-gray-900">{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/dashboard/custom-requests/${req.id}`}
                      className="p-1.5 hover:bg-primary-50 rounded-lg transition-colors"
                      title="View full details"
                    >
                      <Eye className="w-4 h-4 text-primary-600" />
                    </Link>
                    <a
                      href={`mailto:${req.email}?subject=Your Custom Tour Request - Ghumo Phiro India`}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Send email"
                    >
                      <Mail className="w-4 h-4 text-gray-500" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
          <span>{total} total requests</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="px-3 py-1">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
