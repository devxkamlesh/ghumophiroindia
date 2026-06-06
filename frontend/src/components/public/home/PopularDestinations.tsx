'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import type { LocationNode } from '@/types'
import { toWebP } from '@/lib/image'

interface Props { locations?: LocationNode[] }

const EASE = [0.25, 0.46, 0.45, 0.94] as const

export default function PopularDestinations({ locations = [] }: Props) {
  const popularStates = locations.filter(l => l.type === 'state' && l.isPopular)
  const [activeIndex, setActiveIndex] = useState(Math.floor(popularStates.length / 2))

  if (popularStates.length === 0) return null

  const goToPrev = () => {
    setActiveIndex(prev => (prev === 0 ? popularStates.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setActiveIndex(prev => (prev === popularStates.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      <div className="container-custom">
        {/* Heading */}
        <div className="mb-16 text-center">
          <p className="font-montez text-3xl text-[#f97316] md:text-4xl">
            Top Destination
          </p>
          <h2 className="mt-1 text-3xl font-extrabold text-slate-800 md:text-5xl">
            Popular Destination
          </h2>
        </div>

        {/* Overlapping Cards Container (440:630 aspect ratio, infinite loop, progressive scale) */}
        <div className="relative mx-auto flex h-[580px] items-center justify-center overflow-hidden px-4 md:h-[680px]">
          {popularStates.map((state, index) => {
            // Calculate offset with wrap-around for infinite loop
            let offset = index - activeIndex
            const halfLength = Math.floor(popularStates.length / 2)
            
            // Wrap offset to always show closest cards
            if (offset > halfLength) {
              offset -= popularStates.length
            } else if (offset < -halfLength) {
              offset += popularStates.length
            }

            const isFocused = index === activeIndex
            const absOffset = Math.abs(offset)
            const isVisible = absOffset <= 2

            // Progressive scale: center 100%, ±1 is 85%, ±2 is 65%
            let scale = 1
            if (absOffset === 1) scale = 0.85
            else if (absOffset === 2) scale = 0.65
            else if (absOffset > 2) scale = 0.5

            // Horizontal position - with gap between cards
            const xOffset = offset * (absOffset === 2 ? 200 : 220)
            
            const zIndex = 10 - absOffset
            const opacity = isVisible ? 1 : 0
            const blur = isFocused ? 0 : absOffset === 1 ? 2 : 4

            return (
              <motion.div
                key={state.id || state.slug}
                initial={false}
                animate={{
                  x: xOffset,
                  scale,
                  opacity,
                  zIndex,
                  filter: `blur(${blur}px) brightness(${isFocused ? 1 : 0.7})`,
                }}
                transition={{ duration: 0.6, ease: EASE }}
                onClick={() => setActiveIndex(index)}
                className="absolute cursor-pointer"
                style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
              >
                <DestinationCard state={state} isFocused={isFocused} />
              </motion.div>
            )
          })}

          {/* Navigation Arrows */}
          {popularStates.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                aria-label="Previous destination"
                className="absolute left-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white md:left-8 md:h-12 md:w-12"
              >
                <svg className="h-5 w-5 text-gray-800 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                aria-label="Next destination"
                className="absolute right-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white md:right-8 md:h-12 md:w-12"
              >
                <svg className="h-5 w-5 text-gray-800 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function DestinationCard({ state, isFocused }: { state: LocationNode; isFocused: boolean }) {
  const image = toWebP(
    state.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071',
    800
  )

  const tourCount = state.children?.filter(c => c.type === 'city').length || 0

  return (
    <div
      className="relative w-[320px] overflow-hidden rounded-3xl shadow-2xl transition-shadow duration-500 md:w-[400px]"
      style={{
        aspectRatio: '440 / 630',
        boxShadow: isFocused
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          : '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${image}')` }}
      />

      {/* Dark overlay at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content at bottom - left aligned with button on right */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
        <div className="text-left flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white drop-shadow-lg leading-tight md:text-2xl">
            {state.name}
          </h3>
          <p className="mt-1 text-xs font-medium text-white/90 md:text-sm">
            {tourCount} Package{tourCount !== 1 ? 's' : ''}
          </p>
        </div>

        {isFocused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="flex-shrink-0"
          >
            <Link
              href={`/destinations/${state.slug}`}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-white bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-slate-800"
            >
              View All <span className="text-base">→</span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
