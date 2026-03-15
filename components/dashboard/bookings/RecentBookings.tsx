'use client'

import { Calendar, User, MapPin } from 'lucide-react'
import Link from 'next/link'

// TODO: Fetch from API
const recentBookings = [
  {
    id: 1,
    customerName: 'John Smith',
    tourName: 'Golden Triangle Tour',
    date: '2026-04-15',
    status: 'confirmed',
    amount: '$599',
  },
  {
    id: 2,
    customerName: 'Sarah Johnson',
    tourName: 'Jaipur City Tour',
    date: '2026-04-18',
    status: 'pending',
    amount: '$149',
  },
  {
    id: 3,
    customerName: 'Michael Brown',
    tourName: 'Udaipur Lake City',
    date: '2026-04-20',
    status: 'confirmed',
    amount: '$249',
  },
  {
    id: 4,
    customerName: 'Emma Wilson',
    tourName: 'Jaisalmer Desert Safari',
    date: '2026-04-22',
    status: 'pending',
    amount: '$329',
  },
]

const statusColors = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function RecentBookings() {
  return (
    <div className="space-y-4">
      {recentBookings.map((booking) => (
        <Link
          key={booking.id}
          href={`/dashboard/bookings/${booking.id}`}
          className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-900">{booking.customerName}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status as keyof typeof statusColors]}`}>
              {booking.status}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
            <MapPin className="w-4 h-4" />
            <span>{booking.tourName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{new Date(booking.date).toLocaleDateString()}</span>
            </div>
            <span className="font-bold text-primary-600">{booking.amount}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
