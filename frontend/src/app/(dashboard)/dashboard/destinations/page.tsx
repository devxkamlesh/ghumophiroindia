'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, MapPin, TrendingUp } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://187.127.151.137/api/v1'

interface Destination {
  id: number
  name: string
  slug: string
  subtitle: string
  description: string
  image: string
  tourCount: number
  isPopular: boolean
  createdAt: string
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/destinations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        const list = Array.isArray(data) ? data : (data.data || [])
        setDestinations(Array.isArray(list) ? list : [])
      }
    } catch (error) {
      console.error('Failed to fetch destinations:', error)
      setDestinations([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Destinations Management</h1>
          <p className="text-gray-600 mt-1">Manage tour destinations</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
          <Plus className="w-5 h-5" />
          <span>Add Destination</span>
        </button>
      </div>

      {destinations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Destinations Found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first destination</p>
          <button className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors mx-auto">
            <Plus className="w-5 h-5" />
            <span>Add Destination</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div key={destination.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 bg-gradient-to-br from-primary-400 to-orange-500">
                {destination.image ? (
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="text-white w-12 h-12" />
                  </div>
                )}
                {destination.isPopular && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Popular
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold mb-1 text-gray-900">{destination.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{destination.subtitle}</p>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{destination.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="font-semibold text-primary-600">{destination.tourCount}</span>
                    <span className="text-gray-500 ml-1">tours</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
