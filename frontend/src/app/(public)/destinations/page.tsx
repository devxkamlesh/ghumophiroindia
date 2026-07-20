'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Search, Loader2, AlertCircle, ArrowRight, TrendingUp } from 'lucide-react'
import { locationAdminService } from '@/services/api'
import JsonLd from '@/components/JsonLd'
import SeoContentSection from '@/components/public/SeoContentSection'
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo'
import { destinationsContent } from '@/config/seo-content'
import type { LocationNode } from '@/types'

// Static structured data for the destinations listing (SSR-rendered on a client page).
const DEST_JSONLD = [
  itemListJsonLd('India Travel Destinations', '/destinations', [
    { name: 'Jaipur', path: '/destinations/jaipur' },
    { name: 'Udaipur', path: '/destinations/udaipur' },
    { name: 'Jodhpur', path: '/destinations/jodhpur' },
    { name: 'Jaisalmer', path: '/destinations/jaisalmer' },
    { name: 'Pushkar', path: '/destinations/pushkar' },
    { name: 'Bikaner', path: '/destinations/bikaner' },
  ]),
  breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
  ]),
]

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

  // Only states
  const states = locations.filter(l =>
    l.type === 'state' && (!search || l.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <JsonLd data={DEST_JSONLD} />

      {/* Hero */}
      <div className="relative min-h-[420px] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="container-custom relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium px-5 py-2 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              Explore Destinations
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-4">
            Discover Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-orange-300 to-yellow-300">
              Next Adventure
            </span>
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 tracking-wide">
            Pick a state and explore its most iconic tours and experiences across incredible India
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search states…"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 shadow-xl bg-white/95 backdrop-blur-sm"
              />
            </div>
          </div>

          <div>
            <Link href="/destinations/map"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
              <MapPin className="w-4 h-4" /> View on Map
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom py-16">

        {loading && <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>}
        {error && <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"><AlertCircle className="w-4 h-4" />{error}</div>}

        {!loading && !error && states.length === 0 && (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No states found</h3>
            <p className="text-gray-500">{search ? `No results for "${search}"` : 'No states available yet'}</p>
          </div>
        )}

        {states.length > 0 && (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Choose a State</h2>
              <p className="text-gray-500 mt-2">{states.length} {states.length === 1 ? 'state' : 'states'} to explore</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {states.map(state => (
                <DestinationCard key={state.id} location={state} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Long-form SEO content for search + answer engines */}
      <SeoContentSection {...destinationsContent} />
    </div>
  )
}

function DestinationCard({ location }: { location: LocationNode }) {
  const tourCount = location.tourCount ?? 0

  return (
    <Link
      href={`/destinations/${location.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-white border border-gray-200 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative h-60 overflow-hidden">
        <Image
          src={location.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80'}
          alt={location.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-white font-bold text-2xl mb-1">{location.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">
              {tourCount > 0 ? `${tourCount} package${tourCount === 1 ? '' : 's'}` : 'Explore now'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-all group-hover:gap-2.5">
              Explore <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
