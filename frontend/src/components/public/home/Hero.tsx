'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin, Calendar, Users, Search, ChevronDown, Loader2, Check, ChevronLeft, ChevronRight } from 'lucide-react'

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

/* ─── Data ─────────────────────────────────────────────────────────────── */
const DESTINATIONS = [
  { value: 'jaipur',          label: 'Jaipur',          sub: 'Pink City' },
  { value: 'udaipur',         label: 'Udaipur',         sub: 'City of Lakes' },
  { value: 'jodhpur',         label: 'Jodhpur',         sub: 'Blue City' },
  { value: 'jaisalmer',       label: 'Jaisalmer',       sub: 'Golden City' },
  { value: 'bikaner',         label: 'Bikaner',         sub: 'Desert Jewel' },
  { value: 'golden-triangle', label: 'Golden Triangle', sub: 'Delhi · Agra · Jaipur' },
  { value: 'all-rajasthan',   label: 'All Rajasthan',   sub: 'Full state tour' },
]

const DURATIONS = [
  { value: '1-2',  label: '1–2 Days' },
  { value: '3-5',  label: '3–5 Days' },
  { value: '6-9',  label: '6–9 Days' },
  { value: '10-14',label: '10–14 Days' },
  { value: '15+',  label: '15+ Days' },
]

const TRAVELERS = [
  { value: '1',   label: 'Solo' },
  { value: '2',   label: '2 People' },
  { value: '3-4', label: '3–4 People' },
  { value: '5-8', label: '5–8 People' },
  { value: '9+',  label: '9+ People' },
]

/* ─── Custom Dropdown ───────────────────────────────────────────────────── */
interface Option { value: string; label: string; sub?: string }

interface DropdownProps {
  label: string
  placeholder: string
  icon: React.ReactNode
  options: Option[]
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}

