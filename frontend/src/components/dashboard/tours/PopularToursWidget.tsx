'use client'

import { TrendingUp, Star, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getToken } from '@/lib/auth'

interface Tour {
  id: string
  title: string
  price: number
  rating: number
  reviewCount: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export default function PopularToursWidget() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTours() {
      try {
        const token = getToken()
        const response = await fetch(`${API_URL}/tours?limit=4&sort=rating`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setTours(data.tours || data.data || data || [])
        }
      } catch (error) {
        console.error('Failed to fetch popular tours:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTours()
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

  if (tours.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No tours available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tours.map((tour, index) => (
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
              <span className="font-semibold text-gray-900">{tour.title}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{tour.rating || 0}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>{tour.reviewCount || 0} reviews</span>
            </div>
            <span className="font-bold text-green-600">₹{tour.price}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
