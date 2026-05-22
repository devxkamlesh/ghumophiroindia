'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Search, Loader2, AlertCircle, ArrowRight, Compass, Globe, Building2, Map as MapIcon, Landmark, TrendingUp } from 'lucide-react'
import { locationAdminService } from '@/services/api'
import { cn } from '@/lib/utils'
import type { LocationNode } from '@/types'

export default function DestinationsPage() {
  const [locations, setLocations] = useState<LocationNode[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [search,    setSearch]    = useState('')

  useEffect(() => {
    locationAdminService.getAll()
      .then(all => setLocations(all))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = locations.filter(l =>
    !search || l.name.toLowerCase().includes(search.toLowerCase())
  )

  // Filter by type and isPopular
  const citiesAndPlaces = filtered.filter(l => (l.type === 'city' || l.type === 'place') && l.isPopular)
  const states = filtered.filter(l => l.type === 'state' && l.isPopular)
  const countries = filtered.filter(l => l.type === 'country' && l.isPopular)

  const hasAnyPopular = citiesAndPlaces.length > 0 || states.length > 0 || countries.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* Hero */}
      <div className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 px-4 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />
        </div>

        {/* Accent orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom relative z-10 text-center">
          {/* Eyebrow */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium px-5 py-2 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              Popular Destinations
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-4">
            Discover Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-orange-300 to-yellow-300">
              Next Adventure
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 tracking-wide">
            From the deserts of Rajasthan to the backwaters of Kerala — explore India&apos;s most iconic destinations
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                placeholder="Search destinations…"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 shadow-xl bg-white/95 backdrop-blur-sm" 
              />
            </div>
          </div>

          {/* Map link */}
          <div>
            <Link href="/destinations/map"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
              <MapPin className="w-4 h-4" /> View on Map
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom py-16 space-y-16">

        {loading && <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>}
        {error && <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"><AlertCircle className="w-4 h-4" />{error}</div>}

        {!loading && !hasAnyPopular && (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-500">{search ? `No results for "${search}"` : 'No popular destinations available yet'}</p>
            <p className="text-xs text-gray-400 mt-2">Mark locations as popular in the admin dashboard</p>
          </div>
        )}

        {/* Cities & Places */}
        {citiesAndPlaces.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Cities & Places</h2>
                  <p className="text-sm text-gray-500">Explore vibrant cities and iconic landmarks</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {citiesAndPlaces.length} {citiesAndPlaces.length === 1 ? 'destination' : 'destinations'}
              </span>
            </div>
            <BentoGrid locations={citiesAndPlaces} />
          </section>
        )}

        {/* States */}
        {states.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <MapIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">States & Regions</h2>
                  <p className="text-sm text-gray-500">Discover diverse states across India</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {states.length} {states.length === 1 ? 'state' : 'states'}
              </span>
            </div>
            <BentoGrid locations={states} />
          </section>
        )}

        {/* Countries */}
        {countries.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Countries</h2>
                  <p className="text-sm text-gray-500">Explore international destinations</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {countries.length} {countries.length === 1 ? 'country' : 'countries'}
              </span>
            </div>
            <BentoGrid locations={countries} />
          </section>
        )}
      </div>
    </div>
  )
}

// Bento-style grid layout (1 large featured + up to 4 smaller cards)
function BentoGrid({ locations }: { locations: LocationNode[] }) {
  if (locations.length === 0) return null

  const [featured, ...rest] = locations
  const smallCards = rest.slice(0, 4)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Featured large card */}
      <DestinationCard location={featured} featured />
      
      {/* Smaller cards */}
      {smallCards.map(loc => (
        <DestinationCard key={loc.id} location={loc} />
      ))}
    </div>
  )
}

function DestinationCard({ location, featured }: { location: LocationNode; featured?: boolean }) {
  const typeConfig = {
    country: { icon: Globe, color: 'from-blue-500 to-indigo-600', badge: 'bg-blue-100 text-blue-700' },
    state: { icon: MapIcon, color: 'from-purple-500 to-violet-600', badge: 'bg-purple-100 text-purple-700' },
    city: { icon: Building2, color: 'from-green-500 to-emerald-600', badge: 'bg-green-100 text-green-700' },
    place: { icon: Landmark, color: 'from-orange-500 to-amber-600', badge: 'bg-orange-100 text-orange-700' },
  }

  const config = typeConfig[location.type as keyof typeof typeConfig] || typeConfig.place
  const Icon = config.icon

  return (
    <Link
      href={`/destinations/${location.slug}`}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1',
        featured ? 'md:row-span-2 md:col-span-1' : ''
      )}
    >
      {/* Image */}
      <div className={cn('relative overflow-hidden', featured ? 'h-80 md:h-full' : 'h-64')}>
        <Image
          src={location.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80'}
          alt={location.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Type badge */}
        <div className="absolute top-4 left-4">
          <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md', config.badge)}>
            <Icon className="w-3.5 h-3.5" />
            {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
          </div>
        </div>

        {/* Popular badge */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md border border-white/30">
            <TrendingUp className="w-3 h-3" />
            Popular
          </div>
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className={cn('text-white font-bold mb-1', featured ? 'text-2xl' : 'text-xl')}>
            {location.name}
          </h3>
          {location.path && (
            <p className="text-white/70 text-xs font-mono mb-2">{location.path}</p>
          )}
          {location.description && featured && (
            <p className="text-white/90 text-sm leading-relaxed line-clamp-2 mb-3">
              {location.description}
            </p>
          )}
          
          {/* CTA */}
          <div className="flex items-center justify-between mt-3">
            {location.lat && location.lng ? (
              <div className="flex items-center gap-1 text-xs text-white/70">
                <MapPin className="w-3.5 h-3.5" />
                {Number(location.lat).toFixed(2)}°, {Number(location.lng).toFixed(2)}°
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-white/70">
                <MapPin className="w-3.5 h-3.5" />
                India
              </div>
            )}
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:gap-2.5 transition-all">
              Explore <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
