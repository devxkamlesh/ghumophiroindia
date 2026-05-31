'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Compass, ChevronLeft, ChevronRight } from 'lucide-react'
import type { LocationNode } from '@/types'
import { toWebP } from '@/lib/image'

/* ─── Helpers ───────────────────────────────────────────────────────────── */
/** Extract country & state from path like "india/rajasthan/jaipur" */
function parsePath(path: string) {
  const parts = path.split('/')
  return {
    country: parts[0] ? capitalize(parts[0]) : null,
    state:   parts[1] ? capitalize(parts[1]) : null,
  }
}
function capitalize(s: string) {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

/* ─── Component ─────────────────────────────────────────────────────────── */
interface Props { locations?: LocationNode[] }

export default function PopularDestinations({ locations = [] }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Filter only states that are marked as popular
  const popularStates = locations.filter(l => l.type === 'state' && l.isPopular)

  // Check scroll position to show/hide buttons
  const checkScrollPosition = () => {
    const container = scrollRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    )
  }

  // Scroll functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -284, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 284, behavior: 'smooth' })
    }
  }

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || popularStates.length === 0) return

    let scrollInterval: NodeJS.Timeout
    let isPaused = false

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!isPaused && scrollContainer) {
          const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth
          const currentScroll = scrollContainer.scrollLeft

          if (currentScroll >= maxScroll) {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' })
          } else {
            scrollContainer.scrollBy({ left: 284, behavior: 'smooth' })
          }
        }
      }, 3000)
    }

    // Pause on hover
    const handleMouseEnter = () => { isPaused = true }
    const handleMouseLeave = () => { isPaused = false }

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)
    scrollContainer.addEventListener('scroll', checkScrollPosition)

    startAutoScroll()
    checkScrollPosition()

    return () => {
      clearInterval(scrollInterval)
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
      scrollContainer.removeEventListener('scroll', checkScrollPosition)
    }
  }, [popularStates.length])

  // Don't render section if no popular states exist
  if (popularStates.length === 0) return null

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-primary-600 text-sm font-semibold mb-3">
              <Compass className="w-4 h-4" />
              <span>Popular Destinations</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Explore India
            </h2>
          </div>
          <Link href="/destinations"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all text-sm shrink-0">
            View all destinations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            Horizontal Scrollable Row with Navigation Buttons
        ══════════════════════════════════════════════════════════════════ */}
        <div className="relative">
          {/* Left scroll button */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 hidden md:flex"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {/* Right scroll button */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 hidden md:flex"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {/* Scroll container */}
          <div 
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide"
            style={{ overscrollBehavior: 'contain' }}
            onWheel={(e) => {
              e.preventDefault()
              if (scrollRef.current) {
                scrollRef.current.scrollBy({ left: e.deltaY * 2, behavior: 'smooth' })
              }
            }}
          >
            {popularStates.map(state => (
              <StateCard key={state.id || state.slug} state={state} />
            ))}
          </div>
          
          {/* Gradient fades on edges - reduced width */}
          <div className="absolute top-0 left-0 bottom-4 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none hidden md:block" />
          <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none hidden md:block" />
        </div>

      </div>

      {/* Hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}

/* ─── State Card ────────────────────────────────────────────────────────── */
function StateCard({ state }: { state: LocationNode }) {
  const image = toWebP(state.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071', 600)

  return (
    <Link href={`/destinations/${state.slug}`}
      className="group relative rounded-3xl overflow-hidden block w-[264px] h-[240px] flex-shrink-0 snap-start snap-always">
      {/* Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <h3 className="font-bold text-white text-lg leading-tight transition-all duration-300 group-hover:translate-y-[-2px] group-hover:text-xl">
          {state.name}
        </h3>
      </div>

      {/* Enhanced hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 group-hover:from-black/30 group-hover:via-black/10 group-hover:to-transparent transition-all duration-300" />
      
      {/* Subtle glow border on hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-3xl transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
    </Link>
  )
}
