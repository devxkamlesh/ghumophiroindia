/**
 * MapDataPreview
 *
 * Renders map data from the backend without requiring a map library.
 * Shows:
 *   - Location header + summary stats
 *   - Place markers as a visual grid (lat/lng shown)
 *   - Tour cards linked to the location
 *
 * When you're ready to add Mapbox or Google Maps, replace the
 * "Map placeholder" section with your map component and pass
 * `markers`, `center`, or `centerLL` from useMapData().
 *
 * Usage:
 *   <MapDataPreview slug="jaipur" />
 */

'use client'

import { MapPin, Star, Clock, Users, Loader2, AlertCircle, RefreshCw, Navigation } from 'lucide-react'
import Link from 'next/link'
import { useMapData } from '@/hooks/useMapData'

interface Props {
  slug: string
  /** Show the tour cards section (default: true) */
  showTours?: boolean
  /** Show the places grid (default: true) */
  showPlaces?: boolean
  className?: string
}

function priceNum(p: string | null | undefined) {
  if (!p) return 0
  return parseFloat(p) || 0
}

export default function MapDataPreview({
  slug,
  showTours   = true,
  showPlaces  = true,
  className   = '',
}: Props) {
  const { core, places, tours, markers, center, loading, error, refetch } = useMapData(slug)

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-16 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 gap-3 ${className}`}>
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-red-600 text-sm">{error}</p>
        <button onClick={refetch} className="flex items-center gap-2 text-sm text-primary-600 hover:underline">
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    )
  }

  if (!core) return null

  return (
    <div className={`space-y-6 ${className}`}>

      {/* ── Location header ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider capitalize">
                {core.location.type}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{core.location.name}</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{core.location.path}</p>
          </div>

          {/* Summary stats */}
          <div className="flex gap-4 text-right flex-shrink-0">
            <div>
              <p className="text-lg font-bold text-gray-900">{core.summary.totalTours}</p>
              <p className="text-xs text-gray-500">Tours</p>
            </div>
            {core.summary.avgPrice > 0 && (
              <div>
                <p className="text-lg font-bold text-gray-900">
                  ₹{Math.round(core.summary.avgPrice).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-500">Avg. price</p>
              </div>
            )}
          </div>
        </div>

        {/* Center coordinates */}
        {center && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
            <Navigation className="w-3.5 h-3.5" />
            <span>
              Center: {core.center.lat?.toFixed(4)}, {core.center.lng?.toFixed(4)}
            </span>
            <span className="ml-auto text-gray-300">
              Cached {new Date(core.cachedAt).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      {/* ── Map placeholder ───────────────────────────────────────────────────
          Replace this div with your Mapbox / Google Maps component.
          Pass: center={center} markers={markers}
      ──────────────────────────────────────────────────────────────────────── */}
      {center && (
        <div className="bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden">
          <div className="h-64 flex flex-col items-center justify-center gap-3 text-gray-400">
            <MapPin className="w-10 h-10 opacity-30" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Map ready</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {markers.length} markers · center [{center[1].toFixed(4)}, {center[0].toFixed(4)}]
              </p>
              <p className="text-xs text-gray-300 mt-1">
                Drop in Mapbox or Google Maps here
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Places grid ── */}
      {showPlaces && places.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Places ({places.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {places.map(place => (
              <div key={place.id}
                className="bg-white rounded-xl border border-gray-100 p-3 hover:border-primary-200 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3 h-3 text-primary-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{place.name}</p>
                </div>
                {place.lat != null && place.lng != null ? (
                  <p className="text-xs text-gray-400 font-mono">
                    {place.lat.toFixed(3)}, {place.lng.toFixed(3)}
                  </p>
                ) : (
                  <p className="text-xs text-gray-300">No coordinates</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tour cards ── */}
      {showTours && tours.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Tours in {core.location.name} ({tours.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tours.map(tour => {
              const price  = priceNum(tour.price)
              const rating = tour.rating ? Number(tour.rating) : null
              return (
                <Link key={tour.id} href={`/tours/${tour.id}`}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:border-primary-200 hover:shadow-sm transition-all group">
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                    {tour.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {tour.duration} days
                    </span>
                    {rating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {rating.toFixed(1)}
                      </span>
                    )}
                    <span className="font-semibold text-gray-900">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && places.length === 0 && tours.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <p className="text-sm">No places or tours found for {core.location.name}</p>
          <p className="text-xs mt-1">Add locations and link tours to destinations to populate this map.</p>
        </div>
      )}
    </div>
  )
}
