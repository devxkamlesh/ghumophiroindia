'use client'

import { TrendingUp, Star } from 'lucide-react'
import Link from 'next/link'

// TODO: Fetch from API
const popularTours = [
  {
    id: 1,
    name: 'Golden Triangle Tour',
    bookings: 45,
    rating: 4.9,
    revenue: '$26,955',
  },
  {
    id: 2,
    name: 'Jaisalmer Desert Safari',
    bookings: 38,
    rating: 4.8,
    revenue: '$12,502',
  },
  {
    id: 3,
    name: 'Udaipur Lake City',
    bookings: 32,
    rating: 5.0,
    revenue: '$7,968',
  },
  {
    id: 4,
    name: 'Jaipur City Tour',
    bookings: 28,
    rating: 4.7,
    revenue: '$4,172',
  },
]

export default function PopularToursWidget() {
  return (
    <div className="space-y-4">
      {popularTours.map((tour, index) => (
        <Link
          key={tour.id}
          href={`/dashboard/tours/${tour.id}`}
          className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <span className="font-semibold text-gray-900">{tour.name}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{tour.rating}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>{tour.bookings} bookings</span>
            </div>
            <span className="font-bold text-green-600">{tour.revenue}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
