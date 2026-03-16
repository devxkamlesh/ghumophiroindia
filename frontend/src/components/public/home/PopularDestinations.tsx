'use client'

import Link from 'next/link'
import { MapPin, ArrowRight, Compass } from 'lucide-react'
import type { LocationNode } from '@/types'

const FALLBACK_LOCATIONS: LocationNode[] = [
  { id: 0, slug: 'jaipur',    name: 'Jaipur',    type: 'city', path: 'india/rajasthan/jaipur',    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2070', description: 'Royal palaces and vibrant bazaars',    parentId: null, lat: '26.9124', lng: '75.7873', isActive: true, isPopular: true, createdAt: '' },
  { id: 0, slug: 'udaipur',   name: 'Udaipur',   type: 'city', path: 'india/rajasthan/udaipur',   image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=2070', description: 'Romantic lakes and majestic palaces', parentId: null, lat: '24.5854', lng: '73.7125', isActive: true, isPopular: true, createdAt: '' },
  { id: 0, slug: 'jaisalmer', name: 'Jaisalmer', type: 'city', path: 'india/rajasthan/jaisalmer', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070', description: 'Desert adventures and golden forts',    parentId: null, lat: '26.9157', lng: '70.9083', isActive: true, isPopular: true, createdAt: '' },
  { id: 0, slug: 'jodhpur',   name: 'Jodhpur',   type: 'city', path: 'india/rajasthan/jodhpur',   image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070', description: 'Majestic forts and blue houses',       parentId: null, lat: '26.2389', lng: '73.0243', isActive: true, isPopular: true, createdAt: '' },
  { id: 0, slug: 'bikaner',   name: 'Bikaner',   type: 'city', path: 'india/rajasthan/bikaner',   image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071', description: 'Ancient forts and camel safaris',      parentId: null, lat: '28.0229', lng: '73.3119', isActive: true, isPopular: true, createdAt: '' },
  { id: 0, slug: 'pushkar',   name: 'Pushkar',   type: 'city', path: 'india/rajasthan/pushkar',   image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071', description: 'Sacred lakes and spiritual vibes',     parentId: null, lat: '26.4899', lng: '74.5511', isActive: true, isPopular: true, createdAt: '' },
]

const GRADIENTS = [
  'from-pink-600/75 to-rose-700/75',
  'from-blue-500/75 to-cyan-600/75',
  'from-yellow-500/75 to-orange-600/75',
  'from-blue-600/75 to-indigo-700/75',
  'from-amber-500/75 to-orange-700/75',
  'from-purple-500/75 to-pink-600/75',
]

interface Props {
  locations?: LocationNode[]
}

export default function PopularDestinations({ locations }: Props) {
  const items = locations && locations.length > 0 ? locations : FALLBACK_LOCATIONS

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">

        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-4">
            <Compass className="w-4 h-4" />
            <span className="text-sm font-semibold">Explore Destinations</span>
          </div>
          <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Popular Destinations
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most sought-after cities in Rajasthan
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((loc, i) => {
            const gradient = GRADIENTS[i % GRADIENTS.length]
            const image    = loc.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071'
            const href     = `/destinations/${loc.slug}`

            return (
              <Link key={loc.id || loc.slug} href={href}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${image}')` }} />
                <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-90 group-hover:opacity-95 transition-opacity`} />

                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                      <div className="flex items-center gap-1 text-white">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold capitalize">{loc.type}</span>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="text-white">
                    <h3 className="text-3xl md:text-4xl font-bold mb-1 transform group-hover:translate-x-1 transition-transform">
                      {loc.name}
                    </h3>
                    <p className="text-white/75 text-sm font-mono">{loc.path}</p>
                    {loc.description && <p className="text-white/75 text-sm mt-1">{loc.description}</p>}
                    <div className="flex items-center gap-2 text-sm font-semibold mt-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                      <span>Explore {loc.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-orange-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Can&apos;t Find Your Dream Destination?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Create a custom tour tailored to your preferences.
            </p>
            <Link href="/custom-tour"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl">
              Build Custom Tour <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Fallback data — shown when DB has no destinations yet ─────────────────────

const FALLBACK_DESTINATIONS = [
  {
    id: 0, slug: 'jaipur', name: 'Jaipur', subtitle: 'The Pink City',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2070',
    description: 'Royal palaces and vibrant bazaars',
    tourCount: 0, isPopular: true, createdAt: '',
  },
  {
    id: 0, slug: 'udaipur', name: 'Udaipur', subtitle: 'City of Lakes',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=2070',
    description: 'Romantic lakes and majestic palaces',
    tourCount: 0, isPopular: true, createdAt: '',
  },
  {
    id: 0, slug: 'jaisalmer', name: 'Jaisalmer', subtitle: 'Golden City',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070',
    description: 'Desert adventures and golden forts',
    tourCount: 0, isPopular: true, createdAt: '',
  },
  {
    id: 0, slug: 'jodhpur', name: 'Jodhpur', subtitle: 'Blue City',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070',
    description: 'Majestic forts and blue houses',
    tourCount: 0, isPopular: true, createdAt: '',
  },
  {
    id: 0, slug: 'bikaner', name: 'Bikaner', subtitle: 'Desert Jewel',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071',
    description: 'Ancient forts and camel safaris',
    tourCount: 0, isPopular: true, createdAt: '',
  },
  {
    id: 0, slug: 'pushkar', name: 'Pushkar', subtitle: 'Holy City',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071',
    description: 'Sacred lakes and spiritual vibes',
    tourCount: 0, isPopular: true, createdAt: '',
  },
] satisfies Destination[]

// Gradient overlays per index — cycles if more than 6 destinations
const GRADIENTS = [
  'from-pink-600/75 to-rose-700/75',
  'from-blue-500/75 to-cyan-600/75',
  'from-yellow-500/75 to-orange-600/75',
  'from-blue-600/75 to-indigo-700/75',
  'from-amber-500/75 to-orange-700/75',
  'from-purple-500/75 to-pink-600/75',
]

// Fallback images for destinations without an image
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2070',
  'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=2070',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071',
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071',
]

interface Props {
  destinations?: Destination[]
}

export default function PopularDestinations({ destinations }: Props) {
  // Use real data if available, otherwise fall back to static
  const items = destinations && destinations.length > 0 ? destinations : FALLBACK_DESTINATIONS

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-4">
            <Compass className="w-4 h-4" />
            <span className="text-sm font-semibold">Explore Destinations</span>
          </div>
          <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Popular Destinations
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most sought-after cities in Rajasthan
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((dest, i) => {
            const gradient = GRADIENTS[i % GRADIENTS.length]
            const image    = dest.image || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]
            const href     = `/tours?search=${encodeURIComponent(dest.name)}`

            return (
              <Link
                key={dest.id || dest.slug}
                href={href}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${image}')` }}
                />

                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-90 group-hover:opacity-95 transition-opacity`} />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  {/* Top */}
                  <div className="flex justify-between items-start">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                      <div className="flex items-center gap-1 text-white">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">
                          {dest.tourCount > 0 ? `${dest.tourCount} Tours` : 'Explore'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="text-white">
                    <h3 className="text-3xl md:text-4xl font-bold mb-1 transform group-hover:translate-x-1 transition-transform">
                      {dest.name}
                    </h3>
                    <p className="text-white/90 text-base font-medium mb-1">{dest.subtitle}</p>
                    <p className="text-white/75 text-sm">{dest.description}</p>

                    <div className="flex items-center gap-2 text-sm font-semibold mt-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                      <span>Explore {dest.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Shine sweep on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-orange-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Can&apos;t Find Your Dream Destination?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Create a custom tour tailored to your preferences. Choose your destinations, duration, and experiences.
            </p>
            <Link
              href="/custom-tour"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Build Custom Tour
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
