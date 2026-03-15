'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Search, Loader2, AlertCircle, ArrowRight, Compass } from 'lucide-react'
import { destinationService } from '@/services/api'
import { cn } from '@/lib/utils'
import type { Destination } from '@/types'

const FALLBACK = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80'

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [search,       setSearch]       = useState('')

  useEffect(() => {
    destinationService.getAll()
      .then(setDestinations)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = destinations.filter(d =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.subtitle?.toLowerCase().includes(search.toLowerCase())
  )

  const popular = filtered.filter(d => d.isPopular)
  const others  = filtered.filter(d => !d.isPopular)

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
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations…"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="container-custom py-10 space-y-10">

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No destinations found{search ? ` for "${search}"` : ''}</p>
          </div>
        )}

        {/* Popular destinations */}
        {popular.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Popular Destinations</h2>
                <p className="text-sm text-gray-500 mt-0.5">Most loved by our travelers</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popular.map(d => <DestinationCard key={d.id} destination={d} featured />)}
            </div>
          </section>
        )}

        {/* All destinations */}
        {others.length > 0 && (
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900">All Destinations</h2>
              <p className="text-sm text-gray-500 mt-0.5">{others.length} destination{others.length !== 1 ? 's' : ''} to explore</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {others.map(d => <DestinationCard key={d.id} destination={d} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function DestinationCard({ destination: d, featured }: { destination: Destination; featured?: boolean }) {
  return (
    <Link href={`/destinations/${d.slug}`}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1',
        featured && 'sm:first:col-span-2 sm:first:row-span-1'
      )}>
      {/* Image */}
      <div className={cn('relative overflow-hidden', featured ? 'h-56' : 'h-44')}>
        <Image
          src={d.image || FALLBACK}
          alt={d.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {d.isPopular && (
          <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Popular
          </div>
        )}

        {d.tourCount > 0 && (
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
            {d.tourCount} tour{d.tourCount !== 1 ? 's' : ''}
          </div>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg leading-tight">{d.name}</h3>
          {d.subtitle && <p className="text-white/80 text-xs mt-0.5">{d.subtitle}</p>}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {d.description && (
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{d.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="w-3.5 h-3.5" /> India
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:gap-2 transition-all">
            Explore <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
