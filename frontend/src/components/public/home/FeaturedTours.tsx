'use client'

import { MapPin, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import type { Tour } from '@/types'
import { toWebP } from '@/lib/image'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
]

function priceNum(p: string | number | null | undefined) {
  if (!p) return 0
  return typeof p === 'string' ? parseFloat(p) || 0 : p
}

interface Props { tours: Tour[] }

export default function FeaturedTours({ tours }: Props) {
  if (!tours || tours.length === 0) return null

  return (
    <section className="bg-emerald-50/30 py-16 md:py-20">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="font-montez text-4xl text-[#f97316] md:text-5xl lg:text-6xl">
            Best Place For You
          </p>
          <h2 className="mt-1 font-poppins text-3xl font-bold text-slate-800 md:text-5xl">
            Most <span className="text-blue-600">Popular</span> Tour
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm text-gray-600 md:text-base">
            Discover the world's most popular tours with unforgettable experiences. Your best place
            for adventure, culture, and memories that last a lifetime starts here.
          </p>
        </div>

        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tours.slice(0, 4).map((tour, i) => {
            const imageUrl = toWebP(
              (tour.images ?? [])[0] || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
              800
            )
            const price = priceNum(tour.price)

            // Get start/end locations from tour locations
            const startLocation = tour.tourLocations?.[0]?.name || 'Delhi'
            const endLocation = tour.tourLocations?.[tour.tourLocations.length - 1]?.name || 'Delhi'
            const locationText = startLocation === endLocation 
              ? `${startLocation} To ${endLocation}` 
              : `${startLocation} - ${endLocation}`

            // Generate upcoming dates (placeholder - would come from booking system)
            const upcomingDates = generateUpcomingDates(4)

            return (
              <div
                key={tour.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image with badges */}
                <div className="relative h-56 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Start-End Badge */}
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow backdrop-blur-sm">
                    <MapPin className="h-3.5 w-3.5 text-green-600" />
                    {locationText}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow backdrop-blur-sm">
                    <Clock className="h-3.5 w-3.5 text-orange-600" />
                    {tour.duration}D
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="mb-2 text-base font-bold leading-tight text-gray-800 line-clamp-2 group-hover:text-[#f97316]">
                    {tour.title}
                  </h3>

                  {/* Dates */}
                  <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-600">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <span className="line-clamp-1">{upcomingDates}</span>
                  </div>

                  {/* Price */}
                  <div className="mb-3 text-lg font-bold text-[#f97316]">
                    ₹{price.toLocaleString('en-IN')} <span className="text-sm font-normal text-gray-500">/Person</span>
                  </div>

                  {/* Request CallBack Button */}
                  <Link
                    href={`tel:8287828267`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-[#f97316] hover:bg-[#f97316] hover:text-white"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Request CallBack
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Helper function to generate upcoming dates
function generateUpcomingDates(count: number): string {
  const dates: string[] = []
  const today = new Date()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  for (let i = 0; i < count; i++) {
    const futureDate = new Date(today)
    futureDate.setDate(today.getDate() + (i * 7)) // Weekly dates
    dates.push(`${futureDate.getDate()} ${months[futureDate.getMonth()]}`)
  }
  
  return dates.join(', ') + ', ...'
}
