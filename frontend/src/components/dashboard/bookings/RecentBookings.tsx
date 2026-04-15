'use client'

import { Calendar, User, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getToken } from '@/lib/auth'

interface Booking {
  id: string
  name: string
  email: string
  tourId?: string
  startDate: string
  totalPrice: number
  status: string
}

const statusColors = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export default function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const token = getToken()
        const response = await fetch(`${API_URL}/bookings?limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setBookings(data.bookings || data.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch recent bookings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No recent bookings</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Link
          key={booking.id}
          href={`/dashboard/bookings/${booking.id}`}
          className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-900">{booking.name}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
              {booking.status}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
            <MapPin className="w-4 h-4" />
            <span>{booking.email}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{new Date(booking.startDate).toLocaleDateString()}</span>
            </div>
            <span className="font-bold text-primary-600">${booking.totalPrice}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
