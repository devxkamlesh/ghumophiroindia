'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Search, Loader2, AlertCircle, ArrowRight, Compass, Globe, Building2, Map as MapIcon } from 'lucide-react'
import { locationAdminService } from '@/services/api'
import { cn } from '@/lib/utils'
import type { LocationNode } from '@/types'

const FALLBACK = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80'

const TYPE_LABEL: Record<string, string> = { country: 'Country', state: 'State', city: 'City', place: 'Place' }
const TYPE_COLOR: Record<string, string> = {
  state: 'bg-purple-100 text-purple-700',
  city:  'bg-green-100 text-green-700',
}

export default function DestinationsPage() {
  const [locations, setLocations] = useState<LocationNode[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [search,    setSearch]    = useState('')

  useEffect(() => {
    locationAdminService.getAll()
      .then(all => setLocations(all.filter(l => l.type === 'city' || l.type === 'state')))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = locations.filter(l =>
    !search || l.name.toLowerCase().includes(search.toLowerCase())
  )

  const cities = filtered.filter(l => l.type === 'city')
  const states = filtered.filter(l => l.type === 'state')

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-green-600 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container-custom relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Compass className="w-3.5 h-3.5" /> Explore India
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Discover Your Next<br />Adventure
          </h1>
          <p className="text-primary-100 text-base md:text-lg mb-8 max-w-xl mx-auto">
            From the deserts of Rajasthan to the backwaters of Kerala — explore India's most iconic destinations
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations…"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg" />
          </div>
          <div className="mt-4">
            <Link href="/destinations/map"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/30">
              <MapPin className="w-4 h-4" /> View on Map
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom py-10 space-y-10">

        {loading && <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>}
        {error && <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"><AlertCircle className="w-4 h-4" />{error}</div>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No destinations found{search ? ` for "${search}"` : ''}</p>
            <p className="text-xs text-gray-400 mt-2">Add locations in the admin dashboard first</p>
          </div>
        )}

        {/* Cities */}
        {cities.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Building2 className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Cities</h2>
              <span className="text-sm text-gray-400">({cities.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cities.map(l => <LocationCard key={l.id} location={l} />)}
            </div>
          </section>
        )}

        {/* States */}
        {states.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <MapIcon className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">States & Regions</h2>
              <span className="text-sm text-gray-400">({states.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {states.map(l => <LocationCard key={l.id} location={l} featured />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function LocationCard({ location: l, featured }: { location: LocationNode; featured?: boolean }) {
  return (
    <Link href={`/destinations/${l.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={cn('relative overflow-hidden', featured ? 'h-52' : 'h-44')}>
        <Image src={l.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80'}
          alt={l.name} fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', TYPE_COLOR[l.type] ?? 'bg-gray-100 text-gray-700')}>
            {TYPE_LABEL[l.type]}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg leading-tight">{l.name}</h3>
          {l.path && <p className="text-white/70 text-xs mt-0.5 font-mono">{l.path}</p>}
        </div>
      </div>
      <div className="p-4">
        {l.description && <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{l.description}</p>}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="w-3.5 h-3.5" />
            {l.lat && l.lng
              ? `${Number(l.lat).toFixed(2)}°N, ${Number(l.lng).toFixed(2)}°E`
              : 'India'}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:gap-2 transition-all">
            Explore <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
