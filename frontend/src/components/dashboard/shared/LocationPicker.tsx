'use client'

import { useEffect, useState } from 'react'
import { Search, X, MapPin, Globe, Map as MapIcon, Building2, Landmark, ChevronRight } from 'lucide-react'
import { locationAdminService } from '@/services/api'
import { cn } from '@/lib/utils'
import type { LocationNode, LocationType } from '@/types'

const TYPE_ICON: Record<LocationType, React.ElementType> = {
  country: Globe, state: MapIcon, city: Building2, place: Landmark,
}
const TYPE_COLOR: Record<LocationType, string> = {
  country: 'text-blue-600 bg-blue-50',
  state:   'text-purple-600 bg-purple-50',
  city:    'text-green-600 bg-green-50',
  place:   'text-orange-600 bg-orange-50',
}

interface Props {
  selectedIds: number[]
  onChange: (ids: number[]) => void
  singleSelect?: boolean
}

export function LocationPicker({ selectedIds, onChange, singleSelect }: Props) {
  const [all,      setAll]      = useState<LocationNode[]>([])
  const [search,   setSearch]   = useState('')
  const [open,     setOpen]     = useState(false)
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    setLoading(true)
    locationAdminService.getAll()
      .then(setAll)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const selected = all.filter(l => selectedIds.includes(l.id))

  const filtered = all.filter(l =>
    !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.path.includes(search.toLowerCase())
  )

  const toggle = (id: number) => {
    if (singleSelect) {
      // Single select: pick one, close dropdown
      onChange(selectedIds.includes(id) ? [] : [id])
      setOpen(false)
    } else {
      if (selectedIds.includes(id)) onChange(selectedIds.filter(i => i !== id))
      else onChange([...selectedIds, id])
    }
  }

  const remove = (id: number) => onChange(selectedIds.filter(i => i !== id))

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {singleSelect ? 'Location' : 'Locations'} <span className="text-xs text-gray-400">({singleSelect ? 'pick one' : 'link to real locations'})</span>
      </label>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map(l => {
            const Icon = TYPE_ICON[l.type as LocationType] ?? MapPin
            return (
              <span key={l.id} className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                TYPE_COLOR[l.type as LocationType] ?? 'text-gray-600 bg-gray-50'
              )}>
                <Icon className="w-3 h-3" />
                {l.name}
                <button type="button" onClick={() => remove(l.id)} className="hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )
          })}
        </div>
      )}

      {/* Dropdown trigger */}
      <div className="relative">
        <button type="button" onClick={() => setOpen(o => !o)}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-primary-400 transition-colors text-left">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>{open ? 'Search locations…' : `${selected.length > 0 ? `${selected.length} selected` : 'Select locations…'}`}</span>
        </button>

        {open && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input autoFocus type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or path…"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto">
              {loading && <p className="text-xs text-gray-400 text-center py-4">Loading…</p>}
              {!loading && filtered.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No locations found. Add them in Locations admin.</p>
              )}
              {filtered.map(l => {
                const Icon = TYPE_ICON[l.type as LocationType] ?? MapPin
                const isSelected = selectedIds.includes(l.id)
                const indent = { country: 0, state: 1, city: 2, place: 3 }[l.type as LocationType] ?? 0
                return (
                  <button key={l.id} type="button" onClick={() => toggle(l.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left',
                      isSelected && 'bg-primary-50'
                    )}
                    style={{ paddingLeft: 12 + indent * 16 }}>
                    <div className={cn('w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0', TYPE_COLOR[l.type as LocationType] ?? 'bg-gray-50 text-gray-500')}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('font-medium truncate', isSelected ? 'text-primary-700' : 'text-gray-900')}>{l.name}</p>
                      <p className="text-xs text-gray-400 font-mono truncate">{l.path}</p>
                    </div>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />}
                  </button>
                )
              })}
            </div>

            <div className="p-2 border-t border-gray-100 flex justify-end">
              <button type="button" onClick={() => setOpen(false)}
                className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-medium">
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
