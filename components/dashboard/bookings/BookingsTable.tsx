'use client'

import { Eye, Mail, Phone, Check, X, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Booking {
  id: string
  name: string
  email: string
  phone?: string
  tourId?: string
  startDate: string
  numberOfTravelers: number
  totalPrice: number
  status: string
  paymentStatus?: string
}

export default function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch('/api/bookings')
        if (response.ok) {
          const data = await response.json()
          setBookings(data.bookings || [])
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const statusColors = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const paymentColors = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    refunded: 'bg-gray-100 text-gray-700',
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading bookings...</p>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No bookings found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Booking ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Travelers
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-mono text-sm font-semibold text-gray-900">{booking.id}</div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{booking.name}</div>
                <div className="text-xs text-gray-500">{booking.email}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(booking.startDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {booking.numberOfTravelers}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                ${booking.totalPrice}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[booking.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Link
                    href={`/dashboard/bookings/${booking.id}`}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </Link>
                  <a
                    href={`mailto:${booking.email}`}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4 text-gray-600" />
                  </a>
                  {booking.phone && (
                    <a
                      href={`tel:${booking.phone}`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Call"
                    >
                      <Phone className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                  {booking.status === 'pending' && (
                    <>
                      <button
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                        title="Confirm"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
