'use client'

import { Eye, Mail, Loader2, Calendar, RefreshCw, AlertCircle, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { bookingService } from '@/services/api'
import { cn } from '@/lib/utils'
import type { Booking, BookingStatus } from '@/types'

const STATUS_STYLES: Record<BookingStatus, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
}

interface Props {
  search?: string
  statusFilter?: string
  onStatsChange?: (s: { total: number; pending: number; confirmed: number; cancelled: number }) => void
}

export default function BookingsTable({ search = '', statusFilter = '', onStatsChange }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusError, setStatusError] = useState('')
  const [page,          setPage]          = useState(1)
  const [totalPages,    setTotalPages]    = useState(1)
  const [total,         setTotal]         = useState(0)

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [search, statusFilter])

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await bookingService.getAll({
        page,
        limit: 15,
        ...(statusFilter && { status: statusFilter }),
      })
      const list = result.bookings ?? []
      setBookings(list)
      setTotal(result.pagination?.total ?? list.length)
      setTotalPages(result.pagination?.totalPages ?? 1)
      // Stats: fetch unfiltered total for accurate counts
      onStatsChange?.({
        total:     result.pagination?.total ?? list.length,
        pending:   list.filter(b => b.status === 'pending').length,
        confirmed: list.filter(b => b.status === 'confirmed').length,
        cancelled: list.filter(b => b.status === 'cancelled').length,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, onStatsChange])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const updateStatus = async (id: number, status: string) => {
    setStatusError('')
    try {
      await bookingService.updateStatus(id, status)
      fetchBookings()
    } catch (err: any) {
      setStatusError(err.message || 'Failed to update status')
      setTimeout(() => setStatusError(''), 4000)
    }
  }

  const filtered = bookings.filter(b => {
    const matchSearch = !search ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      String(b.id).includes(search)
    const matchStatus = !statusFilter || b.status === statusFilter
    return matchSearch && matchStatus
  })

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <p className="text-red-600 text-sm">{error}</p>
      <button onClick={fetchBookings} className="flex items-center gap-2 text-sm text-primary-600 hover:underline">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  )

  if (filtered.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
      <Calendar className="w-10 h-10 opacity-30" />
      <p className="text-sm">No bookings found</p>
    </div>
  )

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
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tour</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Travelers</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(b => (
              <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 text-gray-400 font-mono text-xs">#{b.id}</td>
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">{b.customerName}</p>
                  <p className="text-xs text-gray-500">{b.customerEmail}</p>
                </td>
                <td className="px-5 py-4 text-gray-700">
                  {b.tour?.title ?? `Tour #${b.tourId}`}
                </td>
                <td className="px-5 py-4 text-gray-500 text-xs">
                  <p>{new Date(b.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <p className="text-gray-400">→ {new Date(b.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </td>
                <td className="px-5 py-4 text-gray-700">{b.numberOfTravelers}</td>
                <td className="px-5 py-4 font-semibold text-gray-900">
                  ₹{Number(b.totalPrice).toLocaleString('en-IN')}
                </td>
                <td className="px-5 py-4">
                  <select
                    value={b.status}
                    onChange={e => updateStatus(b.id, e.target.value)}
                    className={cn(
                      'text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-primary-500 outline-none',
                      STATUS_STYLES[b.status] ?? 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {['pending','confirmed','completed','cancelled'].map(s => (
                      <option key={s} value={s} className="bg-white text-gray-900">{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/dashboard/bookings/${b.id}`} className="p-1.5 hover:bg-primary-50 rounded-lg" title="View">
                      <Eye className="w-4 h-4 text-primary-600" />
                    </Link>
                    <a href={`mailto:${b.customerEmail}`} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Email">
                      <Mail className="w-4 h-4 text-gray-500" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
          <span>{total} total bookings</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
            <span className="px-3 py-1">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
