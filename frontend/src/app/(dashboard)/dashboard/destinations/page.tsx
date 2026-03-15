'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Plus, Edit, Trash2, MapPin, TrendingUp, Loader2,
  RefreshCw, AlertCircle, Check, X, Link2, Upload,
} from 'lucide-react'
import { destinationService, uploadService } from '@/services/api'
import { cn } from '@/lib/utils'
import type { Destination } from '@/types'

// ── Destination form modal ────────────────────────────────────────────────────
const EMPTY_FORM = { name: '', slug: '', subtitle: '', description: '', image: '', isPopular: false }

function DestinationModal({
  initial, onSave, onClose,
}: {
  initial?: Destination | null
  onSave: (data: typeof EMPTY_FORM) => Promise<void>
  onClose: () => void
}) {
  const [form,     setForm]     = useState(initial
    ? { name: initial.name, slug: initial.slug, subtitle: initial.subtitle, description: initial.description, image: initial.image, isPopular: initial.isPopular }
    : { ...EMPTY_FORM })
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [imgMode,  setImgMode]  = useState<'url' | 'upload'>('url')
  const [uploading, setUploading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError('')
    try {
      const url = await uploadService.image(file)
      setForm(p => ({ ...p, image: url }))
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim())        { setError('Name is required'); return }
    if (!form.slug.trim())        { setError('Slug is required'); return }
    if (!form.subtitle.trim())    { setError('Subtitle is required'); return }
    if (!form.description.trim()) { setError('Description is required'); return }
    if (!form.image.trim())       { setError('Image is required'); return }
    setSaving(true); setError('')
    try {
      await onSave(form)
    } catch (err: any) {
      setError(err.message || 'Failed to save')
      setSaving(false)
    }
  }

  const inputCls = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            {initial ? 'Edit Destination' : 'Add Destination'}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          {/* Name + Slug */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Name <span className="text-red-500">*</span></label>
              <input type="text" value={form.name} required
                onChange={e => { set('name')(e); if (!initial) setForm(p => ({ ...p, name: e.target.value, slug: autoSlug(e.target.value) })) }}
                className={inputCls} placeholder="Jaipur" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Slug <span className="text-red-500">*</span></label>
              <input type="text" value={form.slug} required onChange={set('slug')}
                className={inputCls} placeholder="jaipur" />
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Subtitle <span className="text-red-500">*</span></label>
            <input type="text" value={form.subtitle} required onChange={set('subtitle')}
              className={inputCls} placeholder="The Pink City of Rajasthan" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
            <textarea rows={3} value={form.description} required onChange={set('description')}
              className={inputCls} placeholder="Describe this destination…" />
          </div>

          {/* Image — URL or Upload toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-700">Image <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
                {(['url', 'upload'] as const).map(m => (
                  <button key={m} type="button" onClick={() => setImgMode(m)}
                    className={cn('flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                      imgMode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
                    {m === 'url' ? <Link2 className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                    {m === 'url' ? 'URL' : 'Upload'}
                  </button>
                ))}
              </div>
            </div>

            {imgMode === 'url' ? (
              <input type="url" value={form.image} onChange={set('image')}
                className={inputCls} placeholder="https://res.cloudinary.com/…" />
            ) : (
              <label className={cn(
                'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-5 cursor-pointer transition-colors',
                uploading ? 'border-primary-300 bg-primary-50' : 'border-gray-200 hover:border-primary-400 hover:bg-gray-50'
              )}>
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
                {uploading
                  ? <><Loader2 className="w-6 h-6 text-primary-500 animate-spin" /><p className="text-xs text-primary-600">Uploading…</p></>
                  : <><Upload className="w-6 h-6 text-gray-400" /><p className="text-xs text-gray-500">Click to upload image</p></>
                }
              </label>
            )}

            {/* Preview */}
            {form.image && (
              <div className="mt-2 relative h-24 rounded-xl overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setForm(p => ({ ...p, image: '' }))}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Popular toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={cn('w-10 h-6 rounded-full transition-colors relative', form.isPopular ? 'bg-primary-600' : 'bg-gray-200')}
              onClick={() => setForm(p => ({ ...p, isPopular: !p.isPopular }))}>
              <div className={cn('absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform', form.isPopular ? 'translate-x-5' : 'translate-x-1')} />
            </div>
            <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : initial ? 'Save Changes' : 'Add Destination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Delete dialog ─────────────────────────────────────────────────────────────
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
          Delete <span className="font-semibold text-gray-700">"{name}"</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DestinationsPage() {
  const [destinations,  setDestinations]  = useState<Destination[]>([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [modal,         setModal]         = useState<'add' | Destination | null>(null)
  const [deleting,      setDeleting]      = useState<Destination | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast,         setToast]         = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const list = await destinationService.getAll()
      setDestinations(Array.isArray(list) ? list : [])
    } catch (err: any) {
      setError(err.message || 'Failed to load')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (data: typeof EMPTY_FORM) => {
    if (modal === 'add') {
      await destinationService.create(data)
      showToast(`"${data.name}" added successfully`)
    } else if (modal && typeof modal === 'object') {
      await destinationService.update(modal.id, data)
      showToast(`"${data.name}" updated successfully`)
    }
    setModal(null)
    load()
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteLoading(true)
    try {
      await destinationService.delete(deleting.id)
      setDeleting(null)
      showToast(`"${deleting.name}" deleted`)
      load()
    } catch (err: any) {
      setError(err.message || 'Failed to delete')
      setDeleting(null)
    } finally { setDeleteLoading(false) }
  }

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
          <Check className="w-4 h-4" /> {toast}
        </div>
      )}

      {/* Modals */}
      {modal && (
        <DestinationModal
          initial={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {deleting && (
        <DeleteDialog name={deleting.name} onConfirm={handleDelete} onCancel={() => setDeleting(null)} loading={deleteLoading} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage tour destinations</p>
        </div>
        <button onClick={() => setModal('add')}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-900">{destinations.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-primary-600">{destinations.filter(d => d.isPopular).length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Popular</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-900">{destinations.reduce((s, d) => s + (d.tourCount ?? 0), 0)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Tours Linked</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          <button onClick={load} className="ml-auto flex items-center gap-1 text-xs hover:underline">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

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
          <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900 mb-2">No destinations yet</h3>
          <p className="text-gray-500 text-sm mb-5">Add your first destination to get started</p>
          <button onClick={() => setModal('add')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Destination
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map(dest => (
            <div key={dest.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-44 bg-gradient-to-br from-primary-400 to-orange-500 overflow-hidden">
                {dest.image
                  ? <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full flex items-center justify-center"><MapPin className="text-white w-10 h-10 opacity-60" /></div>
                }
                {dest.isPopular && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" /> Popular
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold text-gray-900 mb-0.5">{dest.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{dest.subtitle}</p>
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">{dest.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    <span className="font-semibold text-primary-600">{dest.tourCount ?? 0}</span> tours
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => setModal(dest)}
                      className="p-1.5 hover:bg-primary-50 rounded-lg transition-colors" title="Edit">
                      <Edit className="w-4 h-4 text-primary-600" />
                    </button>
                    <button onClick={() => setDeleting(dest)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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
