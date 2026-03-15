'use client'

import { Eye, Mail, DollarSign } from 'lucide-react'
import Link from 'next/link'

const requests = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    destinations: ['Jaipur', 'Udaipur', 'Jodhpur'],
    duration: 10,
    travelers: 4,
    budget: 'luxury',
    status: 'new',
    createdAt: '2026-03-14',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    destinations: ['Jaisalmer', 'Bikaner'],
    duration: 5,
    travelers: 2,
    budget: 'moderate',
    status: 'quoted',
    createdAt: '2026-03-13',
  },
]

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  quoted: 'bg-yellow-100 text-yellow-700',
  converted: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
}

export default function CustomRequestsTable() {
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
                <div className="flex flex-wrap gap-1">
                  {request.destinations.map((dest) => (
                    <span key={dest} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded">
                      {dest}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-sm">{request.duration} days</td>
              <td className="px-6 py-4 text-sm">{request.travelers}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                  {request.budget}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[request.status as keyof typeof statusColors]}`}>
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
