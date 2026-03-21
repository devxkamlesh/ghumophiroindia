'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Loader2, AlertCircle, Check, X, Image as ImageIcon, ExternalLink, GripVertical, Eye, EyeOff } from 'lucide-react'
import { bannerService, uploadService } from '@/services/api'
import { cn } from '@/lib/utils'
import type { Banner } from '@/types'

// ── Banner Form Modal ─────────────────────────────────────────────────────────
function BannerModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Banner | null
  onSave: (data: Partial<Banner>) => Promise<void>
  onClose: () => void
}) {
  const [form, setForm] = useState<Partial<Banner>>(
    initial ?? {
      title: '',
      subtitle: '',
      description: '',
      image: '',
      linkUrl: '',
      linkText: 'Book Now',
      displayOrder: 0,
      isActive: true,
    }
  )
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof Banner, v: any) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title?.trim()) {
      setError('Title is required')
      return
    }
    if (!form.image?.trim()) {
      setError('Image is required')
      return
    }

    setSaving(true)
    setError('')
    try {
      await onSave(form)
    } catch (err: any) {
      setError(err.message || 'Failed to save')
      setSaving(false)
    }
  }

  const inputCls = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            {initial ? 'Edit Banner' : 'Add Banner'}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title ?? ''}
              required
              onChange={e => set('title', e.target.value)}
              className={inputCls}
              placeholder="Golden Triangle Tour"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Subtitle</label>
            <input
              type="text"
              value={form.subtitle ?? ''}
              onChange={e => set('subtitle', e.target.value)}
              className={inputCls}
              placeholder="Delhi · Agra · Jaipur"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={form.description ?? ''}
              onChange={e => set('description', e.target.value)}
              className={inputCls}
              placeholder="6 Days, 5 Nights | Starting from ₹24,999"
            />
          </div>

          {/* Image */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-700">
                Image <span className="text-red-500">*</span>
              </label>
            </div>
            <input
              type="url"
              value={form.image ?? ''}
              onChange={e => set('image', e.target.value)}
              className={inputCls}
              placeholder="https://… or upload below"
              required
            />
            <label
              className={cn(
                'mt-2 flex items-center justify-center gap-2 border-2 border-dashed rounded-xl p-3 cursor-pointer transition-colors text-xs',
                uploading
                  ? 'border-primary-300 bg-primary-50 text-primary-600'
                  : 'border-gray-200 hover:border-primary-400 text-gray-400 hover:text-primary-600'
              )}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async e => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setUploading(true)
                  try {
                    set('image', await uploadService.image(file))
                  } catch (err: any) {
                    setError(err.message || 'Upload failed')
                  } finally {
                    setUploading(false)
                    e.target.value = ''
                  }
                }}
                disabled={uploading}
              />
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading…
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" /> Upload image (1920x600 recommended)
                </>
              )}
            </label>
            {form.image && (
              <div className="mt-2 relative h-32 rounded-xl overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => set('image', '')}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Link URL */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Link URL</label>
            <input
              type="url"
              value={form.linkUrl ?? ''}
              onChange={e => set('linkUrl', e.target.value)}
              className={inputCls}
              placeholder="/tours"
            />
          </div>

          {/* Link Text */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Link Text</label>
            <input
              type="text"
              value={form.linkText ?? ''}
              onChange={e => set('linkText', e.target.value)}
              className={inputCls}
              placeholder="Book Now"
            />
          </div>

          {/* Display Order & Active */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Display Order</label>
              <input
                type="number"
                value={form.displayOrder ?? 0}
                onChange={e => set('displayOrder', parseInt(e.target.value))}
                className={inputCls}
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
                <div
                  className={cn(
                    'w-10 h-6 rounded-full transition-colors relative flex-shrink-0',
                    form.isActive ? 'bg-primary-600' : 'bg-gray-200'
                  )}
                  onClick={() => set('isActive', !form.isActive)}
                >
                  <div
                    className={cn(
                      'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
                      form.isActive ? 'translate-x-5' : 'translate-x-1'
                    )}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {form.isActive ? 'Active' : 'Inactive'}
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : initial ? (
                'Save Changes'
              ) : (
                'Add Banner'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Delete Dialog ─────────────────────────────────────────────────────────────
function DeleteDialog({
  title,
  onConfirm,
  onCancel,
  loading,
}: {
  title: string
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-2">Delete Banner</h3>
        <p className="text-sm text-gray-500 mb-6">
          Delete <span className="font-semibold">"{title}"</span>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState<{ mode: 'add' } | { mode: 'edit'; banner: Banner } | null>(null)
  const [deleting, setDeleting] = useState<Banner | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await bannerService.getAll()
      setBanners(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load banners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSave = async (data: Partial<Banner>) => {
    if (modal?.mode === 'edit') {
      await bannerService.update(modal.banner.id, data)
      showToast(`"${data.title}" updated`)
    } else {
      await bannerService.create(data)
      showToast(`"${data.title}" added`)
    }
    setModal(null)
    load()
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteLoading(true)
    try {
      await bannerService.delete(deleting.id)
      setDeleting(null)
      showToast(`"${deleting.title}" deleted`)
      load()
    } catch (err: any) {
      setError(err.message || 'Failed to delete')
      setDeleting(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  const activeBanners = banners.filter(b => b.isActive)
  const inactiveBanners = banners.filter(b => !b.isActive)

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
        <BannerModal
          initial={modal.mode === 'edit' ? modal.banner : null}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {deleting && (
        <DeleteDialog
          title={deleting.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          loading={deleteLoading}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage homepage hero banners</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-blue-600">{banners.length}</p>
            <p className="text-xs text-gray-500">Total Banners</p>
          </div>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
            <Eye className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-green-600">{activeBanners.length}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <EyeOff className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-600">{inactiveBanners.length}</p>
            <p className="text-xs text-gray-500">Inactive</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Banners List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-2">No banners yet</h3>
            <p className="text-gray-500 text-sm mb-5">Create your first homepage banner</p>
            <button
              onClick={() => setModal({ mode: 'add' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add Banner
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {banners.map(banner => (
              <div
                key={banner.id}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl border transition-colors group',
                  banner.isActive
                    ? 'border-green-200 bg-green-50/50 hover:bg-green-50'
                    : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                )}
              >
                {/* Drag Handle */}
                <div className="flex-shrink-0 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                </div>

                {/* Image Preview */}
                <div className="w-32 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{banner.title}</h3>
                    {banner.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <Eye className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        <EyeOff className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </div>
                  {banner.subtitle && <p className="text-xs text-gray-600 mb-0.5">{banner.subtitle}</p>}
                  {banner.description && <p className="text-xs text-gray-500">{banner.description}</p>}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">Order: {banner.displayOrder}</span>
                    {banner.linkUrl && (
                      <a
                        href={banner.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                      >
                        {banner.linkText || 'Link'} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setModal({ mode: 'edit', banner })}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setDeleting(banner)}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <p className="font-medium mb-1">💡 Banner Tips:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Recommended image size: 1920x600 pixels</li>
          <li>Use high-quality images for best results</li>
          <li>Only active banners will show on homepage</li>
          <li>Banners rotate automatically every 4 seconds</li>
          <li>Lower display order shows first</li>
        </ul>
      </div>
    </div>
  )
}
