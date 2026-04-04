'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { bannerService } from '@/services/api'
import type { Banner } from '@/types'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 1,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: EASE },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 1,
    transition: { duration: 0.55, ease: EASE },
  }),
}

const textVariants = {
  hidden: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 60 : -60,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: 0.2, ease: EASE },
  },
}

export default function Hero() {
  const [[currentSlide, direction], setSlide] = useState([0, 1])
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    bannerService.getActive('hero')
      .then(data => setBanners(data))
      .catch(err => console.error('Failed to fetch banners:', err))
      .finally(() => setLoading(false))
  }, [])

  const paginate = (dir: number) => {
    setSlide(([cur]) => {
      const next = (cur + dir + banners.length) % banners.length
      return [next, dir]
    })
  }

  useEffect(() => {
    if (isPaused || banners.length <= 1) return
    const t = setInterval(() => paginate(1), 4500)
    return () => clearInterval(t)
  }, [isPaused, banners.length, currentSlide])

  if (loading) {
    return (
      <section className="relative bg-white">
        <div className="w-full h-[320px] flex items-center justify-center bg-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </section>
    )
  }

  if (banners.length === 0) {
    return (
      <section className="relative bg-white">
        <div className="w-full h-[320px] flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Ghumo Phiro India</h2>
            <p className="text-gray-600">Explore the beauty of Rajasthan</p>
          </div>
        </div>
      </section>
    )
  }

  const banner = banners[currentSlide]

  return (
    <section className="relative bg-black">
      <div
        className="relative w-full h-[320px] overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Sliding track */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {/* Background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${banner.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />

            {/* Text */}
            <div className="absolute inset-0 flex items-center">
              <div className="container-custom w-full px-4 md:px-8 lg:px-12">
                <motion.div
                  custom={direction}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="max-w-xl flex flex-col gap-2.5"
                >
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="text-white/95 text-base md:text-lg font-semibold drop-shadow">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.description && (
                    <p className="text-white/80 text-sm md:text-base">
                      {banner.description}
                    </p>
                  )}
                  {banner.linkUrl && (
                    <div className="pt-1">
                      <Link
                        href={banner.linkUrl}
                        className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm md:text-base transition-colors shadow-lg"
                      >
                        {banner.linkText || 'Book Now'}
                      </Link>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
            <button
              onClick={() => paginate(-1)}
              className="w-8 h-8 bg-black/40 hover:bg-black/70 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <div className="flex gap-1.5">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlide([idx, idx > currentSlide ? 1 : -1])}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                />
              ))}
            </div>
            <button
              onClick={() => paginate(1)}
              className="w-8 h-8 bg-black/40 hover:bg-black/70 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
