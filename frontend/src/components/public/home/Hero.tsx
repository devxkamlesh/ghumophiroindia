'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

/* ─── Demo Featured Tours ───────────────────────────────────────────────── */
const DEMO_TOURS = [
  {
    id: 1,
    title: 'Golden Triangle Tour',
    subtitle: 'Delhi · Agra · Jaipur',
    duration: '6 Days, 5 Nights',
    price: '₹ 24,999',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80',
  },
  {
    id: 2,
    title: 'Magical Rajasthan Tour',
    subtitle: 'Jaipur · Udaipur · Jodhpur · Jaisalmer',
    duration: '8 Days, 7 Nights',
    price: '₹ 34,999',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1920&q=80',
  },
  {
    id: 3,
    title: 'Desert Safari Experience',
    subtitle: 'Jaisalmer · Bikaner',
    duration: '4 Days, 3 Nights',
    price: '₹ 18,999',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1920&q=80',
  },
]

/* ─── Hero ──────────────────────────────────────────────────────────────── */
export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-scroll slider
  useEffect(() => {
    if (isPaused) return
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % DEMO_TOURS.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isPaused])

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % DEMO_TOURS.length)
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + DEMO_TOURS.length) % DEMO_TOURS.length)

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
                style={{ backgroundImage: `url('${DEMO_TOURS[currentSlide].image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/65" />

              {/* Tour info */}
              <div className="absolute inset-0 flex items-start pt-10 pb-12">
                <div className="container-custom w-full px-4 md:px-6 lg:px-8">
                  <div className="max-w-xl">
                    <div className="text-primary-300 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Featured Tour</div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 leading-tight">
                      {DEMO_TOURS[currentSlide].title}
                    </h2>
                    <p className="text-white/90 text-xs md:text-sm mb-2">{DEMO_TOURS[currentSlide].subtitle}</p>
                    <div className="flex items-center gap-3 md:gap-4 mb-2.5">
                      <div className="flex items-center gap-1 text-white/90 text-[11px] md:text-xs">
                        <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        {DEMO_TOURS[currentSlide].duration}
                      </div>
                      <div className="text-white font-bold text-lg md:text-xl">{DEMO_TOURS[currentSlide].price}</div>
                    </div>
                    <Link href="/tours" className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-4 md:px-5 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm transition-colors shadow-lg">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Controls - Bottom Right */}
        <div className="absolute bottom-4 right-4 md:right-6 flex items-center gap-2 z-20">
          <button onClick={prevSlide} className="w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="Previous slide">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <div className="flex gap-1.5">
            {DEMO_TOURS.map((_, idx) => (
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
      </div>
    </section>
  )
}
