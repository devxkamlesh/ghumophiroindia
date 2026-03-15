'use client'

import { Edit, Trash2, Eye, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// TODO: Fetch from API
const tours = [
  {
    id: 1,
    title: 'Golden Triangle Tour',
    duration: 6,
    price: 599,
    category: 'Heritage',
    status: 'active',
    bookings: 45,
    rating: 4.9,
  },
  {
    id: 2,
    title: 'Jaipur City Tour',
    duration: 2,
    price: 149,
    category: 'City',
    status: 'active',
    bookings: 28,
    rating: 4.8,
  },
  {
    id: 3,
    title: 'Udaipur Lake City',
    duration: 3,
    price: 249,
    category: 'City',
    status: 'active',
    bookings: 32,
    rating: 5.0,
  },
  {
    id: 4,
    title: 'Jaisalmer Desert Safari',
    duration: 4,
    price: 329,
    category: 'Desert',
    status: 'active',
    bookings: 38,
    rating: 4.9,
  },
  {
    id: 5,
    title: 'Jodhpur Blue City Tour',
    duration: 2,
    price: 179,
    category: 'City',
    status: 'inactive',
    bookings: 15,
    rating: 4.7,
  },
]

export default function ToursTable() {
  const [selectedTour, setSelectedTour] = useState<number | null>(null)

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Tour
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Bookings
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Rating
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
          {tours.map((tour) => (
            <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{tour.title}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {tour.duration} days
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                ${tour.price}
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  {tour.category}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {tour.bookings}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                ⭐ {tour.rating}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  tour.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {tour.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Link
                    href={`/tours/${tour.id}`}
                    target="_blank"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </Link>
                  <Link
                    href={`/dashboard/tours/${tour.id}`}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </Link>
                  <button
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
