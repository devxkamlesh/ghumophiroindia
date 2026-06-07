'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Clock, Users, MapPin, Star, Check, X, ChevronRight,
  AlertCircle, Loader2, Shield, Award, ThumbsUp, HeartHandshake,
  Hotel, Bus, UtensilsCrossed, Camera, Binoculars, Coffee, Utensils,
  ChevronDown, ChevronUp, Info, Mountain, Tag, Phone, Share2, Sparkles,
  Wallet, ShieldCheck, Headphones, FileText, Ban,
} from 'lucide-react'
import { tourService, locationAdminService } from '@/services/api'
import BookingCalculator from '@/components/public/tour/BookingCalculator'
import TourGallery from '@/components/public/tour/TourGallery'
import FeaturedTours from '@/components/public/tour/FeaturedTours'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import type { Tour, LocationNode, Itinerary } from '@/types'
import dynamic from 'next/dynamic'

const TourRouteMap = dynamic(() => import('@/components/public/map/TourRouteMap'), {
  ssr: false,
  loading: () => <div className="h-[380px] bg-gray-100 rounded-2xl animate-pulse" />,
})

function priceNum(p: string | number | null | undefined) {
  if (!p) return 0
  return typeof p === 'string' ? parseFloat(p) || 0 : p
}

const FALLBACK = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80'
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || '919876543210'

const CANCELLATION_POLICY = [
  { days: 'Registration charges', rule: 'Non-refundable and non-transferable.' },
  { days: 'Within 7 days', rule: '100% of tour package amount charged as cancellation fees.' },
  { days: '15 days before', rule: '50% of tour package amount charged as cancellation fees.' },
  { days: '30 days before', rule: '25% of tour package amount charged as cancellation fees.' },
  { days: 'Weather / Govt restrictions', rule: 'Certain activities may be cancelled. No refund provided. Alternate activity will be arranged.' },
  { days: 'Lockdown at destination', rule: 'Credit shell released, valid for 365 days for same number of persons after deduction of IRCTC/Airline charges.' },
]

const TERMS = [
  'Full payment must be made before 7 days of trip begins. Pending payments may lead to cancellation.',
  'Standard check-in time is 11 AM. Early check-in is subject to availability.',
  'Transportation is as per itinerary and not at disposal. AC will not work on hills.',
  'Package rates are subject to change without prior notice due to Force Majeure events, strikes, fairs, festivals, weather conditions, traffic problems, overbooking of hotels/flights.',
  'Company reserves the right to cancel bookings even after payment acceptance without assigning any reason. Full refund will be provided in such cases.',
  'Company may dismiss any guest for misbehavior, especially if it affects the group or involves physical/verbal assault to the Tour Manager, without any refunds.',
  'Hotel and/or tour programme may change due to unavoidable circumstances.',
  'Registration once booked cannot be cancelled, transferred or exchanged.',
  'Travellers are solely responsible for any mishappening, theft, loss, injuries, or illegal activities (including carrying banned drugs) during the tour.',
  'No act of misconduct or indiscipline shall be tolerated on the tours.',
  'In case of vehicle breakdown, travellers must wait for repair or alternate option arranged by the company. If 4x4 pickup is required due to heavy snow or road jam, client should pay extra.',
  'Travellers must take care of their luggage and belongings. Management shall not be accountable for missing items.',
  'COVID guidelines must be followed by all travellers.',
  'Departure time is fixed. Anyone missing the bus shall not be eligible for any refunds. We shall call you twice before scheduled departure.',
  'Travellers cannot drink or smoke in the vehicle during the trip.',
  'Company reserves the right to take photographs of participants for promotional purposes. Participants who prefer their image not be used must inform the tour leader at commencement.',
  'Company has rights to terminate any person during the trip due to misconduct, anti-social activities, or illegal activities. Remaining trip amount will be refunded.',
]

// ── Section navigation anchors ────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'itinerary',  label: 'Itinerary' },
  { id: 'inclusions', label: 'Inclusions' },
  { id: 'policies',   label: 'Policies' },
  { id: 'reviews',    label: 'Reviews' },
]

