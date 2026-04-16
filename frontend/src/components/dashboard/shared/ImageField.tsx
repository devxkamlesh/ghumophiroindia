'use client'

import { useState, useRef } from 'react'
import { Link2, Upload, Trash2, Plus, Loader2, X, ImageIcon } from 'lucide-react'
import { uploadService } from '@/services/api'
import { cn } from '@/lib/utils'
import { toWebP } from '@/lib/image'

const cls = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all'

interface Props {
  images: string[]
  onChange: (images: string[]) => void
}

export function ImageField({ images, onChange }: Props) {
  // 'url' | 'upload' — mutually exclusive per slot
  const [mode, setMode] = useState<'url' | 'upload'>('url')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const updateUrl = (i: number, val: string) => {
    const next = [...images]; next[i] = val; onChange(next)
  }
  const removeUrl = (i: number) => onChange(images.filter((_, idx) => idx !== i))
  const addUrl    = () => onChange([...images, ''])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploadError('')
    setUploading(true)
    try {
      const urls = await Promise.all(files.map(f => uploadService.image(f)))
      // Merge: replace empty slots first, then append
      const next = [...images]
      urls.forEach(url => {
        const emptyIdx = next.findIndex(u => !u.trim())
        if (emptyIdx !== -1) next[emptyIdx] = url
        else next.push(url)
      })
      onChange(next)
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">Images <span className="text-red-500">*</span></label>
        {/* Mode toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all',
              mode === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Link2 className="w-3.5 h-3.5" /> URL
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all',
              mode === 'upload' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
        </div>
      </div>

      {/* URL mode */}
      {mode === 'url' && (
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="url"
                value={img}
                onChange={e => updateUrl(i, e.target.value)}
                className={cls}
                placeholder="https://res.cloudinary.com/… or any image URL"
              />
              {images.length > 1 && (
                <button type="button" onClick={() => removeUrl(i)}
                  className="p-2.5 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addUrl}
            className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add URL
          </button>
        </div>
      )}

      {/* Upload mode */}
      {mode === 'upload' && (
        <div className="space-y-3">
          {/* Drop zone */}
          <label className={cn(
            'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors',
            uploading ? 'border-primary-300 bg-primary-50' : 'border-gray-200 hover:border-primary-400 hover:bg-gray-50'
          )}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                <p className="text-sm text-primary-600 font-medium">Uploading to Cloudinary…</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-600 font-medium">Click to upload images</p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB each</p>
              </>
            )}
          </label>

          {uploadError && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
              <X className="w-3.5 h-3.5 flex-shrink-0" />
              {uploadError}
            </div>
          )}

          {/* Preview uploaded images */}
          {images.filter(u => u.trim()).length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.filter(u => u.trim()).map((url, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={toWebP(url, 400)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeUrl(images.indexOf(url))}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.filter(u => u.trim()).length === 0 && !uploading && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ImageIcon className="w-4 h-4" />
              No images uploaded yet
            </div>
          )}
        </div>
      )}
    </div>
  )
}
