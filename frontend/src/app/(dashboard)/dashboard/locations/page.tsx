'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Plus, Edit, Trash2, ChevronRight, ChevronDown,
  Loader2, AlertCircle, Check, X, MapPin, Globe,
  Building2, Map as MapIcon, Landmark, RefreshCw, Upload, Link2, TrendingUp,
  Search, Filter, Download, Eye, EyeOff, Copy, ExternalLink, FileUp,
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
    
    console.log('📝 LocationModal - Form data before save:', form)
    console.log('📝 isPopular in form:', form.isPopular)
    
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
  node, allFlat, onEdit, onDelete, onAddChild, depth = 0, forceExpand = false,
}: {
  node: LocationNode
  allFlat: LocationNode[]
  onEdit: (n: LocationNode) => void
  onDelete: (n: LocationNode) => void
  onAddChild: (parent: LocationNode) => void
  depth?: number
  forceExpand?: boolean
}) {
  const [open, setOpen] = useState(depth < 2)
  const cfg  = TYPE_CONFIG[node.type as LocationType] ?? TYPE_CONFIG.place
  const Icon = cfg.icon
  const hasChildren = (node.children?.length ?? 0) > 0
  const canAddChild = node.type !== 'place'

  // Force expand/collapse from parent
  useEffect(() => {
    if (forceExpand !== undefined) setOpen(forceExpand)
  }, [forceExpand])

  const copyLocationDetails = (loc: LocationNode) => {
    const details = `Name: ${loc.name}\nSlug: ${loc.slug}\nType: ${loc.type}\nPath: ${loc.path}\nLat/Lng: ${loc.lat}, ${loc.lng}\nImage: ${loc.image || 'N/A'}`
    navigator.clipboard.writeText(details)
  }

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
            {node.isPopular && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-300 font-medium flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> Popular
              </span>
            )}
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
          {node.image && (
            <a href={node.image} target="_blank" rel="noopener noreferrer"
              className="p-1.5 hover:bg-white rounded-lg transition-colors" title="View image">
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            </a>
          )}
          <button onClick={() => copyLocationDetails(node)}
            className="p-1.5 hover:bg-white rounded-lg transition-colors" title="Copy details">
            <Copy className="w-3.5 h-3.5 text-gray-600" />
          </button>
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
              onEdit={onEdit} onDelete={onDelete} onAddChild={onAddChild} depth={depth + 1} forceExpand={forceExpand} />
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

