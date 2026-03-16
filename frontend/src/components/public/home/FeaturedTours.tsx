'use client'

import { Star, Clock, Users, ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import type { Tour } from '@/types'
import { toWebP } from '@/lib/image'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
]

const BADGES = [
  { text: 'Most Popular', color: 'bg-red-500' },
  { text: 'Best Value',   color: 'bg-green-500' },
  { text: 'Top Rated',    color: 'bg-yellow-500' },
  { text: 'Adventure',    color: 'bg-orange-500' },
]

function priceNum(p: string | number | null | undefined) {
  if (!p) return 0
  return typeof p === 'string' ? parseFloat(p) || 0 : p
}

interface Props {
  tours: Tour[]
}

export default function FeaturedTours({ tours }: Props) {
  // Don't render the section at all if there are no tours
  if (!tours || tours.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">Trending Now</span>
          </div>
          <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Featured Tours
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked experiences showcasing the best of Rajasthan
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tours.slice(0, 4).map((tour, i) => {
            const badge    = BADGES[i % BADGES.length]
            const imageUrl = toWebP((tour.images ?? [])[0] || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length], 800)
            const price    = priceNum(tour.price)
            const rating   = tour.rating != null ? Number(tour.rating) : null
            const dests    = Array.isArray(tour.destinations) ? tour.destinations : []

            return (
              <Link
                key={tour.id}
                href={`/tours/${tour.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  <span className={`absolute top-4 left-4 ${badge.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                    {badge.text}
                  </span>

                  <span className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full shadow-lg text-sm font-bold text-primary-600">
                    ₹{price.toLocaleString('en-IN')}
                  </span>

                  {rating != null && (
                    <span className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-sm text-gray-900">{rating.toFixed(1)}</span>
                      {(tour.reviewCount ?? 0) > 0 && (
                        <span className="text-xs text-gray-600">({tour.reviewCount})</span>
                      )}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {tour.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-primary-600" />
                      <span className="font-medium">{tour.duration} days</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-primary-600" />
                      <span className="font-medium">Max {tour.maxGroupSize}</span>
                    </span>
                  </div>

                  {/* Destination tags */}
                  {dests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {dests.slice(0, 2).map((d, j) => (
                        <span key={j} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary-600 group-hover:text-primary-700">
                      View Details
                    </span>
                    <ArrowRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View all */}
        <div className="text-center">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            View All Tours
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
