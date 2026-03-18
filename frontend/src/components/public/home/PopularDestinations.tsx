'use client'

import Link from 'next/link'
import { ArrowRight, Compass, MapPin, Map, Globe } from 'lucide-react'
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
  // Filter by type and isPopular - only show items marked as popular in database
  const popularCities = locations.filter(l => (l.type === 'city' || l.type === 'place') && l.isPopular)
  const popularStates = locations.filter(l => l.type === 'state' && l.isPopular)
  const popularCountries = locations.filter(l => l.type === 'country' && l.isPopular)

  const hasCities = popularCities.length > 0
  const hasStates = popularStates.length > 0
  const hasCountries = popularCountries.length > 0

  // Debug logging (remove in production)
  if (typeof window !== 'undefined') {
    console.log('PopularDestinations - Total locations:', locations.length)
    console.log('PopularDestinations - Popular cities:', popularCities.length, popularCities.map(l => l.name))
    console.log('PopularDestinations - Popular states:', popularStates.length, popularStates.map(l => l.name))
    console.log('PopularDestinations - Popular countries:', popularCountries.length, popularCountries.map(l => l.name))
  }

  // Don't render section at all if no popular locations exist
  if (!hasCities && !hasStates && !hasCountries) return null

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container-custom space-y-16">

        {/* ── Main header ────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-primary-600 text-sm font-semibold mb-3">
              <Compass className="w-4 h-4" />
              <span>Explore Destinations</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Popular Destinations
            </h2>
            <p className="text-gray-500 mt-2 text-lg">Discover the most sought-after places to visit</p>
          </div>
          <Link href="/destinations"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all text-sm shrink-0">
            All destinations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 1 — Cities & Places
        ══════════════════════════════════════════════════════════════════ */}
        {hasCities && (
          <LocationSection
            title="Cities & Places"
            subtitle="Explore vibrant cities and iconic landmarks"
            icon={<MapPin className="w-4 h-4 text-primary-600" />}
            iconBg="bg-primary-100"
            items={popularCities}
          />
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2 — States
        ══════════════════════════════════════════════════════════════════ */}
        {hasStates && (
          <LocationSection
            title="States"
            subtitle="Discover entire regions and their wonders"
            icon={<Map className="w-4 h-4 text-violet-600" />}
            iconBg="bg-violet-100"
            items={popularStates}
          />
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 3 — Countries
        ══════════════════════════════════════════════════════════════════ */}
        {hasCountries && (
          <LocationSection
            title="Countries"
            subtitle="Explore nations and their diverse cultures"
            icon={<Globe className="w-4 h-4 text-blue-600" />}
            iconBg="bg-blue-100"
            items={popularCountries}
          />
        )}

        {/* Custom tour nudge */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl px-7 py-5">
          <div>
            <p className="font-bold text-gray-900">Can&apos;t find your dream destination?</p>
            <p className="text-gray-400 text-sm mt-0.5">We build fully custom itineraries tailored to you.</p>
          </div>
          <Link href="/custom-tour"
            className="shrink-0 inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-md">
            Build Custom Tour <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Location Section ──────────────────────────────────────────────────── */
interface LocationSectionProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  iconBg: string
  items: LocationNode[]
}

function LocationSection({ title, subtitle, icon, iconBg, items }: LocationSectionProps) {
  // Bento layout: 1 large + up to 4 small
  const [featured, ...rest] = items.slice(0, 5)

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{title}</h3>
          <p className="text-gray-400 text-xs">{subtitle}</p>
        </div>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Featured large card */}
        {featured && (
          <DestCard loc={featured} className="md:col-span-5 h-80 md:h-[440px]" large />
        )}
        {/* Smaller cards */}
        {rest.length > 0 && (
          <div className="md:col-span-7 grid grid-cols-2 gap-4">
            {rest.map(loc => (
              <DestCard key={loc.id || loc.slug} loc={loc} className="h-52" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Destination card ──────────────────────────────────────────────────── */
function DestCard({ loc, className = '', large = false }: {
  loc: LocationNode
  className?: string
  large?: boolean
}) {
  const image = toWebP(loc.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071', 800)
  const { country, state } = parsePath(loc.path)

  return (
    <Link href={`/destinations/${loc.slug}`}
      className={`group relative rounded-2xl overflow-hidden block ${className}`}>
      {/* Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Location breadcrumb badge */}
      {(country || state) && (
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm border border-white/10 text-white/80 text-[10px] font-medium px-2.5 py-1 rounded-full">
          <MapPin className="w-3 h-3" />
          {[state, country].filter(Boolean).join(', ')}
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <h3 className={`font-bold text-white leading-tight ${large ? 'text-4xl md:text-5xl' : 'text-2xl'}`}>
          {loc.name}
        </h3>
        {loc.description && (
          <p className="text-white/65 text-sm mt-1 line-clamp-1">{loc.description}</p>
        )}
        <div className="flex items-center gap-1 text-white/0 group-hover:text-white/90 text-xs font-semibold mt-3 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          Explore <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  )
}
