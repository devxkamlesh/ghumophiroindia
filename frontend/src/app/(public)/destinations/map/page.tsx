'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ArrowRight, Globe, Building2, Map as MapIcon, Landmark, Loader2, AlertCircle, List, X } from 'lucide-react'
import { locationAdminService } from '@/services/api'
import { cn } from '@/lib/utils'
import type { LocationNode, LocationType } from '@/types'
import dynamic from 'next/dynamic'

// Lazy load map — it uses browser APIs
const LocationMap = dynamic(() => import('@/components/public/map/LocationMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-gray-100 rounded-2xl h-full">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
    </div>
  ),
})

const TYPE_ICON: Record<LocationType, React.ElementType> = {
  country: Globe, state: MapIcon, city: Building2, place: Landmark,
}
const TYPE_COLOR: Record<LocationType, string> = {
  country: 'text-blue-700 bg-blue-50 border-blue-200',
  state:   'text-purple-700 bg-purple-50 border-purple-200',
  city:    'text-green-700 bg-green-50 border-green-200',
  place:   'text-orange-700 bg-orange-50 border-orange-200',
}

export default function DestinationsMapPage() {
  const [locations,  setLocations]  = useState<LocationNode[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [selected,   setSelected]   = useState<LocationNode | null>(null)
  const [filter,     setFilter]     = useState<LocationType | 'all'>('all')
  const [showList,   setShowList]   = useState(false)

  useEffect(() => {
    locationAdminService.getAll()
      .then(all => setLocations(all.filter(l => l.lat && l.lng)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? locations : locations.filter(l => l.type === filter)

  const counts = {
    all:     locations.length,
    country: locations.filter(l => l.type === 'country').length,
    state:   locations.filter(l => l.type === 'state').length,
    city:    locations.filter(l => l.type === 'city').length,
    place:   locations.filter(l => l.type === 'place').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="container-custom flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Explore India</h1>
            <p className="text-sm text-gray-500">{locations.length} locations on the map</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/destinations"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <List className="w-4 h-4" /> List View
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom py-4">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          {(['all', 'country', 'state', 'city', 'place'] as const).map(t => {
            const Icon = t === 'all' ? MapPin : TYPE_ICON[t as LocationType]
            return (
              <button key={t} onClick={() => setFilter(t)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all',
                  filter === t
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                )}>
                <Icon className="w-3.5 h-3.5" />
                {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1) + 's'}
                <span className={cn('ml-0.5', filter === t ? 'text-primary-200' : 'text-gray-400')}>
                  {counts[t]}
                </span>
              </button>
            )
          })}
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Map */}
          <div className="lg:col-span-2">
            <LocationMap
              locations={filtered}
              height="calc(100vh - 220px)"
              selectedId={selected?.id}
              onLocationClick={loc => setSelected(loc)}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>

            {/* Selected location detail */}
            {selected && (
              <div className="bg-white rounded-2xl border-2 border-primary-200 overflow-hidden">
                {selected.image && (
                  <div className="relative h-36">
                    <Image src={selected.image} alt={selected.name} fill className="object-cover" sizes="400px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <button onClick={() => setSelected(null)}
                      className="absolute top-2 right-2 p-1 bg-black/40 text-white rounded-full hover:bg-black/60">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className={cn('inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border mb-1', TYPE_COLOR[selected.type as LocationType])}>
                        {selected.type}
                      </span>
                      <h3 className="text-base font-bold text-gray-900">{selected.name}</h3>
                      <p className="text-xs text-gray-400 font-mono">{selected.path}</p>
                    </div>
                    {!selected.image && (
                      <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                  {selected.description && (
                    <p className="text-sm text-gray-600 mb-3">{selected.description}</p>
                  )}
                  {selected.lat && selected.lng && (
                    <p className="text-xs text-gray-400 mb-3">
                      {Number(selected.lat).toFixed(4)}°N, {Number(selected.lng).toFixed(4)}°E
                    </p>
                  )}
                  <Link href={`/destinations/${selected.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors">
                    View Tours <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Location list */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No locations with GPS coordinates yet.</p>
                <p className="text-xs text-gray-400 mt-1">Add lat/lng in the Locations admin.</p>
              </div>
            ) : (
              filtered.map(loc => {
                const Icon = TYPE_ICON[loc.type as LocationType] ?? MapPin
                const isSelected = selected?.id === loc.id
                return (
                  <button key={loc.id} onClick={() => setSelected(isSelected ? null : loc)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:shadow-sm',
                      isSelected ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    )}>
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', TYPE_COLOR[loc.type as LocationType])}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{loc.name}</p>
                      <p className="text-xs text-gray-400 font-mono truncate">{loc.path}</p>
                    </div>
                    {loc.lat && loc.lng && (
                      <MapPin className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
