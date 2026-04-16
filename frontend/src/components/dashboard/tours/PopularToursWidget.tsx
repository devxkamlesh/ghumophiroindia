'use client'

import { Star, MapPin, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { tourService } from '@/services/api'
import type { Tour } from '@/types'

export default function PopularToursWidget() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tourService.getAll({ limit: 5, sortBy: 'rating', sortOrder: 'desc' })
      .then(r => setTours(r.tours ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
      ))}
    </div>
  )

  if (tours.length === 0) return (
    <div className="text-center py-10 text-gray-400">
      <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
      <p className="text-sm">No tours available</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {tours.map((tour, i) => (
        <Link key={tour.id} href={`/dashboard/tours/${tour.id}`}
          className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-primary-200 hover:bg-primary-50/30 transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {i + 1}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{tour.title}</p>
              <p className="text-xs text-gray-500 capitalize">{tour.category} · {tour.duration}d</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-3">
            {tour.rating && (
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                {Number(tour.rating).toFixed(1)}
              </span>
            )}
            <span className="text-sm font-bold text-gray-900">₹{Number(tour.price).toLocaleString('en-IN')}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
