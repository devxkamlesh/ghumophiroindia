'use client'

import { Edit, Trash2, Eye, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Tour {
  id: string
  title: string
  duration: number
  price: number
  category?: string
  status?: string
  rating?: number
  reviewCount?: number
}

export default function ToursTable() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTours() {
      try {
        const response = await fetch('/api/tours')
        if (response.ok) {
          const data = await response.json()
          setTours(data || [])
        }
      } catch (error) {
        console.error('Failed to fetch tours:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [])

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading tours...</p>
      </div>
    )
  }

  if (tours.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No tours found</p>
      </div>
    )
  }

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
              Rating
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
                {tour.category && (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {tour.category}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {tour.rating ? `⭐ ${tour.rating}` : '-'}
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
