'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { MapPin, Clock, Star, Users, ArrowRight, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Tour } from '@/types'
import { toWebP } from '@/lib/image'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
]

const CALLBACK_PHONE = process.env.NEXT_PUBLIC_PHONE?.replace(/\s/g, '') || '8287828267'

function priceNum(p: string | number | null | undefined) {
  if (!p) return 0
  return typeof p === 'string' ? parseFloat(p) || 0 : p
}

interface Props { tours: Tour[] }

export default function FeaturedTours({ tours }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  if (!tours || tours.length === 0) return null

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10)
  }, [])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    // Scroll by roughly one card width + gap
    const cardWidth = el.querySelector('.tour-card')?.clientWidth || 380
    const distance = cardWidth + 24 // card + gap
    el.scrollBy({ left: direction === 'left' ? -distance : distance, behavior: 'smooth' })
  }

  return (
    <section className="bg-emerald-50/30 py-16 md:py-20">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="font-montez text-4xl text-[#f97316] md:text-5xl lg:text-6xl">
            Best Place For You
          </p>
          <h2 className="mt-1 font-poppins text-3xl font-bold text-slate-800 md:text-5xl">
            Most <span className="text-blue-600">Popular</span> Tour
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm text-gray-600 md:text-base">
            Discover the world&apos;s most popular tours with unforgettable experiences. Your best place
            for adventure, culture, and memories that last a lifetime starts here.
          </p>
        </div>

        {/* Slider container */}
        <div className="relative">
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="absolute -left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-gray-200 transition-all hover:scale-110 hover:bg-[#f97316] hover:text-white md:-left-5"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="absolute -right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-gray-200 transition-all hover:scale-110 hover:bg-[#f97316] hover:text-white md:-right-5"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4"
          >
            {tours.map((tour, i) => (
              <div
                key={tour.id}
                className="tour-card w-[calc(100%-1rem)] flex-shrink-0 snap-start sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <TourCard tour={tour} fallback={FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]} />
              </div>
            ))}
          </div>
        </div>

        {/* View all */}
        <div className="mt-10 text-center">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#f97316] px-7 py-3 text-sm font-semibold text-[#f97316] transition-all hover:bg-[#f97316] hover:text-white"
          >
            View All Tours <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function TourCard({ tour, fallback }: { tour: Tour; fallback: string }) {
  const href = `/tours/${tour.id}`
  const imageUrl = toWebP((tour.images ?? [])[0] || fallback, 800)
  const price = priceNum(tour.price)
  const original = Math.round((price * 1.2) / 100) * 100
  const discount = original > price ? Math.round(((original - price) / original) * 100) : 0
  const rating = tour.rating ? Number(tour.rating) : null
  const nights = tour.duration > 1 ? tour.duration - 1 : 0

  const destinations = tour.destinations || []
  const startLocation = destinations[0] || 'Delhi'
  const endLocation = destinations[destinations.length - 1] || startLocation
  const locationText = startLocation === endLocation ? startLocation : `${startLocation} – ${endLocation}`

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <Link href={href} className="relative block h-56 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

        {/* Top: location + duration */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
          <MapPin className="h-3.5 w-3.5 text-green-600" />
          {locationText}
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
          <Clock className="h-3.5 w-3.5 text-orange-600" />
          {tour.duration}D
        </div>

        {/* Bottom: category + featured + discount */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="rounded-full bg-[#f97316] px-2.5 py-1 text-[11px] font-bold capitalize text-white shadow">
            {tour.category}
          </span>
          {tour.isFeatured && (
            <span className="flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-1 text-[11px] font-bold text-yellow-900 shadow">
              <Star className="h-3 w-3 fill-yellow-900" /> Featured
            </span>
          )}
        </div>
        {discount > 0 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-green-600 px-2.5 py-1 text-[11px] font-bold text-white shadow">
            {discount}% OFF
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={href}>
          <h3 className="mb-2 line-clamp-2 text-base font-bold leading-tight text-gray-800 transition-colors group-hover:text-[#f97316] md:text-lg">
            {tour.title}
          </h3>
        </Link>

        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          {rating && (
            <span className="flex items-center gap-1 font-medium text-gray-700">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {rating.toFixed(1)}
              {(tour.reviewCount ?? 0) > 0 && <span className="text-gray-400">({tour.reviewCount})</span>}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            {tour.duration}D{nights > 0 ? `/${nights}N` : ''}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-gray-400" />
            Max {tour.maxGroupSize}
          </span>
        </div>

        {/* Price */}
        <div className="mb-5 mt-auto">
          <div className="flex items-end gap-2">
            <span className="text-2xl font-extrabold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
            {discount > 0 && (
              <span className="mb-0.5 text-sm text-gray-400 line-through">₹{original.toLocaleString('en-IN')}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">per person</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={href}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#f97316] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#ea670c]"
          >
            View Details <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={`tel:${CALLBACK_PHONE}`}
            aria-label="Request callback"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition-all hover:border-[#f97316] hover:bg-[#f97316] hover:text-white"
          >
            <Phone className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
