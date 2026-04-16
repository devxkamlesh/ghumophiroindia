'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Plus, Edit, Trash2, ChevronRight, ChevronDown,
  Loader2, AlertCircle, Check, X, MapPin, Globe,
  Building2, Map as MapIcon, Landmark, RefreshCw, Upload, Link2, TrendingUp,
} from 'lucide-react'
import { locationAdminService, uploadService } from '@/services/api'
import { cn } from '@/lib/utils'
import type { LocationNode, LocationType } from '@/types'

// ── Type config ───────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<LocationType, { label: string; icon: React.ElementType; color: string; bg: string; indent: number }> = {
  country: { label: 'Country', icon: Globe,    color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',   indent: 0 },
  state:   { label: 'State',   icon: MapIcon,      color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', indent: 1 },
  city:    { label: 'City',    icon: Building2, color: 'text-green-700',  bg: 'bg-green-50 border-green-200',  indent: 2 },
  place:   { label: 'Place',   icon: Landmark, color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', indent: 3 },
}

const TYPE_ORDER: LocationType[] = ['country', 'state', 'city', 'place']

// ── Build tree from flat list ─────────────────────────────────────────────────
function buildTree(flat: LocationNode[]): LocationNode[] {
  const map = new Map<number, LocationNode>()
  flat.forEach(n => map.set(n.id, { ...n, children: [] }))
  const roots: LocationNode[] = []
  map.forEach(node => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children!.push(node)
    } else {
      roots.push(node)
    }
  })
  return roots
}

// ── Location form modal ───────────────────────────────────────────────────────
const EMPTY: Partial<LocationNode> = { name: '', slug: '', type: 'country', parentId: null, lat: null, lng: null, description: null, image: null, isPopular: false }

