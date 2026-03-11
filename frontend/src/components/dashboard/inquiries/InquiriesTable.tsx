'use client'

import { Eye, Mail, Phone, CheckCircle, Loader2, MessageSquare, RefreshCw, AlertCircle, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { inquiryService } from '@/services/api'
import { cn } from '@/lib/utils'

interface Inquiry {
  id: number
  name: string
  email: string
  phone: string
  country?: string
  tourInterest?: string
  message: string
  status: string
  createdAt: string
}

const STATUS_STYLES: Record<string, string> = {
  new:       'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  converted: 'bg-green-100 text-green-700',
  closed:    'bg-gray-100 text-gray-600',
}

interface Props {
  search?: string
  statusFilter?: string
  onStatsChange?: (stats: { total: number; new: number; contacted: number; converted: number }) => void
}

export default function InquiriesTable({ search = '', statusFilter = '', onStatsChange }: Props) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusError, setStatusError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchInquiries = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await inquiryService.getAll({ page, limit: 15 })
      const list: Inquiry[] = result.inquiries ?? []
      setInquiries(list)
      setTotal(result.pagination?.total ?? list.length)
      setTotalPages(result.pagination?.totalPages ?? 1)

      onStatsChange?.({
        total:     result.pagination?.total ?? list.length,
        new:       list.filter(i => i.status === 'new').length,
        contacted: list.filter(i => i.status === 'contacted').length,
        converted: list.filter(i => i.status === 'converted').length,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, onStatsChange])

  useEffect(() => { fetchInquiries() }, [fetchInquiries])

  const updateStatus = async (id: number, status: string) => {
    setStatusError('')
    try {
      await inquiryService.updateStatus(id, status)
      fetchInquiries()
    } catch (err: any) {
      setStatusError(err.message || 'Failed to update status')
      setTimeout(() => setStatusError(''), 4000)
    }
  }

  const filtered = inquiries.filter(i => {
    const matchSearch = !search ||
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      (i.tourInterest ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || i.status === statusFilter
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
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <p className="text-red-600 text-sm">{error}</p>
        <button onClick={fetchInquiries} className="flex items-center gap-2 text-sm text-primary-600 hover:underline">
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
        <MessageSquare className="w-10 h-10 opacity-30" />
        <p className="text-sm">No inquiries found</p>
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
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tour Interest</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((inquiry) => (
              <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">{inquiry.name}</p>
                  {inquiry.country && <p className="text-xs text-gray-400">{inquiry.country}</p>}
                </td>
                <td className="px-5 py-4">
                  <p className="text-gray-700">{inquiry.email}</p>
                  {inquiry.phone && <p className="text-xs text-gray-500">{inquiry.phone}</p>}
                </td>
                <td className="px-5 py-4 text-gray-600">
                  {inquiry.tourInterest || <span className="text-gray-300">—</span>}
                </td>
                <td className="px-5 py-4 max-w-[220px]">
                  <p className="text-gray-600 truncate">{inquiry.message}</p>
                </td>
                <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                  {new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-5 py-4">
                  <select
                    value={inquiry.status}
                    onChange={e => updateStatus(inquiry.id, e.target.value)}
                    className={cn(
                      'text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-primary-500 outline-none',
                      STATUS_STYLES[inquiry.status] ?? 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {['new', 'contacted', 'converted', 'closed'].map(s => (
                      <option key={s} value={s} className="bg-white text-gray-900">{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/dashboard/inquiries/${inquiry.id}`}
                      className="p-1.5 hover:bg-primary-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4 text-primary-600" />
                    </Link>
                    <a
                      href={`mailto:${inquiry.email}?subject=Re: Your Inquiry - Ghumo Phiro India`}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Send email"
                    >
                      <Mail className="w-4 h-4 text-gray-500" />
                    </a>
                    {inquiry.phone && (
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Call"
                      >
                        <Phone className="w-4 h-4 text-gray-500" />
                      </a>
                    )}
                    {inquiry.status === 'new' && (
                      <button
                        onClick={() => updateStatus(inquiry.id, 'contacted')}
                        className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark as contacted"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
          <span>{total} total inquiries</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              Prev
            </button>
            <span className="px-3 py-1">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
