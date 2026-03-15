'use client'

import { Eye, Mail, Phone, Check, X } from 'lucide-react'
import Link from 'next/link'

// TODO: Fetch from API
const bookings = [
  {
    id: 'BK001',
    customerName: 'John Smith',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    tourName: 'Golden Triangle Tour',
    startDate: '2026-04-15',
    travelers: 2,
    amount: 1198,
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    id: 'BK002',
    customerName: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 234 567 8901',
    tourName: 'Jaipur City Tour',
    startDate: '2026-04-18',
    travelers: 4,
    amount: 596,
    status: 'pending',
    paymentStatus: 'pending',
  },
  {
    id: 'BK003',
    customerName: 'Michael Brown',
    email: 'michael@example.com',
    phone: '+1 234 567 8902',
    tourName: 'Udaipur Lake City',
    startDate: '2026-04-20',
    travelers: 2,
    amount: 498,
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    id: 'BK004',
    customerName: 'Emma Wilson',
    email: 'emma@example.com',
    phone: '+1 234 567 8903',
    tourName: 'Jaisalmer Desert Safari',
    startDate: '2026-04-22',
    travelers: 3,
    amount: 987,
    status: 'pending',
    paymentStatus: 'pending',
  },
  {
    id: 'BK005',
    customerName: 'David Lee',
    email: 'david@example.com',
    phone: '+1 234 567 8904',
    tourName: 'Complete Rajasthan Tour',
    startDate: '2026-05-01',
    travelers: 2,
    amount: 2598,
    status: 'confirmed',
    paymentStatus: 'paid',
  },
]

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

export default function BookingsTable() {
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
              Tour
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
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Payment
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
                <div className="font-medium text-gray-900">{booking.customerName}</div>
                <div className="text-xs text-gray-500">{booking.email}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{booking.tourName}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(booking.startDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {booking.travelers}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                ${booking.amount}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[booking.status as keyof typeof statusColors]}`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${paymentColors[booking.paymentStatus as keyof typeof paymentColors]}`}>
                  {booking.paymentStatus}
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
