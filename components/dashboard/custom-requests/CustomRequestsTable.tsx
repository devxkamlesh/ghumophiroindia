'use client'

import { Eye, Mail, DollarSign, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface CustomRequest {
  id: string
  name: string
  email: string
  destinations?: string[]
  duration?: number
  numberOfTravelers?: number
  budget?: string
  status: string
  createdAt: string
}

export default function CustomRequestsTable() {
  const [requests, setRequests] = useState<CustomRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await fetch('/api/custom-tour')
        if (response.ok) {
          const data = await response.json()
          setRequests(data.requests || [])
        }
      } catch (error) {
        console.error('Failed to fetch custom requests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
    quoted: 'bg-purple-100 text-purple-700',
    converted: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700',
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading custom requests...</p>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No custom requests found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Destinations</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Duration</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Travelers</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Budget</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{request.name}</div>
                <div className="text-xs text-gray-500">{request.email}</div>
              </td>
              <td className="px-6 py-4">
                {request.destinations && request.destinations.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {request.destinations.map((dest) => (
                      <span key={dest} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded">
                        {dest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm">{request.duration ? `${request.duration} days` : '-'}</td>
              <td className="px-6 py-4 text-sm">{request.numberOfTravelers || '-'}</td>
              <td className="px-6 py-4">
                {request.budget ? (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                    {request.budget}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[request.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
                  {request.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Link href={`/dashboard/custom-requests/${request.id}`} className="p-2 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </Link>
                  <a href={`mailto:${request.email}`} className="p-2 hover:bg-gray-100 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </a>
                  <button className="p-2 hover:bg-primary-50 rounded-lg" title="Send Quote">
                    <DollarSign className="w-4 h-4 text-primary-600" />
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
