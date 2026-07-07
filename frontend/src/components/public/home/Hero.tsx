'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ArrowRight, Loader2 } from 'lucide-react'
import { bannerService } from '@/services/api'
import type { Banner } from '@/types'

const AUTOPLAY_MS = 6000

// Sized for 1920x600 banners (16:5). Height follows width, but stays readable on
// phones (min) and never gets oversized on ultrawide (max).
const BOX = 'relative w-full aspect-[16/5] min-h-[300px] max-h-[600px] overflow-hidden'

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    bannerService.getActive()
      .then(setBanners)
      .catch(err => console.error('Failed to fetch banners:', err))
      .finally(() => setLoading(false))
  }, [])

  const count = banners.length
  const go = useCallback((i: number) => {
    setIndex(prev => (count ? ((i % count) + count) % count : prev))
  }, [count])

  // Autoplay — pure state tick, no animation library involved.
  useEffect(() => {
    if (paused || count <= 1) return
    const t = setInterval(() => setIndex(i => (i + 1) % count), AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [paused, count])

  if (loading) {
    return (
      <section className={`${BOX} bg-gray-100 flex items-center justify-center`}>
        <Loader2 className="w-7 h-7 animate-spin text-primary-600" />
      </section>
    )
  }

  if (count === 0) {
    return (
      <section className={`${BOX} flex items-center justify-center bg-gradient-to-br from-primary-600 to-orange-500`}>
        <div className="text-center text-white px-4">
          <h2 className="text-2xl md:text-4xl font-extrabold drop-shadow">Ghumo Phiro India</h2>
          <p className="mt-2 text-white/90 text-sm md:text-base">Custom Rajasthan tours from Jaipur</p>
          <Link
            href="/tours"
            className="mt-5 inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            Explore Tours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section
      className={`group ${BOX} bg-gray-900`}
      aria-roledescription="carousel"
      aria-label="Featured tours"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides stacked once and crossfaded with a compositor-only opacity
          transition — no scale/slide animation, so no scroll jank. */}
      {banners.map((b, i) => {
        const active = i === index
        return (
          <div
            key={b.id ?? i}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <Image
              src={b.image}
              alt={b.title || 'Featured tour'}
              fill
              priority={i === 0}
              loading={i === 0 ? 'eager' : 'lazy'}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

            <div className="absolute inset-0 flex items-center">
              <div className="container-custom w-full px-4 md:px-8 lg:px-12">
                <div className="max-w-xl">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.05] tracking-tight drop-shadow-xl">
                    {b.title}
                  </h2>
                  {b.subtitle && (
                    <p className="mt-2 text-white/95 text-sm md:text-lg font-semibold drop-shadow">{b.subtitle}</p>
                  )}
                  {b.description && (
                    <p className="mt-1.5 hidden sm:block text-white/80 text-xs md:text-sm max-w-md line-clamp-2">
                      {b.description}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href={b.linkUrl || '/tours'}
                      className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg"
                    >
                      {b.linkText || 'Book Now'} <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/tours"
                      className="inline-flex items-center gap-2 text-white/90 hover:text-white px-4 py-2.5 rounded-xl font-semibold text-sm border border-white/30 hover:border-white/60 transition-colors"
                    >
                      Explore all tours
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Controls */}
      {count > 1 && (
        <>
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white transition md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white transition md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-20 flex items-center gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
