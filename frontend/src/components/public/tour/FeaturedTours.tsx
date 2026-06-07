'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Clock, MapPin, ArrowRight } from 'lucide-react'
import { tourService } from '@/services/api'
import { toWebP } from '@/lib/image'
import type { Tour } from '@/types'

const FALLBACK = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'

function priceNum(p: string | number | null | undefined) {
  if (!p) return 0
  return typeof p === 'string' ? parseFloat(p) || 0 : p
}

export default function FeaturedTours({ excludeId }: { excludeId?: number }) {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        // Prefer featured tours; fall back to the latest active tours
        let list = await tourService.getFeatured().catch(() => [])
        if (!list || list.length < 4) {
          const res = await tourService.getAll({ limit: 8 }).catch(() => null)
          if (res?.tours) list = res.tours
        }
        if (active) setTours((list ?? []).filter(t => t.id !== excludeId).slice(0, 4))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [excludeId])

  if (loading || tours.length === 0) return null

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">You May Also Like</h2>
          <p className="text-sm text-gray-400 mt-0.5">Handpicked tours other travelers loved</p>
        </div>
        <Link href="/tours" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:gap-2.5 transition-all">
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tours.map(t => {
          const price = priceNum(t.price)
          const rating = t.rating ? Number(t.rating) : null
          const dests = t.destinations ?? []
          const location = dests.length ? (dests[0] === dests[dests.length - 1] ? dests[0] : `${dests[0]} – ${dests[dests.length - 1]}`) : 'India'
          const img = toWebP((t.images ?? [])[0] || FALLBACK, 600)
          return (
            <Link key={t.id} href={`/tours/${t.id}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="relative h-40 overflow-hidden">
                <Image src={img} alt={t.title} fill sizes="(max-width:640px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2.5 left-2.5 bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">{t.category}</span>
                {rating && (
                  <span className="absolute top-2.5 right-2.5 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm text-gray-800 text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{rating.toFixed(1)}
                  </span>
                )}
              </div>

              <div className="p-3.5">
                <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-primary-600 transition-colors">{t.title}</h3>
                <p className="flex items-center gap-1 text-xs text-gray-400 mt-1 line-clamp-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />{location}
                </p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />{t.duration} Days
                  </span>
                  <span className="text-sm font-extrabold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
