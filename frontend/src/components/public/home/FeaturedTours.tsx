'use client'

import { Star, Clock, MapPin, ArrowRight, Flame } from 'lucide-react'
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
  { text: 'Most Popular', cls: 'bg-rose-500' },
  { text: 'Best Value', cls: 'bg-emerald-500' },
  { text: 'Top Rated', cls: 'bg-amber-500' },
  { text: 'Adventure', cls: 'bg-violet-500' },
]

function priceNum(p: string | number | null | undefined) {
  if (!p) return 0
  return typeof p === 'string' ? parseFloat(p) || 0 : p
}

interface Props { tours: Tour[] }

export default function FeaturedTours({ tours }: Props) {
  if (!tours || tours.length === 0) return null

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-custom">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-primary-600 text-sm font-semibold mb-3">
              <Flame className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Featured Tours
            </h2>
            <p className="text-gray-500 mt-2 text-lg">Handpicked experiences across Rajasthan</p>
          </div>
          <Link href="/tours"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all text-sm shrink-0">
            View all tours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tours.slice(0, 4).map((tour, i) => {
            const badge = BADGES[i % BADGES.length]
            const imageUrl = toWebP((tour.images ?? [])[0] || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length], 800)
            const price = priceNum(tour.price)
            const rating = tour.rating != null ? Number(tour.rating) : null
            const dests = Array.isArray(tour.destinations) ? tour.destinations : []

            return (
              <Link key={tour.id} href={`/tours/${tour.id}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  <span className={`absolute top-3 left-3 ${badge.cls} text-white text-[11px] font-bold px-2.5 py-1 rounded-full`}>
                    {badge.text}
                  </span>

                  {rating != null && (
                    <span className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow text-xs font-bold text-gray-900">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      {rating.toFixed(1)}
                      {(tour.reviewCount ?? 0) > 0 && <span className="text-gray-500 font-normal">({tour.reviewCount})</span>}
                    </span>
                  )}

                  <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-primary-700 font-bold text-sm px-3 py-1 rounded-full shadow">
                    ₹{price.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {tour.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{tour.description}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary-500" />
                      {tour.duration} days
                    </span>
                    {dests.length > 0 && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary-500" />
                        {dests.slice(0, 2).join(', ')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Max {tour.maxGroupSize} people</span>
                    <span className="flex items-center gap-1 text-primary-600 text-xs font-semibold group-hover:gap-2 transition-all">
                      View details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/tours"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl">
            Browse All Tours <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