// ── CSV Import Modal ──────────────────────────────────────────────────────────
function CSVImportModal({ onClose, onImport, allLocations }: {
  onClose: () => void
  onImport: () => void
  allLocations: LocationNode[]
}) {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<{
    success: LocationNode[]
    failed: { row: number; data: any; error: string }[]
    skipped: { row: number; data: any; reason: string }[]
  } | null>(null)
  const [error, setError] = useState('')

  const parseCSV = (text: string): Partial<LocationNode>[] => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) throw new Error('CSV file is empty or invalid')

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const data: Partial<LocationNode>[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      const row: any = {}

      headers.forEach((header, index) => {
        const value = values[index]
        if (!value) return

        switch (header) {
          case 'name':
            row.name = value
            break
          case 'slug':
            row.slug = value
            break
          case 'type':
            row.type = value as LocationType
            break
          case 'parent':
          case 'parent_slug':
            // Find parent by slug
            const parent = allLocations.find(l => l.slug === value)
            if (parent) row.parentId = parent.id
            break
          case 'parent_id':
            row.parentId = parseInt(value)
            break
          case 'lat':
          case 'latitude':
            row.lat = parseFloat(value)
            break
          case 'lng':
          case 'longitude':
            row.lng = parseFloat(value)
            break
          case 'description':
            row.description = value
            break
          case 'image':
            row.image = value
            break
          case 'is_popular':
          case 'popular':
            row.isPopular = value.toLowerCase() === 'true' || value === '1'
            break
        }
      })

      if (row.name && row.slug && row.type) {
        data.push(row)
      }
    }

    return data
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file')
        return
      }
      setFile(selectedFile)
      setError('')
      setResults(null)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setError('')

    try {
      const text = await file.text()
      const locations = parseCSV(text)

      if (locations.length === 0) {
        setError('No valid locations found in CSV')
        setImporting(false)
        return
      }

      const importResults = await locationAdminService.bulkImport(locations)
      setResults(importResults)

      if (importResults.success.length > 0) {
        onImport()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to import CSV')
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const template = `name,slug,type,parent_slug,lat,lng,description,image,is_popular
Rajasthan,rajasthan,state,india,26.9124,75.7873,The Land of Kings,https://example.com/image.jpg,true
Jaipur,jaipur,city,rajasthan,26.9124,75.7873,The Pink City,https://example.com/jaipur.jpg,true
Hawa Mahal,hawa-mahal,place,jaipur,26.9239,75.8267,Palace of Winds,https://example.com/hawa.jpg,true`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'location_import_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget && !importing) onClose() }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90dvh] overflow-y-auto">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Import Locations from CSV</h2>
          <button onClick={onClose} disabled={importing} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          {!results ? (
            <>
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">CSV Format</h3>
                <p className="text-xs text-blue-700 mb-3">
                  Your CSV file should have these columns: <code className="bg-blue-100 px-1 py-0.5 rounded">name, slug, type, parent_slug, lat, lng, description, image, is_popular</code>
                </p>
                <button onClick={downloadTemplate}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium">
                  <Download className="w-3.5 h-3.5" /> Download Template
                </button>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={importing}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50"
                />
                {file && (
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {/* Import Button */}
              <div className="flex gap-3 pt-2">
                <button onClick={onClose} disabled={importing}
                  className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={handleImport} disabled={!file || importing}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                  {importing ? <><Loader2 className="w-4 h-4 animate-spin" />Importing…</> : <><FileUp className="w-4 h-4" />Import Locations</>}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Results */}
              <div className="space-y-3">
                {/* Success */}
                {results.success.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <h3 className="text-sm font-semibold text-green-900">
                        Successfully Imported: {results.success.length}
                      </h3>
                    </div>
                    <div className="max-h-32 overflow-y-auto text-xs text-green-700 space-y-1">
                      {results.success.map((loc, i) => (
                        <div key={i}>✓ {loc.name} ({loc.type})</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skipped */}
                {results.skipped.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <h3 className="text-sm font-semibold text-amber-900">
                        Skipped: {results.skipped.length}
                      </h3>
                    </div>
                    <div className="max-h-32 overflow-y-auto text-xs text-amber-700 space-y-1">
                      {results.skipped.map((item, i) => (
                        <div key={i}>Row {item.row}: {item.data.name} - {item.reason}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Failed */}
                {results.failed.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <X className="w-5 h-5 text-red-600" />
                      <h3 className="text-sm font-semibold text-red-900">
                        Failed: {results.failed.length}
                      </h3>
                    </div>
                    <div className="max-h-32 overflow-y-auto text-xs text-red-700 space-y-1">
                      {results.failed.map((item, i) => (
                        <div key={i}>Row {item.row}: {item.data.name} - {item.error}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button onClick={onClose}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold">
                Close
              </button>
            </>
          )}
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
  const [searchQuery,  setSearchQuery]  = useState('')
  const [filterType,   setFilterType]   = useState<LocationType | 'all'>('all')
  const [showPopularOnly, setShowPopularOnly] = useState(false)
  const [expandAll,    setExpandAll]    = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

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

  // Filter and search logic
  const filteredFlat = flat.filter(loc => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!loc.name.toLowerCase().includes(q) && 
          !loc.path.toLowerCase().includes(q) &&
          !loc.slug.toLowerCase().includes(q)) {
        return false
      }
    }
    // Type filter
    if (filterType !== 'all' && loc.type !== filterType) return false
    // Popular filter
    if (showPopularOnly && !loc.isPopular) return false
    return true
  })

  const filteredTree = buildTree(filteredFlat)

  // Export to CSV
  const handleExport = () => {
    const headers = ['ID', 'Name', 'Slug', 'Type', 'Parent ID', 'Path', 'Latitude', 'Longitude', 'Description', 'Image', 'Is Popular']
    const rows = flat.map(loc => [
      loc.id,
      loc.name,
      loc.slug,
      loc.type,
      loc.parentId || '',
      loc.path,
      loc.lat || '',
      loc.lng || '',
      loc.description || '',
      loc.image || '',
      loc.isPopular ? 'Yes' : 'No'
    ])
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `locations-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Exported to CSV')
  }

  // Copy location details
  const copyLocationDetails = (loc: LocationNode) => {
    const details = `Name: ${loc.name}\nSlug: ${loc.slug}\nType: ${loc.type}\nPath: ${loc.path}\nLat/Lng: ${loc.lat}, ${loc.lng}\nImage: ${loc.image || 'N/A'}`
    navigator.clipboard.writeText(details)
    showToast('Copied to clipboard')
  }

  const handleSave = async (data: Partial<LocationNode>) => {
    console.log('🔍 Frontend handleSave - Data being sent:', data)
    console.log('🔍 isPopular value:', data.isPopular)
    
    if (modal?.mode === 'edit') {
      console.log('🔍 Updating location ID:', modal.node.id)
      await locationAdminService.update(modal.node.id, data)
      showToast(`"${data.name}" updated`)
    } else {
      console.log('🔍 Creating new location')
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
      return { id: 0, name: '', slug: '', type: childType, parentId: modal.parent.id, path: '', lat: null, lng: null, description: null, image: null, isActive: true, isPopular: false, createdAt: '' }
    }
    return null
  }

  const counts = {
    country: flat.filter(l => l.type === 'country').length,
    state:   flat.filter(l => l.type === 'state').length,
    city:    flat.filter(l => l.type === 'city').length,
    place:   flat.filter(l => l.type === 'place').length,
    popular: flat.filter(l => l.isPopular).length,
    total:   flat.length,
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
      {showImportModal && (
        <CSVImportModal
          onClose={() => setShowImportModal(false)}
          onImport={() => { load(); showToast('Locations imported successfully') }}
          allLocations={flat}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage the India → State → City → Place hierarchy · {counts.total} total locations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            <FileUp className="w-4 h-4" /> Import CSV
          </button>
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setModal({ mode: 'add' })}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Location
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-3">
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
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <p className="text-xl font-bold text-amber-700">{counts.popular}</p>
            <p className="text-xs text-gray-500">Popular</p>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-700">{counts.total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, slug, or path..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded">
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as LocationType | 'all')}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
              <option value="all">All Types</option>
              {TYPE_ORDER.map(t => (
                <option key={t} value={t}>{TYPE_CONFIG[t].label}s</option>
              ))}
            </select>
          </div>

          {/* Popular Filter */}
          <button
            onClick={() => setShowPopularOnly(!showPopularOnly)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              showPopularOnly
                ? 'bg-amber-100 text-amber-700 border border-amber-300'
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
            )}>
            <TrendingUp className="w-4 h-4" />
            Popular Only
          </button>

          {/* Expand/Collapse All */}
          <button
            onClick={() => setExpandAll(!expandAll)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-lg text-sm font-medium transition-colors">
            {expandAll ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {expandAll ? 'Collapse' : 'Expand'} All
          </button>
        </div>

        {/* Active Filters Summary */}
        {(searchQuery || filterType !== 'all' || showPopularOnly) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                Type: {TYPE_CONFIG[filterType].label}s
                <button onClick={() => setFilterType('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {showPopularOnly && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs">
                Popular Only
                <button onClick={() => setShowPopularOnly(false)}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={() => { setSearchQuery(''); setFilterType('all'); setShowPopularOnly(false) }}
              className="ml-auto text-xs text-gray-500 hover:text-gray-700 hover:underline">
              Clear all
            </button>
          </div>
        )}

        {/* Results count */}
        {filteredFlat.length !== flat.length && (
          <p className="text-xs text-gray-500 mt-3">
            Showing {filteredFlat.length} of {flat.length} locations
          </p>
        )}
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
        ) : filteredTree.length === 0 ? (
          <div className="text-center py-16">
            {flat.length === 0 ? (
              <>
                <Globe className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-900 mb-2">No locations yet</h3>
                <p className="text-gray-500 text-sm mb-5">Start by adding India as a Country</p>
                <button onClick={() => setModal({ mode: 'add' })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium">
                  <Plus className="w-4 h-4" /> Add India
                </button>
              </>
            ) : (
              <>
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500 text-sm mb-5">Try adjusting your search or filters</p>
                <button
                  onClick={() => { setSearchQuery(''); setFilterType('all'); setShowPopularOnly(false) }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium">
                  <X className="w-4 h-4" /> Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div>
            {filteredTree.map(node => (
              <TreeRow
                key={node.id}
                node={node}
                allFlat={flat}
                onEdit={node => setModal({ mode: 'edit', node })}
                onDelete={node => setDeleting(node)}
                onAddChild={parent => setModal({ mode: 'add', parent })}
                forceExpand={expandAll}
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
