'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, MapPin, Star, Clock, Users, Search,
  Loader2, AlertCircle, ArrowRight, Globe, Building2, Map as MapIcon, Landmark,
  Hotel, Bus, UtensilsCrossed, Binoculars, Flame, MessageCircle,
} from 'lucide-react'
import { locationAdminService } from '@/services/api'
import { cn } from '@/lib/utils'
import type { LocationNode, Tour } from '@/types'
import dynamic from 'next/dynamic'

const LocationMap = dynamic(() => import('@/components/public/map/LocationMap'), { ssr: false })

const FALLBACK = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80'
const FALLBACK_TOUR = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'

const TYPE_ICON: Record<string, React.ElementType> = { country: Globe, state: MapIcon, city: Building2, place: Landmark }
const TYPE_COLOR: Record<string, string> = {
  country: 'text-blue-700 bg-blue-50 border-blue-200',
  state:   'text-purple-700 bg-purple-50 border-purple-200',
  city:    'text-green-700 bg-green-50 border-green-200',
  place:   'text-orange-700 bg-orange-50 border-orange-200',
}

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

  const [location, setLocation] = useState<LocationNode | null>(null)
  const [tours,    setTours]    = useState<Tour[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [search,   setSearch]   = useState('')
  const [difficulty, setDifficulty] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const loc = await locationAdminService.getBySlug(slug)
      setLocation(loc)
      const tourList = await locationAdminService.getTours(loc.id)
      setTours(tourList)
    } catch (err: any) {
      setError(err.message || 'Destination not found')
    } finally { setLoading(false) }
  }, [slug])

  useEffect(() => { load() }, [load])

  const filtered = tours.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase())
    const matchDiff   = !difficulty || t.difficulty === difficulty
    return matchSearch && matchDiff
  })

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    </div>
  )

  if (error || !location) return (
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

  const TypeIcon = TYPE_ICON[location.type] ?? MapPin

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative h-[380px] md:h-[460px] overflow-hidden bg-gray-900">
        <Image src={location.image || FALLBACK} alt={location.name}
          fill className="object-cover opacity-80" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <button onClick={() => router.back()}
          className="absolute top-20 left-5 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors border border-white/20">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-8">
          <div className="container-custom">
            <div className="flex items-center gap-2 mb-3">
              <span className={cn('inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border', TYPE_COLOR[location.type])}>
                <TypeIcon className="w-3.5 h-3.5" />
                {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{location.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-white/70 text-sm font-mono">{location.path}</span>
              {location.lat && location.lng && (
                <span className="text-white/60 text-xs">
                  {Number(location.lat).toFixed(4)}°N, {Number(location.lng).toFixed(4)}°E
                </span>
              )}
              {tours.length > 0 && (
                <span className="flex items-center gap-1.5 text-white/70 text-sm">
                  <Clock className="w-4 h-4" /> {tours.length} tour{tours.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 space-y-8">

        {/* About + Mini Map side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {location.description && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-3">About {location.name}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{location.description}</p>
              {location.lat && location.lng && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                  <MapPin className="w-3.5 h-3.5 text-primary-500" />
                  {Number(location.lat).toFixed(6)}°N, {Number(location.lng).toFixed(6)}°E
                </div>
              )}
            </div>
          )}

          {/* Mini map — only if GPS exists */}
          {location.lat && location.lng && (
            <div>
              <LocationMap
                locations={[location]}
                height="260px"
                selectedId={location.id}
              />
            </div>
          )}
        </div>

        {/* Tours */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Tours in {location.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{filtered.length} tour{filtered.length !== 1 ? 's' : ''} available</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search tours…"
                  className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none w-44" />
              </div>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
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
              <p className="text-gray-500 text-sm">No tours linked to {location.name} yet.</p>
              <p className="text-xs text-gray-400 mt-1">Add tours and link them to this location in the admin dashboard.</p>
              <Link href="/tours" className="inline-flex items-center gap-1.5 mt-4 text-sm text-primary-600 hover:underline">
                Browse all tours <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(tour => <TourCard key={tour.id} tour={tour} />)}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary-600 to-green-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Can't find what you're looking for?</h3>
          <p className="text-primary-100 text-sm mb-5">We create custom tours tailored to your preferences.</p>
          <Link href="/custom-tour"
            className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
            Plan a Custom Tour <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

const PKG_ICONS = [
  { key: 'hotel',       icon: Hotel,           label: 'Hotel',       match: /hotel|accommodat|stay/i },
  { key: 'sightseeing', icon: Binoculars,      label: 'Sightseeing', match: /sightseeing|visit|guide|tour/i },
  { key: 'transport',   icon: Bus,             label: 'Transport',   match: /transport|vehicle|cab|bus|train|transfer|flight/i },
  { key: 'meals',       icon: UtensilsCrossed, label: 'Meals',       match: /meal|breakfast|lunch|dinner|food/i },
]

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || '919876543210'

function TourCard({ tour }: { tour: Tour }) {
  const p      = priceNum(tour.price)
  const rating = tour.rating ? Number(tour.rating) : null
  const img    = tour.images?.[0] || FALLBACK_TOUR
  const nights = tour.duration > 1 ? tour.duration - 1 : 0
  const included = tour.included ?? []
  const detectedPkg = PKG_ICONS.filter(pkg => included.some(inc => pkg.match.test(inc)))
  const places = tour.destinations ?? []

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row">
      {/* Image */}
      <Link href={`/tours/${tour.id}`} className="relative sm:w-64 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
        <Image src={img} alt={tour.title} fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, 256px" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="bg-green-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize shadow-sm">{tour.category}</span>
        </div>
        {tour.isFeatured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-yellow-900" /> Featured
          </div>
        )}
      </Link>

      {/* Middle: details */}
      <div className="flex-1 p-4 sm:p-5 min-w-0">
        <Link href={`/tours/${tour.id}`}>
          <h3 className="font-bold text-gray-900 text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{tour.title}</h3>
        </Link>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-medium">{tour.duration} Days{nights > 0 ? ` & ${nights} Nights` : ''}</span>
          {rating && (
            <span className="flex items-center gap-1 text-yellow-600 font-medium ml-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Includes icons */}
        {detectedPkg.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
            {detectedPkg.map(({ key, icon: Icon, label }) => (
              <span key={key} className="flex items-center gap-1.5 text-xs text-gray-600">
                <Icon className="w-4 h-4 text-primary-500" />{label}
              </span>
            ))}
          </div>
        )}

        {/* Location chips */}
        {places.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {places.slice(0, 5).map((place, i) => (
              <span key={i} className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3 text-gray-400" />{place}
              </span>
            ))}
            {places.length > 5 && (
              <span className="text-xs text-primary-600 font-medium">+{places.length - 5} more</span>
            )}
          </div>
        )}
      </div>

      {/* Right: price + CTAs */}
      <div className="sm:w-52 flex-shrink-0 border-t sm:border-t-0 sm:border-l border-gray-100 p-4 sm:p-5 flex flex-col justify-center bg-gray-50/50">
        <p className="text-[11px] font-semibold text-green-600 uppercase tracking-wide mb-0.5">Super Deal Price</p>
        <div className="flex items-end gap-1 mb-0.5">
          <p className="text-2xl font-extrabold text-gray-900">₹{p.toLocaleString('en-IN')}</p>
          <span className="text-gray-400 text-xs mb-1">/-</span>
        </div>
        <p className="text-[11px] text-gray-400 mb-3">per person</p>

        <Link href={`/tours/${tour.id}`}
          className="w-full text-center bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors mb-2">
          Get Detail
        </Link>
        <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, I want to enquire about ${tour.title}`)}`}
          target="_blank" rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-white text-gray-700 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          <MessageCircle className="w-4 h-4 text-green-500" /> Enquire Now
        </a>
      </div>
    </div>
  )
}
