'use client'

import { Calendar, Heart, Star, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getUser, getToken } from '@/lib/auth'

interface Booking {
  id: string
  startDate: string
  numberOfTravelers: number
  status: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export default function MyAccountPage() {
  const [userName, setUserName] = useState('Traveler')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const user = getUser()
        const token = getToken()

        if (!user || !token) {
          window.location.href = '/login?redirect=/my-account'
          return
        }

        setUserName(user.name || 'Traveler')

        const res = await fetch(`${API_URL}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setBookings(data.data || data.bookings || [])
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const upcomingBookings = bookings.filter((b) => new Date(b.startDate) > new Date())
  const totalBookings = bookings.length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white animate-pulse">
          <div className="h-8 bg-white/20 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
        <p className="text-primary-100">Ready for your next adventure?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{upcomingBookings.length}</div>
              <div className="text-sm text-gray-600">Upcoming Trips</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-gray-600">Wishlist</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
          </div>
        </div>
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
          <div className="space-y-4">
            {upcomingBookings.slice(0, 2).map((booking) => (
              <div key={booking.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Booking #{booking.id}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                    </span>
                    <span>{booking.numberOfTravelers} travelers</span>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No upcoming trips</p>
            <Link href="/tours" className="text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block">
              Browse tours
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/tours" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-primary-300 transition-colors">
          <MapPin className="w-8 h-8 text-primary-600 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Browse Tours</h3>
          <p className="text-sm text-gray-600">Discover amazing destinations</p>
        </Link>
        <Link href="/custom-tour" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-primary-300 transition-colors">
          <Star className="w-8 h-8 text-primary-600 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Custom Tour</h3>
          <p className="text-sm text-gray-600">Build your perfect itinerary</p>
        </Link>
        <Link href="/contact" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-primary-300 transition-colors">
          <Calendar className="w-8 h-8 text-primary-600 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Contact Us</h3>
          <p className="text-sm text-gray-600">Get help from our team</p>
        </Link>
      </div>
    </div>
  )
}
