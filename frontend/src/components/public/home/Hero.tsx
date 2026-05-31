'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { bannerService } from '@/services/api'
import type { Banner } from '@/types'

/* ─── Hero ──────────────────────────────────────────────────────────────── */
export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerService.getActive()
        setBanners(data)
      } catch (error) {
        console.error('Failed to fetch banners:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  // Auto-scroll slider
  useEffect(() => {
    if (isPaused || banners.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isPaused, banners.length])

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % banners.length)
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length)

  if (loading) {
    return (
      <section className="relative bg-white">
        <div className="relative w-full h-[350px] overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </section>
    )
  }

  if (banners.length === 0) {
    return (
      <section className="relative bg-white">
        <div className="relative w-full h-[350px] overflow-hidden flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Ghumo Firo India</h2>
            <p className="text-gray-600">Explore the beauty of Rajasthan</p>
          </div>
        </div>
      </section>
    )
  }

  const currentBanner = banners[currentSlide]

  return (
    <section className="relative bg-white">

      {/* Banner Slider */}
      <div
        className="relative w-full h-[350px] overflow-hidden flex-shrink-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${currentBanner.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/65" />

              {/* Banner info */}
              <div className="absolute inset-0 flex items-start pt-10 pb-12">
                <div className="container-custom w-full px-4 md:px-6 lg:px-8">
                  <div className="max-w-xl">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 leading-tight">
                      {currentBanner.title}
                    </h2>
                    {currentBanner.subtitle && (
                      <p className="text-white/90 text-xs md:text-sm mb-2">{currentBanner.subtitle}</p>
                    )}
                    {currentBanner.description && (
                      <p className="text-white/80 text-xs md:text-sm mb-3">{currentBanner.description}</p>
                    )}
                    {currentBanner.linkUrl && (
                      <Link 
                        href={currentBanner.linkUrl} 
                        className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-4 md:px-5 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm transition-colors shadow-lg"
                      >
                        {currentBanner.linkText || 'Learn More'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Controls - Bottom Right */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 right-4 md:right-6 flex items-center gap-2 z-20">
            <button onClick={prevSlide} className="w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="Previous slide">
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <div className="flex gap-1.5">
              {banners.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="Next slide">
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