function Dropdown({ label, placeholder, icon, options, value, onChange, disabled }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative h-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={`
          w-full h-full flex flex-col justify-center px-4 pt-7 pb-3 text-left
          transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed
          ${open ? 'bg-primary-50/60' : 'hover:bg-gray-50/70'}
        `}
      >
        {/* Label */}
        <span className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
          <span className="text-primary-500">{icon}</span>
          {label}
        </span>

        {/* Value */}
        <span className={`text-sm font-semibold truncate pr-6 ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
          {selected ? selected.label : placeholder}
        </span>

        {/* Chevron */}
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-[calc(100%+6px)] left-0 min-w-[200px] w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`
                  w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm
                  transition-colors duration-100
                  ${value === opt.value ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                <span>
                  <span className="font-semibold block leading-tight">{opt.label}</span>
                  {opt.sub && <span className="text-xs text-gray-400">{opt.sub}</span>}
                </span>
                {value === opt.value && <Check className="w-4 h-4 text-primary-600 shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Hero ──────────────────────────────────────────────────────────────── */
export default function Hero() {
  const router = useRouter()
  const [isSearching, setIsSearching] = useState(false)
  const [params, setParams] = useState({ destination: '', duration: '', travelers: '' })
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    await new Promise(r => setTimeout(r, 500))
    const p = new URLSearchParams()
    if (params.destination) p.append('destination', params.destination)
    if (params.duration)    p.append('duration',    params.duration)
    if (params.travelers)   p.append('travelers',   params.travelers)
    router.push(`/tours?${p.toString()}`)
    setIsSearching(false)
  }

  return (
    <section className="relative">
      {/* Ads Banner Slider - Compact Height */}
      <div className="relative w-full h-[240px] sm:h-[280px] md:h-[320px] overflow-hidden">
        {/* Featured Tours Slider Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${DEMO_TOURS[currentSlide].image}')` }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Featured Tour Info Overlay */}
        <div 
          className="absolute inset-0 flex items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="container-custom w-full px-4 md:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl"
              >
                <div className="text-primary-300 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Featured Tour</div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 leading-tight">
                  {DEMO_TOURS[currentSlide].title}
                </h2>
                <p className="text-white/90 text-xs md:text-sm mb-2">{DEMO_TOURS[currentSlide].subtitle}</p>
                <div className="flex items-center gap-3 md:gap-4 mb-2.5">
                  <div className="flex items-center gap-1.5 text-white/90 text-[11px] md:text-xs">
                    <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    {DEMO_TOURS[currentSlide].duration}
                  </div>
                  <div className="text-white font-bold text-base md:text-xl">{DEMO_TOURS[currentSlide].price}</div>
                </div>
                <Link href="/tours" className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-lg font-bold text-[11px] md:text-xs transition-colors shadow-lg">
                  Book Now
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slider Controls - Bottom Right */}
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 flex items-center gap-1.5 md:gap-2 z-20">
          <button
            onClick={prevSlide}
            className="w-7 h-7 md:w-8 md:h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
          </button>
          <div className="flex gap-1">
            {DEMO_TOURS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1 rounded-full transition-all ${
                  idx === currentSlide ? 'w-5 bg-white' : 'w-1 bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="w-7 h-7 md:w-8 md:h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Search Box Section - Compact */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 py-4 md:py-5">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="container-custom px-4 md:px-6"
        >
          <form onSubmit={handleSearch}
            className="bg-white rounded-lg md:rounded-xl shadow-2xl overflow-hidden max-w-5xl mx-auto">

            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Destination */}
              <div className="md:col-span-4 min-h-[56px] md:min-h-[60px]">
                <Dropdown
                  label="Where to?"
                  placeholder="Select destination"
                  icon={<MapPin className="w-3.5 h-3.5" />}
                  options={DESTINATIONS}
                  value={params.destination}
                  onChange={v => setParams(p => ({ ...p, destination: v }))}
                  disabled={isSearching}
                />
              </div>

              {/* Duration */}
              <div className="md:col-span-3 min-h-[56px] md:min-h-[60px]">
                <Dropdown
                  label="Duration"
                  placeholder="Any duration"
                  icon={<Calendar className="w-3.5 h-3.5" />}
                  options={DURATIONS}
                  value={params.duration}
                  onChange={v => setParams(p => ({ ...p, duration: v }))}
                  disabled={isSearching}
                />
              </div>

              {/* Travelers */}
              <div className="md:col-span-3 min-h-[56px] md:min-h-[60px]">
                <Dropdown
                  label="Travelers"
                  placeholder="Any group"
                  icon={<Users className="w-3.5 h-3.5" />}
                  options={TRAVELERS}
                  value={params.travelers}
                  onChange={v => setParams(p => ({ ...p, travelers: v }))}
                  disabled={isSearching}
                />
              </div>

              {/* Search button */}
              <div className="md:col-span-2 flex items-stretch min-h-[56px] md:min-h-[60px]">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-sm transition-colors disabled:opacity-60 px-4 py-2.5 md:py-0 rounded-b-lg md:rounded-b-none md:rounded-r-xl"
                >
                  {isSearching
                    ? <Loader2 className="w-5 h-5 animate-spin" />
                    : <Search className="w-5 h-5" />
                  }
                  <span className="md:hidden">Search Tours</span>
                </button>
              </div>
            </div>

            {/* Quick links */}
            <div className="px-3 md:px-4 py-2 bg-gray-50/80 border-t border-gray-100 flex flex-wrap items-center gap-1.5 md:gap-2">
              <span className="text-[11px] text-gray-400 font-medium mr-0.5">Popular:</span>
              {[
                { label: 'Golden Triangle', href: '/tours?destination=golden-triangle' },
                { label: 'Desert Safari',   href: '/tours?destination=jaisalmer' },
                { label: 'Jaipur City',     href: '/tours?destination=jaipur' },
                { label: 'Custom Tour',     href: '/custom-tour' },
              ].map(l => (
                <Link key={l.label} href={l.href}
                  className="text-[11px] px-2 md:px-2.5 py-1 bg-white border border-gray-200 hover:border-primary-400 hover:text-primary-600 text-gray-600 rounded-full transition-colors font-medium">
                  {l.label}
                </Link>
              ))}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
