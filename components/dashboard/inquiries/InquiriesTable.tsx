'use client'

import { Eye, Mail, Phone, CheckCircle, X } from 'lucide-react'
import Link from 'next/link'

// TODO: Fetch from API
const inquiries = [
  {
    id: 1,
    name: 'Robert Chen',
    email: 'robert@example.com',
    phone: '+1 234 567 8905',
    country: 'USA',
    tourInterest: 'Golden Triangle',
    message: 'Interested in a 7-day tour for family of 4',
    status: 'new',
    createdAt: '2026-03-14',
  },
  {
    id: 2,
    name: 'Maria Garcia',
    email: 'maria@example.com',
    phone: '+34 612 345 678',
    country: 'Spain',
    tourInterest: 'Rajasthan Tour',
    message: 'Looking for luxury tour package',
    status: 'contacted',
    createdAt: '2026-03-13',
  },
  {
    id: 3,
    name: 'James Wilson',
    email: 'james@example.com',
    phone: '+44 7700 900123',
    country: 'UK',
    tourInterest: 'Desert Safari',
    message: 'Want to book for honeymoon',
    status: 'converted',
    createdAt: '2026-03-12',
  },
]

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  converted: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
}

export default function InquiriesTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Tour Interest
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Message
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Date
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
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{inquiry.name}</div>
                <div className="text-xs text-gray-500">{inquiry.country}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">{inquiry.email}</div>
                <div className="text-xs text-gray-500">{inquiry.phone}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {inquiry.tourInterest}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600 max-w-xs truncate">
                  {inquiry.message}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[inquiry.status as keyof typeof statusColors]}`}>
                  {inquiry.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Link
                    href={`/dashboard/inquiries/${inquiry.id}`}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </Link>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4 text-gray-600" />
                  </a>
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Call"
                  >
                    <Phone className="w-4 h-4 text-gray-600" />
                  </a>
                  {inquiry.status === 'new' && (
                    <button
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                      title="Mark as Contacted"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </button>
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
