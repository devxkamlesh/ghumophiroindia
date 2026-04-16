'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Edit, Trash2, MapPin, TrendingUp, Loader2, RefreshCw, AlertCircle, X, Check } from 'lucide-react'
import { destinationService } from '@/services/api'
import type { Destination } from '@/types'

// ── Delete confirmation dialog ────────────────────────────────────────────────
function DeleteDialog({ name, onConfirm, onCancel, loading }: {
  name: string; onConfirm: () => void; onCancel: () => void; loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-base font-bold text-gray-900 text-center mb-2">Delete Destination</h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete <span className="font-semibold text-gray-700">"{name}"</span>? This cannot be undone.
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

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [deleting,     setDeleting]     = useState<Destination | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast,        setToast]        = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchDestinations = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const list = await destinationService.getAll()
      setDestinations(Array.isArray(list) ? list : [])
    } catch (err: any) {
      setError(err.message || 'Failed to load destinations')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDestinations() }, [fetchDestinations])

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteLoading(true)
    try {
      await destinationService.delete(deleting.id)
      setDeleting(null)
      showToast(`"${deleting.name}" deleted successfully`)
      fetchDestinations()
    } catch (err: any) {
      setDeleting(null)
      setError(err.message || 'Failed to delete destination')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
          <Check className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Delete dialog */}
      {deleting && (
        <DeleteDialog
          name={deleting.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          loading={deleteLoading}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage tour destinations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Destination
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-900">{destinations.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Destinations</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-primary-600">{destinations.filter(d => d.isPopular).length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Popular</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-900">{destinations.reduce((s, d) => s + (d.tourCount ?? 0), 0)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Tours Linked</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={fetchDestinations} className="ml-auto flex items-center gap-1 text-xs hover:underline">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-14 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2">No destinations yet</h3>
          <p className="text-gray-500 text-sm mb-5">Add your first destination to get started</p>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Destination
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map(dest => (
            <div key={dest.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
              {/* Image */}
              <div className="relative h-44 bg-gradient-to-br from-primary-400 to-orange-500 overflow-hidden">
                {dest.image ? (
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="text-white w-10 h-10 opacity-60" />
                  </div>
                )}
                {dest.isPopular && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" /> Popular
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-4">
                <h3 className="text-base font-bold text-gray-900 mb-0.5">{dest.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{dest.subtitle}</p>
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">{dest.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    <span className="font-semibold text-primary-600">{dest.tourCount ?? 0}</span> tours
                  </span>
                  <div className="flex gap-1">
                    <button
                      className="p-1.5 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit destination"
                    >
                      <Edit className="w-4 h-4 text-primary-600" />
                    </button>
                    <button
                      onClick={() => setDeleting(dest)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete destination"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
