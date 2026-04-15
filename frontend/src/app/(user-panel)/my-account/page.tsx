'use client'

import { Calendar, Heart, Star, MapPin, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { bookingService } from '@/services/api'
import type { Booking } from '@/types'

export default function MyAccountPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('Traveler')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const user = getUser()
    if (user?.name) setUserName(user.name)

    bookingService
      .getMyBookings()
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.startDate) > new Date() && b.status !== 'cancelled'
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-1">Welcome back, {userName}!</h1>
        <p className="text-primary-100">Ready for your next adventure?</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'blue' },
          { label: 'Upcoming Trips', value: upcomingBookings.length, icon: MapPin, color: 'green' },
          { label: 'Wishlist', value: 0, icon: Heart, color: 'pink' },
          { label: 'Reviews', value: 0, icon: Star, color: 'yellow' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 text-${color}-600`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Upcoming Trips</h2>
          <Link href="/my-account/bookings" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all
          </Link>
        </div>

        {upcomingBookings.length > 0 ? (
          <div className="space-y-3">
            {upcomingBookings.slice(0, 3).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-7 h-7 text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {booking.tour?.title ?? `Booking #${booking.id}`}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(booking.startDate).toLocaleDateString()}
                    </span>
                    <span>{booking.numberOfTravelers} traveler{booking.numberOfTravelers !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No upcoming trips</p>
            <Link href="/tours" className="text-primary-600 hover:text-primary-700 font-medium text-sm mt-2 inline-block">
              Browse tours →
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: '/tours', icon: MapPin, title: 'Browse Tours', desc: 'Discover amazing destinations' },
          { href: '/custom-tour', icon: Star, title: 'Custom Tour', desc: 'Build your perfect itinerary' },
          { href: '/contact', icon: Calendar, title: 'Contact Us', desc: 'Get help from our team' },
        ].map(({ href, icon: Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-primary-300 hover:shadow-md transition-all"
          >
            <Icon className="w-8 h-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
