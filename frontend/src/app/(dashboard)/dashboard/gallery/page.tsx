'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import {
  Images, Upload, Trash2, FolderOpen, Search, X, Check,
  Copy, ExternalLink, Edit2, FolderPlus, Loader2, AlertCircle,
  Grid3X3, List, ChevronRight, Info, Download, Tag,
  CheckSquare, Square, RefreshCw,
} from 'lucide-react'
import { galleryService, type GalleryImage, type GalleryFolder } from '@/services/api'
import { cn } from '@/lib/utils'

const DEFAULT_FOLDERS = ['general', 'tours', 'destinations', 'rajasthan', 'hero', 'banners']

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function GalleryPage() {
  const [images, setImages]             = useState<GalleryImage[]>([])
  const [folders, setFolders]           = useState<GalleryFolder[]>([])
  const [stats, setStats]               = useState<any>(null)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [activeFolder, setActiveFolder] = useState('general')
  const [search, setSearch]             = useState('')
  const [selected, setSelected]         = useState<Set<string>>(new Set())
  const [viewMode, setViewMode]         = useState<'grid' | 'list'>('grid')
  const [nextCursor, setNextCursor]     = useState<string | null>(null)
  const [loadingMore, setLoadingMore]   = useState(false)
  const [preview, setPreview]           = useState<GalleryImage | null>(null)
  const [showUpload, setShowUpload]     = useState(false)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [copied, setCopied]             = useState('')
  const [moving, setMoving]             = useState(false)

  const loadImages = useCallback(async (folder: string, reset = true) => {
    if (reset) { setLoading(true); setImages([]); setNextCursor(null) }
    else setLoadingMore(true)
    setError('')
    try {
      const result = await galleryService.getImages(folder)
      setImages(prev => reset ? result.images : [...prev, ...result.images])
      setNextCursor(result.nextCursor)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false); setLoadingMore(false) }
  }, [])

  const loadFolders = useCallback(async () => {
    try {
      const [f, s] = await Promise.all([galleryService.getFolders(), galleryService.getStats()])
      setFolders(f)
      setStats(s)
    } catch {}
  }, [])

  useEffect(() => { loadFolders(); loadImages('general') }, [])

  const handleFolderChange = (folder: string) => {
    setActiveFolder(folder)
    setSelected(new Set())
    loadImages(folder)
  }

  const handleRefresh = () => { loadFolders(); loadImages(activeFolder) }

  const toggleSelect = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  const selectAll = () => {
    setSelected(selected.size === images.length ? new Set() : new Set(images.map(i => i.publicId)))
  }

  const handleDelete = async (publicId: string) => {
    if (!confirm('Delete this image from Cloudinary? This cannot be undone.')) return
    await galleryService.delete(publicId)
    setImages(prev => prev.filter(i => i.publicId !== publicId))
    if (preview?.publicId === publicId) setPreview(null)
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Permanently delete ${selected.size} images from Cloudinary?`)) return
    await galleryService.bulkDelete(Array.from(selected))
    setImages(prev => prev.filter(i => !selected.has(i.publicId)))
    setSelected(new Set())
  }

  const handleBulkMove = async (targetFolder: string) => {
    if (!targetFolder) return
    setMoving(true)
    try {
      await galleryService.moveImages(Array.from(selected), targetFolder)
      setImages(prev => prev.filter(i => !selected.has(i.publicId)))
      setSelected(new Set())
      setShowMoveModal(false)
      loadFolders() // Refresh folder list
    } catch (e: any) {
      setError(e.message)
    } finally {
      setMoving(false)
    }
  }

  const handleMoveImage = async (publicId: string, targetFolder: string) => {
    setMoving(true)
    try {
      await galleryService.moveImages([publicId], targetFolder)
      setImages(prev => prev.filter(i => i.publicId !== publicId))
      if (preview?.publicId === publicId) setPreview(null)
      loadFolders()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setMoving(false)
    }
  }

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  const filtered = search
    ? images.filter(i =>
        i.publicId.toLowerCase().includes(search.toLowerCase()) ||
        i.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      )
    : images

  // Combine default folders and Cloudinary folders for modals
  const allFolderPaths = [...DEFAULT_FOLDERS, ...folders.map(f => f.path)]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Images className="w-6 h-6 text-primary-600" /> Gallery
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Upload &amp; manage images via Cloudinary — organised by folder</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRefresh} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowNewFolder(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium">
            <FolderPlus className="w-4 h-4" /> New Folder
          </button>
          <button onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            <Upload className="w-4 h-4" /> Upload Images
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Images', value: stats.totalImages },
            { label: 'Storage Used', value: `${stats.storageMB} MB` },
            { label: 'Transformations', value: stats.transformations },
            { label: 'Bandwidth', value: `${Math.round(stats.bandwidth / 1024 / 1024)} MB` },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-5">
        {/* Folder sidebar */}
        <aside className="w-44 flex-shrink-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Folders</p>
          <div className="space-y-0.5">
            {/* Default folders */}
            {DEFAULT_FOLDERS.map(f => (
              <FolderBtn key={f} name={f} active={activeFolder === f} onClick={() => handleFolderChange(f)} />
            ))}
            {/* Cloudinary folders not in defaults */}
            {folders
              .filter(f => !DEFAULT_FOLDERS.includes(f.path))
              .map(f => {
                // Calculate indentation level based on slashes
                const depth = (f.path.match(/\//g) || []).length
                return (
                  <FolderBtn 
                    key={f.path} 
                    name={f.name} 
                    fullPath={f.path}
                    depth={depth}
                    active={activeFolder === f.path} 
                    onClick={() => handleFolderChange(f.path)} 
                  />
                )
              })}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 relative">
          {/* Moving overlay */}
          {moving && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                <p className="text-sm font-semibold text-gray-700">Moving images...</p>
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or tag…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary-400 outline-none" />
            </div>

            {selected.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">{selected.size} selected</span>
                <button onClick={() => setShowMoveModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                  <FolderOpen className="w-3.5 h-3.5" /> Move
                </button>
                <button onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                <button onClick={() => setSelected(new Set())} className="p-1.5 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-1 ml-auto">
              <button onClick={selectAll} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5 rounded hover:bg-gray-100 flex items-center gap-1">
                {selected.size === filtered.length && filtered.length > 0
                  ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                {selected.size === filtered.length && filtered.length > 0 ? 'Deselect all' : 'Select all'}
              </button>
              <button onClick={() => setViewMode('grid')} className={cn('p-1.5 rounded', viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600')}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={cn('p-1.5 rounded', viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600')}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <Images className="w-14 h-14 mx-auto mb-3 opacity-20" />
              <p className="font-semibold text-gray-500">No images in "{activeFolder}"</p>
              <p className="text-sm mt-1">Click "Upload Images" to add photos</p>
              <button onClick={() => setShowUpload(true)}
                className="mt-4 inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors">
                <Upload className="w-4 h-4" /> Upload Now
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map(img => (
                <ImageCard key={img.publicId} image={img}
                  selected={selected.has(img.publicId)}
                  copied={copied === img.publicId}
                  onSelect={() => toggleSelect(img.publicId)}
                  onPreview={() => setPreview(img)}
                  onDelete={() => handleDelete(img.publicId)}
                  onCopy={() => copyUrl(img.url, img.publicId)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(img => (
                <ImageRow key={img.publicId} image={img}
                  selected={selected.has(img.publicId)}
                  copied={copied === img.publicId}
                  onSelect={() => toggleSelect(img.publicId)}
                  onPreview={() => setPreview(img)}
                  onDelete={() => handleDelete(img.publicId)}
                  onCopy={() => copyUrl(img.url, img.publicId)}
                />
              ))}
            </div>
          )}

          {/* Load more */}
          {nextCursor && (
            <div className="flex justify-center mt-6">
              <button onClick={() => loadImages(activeFolder, false)} disabled={loadingMore}
                className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
                {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                Load more
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showUpload && (
        <UploadModal folder={activeFolder} folders={allFolderPaths}
          onClose={() => setShowUpload(false)}
          onUploaded={() => { setShowUpload(false); loadImages(activeFolder) }}
        />
      )}
      {showNewFolder && (
        <NewFolderModal
          onClose={() => setShowNewFolder(false)}
          onCreated={(name) => { setShowNewFolder(false); loadFolders(); handleFolderChange(name) }}
        />
      )}
      {showMoveModal && (
        <MoveModal
          folders={allFolderPaths}
          currentFolder={activeFolder}
          onClose={() => setShowMoveModal(false)}
          onMove={handleBulkMove}
        />
      )}
      {preview && (
        <PreviewModal image={preview}
          copied={copied === preview.publicId}
          folders={allFolderPaths}
          onClose={() => setPreview(null)}
          onDelete={() => handleDelete(preview.publicId)}
          onCopy={() => copyUrl(preview.url, preview.publicId)}
          onMove={(folder) => handleMoveImage(preview.publicId, folder)}
        />
      )}
    </div>
  )
}

/* ─── Folder Button ─────────────────────────────────────────────────────── */
function FolderBtn({ name, fullPath, depth = 0, active, onClick }: { 
  name: string
  fullPath?: string
  depth?: number
  active: boolean
  onClick: () => void 
}) {
  return (
    <button 
      onClick={onClick} 
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left',
        active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
      style={{ paddingLeft: `${12 + depth * 12}px` }}
      title={fullPath || name}
    >
      <FolderOpen className={cn('w-4 h-4 flex-shrink-0', active ? 'text-primary-500' : 'text-gray-400')} />
      <span className="truncate capitalize">{name}</span>
    </button>
  )
}

/* ─── Image Card (grid) ─────────────────────────────────────────────────── */
function ImageCard({ image, selected, copied, onSelect, onPreview, onDelete, onCopy }: {
  image: GalleryImage; selected: boolean; copied: boolean
  onSelect: () => void; onPreview: () => void; onDelete: () => void; onCopy: () => void
}) {
  return (
    <div className={cn(
      'group relative rounded-xl overflow-hidden border-2 transition-all bg-gray-100 cursor-pointer',
      selected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-transparent hover:border-gray-300'
    )}>
      {/* Checkbox */}
      <button onClick={onSelect}
        className="absolute top-2 left-2 z-10 w-5 h-5 rounded bg-white/80 border border-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
        {selected && <Check className="w-3 h-3 text-primary-600" />}
      </button>
      {selected && (
        <div className="absolute top-2 left-2 z-10 w-5 h-5 rounded bg-primary-600 border border-primary-600 flex items-center justify-center shadow-sm">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Image */}
      <div className="aspect-square relative" onClick={onPreview}>
        <Image src={image.url} alt={image.publicId} fill className="object-cover" sizes="200px" unoptimized />
      </div>

      {/* Hover actions */}
      <div className="absolute top-2 right-2 hidden group-hover:flex flex-col gap-1 z-10">
        <button onClick={onCopy} title={copied ? 'Copied!' : 'Copy URL'}
          className={cn('w-7 h-7 rounded-lg flex items-center justify-center shadow-sm transition-colors',
            copied ? 'bg-green-500 text-white' : 'bg-white/90 hover:bg-white text-gray-600')}>
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <button onClick={onPreview} title="Preview & Details"
          className="w-7 h-7 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-600">
          <Info className="w-3.5 h-3.5" />
        </button>
        <button onClick={onDelete} title="Delete"
          className="w-7 h-7 bg-white/90 hover:bg-red-50 rounded-lg flex items-center justify-center shadow-sm text-red-500">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tags */}
      {image.tags.length > 0 && (
        <div className="px-2 py-1.5 bg-white border-t border-gray-100">
          <p className="text-[10px] text-gray-400 truncate">{image.tags.join(', ')}</p>
        </div>
      )}
    </div>
  )
}

/* ─── Image Row (list) ──────────────────────────────────────────────────── */
function ImageRow({ image, selected, copied, onSelect, onPreview, onDelete, onCopy }: {
  image: GalleryImage; selected: boolean; copied: boolean
  onSelect: () => void; onPreview: () => void; onDelete: () => void; onCopy: () => void
}) {
  const name = image.publicId.split('/').pop() || image.publicId
  const sizeMB = (image.bytes / 1024 / 1024).toFixed(2)
  return (
    <div className={cn('flex items-center gap-4 p-3 bg-white rounded-xl border transition-all',
      selected ? 'border-primary-400 bg-primary-50/30' : 'border-gray-200 hover:border-gray-300')}>
      <input type="checkbox" checked={selected} onChange={onSelect} className="w-4 h-4 accent-primary-600 flex-shrink-0" />
      <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 cursor-pointer" onClick={onPreview}>
        <Image src={image.url} alt={name} fill className="object-cover" sizes="48px" unoptimized />
      </div>
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onPreview}>
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        <p className="text-xs text-gray-400">{image.width}×{image.height} · {sizeMB} MB · {image.format.toUpperCase()}</p>
      </div>
      {image.tags.length > 0 && (
        <div className="hidden md:flex items-center gap-1 flex-shrink-0">
          <Tag className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500 truncate max-w-[120px]">{image.tags.join(', ')}</span>
        </div>
      )}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={onCopy} title={copied ? 'Copied!' : 'Copy URL'}
          className={cn('p-1.5 rounded transition-colors', copied ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100')}>
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <a href={image.url} target="_blank" rel="noreferrer"
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button onClick={onPreview} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
          <Info className="w-3.5 h-3.5" />
        </button>
        <button onClick={onDelete} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

/* ─── Upload Modal ──────────────────────────────────────────────────────── */
function UploadModal({ folder, folders, onClose, onUploaded }: {
  folder: string; folders: string[]
  onClose: () => void; onUploaded: () => void
}) {
  const [files, setFiles]         = useState<File[]>([])
  const [previews, setPreviews]   = useState<string[]>([])
  const [targetFolder, setTargetFolder] = useState(folder)
  const [newFolder, setNewFolder] = useState('')
  const [tags, setTags]           = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress]   = useState(0)
  const [error, setError]         = useState('')
  const [dragging, setDragging]   = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const arr = Array.from(incoming).filter(f => f.type.startsWith('image/'))
    setFiles(prev => [...prev, ...arr])
    arr.forEach(f => {
      const reader = new FileReader()
      reader.onload = e => setPreviews(prev => [...prev, e.target?.result as string])
      reader.readAsDataURL(f)
    })
  }

  const removeFile = (i: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  const handleUpload = async () => {
    if (files.length === 0) { setError('Select at least one image'); return }
    setUploading(true); setError('')
    try {
      const dest = newFolder.trim() || targetFolder
      const tagArr = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []
      await galleryService.upload(files, dest, tagArr, setProgress)
      onUploaded()
    } catch (e: any) { setError(e.message) }
    finally { setUploading(false) }
  }

  return (
    <Modal title="Upload Images" onClose={onClose} wide>
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>}

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-4',
          dragging ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
        )}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-700">Drop images here or click to browse</p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, GIF — max 20 MB each</p>
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => addFiles(e.target.files)} />
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4 max-h-48 overflow-y-auto">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button onClick={() => removeFile(i)}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Folder</label>
          <select value={targetFolder} onChange={e => setTargetFolder(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400 outline-none bg-white">
            {[...new Set(folders)].map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Or New Folder</label>
          <input value={newFolder} onChange={e => setNewFolder(e.target.value)} placeholder="e.g. kerala, goa/beaches"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400 outline-none" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-600 mb-1">Tags (comma separated)</label>
        <input value={tags} onChange={e => setTags(e.target.value)} placeholder="rajasthan, fort, heritage"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400 outline-none" />
      </div>

      {uploading && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Uploading to Cloudinary…</span><span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{files.length} file{files.length !== 1 ? 's' : ''} selected</span>
        <div className="flex gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
          <button onClick={handleUpload} disabled={uploading || files.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50">
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            Upload {files.length > 0 ? `${files.length} image${files.length > 1 ? 's' : ''}` : ''}
          </button>
        </div>
      </div>
    </Modal>
  )
}

/* ─── Preview Modal ─────────────────────────────────────────────────────── */
function PreviewModal({ image, copied, folders, onClose, onDelete, onCopy, onMove }: {
  image: GalleryImage; copied: boolean; folders: string[]
  onClose: () => void; onDelete: () => void; onCopy: () => void; onMove: (folder: string) => void
}) {
  const [showMoveDropdown, setShowMoveDropdown] = useState(false)
  const name    = image.publicId.split('/').pop() || image.publicId
  const sizeMB  = (image.bytes / 1024 / 1024).toFixed(2)
  const sizeKB  = (image.bytes / 1024).toFixed(0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}>

        {/* Image panel */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center min-h-[280px] md:min-h-0 relative">
          <Image src={image.url} alt={name} fill className="object-contain p-4" unoptimized />
        </div>

        {/* Details panel */}
        <div className="w-full md:w-72 flex-shrink-0 flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 truncate pr-2">{name}</h3>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* URL */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Image URL</p>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                <p className="text-xs text-gray-600 truncate flex-1 font-mono">{image.url}</p>
                <button onClick={onCopy}
                  className={cn('flex-shrink-0 p-1 rounded transition-colors', copied ? 'text-green-600' : 'text-gray-400 hover:text-gray-600')}>
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Details */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Details</p>
              <div className="space-y-2">
                {[
                  { label: 'Dimensions', value: `${image.width} × ${image.height} px` },
                  { label: 'Format', value: image.format.toUpperCase() },
                  { label: 'File Size', value: `${sizeMB} MB (${sizeKB} KB)` },
                  { label: 'Folder', value: image.folder },
                  { label: 'Public ID', value: image.publicId },
                  { label: 'Uploaded', value: new Date(image.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-2">
                    <span className="text-xs text-gray-400 flex-shrink-0">{label}</span>
                    <span className="text-xs text-gray-700 font-medium text-right break-all">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {image.tags.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {image.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full font-medium">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-5 py-4 border-t border-gray-100 space-y-2">
            <div className="flex gap-2">
              <button onClick={onCopy}
                className={cn('flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-colors border',
                  copied ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100')}>
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
              <a href={image.url} target="_blank" rel="noreferrer" download
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors">
                <Download className="w-3.5 h-3.5" />
              </a>
              <a href={image.url} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMoveDropdown(!showMoveDropdown)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                Move to Folder
              </button>
              {showMoveDropdown && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-48 overflow-y-auto z-10">
                  {folders.filter(f => f !== image.folder).map(f => (
                    <button
                      key={f}
                      onClick={() => { onMove(f); setShowMoveDropdown(false) }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={onDelete}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
              Delete Image
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Move Modal ────────────────────────────────────────────────────────── */
function MoveModal({ folders, currentFolder, onClose, onMove }: {
  folders: string[]
  currentFolder: string
  onClose: () => void
  onMove: (folder: string) => void
}) {
  const [targetFolder, setTargetFolder] = useState('')
  const [newFolder, setNewFolder] = useState('')
  const [moving, setMoving] = useState(false)

  const handleMove = async () => {
    const dest = newFolder.trim() || targetFolder
    if (!dest || dest === currentFolder) return
    setMoving(true)
    try {
      await onMove(dest)
    } finally {
      setMoving(false)
    }
  }

  return (
    <Modal title="Move Images" onClose={onClose}>
      <p className="text-sm text-gray-600 mb-4">
        Select destination folder for selected images
      </p>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Move to existing folder
          </label>
          <select
            value={targetFolder}
            onChange={e => setTargetFolder(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400 outline-none bg-white"
          >
            <option value="">Select folder...</option>
            {folders.filter(f => f !== currentFolder).map(f => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-400">OR</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Create new folder
          </label>
          <input
            value={newFolder}
            onChange={e => setNewFolder(e.target.value)}
            placeholder="e.g. kerala, goa/beaches, rajasthan/jaipur"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400 outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            Use / for subfolders (e.g. rajasthan/jaipur/forts)
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleMove}
          disabled={moving || (!targetFolder && !newFolder.trim())}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {moving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Moving...
            </>
          ) : (
            <>
              <FolderOpen className="w-3.5 h-3.5" />
              Move Images
            </>
          )}
        </button>
      </div>
    </Modal>
  )
}

/* ─── New Folder Modal ──────────────────────────────────────────────────── */
function NewFolderModal({ onClose, onCreated }: { onClose: () => void; onCreated: (name: string) => void }) {
  const [name, setName]     = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const handleCreate = async () => {
    if (!name.trim()) { setError('Folder name is required'); return }
    setSaving(true); setError('')
    try {
      await galleryService.createFolder(name.trim())
      onCreated(name.trim())
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  return (
    <Modal title="Create New Folder" onClose={onClose}>
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>}
      <label className="block text-xs font-semibold text-gray-600 mb-1">Folder Name</label>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. kerala, goa/beaches"
        onKeyDown={e => e.key === 'Enter' && handleCreate()}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400 outline-none mb-4" />
      <p className="text-xs text-gray-400 mb-4">
        Use / for subfolders (e.g. rajasthan/jaipur)
      </p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
        <button onClick={handleCreate} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50">
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Create Folder
        </button>
      </div>
    </Modal>
  )
}

/* ─── Generic Modal ─────────────────────────────────────────────────────── */
function Modal({ title, onClose, children, wide }: {
  title: string; onClose: () => void; children: React.ReactNode; wide?: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={cn('bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto', wide ? 'max-w-2xl' : 'max-w-md')}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