function LocationModal({
  initial, allLocations, onSave, onClose,
}: {
  initial?: LocationNode | null
  allLocations: LocationNode[]
  onSave: (data: Partial<LocationNode>) => Promise<void>
  onClose: () => void
}) {
  const [form,   setForm]   = useState<Partial<LocationNode>>(initial ?? { ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const [uploading, setUploading] = useState(false)

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

  const set = (k: keyof LocationNode, v: any) => setForm(p => ({ ...p, [k]: v }))

  // Filter valid parents based on type hierarchy
  const validParents = allLocations.filter(l => {
    const typeIdx = TYPE_ORDER.indexOf(form.type as LocationType)
    const parentTypeIdx = TYPE_ORDER.indexOf(l.type as LocationType)
    return parentTypeIdx === typeIdx - 1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name?.trim()) { setError('Name is required'); return }
    if (!form.slug?.trim()) { setError('Slug is required'); return }
    if (!form.type)         { setError('Type is required'); return }
    if (form.type !== 'country' && !form.parentId) { setError('Parent is required for non-country locations'); return }
    setSaving(true); setError('')
    try { await onSave(form) }
    catch (err: any) { setError(err.message || 'Failed to save'); setSaving(false) }
  }

  const inputCls = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90dvh] overflow-y-auto">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            {initial ? 'Edit Location' : 'Add Location'}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          {/* Type selector */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Type <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-4 gap-2">
              {TYPE_ORDER.map(t => {
                const cfg = TYPE_CONFIG[t]
                const Icon = cfg.icon
                return (
                  <button key={t} type="button"
                    onClick={() => { set('type', t); if (t === 'country') set('parentId', null) }}
                    className={cn(
                      'flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all',
                      form.type === t ? cn(cfg.bg, cfg.color, 'border-current') : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    )}>
                    <Icon className="w-4 h-4" />
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Name + Slug */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Name <span className="text-red-500">*</span></label>
              <input type="text" value={form.name ?? ''} required
                onChange={e => { set('name', e.target.value); if (!initial) set('slug', autoSlug(e.target.value)) }}
                className={inputCls} placeholder="Jaipur" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Slug <span className="text-red-500">*</span></label>
              <input type="text" value={form.slug ?? ''} required
                onChange={e => set('slug', e.target.value)}
                className={inputCls} placeholder="jaipur" />
            </div>
          </div>

          {/* Parent — only for non-country */}
          {form.type !== 'country' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Parent {TYPE_CONFIG[TYPE_ORDER[TYPE_ORDER.indexOf(form.type as LocationType) - 1]]?.label} <span className="text-red-500">*</span>
              </label>
              <select value={form.parentId ?? ''} required
                onChange={e => set('parentId', e.target.value ? Number(e.target.value) : null)}
                className={inputCls}>
                <option value="">Select parent…</option>
                {validParents.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.path})</option>
                ))}
              </select>
              {validParents.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  No {TYPE_CONFIG[TYPE_ORDER[TYPE_ORDER.indexOf(form.type as LocationType) - 1]]?.label.toLowerCase()}s found. Add one first.
                </p>
              )}
            </div>
          )}

          {/* GPS */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Latitude</label>
              <input type="number" step="0.0000001" value={form.lat ?? ''}
                onChange={e => set('lat', e.target.value || null)}
                className={inputCls} placeholder="26.9124" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Longitude</label>
              <input type="number" step="0.0000001" value={form.lng ?? ''}
                onChange={e => set('lng', e.target.value || null)}
                className={inputCls} placeholder="75.7873" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
            <textarea rows={2} value={form.description ?? ''}
              onChange={e => set('description', e.target.value || null)}
              className={inputCls} placeholder="Brief description…" />
          </div>

          {/* Image */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-700">Image</label>
            </div>
            <input type="url" value={form.image ?? ''}
              onChange={e => set('image', e.target.value || null)}
              className={inputCls} placeholder="https://… or upload below" />
            <label className={cn(
              'mt-2 flex items-center justify-center gap-2 border-2 border-dashed rounded-xl p-3 cursor-pointer transition-colors text-xs',
              uploading ? 'border-primary-300 bg-primary-50 text-primary-600' : 'border-gray-200 hover:border-primary-400 text-gray-400 hover:text-primary-600'
            )}>
              <input type="file" accept="image/*" className="hidden"
                onChange={async e => {
                  const file = e.target.files?.[0]; if (!file) return
                  setUploading(true)
                  try { set('image', await uploadService.image(file)) }
                  catch (err: any) { setError(err.message || 'Upload failed') }
                  finally { setUploading(false); e.target.value = '' }
                }}
                disabled={uploading} />
              {uploading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                : <><Upload className="w-4 h-4" /> Upload image</>
              }
            </label>
            {form.image && (
              <div className="mt-2 relative h-20 rounded-xl overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => set('image', null)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Mark as Popular */}
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
            <div className={cn('w-10 h-6 rounded-full transition-colors relative flex-shrink-0', form.isPopular ? 'bg-primary-600' : 'bg-gray-200')}
              onClick={() => set('isPopular', !form.isPopular)}>
              <div className={cn('absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform', form.isPopular ? 'translate-x-5' : 'translate-x-1')} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-primary-600" />
                Mark as Popular
              </p>
              <p className="text-xs text-gray-400">Shows on home page Popular Destinations section</p>
            </div>
          </label>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : initial ? 'Save Changes' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Tree node row ─────────────────────────────────────────────────────────────
function TreeRow({
  node, allFlat, onEdit, onDelete, onAddChild, depth = 0,
}: {
  node: LocationNode
  allFlat: LocationNode[]
  onEdit: (n: LocationNode) => void
  onDelete: (n: LocationNode) => void
  onAddChild: (parent: LocationNode) => void
  depth?: number
}) {
  const [open, setOpen] = useState(depth < 2)
  const cfg  = TYPE_CONFIG[node.type as LocationType] ?? TYPE_CONFIG.place
  const Icon = cfg.icon
  const hasChildren = (node.children?.length ?? 0) > 0
  const canAddChild = node.type !== 'place'

  return (
    <div>
      <div className={cn(
        'flex items-center gap-2 px-3 py-2.5 rounded-xl border mb-1 group transition-colors hover:bg-gray-50',
        cfg.bg
      )}
        style={{ marginLeft: depth * 20 }}>

        {/* Expand toggle */}
        <button type="button" onClick={() => setOpen(o => !o)}
          className="w-5 h-5 flex items-center justify-center flex-shrink-0">
          {hasChildren
            ? open
              ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            : <span className="w-3.5 h-3.5 border-l-2 border-b-2 border-gray-200 rounded-bl ml-1 mb-1" />
          }
        </button>

        {/* Icon + name */}
        <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0', cfg.bg)}>
          <Icon className={cn('w-3.5 h-3.5', cfg.color)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{node.name}</span>
            <span className={cn('text-xs px-1.5 py-0.5 rounded-full border font-medium', cfg.bg, cfg.color)}>
              {cfg.label}
            </span>
            {node.lat && node.lng && (
              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />{Number(node.lat).toFixed(4)}, {Number(node.lng).toFixed(4)}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 font-mono">{node.path}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {canAddChild && (
            <button onClick={() => onAddChild(node)}
              className="p-1.5 hover:bg-white rounded-lg transition-colors" title={`Add child`}>
              <Plus className="w-3.5 h-3.5 text-primary-600" />
            </button>
          )}
          <button onClick={() => onEdit(node)}
            className="p-1.5 hover:bg-white rounded-lg transition-colors" title="Edit">
            <Edit className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button onClick={() => onDelete(node)}
            className="p-1.5 hover:bg-white rounded-lg transition-colors" title="Delete">
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      </div>

      {/* Children */}
      {open && hasChildren && (
        <div>
          {node.children!.map(child => (
            <TreeRow key={child.id} node={child} allFlat={allFlat}
              onEdit={onEdit} onDelete={onDelete} onAddChild={onAddChild} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Delete dialog ─────────────────────────────────────────────────────────────
function DeleteDialog({ name, onConfirm, onCancel, loading }: {
  name: string; onConfirm: () => void; onCancel: () => void; loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-2">Delete Location</h3>
        <p className="text-sm text-gray-500 mb-1">Delete <span className="font-semibold">"{name}"</span>?</p>
        <p className="text-xs text-red-500 mb-6">All child locations will also be deleted.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LocationsPage() {
  const [flat,         setFlat]         = useState<LocationNode[]>([])
  const [tree,         setTree]         = useState<LocationNode[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [modal,        setModal]        = useState<{ mode: 'add'; parent?: LocationNode } | { mode: 'edit'; node: LocationNode } | null>(null)
  const [deleting,     setDeleting]     = useState<LocationNode | null>(null)
  const [deleteLoading,setDeleteLoading]= useState(false)
  const [toast,        setToast]        = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const list = await locationAdminService.getAll()
      setFlat(list)
      setTree(buildTree(list))
    } catch (err: any) {
      setError(err.message || 'Failed to load locations')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (data: Partial<LocationNode>) => {
    if (modal?.mode === 'edit') {
      await locationAdminService.update(modal.node.id, data)
      showToast(`"${data.name}" updated`)
    } else {
      await locationAdminService.create(data)
      showToast(`"${data.name}" added`)
    }
    setModal(null)
    load()
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteLoading(true)
    try {
      await locationAdminService.delete(deleting.id)
      setDeleting(null)
      showToast(`"${deleting.name}" deleted`)
      load()
    } catch (err: any) {
      setError(err.message || 'Failed to delete')
      setDeleting(null)
    } finally { setDeleteLoading(false) }
  }

  // Pre-fill parent when adding child
  const getModalInitial = (): LocationNode | null => {
    if (!modal) return null
    if (modal.mode === 'edit') return modal.node
    if (modal.mode === 'add' && modal.parent) {
      const childType = TYPE_ORDER[TYPE_ORDER.indexOf(modal.parent.type as LocationType) + 1] as LocationType
      return { id: 0, name: '', slug: '', type: childType, parentId: modal.parent.id, path: '', lat: null, lng: null, description: null, image: null, isActive: true, createdAt: '' }
    }
    return null
  }

  const counts = {
    country: flat.filter(l => l.type === 'country').length,
    state:   flat.filter(l => l.type === 'state').length,
    city:    flat.filter(l => l.type === 'city').length,
    place:   flat.filter(l => l.type === 'place').length,
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
        <LocationModal
          initial={getModalInitial()}
          allLocations={flat}
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
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage the India → State → City → Place hierarchy</p>
        </div>
        <button onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Location
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {TYPE_ORDER.map(t => {
          const cfg = TYPE_CONFIG[t]
          const Icon = cfg.icon
          return (
            <div key={t} className={cn('rounded-xl border p-4 flex items-center gap-3', cfg.bg)}>
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', cfg.bg)}>
                <Icon className={cn('w-5 h-5', cfg.color)} />
              </div>
              <div>
                <p className={cn('text-xl font-bold', cfg.color)}>{counts[t]}</p>
                <p className="text-xs text-gray-500">{cfg.label}{counts[t] !== 1 ? 's' : ''}</p>
              </div>
            </div>
          )
        })}
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          <button onClick={load} className="ml-auto flex items-center gap-1 text-xs hover:underline">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Tree */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : tree.length === 0 ? (
          <div className="text-center py-16">
            <Globe className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-2">No locations yet</h3>
            <p className="text-gray-500 text-sm mb-5">Start by adding India as a Country</p>
            <button onClick={() => setModal({ mode: 'add' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium">
              <Plus className="w-4 h-4" /> Add India
            </button>
          </div>
        ) : (
          <div>
            {tree.map(node => (
              <TreeRow
                key={node.id}
                node={node}
                allFlat={flat}
                onEdit={node => setModal({ mode: 'edit', node })}
                onDelete={node => setDeleting(node)}
                onAddChild={parent => setModal({ mode: 'add', parent })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="font-medium">Legend:</span>
        {TYPE_ORDER.map(t => {
          const cfg = TYPE_CONFIG[t]
          const Icon = cfg.icon
          return (
            <span key={t} className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border', cfg.bg, cfg.color)}>
              <Icon className="w-3 h-3" /> {cfg.label}
            </span>
          )
        })}
        <span className="text-gray-400">· Hover a row to see actions · Click + to add child</span>
      </div>
    </div>
  )
}
