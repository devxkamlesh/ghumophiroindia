'use client'

import { Edit, Trash2, Eye, MapPin, Star, Loader2, RefreshCw, X, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { tourService } from '@/services/api'
import { cn } from '@/lib/utils'
import type { Tour } from '@/types'

// ── Delete confirmation dialog ────────────────────────────────────────────────
function DeleteDialog({ title, onConfirm, onCancel, loading }: {
  title: string; onConfirm: () => void; onCancel: () => void; loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-base font-bold text-gray-900 text-center mb-2">Delete Tour</h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Delete <span className="font-semibold text-gray-700">"{title}"</span>?
          This will soft-delete the tour — it won't appear to users but data is preserved.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

interface Props {
  search?: string
  onStatsChange?: (s: { total: number; active: number; featured: number }) => void
}

export default function ToursTable({ search = '', onStatsChange }: Props) {
  const [tours,         setTours]         = useState<Tour[]>([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [page,          setPage]          = useState(1)
  const [totalPages,    setTotalPages]    = useState(1)
  const [total,         setTotal]         = useState(0)
  const [deleteTarget,  setDeleteTarget]  = useState<Tour | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Reset to page 1 when search changes
  useEffect(() => { setPage(1) }, [search])

  const fetchTours = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const result = await tourService.getAll({
        page,
        limit: 15,
        ...(search && { search }),
      })
      const list = result.tours ?? []
      setTours(list)
      setTotal(result.pagination?.total ?? list.length)
      setTotalPages(result.pagination?.totalPages ?? 1)
      onStatsChange?.({
        total:    result.pagination?.total ?? list.length,
        active:   list.filter(t => t.isActive).length,
        featured: list.filter(t => t.isFeatured).length,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, search, onStatsChange])

  useEffect(() => { fetchTours() }, [fetchTours])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await tourService.delete(deleteTarget.id)
      setDeleteTarget(null)
      fetchTours()
    } catch (err: any) {
      setDeleteTarget(null)
      setError(err.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <p className="text-red-600 text-sm">{error}</p>
      <button onClick={fetchTours} className="flex items-center gap-2 text-sm text-primary-600 hover:underline">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  )

  if (tours.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
      <MapPin className="w-10 h-10 opacity-30" />
      <p className="text-sm">{search ? `No tours matching "${search}"` : 'No tours found'}</p>
    </div>
  )

  return (
    <>
      {deleteTarget && (
        <DeleteDialog
          title={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tour</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tours.map(tour => (
              <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">{tour.title}</p>
                  <p className="text-xs text-gray-400 font-mono">{tour.slug}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full capitalize">{tour.category}</span>
                </td>
                <td className="px-5 py-4 text-gray-600">{tour.duration} days</td>
                <td className="px-5 py-4 font-semibold text-gray-900">
                  ₹{Number(tour.price).toLocaleString('en-IN')}
                </td>
                <td className="px-5 py-4">
                  {tour.rating ? (
                    <span className="flex items-center gap-1 text-gray-700">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      {Number(tour.rating).toFixed(1)}
                      <span className="text-xs text-gray-400">({tour.reviewCount ?? 0})</span>
                    </span>
                  ) : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={cn('px-2 py-0.5 text-xs rounded-full w-fit', tour.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                      {tour.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {tour.isFeatured && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-700 w-fit">Featured</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/tours/${tour.slug}`} target="_blank" className="p-1.5 hover:bg-gray-100 rounded-lg" title="View on site">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </Link>
                    <Link href={`/dashboard/tours/${tour.id}`} className="p-1.5 hover:bg-primary-50 rounded-lg" title="Edit">
                      <Edit className="w-4 h-4 text-primary-600" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(tour)}
                      className="p-1.5 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
          <span>{total} total tours</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
            <span className="px-3 py-1">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      )}
    </>
  )
}
