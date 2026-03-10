'use client'

import { Calendar, Users, MapPin, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { bookingService } from '@/services/api'
import type { Booking, BookingStatus } from '@/types'

const STATUS_STYLES: Record<BookingStatus, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    bookingService
      .getMyBookings()
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-500 mt-1">View and manage your tour bookings</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                {/* Tour image placeholder */}
                <div className="w-full md:w-44 h-44 bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-10 h-10 text-primary-300" />
                </div>

                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-400">#{booking.id}</span>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            STATUS_STYLES[booking.status] ?? 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            booking.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-700'
                              : booking.paymentStatus === 'refunded'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {booking.tour?.title ?? `Tour Booking #${booking.id}`}
                      </h3>
                      {booking.tour?.destination && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {booking.tour.destination}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-bold text-primary-600">
                        ₹{Number(booking.totalPrice).toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-400">Total</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-400">Start</div>
                        <div className="font-medium">{new Date(booking.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-400">End</div>
                        <div className="font-medium">{new Date(booking.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-400">Travelers</div>
                        <div className="font-medium">{booking.numberOfTravelers} {booking.numberOfTravelers === 1 ? 'person' : 'people'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {booking.tourId && (
                      <Link
                        href={`/tours/${booking.tourId}`}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        View Tour
                      </Link>
                    )}
                    {booking.specialRequests && (
                      <span className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm">
                        Special request noted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-14 text-center">
          <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-500 mb-6">Start your adventure by booking a tour</p>
          <Link
            href="/tours"
            className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            Browse Tours
          </Link>
        </div>
      )}
    </div>
  )
}