// ════════════════════════════════════════════════════════════════════════════
// Presentational helpers
// ════════════════════════════════════════════════════════════════════════════

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="container-custom py-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-8 bg-gray-200 rounded w-2/3" />
        <div className="h-[460px] bg-gray-200 rounded-3xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 h-72" />
        </div>
      </div>
    </div>
  )
}

function Section({ id, title, children, icon }: { id?: string; title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-40 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2.5">
        {icon ?? <span className="w-1.5 h-6 bg-primary-600 rounded-full" />}{title}
      </h2>
      {children}
    </section>
  )
}

function Accordion({ title, children, defaultOpen = false }: { title: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left">
        <span className="font-bold text-gray-900 text-sm flex items-center gap-2">{title}</span>
        <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${open ? 'bg-primary-50' : 'bg-gray-100'}`}>
          {open ? <ChevronUp className="w-4 h-4 text-primary-600" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </span>
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-100">{children}</div>}
    </div>
  )
}

// Meals detected from a day's text → shown as chips under the day
const MEAL_TYPES = [
  { key: 'breakfast', label: 'Breakfast', icon: Coffee,          match: /breakfast/i },
  { key: 'lunch',     label: 'Lunch',     icon: Utensils,        match: /\blunch\b/i },
  { key: 'dinner',    label: 'Dinner',    icon: UtensilsCrossed, match: /\bdinner\b/i },
]

function detectMeals(day: Itinerary) {
  const text = [day.title, day.description, ...(day.activities ?? [])].join(' ')
  return MEAL_TYPES.filter(m => m.match.test(text))
}

// A single day row in the itinerary timeline
function ItineraryDay({ day, isLast }: { day: Itinerary; isLast: boolean }) {
  const activities = day.activities ?? []
  const meals = detectMeals(day)

  return (
    <div className="flex gap-3 sm:gap-5">
      {/* DAY label */}
      <div className="w-12 sm:w-16 flex-shrink-0 text-right pt-0.5">
        <p className="text-sm sm:text-lg font-extrabold text-gray-800 leading-none tracking-tight">
          DAY <span className="text-primary-600">{day.day}</span>
        </p>
      </div>

      {/* Marker + dashed connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <MapPin className="w-4 h-4 text-primary-500" strokeWidth={2.2} />
        {!isLast && <div className="w-px flex-1 border-l-2 border-dashed border-primary-200 my-1" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-7">
        <h4 className="text-sm font-bold text-primary-600 mb-2.5">{day.title}</h4>

        {activities.length > 0 ? (
          <ul className="space-y-1.5 mb-3">
            {activities.map((a, j) => (
              <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-[7px] flex-shrink-0" />
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        ) : day.description ? (
          <p className="text-sm text-gray-600 leading-relaxed mb-3">{day.description}</p>
        ) : null}

        {meals.length > 0 && (
          <div className="flex flex-wrap gap-2.5">
            {meals.map(({ key, label, icon: Icon }) => (
              <span key={key} className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-1.5 shadow-sm">
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-700">{label}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Quick-fact stat card
function FactCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-white rounded-lg border border-gray-100 px-3 py-2 shadow-sm">
      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary-600" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide leading-none mb-0.5">{label}</p>
        <p className="text-[13px] font-bold text-gray-900 truncate capitalize leading-tight">{value}</p>
      </div>
    </div>
  )
}

// Sticky section nav with scroll-spy
function SectionNav({ available }: { available: string[] }) {
  const [active, setActive] = useState(available[0] ?? 'overview')
  const sections = NAV_SECTIONS.filter(s => available.includes(s.id))

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections])

  const go = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const headerOffset = window.innerWidth >= 768 ? 130 : 82  // fixed site header
    const navHeight = 52                                        // this sticky tab bar
    const offset = headerOffset + navHeight + 12
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: { offset?: number }) => void } }).__lenis
    if (lenis) {
      lenis.scrollTo(el, { offset: -offset })
    } else {
      const y = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className="sticky top-[82px] md:top-[130px] z-30 bg-white/95 backdrop-blur-md border border-gray-100 rounded-xl shadow-sm">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide px-2">
        {sections.map(s => (
          <button key={s.id} onClick={() => go(s.id)}
            className={`relative py-3 px-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
              active === s.id ? 'text-primary-600' : 'text-gray-500 hover:text-gray-800'
            }`}>
            {s.label}
            {active === s.id && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-600 rounded-full" />}
          </button>
        ))}
      </div>
    </div>
  )
}

// Highlights — splits a leading emoji from the text; falls back to a rotating set
const HL_FALLBACK_EMOJIS = ['✨', '🏔️', '🌅', '🛶', '🏛️', '🎉', '📸', '🌿', '⭐', '🧭']

function splitEmoji(text: string, index: number): { emoji: string; rest: string } {
  const m = text.match(/^\s*(\p{Extended_Pictographic}(?:\u200d\p{Extended_Pictographic}|\uFE0F)*)\s*(.*)$/u)
  if (m && m[2].trim()) return { emoji: m[1], rest: m[2].trim() }
  return { emoji: HL_FALLBACK_EMOJIS[index % HL_FALLBACK_EMOJIS.length], rest: text.trim() }
}

function HighlightCard({ text, index }: { text: string; index: number }) {
  const { emoji, rest } = splitEmoji(text, index)
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-base leading-none flex-shrink-0 mt-0.5">{emoji}</span>
      <p className="text-sm text-gray-600 leading-relaxed">{rest}</p>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Page
// ════════════════════════════════════════════════════════════════════════════

export default function TourDetailPage() {
  const { id }  = useParams<{ id: string }>()
  const router  = useRouter()

  const [tour,        setTour]        = useState<Tour | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [locationMap, setLocationMap] = useState<Record<string, LocationNode>>({})
  const bookingRef = useRef<HTMLDivElement>(null)

  // Navigate to the full booking page with the current selection
  const goToBooking = (data: any) => {
    if (!tour) return
    const params = new URLSearchParams({
      tourId: String(tour.id),
      date:   data?.selectedDate ? new Date(data.selectedDate).toISOString() : '',
      from:   data?.departureCity ?? '',
      adults: String(data?.adults ?? 0),
      kids:   String(data?.children ?? 0),
      rooms:  String(data?.roomsNeeded ?? 1),
      going:  data?.goingTravel ?? 'self',
      ret:    data?.returnTravel ?? 'self',
      total:  String(data?.total ?? 0),
      addons: JSON.stringify(data?.addons ?? {}),
    })
    router.push(`/tour-booking?${params.toString()}`)
  }

  const fetchTour = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const numId = Number(id)
      const data = isNaN(numId) ? await tourService.getBySlug(id) : await tourService.getById(numId)
      setTour(data)
    } catch (e: any) {
      setError(e.message || 'Tour not found')
    } finally { setLoading(false) }
  }, [id])

  useEffect(() => { fetchTour() }, [fetchTour])

  // Load all locations to get images for activity pills + route map
  useEffect(() => {
    locationAdminService.getAll().then(locs => {
      const map: Record<string, LocationNode> = {}
      locs.forEach(l => { map[l.name.toLowerCase()] = l })
      setLocationMap(map)
    }).catch(() => {})
  }, [])

  const scrollToBooking = () => {
    if (window.innerWidth >= 1024 && bookingRef.current) {
      const y = bookingRef.current.getBoundingClientRect().top + window.scrollY - 150
      window.scrollTo({ top: y, behavior: 'smooth' })
    } else {
      // On mobile the booking calculator is rendered inline near the bottom
      const el = document.getElementById('booking')
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 150
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
  }

  if (loading) return <DetailSkeleton />

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center max-w-sm px-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Tour not found</h2>
          <p className="text-gray-500 text-sm mb-5">{error || 'This tour does not exist or has been removed.'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={fetchTour} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              <Loader2 className="w-4 h-4" /> Retry
            </button>
            <Link href="/tours" className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors">
              Browse Tours
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const p      = priceNum(tour.price)
  const rating = tour.rating ? Number(tour.rating) : null
  const images = tour.images?.length ? tour.images : [FALLBACK]
  const nights = tour.duration > 1 ? tour.duration - 1 : 0
  const destinations = tour.destinations ?? []

  // Detect package includes from included array
  const pkgIcons = [
    { key: 'hotel',      icon: Hotel,          label: 'Hotel',       match: /hotel|accommodat/i },
    { key: 'transport',  icon: Bus,            label: 'Transport',   match: /transport|vehicle|cab|bus|transfer/i },
    { key: 'meals',      icon: UtensilsCrossed,label: 'Meals',       match: /meal|breakfast|lunch|dinner|food/i },
    { key: 'sightseeing',icon: Binoculars,     label: 'Sightseeing', match: /sightseeing|visit|tour guide|guide/i },
    { key: 'camera',     icon: Camera,         label: 'Photography', match: /photo|camera|photography/i },
  ]
  const detectedPkg = pkgIcons.filter(pk => (tour.included ?? []).some(inc => pk.match.test(inc)))

  // Build route map locations
  const routeLocations = (tour.itinerary ?? [])
    .map(day => day.locationId
      ? Object.values(locationMap).find(l => l.id === day.locationId)
      : Object.values(locationMap).find(l => l.name.toLowerCase() === day.title.toLowerCase())
    )
    .filter((l): l is LocationNode => !!l && !!l.lat && !!l.lng)
  const uniqueRoute = routeLocations.filter((l, i) => i === 0 || l.id !== routeLocations[i - 1].id)

  // Which nav sections are present
  const availableSections = [
    'overview',
    (tour.itinerary ?? []).length > 0 ? 'itinerary' : '',
    ((tour.included ?? []).length > 0 || (tour.excluded ?? []).length > 0) ? 'inclusions' : '',
    'policies',
    'reviews',
  ].filter(Boolean)

  const shareTour = async () => {
    const shareData = { title: tour.title, text: tour.description, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(shareData)
      else { await navigator.clipboard.writeText(window.location.href) }
    } catch { /* user cancelled */ }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-0">

      <div className="container-custom pt-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/tours" className="hover:text-primary-600 transition-colors">Tours</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600 font-medium truncate max-w-[200px]">{tour.title}</span>
        </nav>

        {/* Title header */}
        <div className="mb-5">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">{tour.title}</h1>
          <div className="flex items-center justify-between gap-4 mt-1">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 min-w-0">
              {destinations.length > 0 && (
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary-500" />{destinations.join(' · ')}</span>
              )}
              {rating && (
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
                  {(tour.reviewCount ?? 0) > 0 && <span className="text-gray-400">({tour.reviewCount} reviews)</span>}
                </span>
              )}
            </div>

            <button onClick={shareTour}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        {/* Gallery */}
        <TourGallery images={images} title={tour.title} />

        {/* Quick facts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-4">
          <FactCard icon={Clock}    label="Duration"   value={`${tour.duration} Days${nights > 0 ? ` / ${nights} Nights` : ''}`} />
          <FactCard icon={Users}    label="Group Size" value={`Max ${tour.maxGroupSize}`} />
          <FactCard icon={Mountain} label="Difficulty" value={tour.difficulty} />
          <FactCard icon={Tag}      label="Category"   value={tour.category} />
        </div>
      </div>

      {/* Body */}
      <div className="container-custom mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left column ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Section nav — sits above the About card, scrolls with content */}
            <SectionNav available={availableSections} />

            {/* About */}
            <Section id="overview" title="About This Tour">
              <p className="text-gray-600 text-sm leading-relaxed">{tour.description}</p>
              {tour.longDescription && <p className="text-gray-600 text-sm leading-relaxed mt-3">{tour.longDescription}</p>}

              {/* Package Includes icons */}
              {detectedPkg.length > 0 && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">This Package Includes</h3>
                  <div className="flex flex-wrap gap-3">
                    {detectedPkg.map(({ key, icon: Icon, label }) => (
                      <div key={key} className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Icon className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Section>

            {/* Itinerary */}
            {(tour.itinerary ?? []).length > 0 && (
              <Section id="itinerary" title="Day-by-Day Itinerary" icon={<span className="w-1.5 h-6 bg-primary-600 rounded-full" />}>
                <p className="text-sm text-gray-400 -mt-2 mb-6">{(tour.itinerary ?? []).length} days of curated experiences</p>
                <div>
                  {(tour.itinerary ?? []).map((day, i) => (
                    <ItineraryDay key={i} day={day} isLast={i === (tour.itinerary ?? []).length - 1} />
                  ))}
                </div>
              </Section>
            )}

            {/* Highlights — after itinerary, emoji point cards */}
            {(tour.highlights ?? []).length > 0 && (
              <Section title="Tour Highlights" icon={<Sparkles className="w-5 h-5 text-primary-500" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(tour.highlights ?? []).map((h, i) => (
                    <HighlightCard key={i} text={h} index={i} />
                  ))}
                </div>
              </Section>
            )}

            {/* Tour Route Map */}
            {uniqueRoute.length >= 2 && (
              <Section title="Tour Route Map" icon={<MapPin className="w-5 h-5 text-orange-600" />}>
                <TourRouteMap locations={uniqueRoute} height="460px" />
              </Section>
            )}

            {/* Included / Excluded */}
            {((tour.included ?? []).length > 0 || (tour.excluded ?? []).length > 0) && (
              <div id="inclusions" className="scroll-mt-40 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(tour.included ?? []).length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-green-700 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>
                      What&apos;s Included
                    </h3>
                    <ul className="space-y-2.5">
                      {(tour.included ?? []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(tour.excluded ?? []).length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-red-600 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center"><X className="w-3.5 h-3.5" /></span>
                      Not Included
                    </h3>
                    <ul className="space-y-2.5">
                      {(tour.excluded ?? []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Policies */}
            <div id="policies" className="scroll-mt-40 space-y-4">
              <Accordion title={<><Ban className="w-4 h-4 text-red-500" /> Cancellation Policy</>} defaultOpen>
                <div className="pt-4 divide-y divide-gray-100">
                  {CANCELLATION_POLICY.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-2.5 first:pt-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{item.days}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.rule}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Accordion>

              <Accordion title={<><FileText className="w-4 h-4 text-primary-500" /> Terms &amp; Conditions</>}>
                <div className="pt-4 space-y-2.5">
                  {TERMS.map((term, i) => (
                    <div key={i} className="flex gap-2.5 text-sm text-gray-600">
                      <span className="text-gray-300 font-bold flex-shrink-0 text-xs mt-0.5 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      <p className="leading-relaxed">{term}</p>
                    </div>
                  ))}
                </div>
              </Accordion>
            </div>

            {/* Why choose */}
            <Section title="Why Book With Us?" icon={<Award className="w-5 h-5 text-primary-600" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {[
                  { icon: Award,       title: 'Expert Local Guides',  desc: 'Certified guides with 10+ years experience' },
                  { icon: Wallet,      title: 'Best Price Guarantee', desc: 'We match any lower price you find' },
                  { icon: ShieldCheck, title: 'Secure Booking',       desc: 'Your data and payment are fully protected' },
                  { icon: Headphones,  title: '24/7 Support',         desc: "We're with you before, during & after" },
                  { icon: Bus,         title: 'All Transfers Included',desc: 'Airport pickup, hotel drops, sightseeing' },
                  { icon: Star,        title: 'Trusted by 1000+',     desc: 'Verified reviews from real travelers' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Reviews */}
            <Section id="reviews" title="Traveler Reviews" icon={<Star className="w-5 h-5 text-yellow-500" />}>
              {(tour.reviewCount ?? 0) > 0 && rating ? (
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-gray-900">{Number(rating).toFixed(1)}</p>
                    <div className="flex justify-center mt-1">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}</div>
                    <p className="text-xs text-gray-400 mt-1">{tour.reviewCount} reviews</p>
                  </div>
                  <p className="text-sm text-gray-500 border-l border-gray-100 pl-4">
                    Rated <span className="font-semibold text-gray-700">{Number(rating) >= 4.5 ? 'Excellent' : Number(rating) >= 4 ? 'Very Good' : 'Good'}</span> by travelers who booked this tour.
                  </p>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="flex justify-center mb-2">{[1,2,3,4,5].map(s => <Star key={s} className="w-6 h-6 text-gray-200" />)}</div>
                  <p className="text-sm text-gray-500">No reviews yet — be the first to review!</p>
                </div>
              )}
            </Section>

          </div>

          {/* ── Sidebar ─────────────────────────────────────────────── */}
          <div className="lg:col-span-1" id="booking">
            <div ref={bookingRef} className="lg:sticky lg:top-[150px] space-y-4">

              {/* Booking card */}
              <div data-booking-card className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-3 flex items-center justify-between gap-2">
                  <p className="text-white whitespace-nowrap">
                    <span className="text-primary-100 text-xs">From</span>{' '}
                    <span className="text-xl font-extrabold align-middle">₹{p.toLocaleString('en-IN')}</span>{' '}
                    <span className="text-primary-200 text-xs">/ person</span>
                  </p>
                  {rating && (
                    <span className="flex items-center gap-1 bg-white/15 rounded-full px-2 py-0.5 flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                      <span className="text-xs font-semibold text-white">{rating.toFixed(1)}</span>
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <BookingCalculator tour={tour} onBook={goToBooking} />
                </div>
              </div>

              {/* Trust badges */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-primary-600" />
                  <span className="text-xs font-semibold text-gray-700">Why book with us?</span>
                </div>
                <ul className="space-y-2.5">
                  {[
                    { icon: ThumbsUp,       text: 'Best price guarantee' },
                    { icon: Check,          text: 'Transparent pricing' },
                    { icon: Award,          text: 'Expert local guides' },
                    { icon: HeartHandshake, text: '24/7 customer support' },
                    { icon: Shield,         text: 'Verified & trusted operator' },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3 h-3 text-green-600" />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick cancellation summary */}
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
                <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Cancellation Summary
                </p>
                <ul className="space-y-1.5 text-xs text-amber-700">
                  <li>• 30+ days before: 25% charges</li>
                  <li>• 15–30 days before: 50% charges</li>
                  <li>• Within 7 days: 100% charges</li>
                  <li>• Registration: Non-refundable</li>
                </ul>
              </div>

              {/* Need help card — moved to bottom */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-sm font-bold text-gray-900 mb-1">Need help planning?</p>
                <p className="text-xs text-gray-500 mb-4">Talk to our travel experts for free.</p>
                <div className="grid grid-cols-2 gap-2">
                  <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, I'm interested in "${tour.title}"`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 py-2.5 rounded-xl text-xs font-semibold transition-colors">
                    <WhatsAppIcon size={16} /> WhatsApp
                  </a>
                  <a href={`tel:+${WHATSAPP}`}
                    className="flex items-center justify-center gap-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 py-2.5 rounded-xl text-xs font-semibold transition-colors">
                    <Phone className="w-4 h-4" /> Call Us
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Featured / related tours */}
        <FeaturedTours excludeId={tour.id} />
      </div>

      {/* ── Mobile sticky booking bar ──────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div>
          <p className="text-[11px] text-gray-400 leading-none">Starting from</p>
          <p className="text-xl font-extrabold text-gray-900">₹{p.toLocaleString('en-IN')}<span className="text-xs font-medium text-gray-400"> /person</span></p>
        </div>
        <button onClick={scrollToBooking}
          className="flex-1 max-w-[180px] bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl text-sm font-bold transition-colors shadow-md">
          Check Availability
        </button>
      </div>
    </div>
  )
}
