'use client'

import Link from 'next/link'
import { MapPin, ArrowRight, Compass } from 'lucide-react'

const destinations = [
  {
    name: 'Jaipur',
    subtitle: 'The Pink City',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2070',
    tours: 24,
    description: 'Royal palaces and vibrant bazaars',
    color: 'from-pink-500/80 to-rose-600/80',
  },
  {
    name: 'Udaipur',
    subtitle: 'City of Lakes',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=2070',
    tours: 18,
    description: 'Romantic lakes and majestic palaces',
    color: 'from-blue-500/80 to-cyan-600/80',
  },
  {
    name: 'Jaisalmer',
    subtitle: 'Golden City',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070',
    tours: 15,
    description: 'Desert adventures and golden forts',
    color: 'from-yellow-500/80 to-orange-600/80',
  },
  {
    name: 'Jodhpur',
    subtitle: 'Blue City',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=2070',
    tours: 12,
    description: 'Majestic forts and blue houses',
    color: 'from-blue-600/80 to-indigo-700/80',
  },
  {
    name: 'Bikaner',
    subtitle: 'Desert Jewel',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071',
    tours: 10,
    description: 'Ancient forts and camel safaris',
    color: 'from-amber-500/80 to-orange-700/80',
  },
  {
    name: 'Pushkar',
    subtitle: 'Holy City',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071',
    tours: 8,
    description: 'Sacred lakes and spiritual vibes',
    color: 'from-purple-500/80 to-pink-600/80',
  },
]

export default function PopularDestinations() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        {/* Section Header */}
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

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.name}
              href={`/destinations/${dest.name.toLowerCase()}`}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${dest.image}')` }}
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} to-transparent opacity-90 group-hover:opacity-95 transition-opacity`} />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                {/* Top Badge */}
                <div className="flex justify-between items-start">
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                    <div className="flex items-center space-x-1 text-white">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-semibold">{dest.tours} Tours</span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="text-white">
                  <div className="mb-2">
                    <h3 className="font-sans text-3xl md:text-4xl font-bold mb-1 transform group-hover:translate-x-2 transition-transform">
                      {dest.name}
                    </h3>
                    <p className="text-white/90 text-lg font-medium mb-2">{dest.subtitle}</p>
                    <p className="text-white/80 text-sm">{dest.description}</p>
                  </div>

                  {/* Explore Button */}
                  <div className="flex items-center space-x-2 text-sm font-semibold mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                    <span>Explore {dest.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
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
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              <span>Build Custom Tour</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
