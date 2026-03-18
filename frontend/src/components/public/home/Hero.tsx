'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin, Calendar, Users, Search, Star, ChevronDown, Loader2, Check } from 'lucide-react'

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
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />

      {/* Accent orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10 w-full pt-28 pb-20">

        {/* Eyebrow */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium px-5 py-2 rounded-full">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            Rajasthan&apos;s Most Trusted Tour Operator
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight">
            Explore
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-orange-300 to-yellow-300">
              Incredible India
            </span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
          className="text-center text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 tracking-wide">
          Jaipur · Udaipur · Jaisalmer · Jodhpur · Golden Triangle &amp; Beyond
        </motion.p>

        {/* Search Card */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
          className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-visible">

            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-100 rounded-t-2xl overflow-hidden">
              {/* Destination */}
              <div className="md:col-span-4 min-h-[72px]">
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
              <div className="md:col-span-3 min-h-[72px]">
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
              <div className="md:col-span-3 min-h-[72px]">
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
              <div className="md:col-span-2 flex items-stretch min-h-[72px]">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-sm transition-colors disabled:opacity-60 px-4 py-4 md:py-0 rounded-b-2xl md:rounded-b-none md:rounded-r-2xl"
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
            <div className="px-5 py-3 bg-gray-50/80 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400 font-medium mr-1">Popular:</span>
              {[
                { label: 'Golden Triangle', href: '/tours?destination=golden-triangle' },
                { label: 'Desert Safari',   href: '/tours?destination=jaisalmer' },
                { label: 'Jaipur City',     href: '/tours?destination=jaipur' },
                { label: 'Custom Tour',     href: '/custom-tour' },
              ].map(l => (
                <Link key={l.label} href={l.href}
                  className="text-xs px-3 py-1.5 bg-white border border-gray-200 hover:border-primary-400 hover:text-primary-600 text-gray-600 rounded-full transition-colors font-medium">
                  {l.label}
                </Link>
              ))}
            </div>
          </form>
        </motion.div>

        {/* Trust row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-wrap justify-center gap-6 mt-10">
          {[
            { icon: <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />, main: '4.9 / 5',     sub: '2,500+ reviews' },
            { icon: <span className="text-base">🏆</span>,                        main: '14+ Years',   sub: 'of experience' },
            { icon: <span className="text-base">🛡️</span>,                        main: 'Safe & Secure', sub: '24/7 support' },
          ].map(b => (
            <div key={b.main} className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                {b.icon}
              </div>
              <div>
                <div className="text-sm font-bold leading-tight">{b.main}</div>
                <div className="text-xs text-white/60">{b.sub}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
    </section>
  )
}
