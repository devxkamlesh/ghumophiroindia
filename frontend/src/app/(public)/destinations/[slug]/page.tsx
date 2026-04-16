'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, MapPin, Star, Clock, Users, Search,
  Loader2, AlertCircle, ArrowRight, Filter, SlidersHorizontal,
} from 'lucide-react'
import { destinationService, tourService } from '@/services/api'
import { cn } from '@/lib/utils'
import type { Destination, Tour } from '@/types'

const FALLBACK_DEST = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80'
const FALLBACK_TOUR = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'

function priceNum(p: string | number | null | undefined) {
  if (!p) return 0
  return typeof p === 'string' ? parseFloat(p) || 0 : p
}

const DIFF_STYLE: Record<string, string> = {
  easy:        'bg-green-100 text-green-700',
  moderate:    'bg-amber-100 text-amber-700',
  challenging: 'bg-red-100 text-red-700',
}

export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router   = useRouter()

  const [destination, setDestination] = useState<Destination | null>(null)
  const [tours,       setTours]       = useState<Tour[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [search,      setSearch]      = useState('')
  const [difficulty,  setDifficulty]  = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const dest = await destinationService.getBySlug(slug)
      setDestination(dest)

      // Fetch tours that match this destination name
      const { tours: allTours } = await tourService.getAll({ limit: 100 })
      const matched = allTours.filter(t =>
        (t.destinations ?? []).some(d =>
          d.toLowerCase().includes(dest.name.toLowerCase()) ||
          dest.name.toLowerCase().includes(d.toLowerCase())
        )
      )
      setTours(matched)
    } catch (err: any) {
      setError(err.message || 'Destination not found')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => { load() }, [load])

  const filtered = tours.filter(t => {
    const matchSearch = !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    const matchDiff = !difficulty || t.difficulty === difficulty
    return matchSearch && matchDiff
  })

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    </div>
  )

  if (error || !destination) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-sm px-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-gray-900 mb-2">Destination not found</h2>
        <p className="text-gray-500 text-sm mb-5">{error}</p>
        <Link href="/destinations" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium">
          All Destinations
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative h-[380px] md:h-[460px] overflow-hidden bg-gray-900">
        <Image
          src={destination.image || FALLBACK_DEST}
          alt={destination.name}
          fill className="object-cover opacity-80"
          priority sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <button onClick={() => router.back()}
          className="absolute top-20 left-5 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors border border-white/20">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-8">
          <div className="container-custom">
            {destination.isPopular && (
              <span className="inline-block bg-primary-600 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                Popular Destination
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{destination.name}</h1>
            {destination.subtitle && (
              <p className="text-white/80 text-base">{destination.subtitle}</p>
            )}
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-white/70 text-sm">
                <MapPin className="w-4 h-4" /> India
              </span>
              {destination.tourCount > 0 && (
                <span className="flex items-center gap-1.5 text-white/70 text-sm">
                  <Clock className="w-4 h-4" /> {destination.tourCount} tour{destination.tourCount !== 1 ? 's' : ''} available
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 space-y-8">

        {/* About */}
        {destination.description && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3">About {destination.name}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{destination.description}</p>
          </div>
        )}

        {/* Tours section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Tours in {destination.name}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {filtered.length} tour{filtered.length !== 1 ? 's' : ''} available
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search tours…"
                  className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none w-44"
                />
              </div>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="">All levels</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
              <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No tours found for this destination yet.</p>
              <Link href="/tours" className="inline-flex items-center gap-1.5 mt-4 text-sm text-primary-600 hover:underline">
                Browse all tours <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(tour => <TourCard key={tour.id} tour={tour} />)}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary-600 to-green-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Can't find what you're looking for?</h3>
          <p className="text-primary-100 text-sm mb-5">
            We create custom tours tailored to your preferences and budget.
          </p>
          <Link href="/custom-tour"
            className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
            Plan a Custom Tour <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function TourCard({ tour }: { tour: Tour }) {
  const p      = priceNum(tour.price)
  const rating = tour.rating ? Number(tour.rating) : null
  const img    = tour.images?.[0] || FALLBACK_TOUR

  return (
    <Link href={`/tours/${tour.id}`}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-44 overflow-hidden">
        <Image src={img} alt={tour.title} fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="bg-primary-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full capitalize">
            {tour.category}
          </span>
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full capitalize', DIFF_STYLE[tour.difficulty] ?? 'bg-gray-100 text-gray-700')}>
            {tour.difficulty}
          </span>
        </div>
        {tour.isFeatured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
            ⭐ Featured
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {tour.title}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3">{tour.description}</p>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{tour.duration} days</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Max {tour.maxGroupSize}</span>
          {rating && (
            <span className="flex items-center gap-1 text-yellow-600 font-medium">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400">From</p>
            <p className="text-base font-bold text-gray-900">₹{p.toLocaleString('en-IN')}</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg group-hover:bg-primary-600 group-hover:text-white transition-colors">
            View Tour <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
