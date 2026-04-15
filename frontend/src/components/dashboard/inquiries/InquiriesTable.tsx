'use client'

import { Eye, Mail, Phone, CheckCircle, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  country?: string
  tourInterest?: string
  message: string
  status: string
  createdAt: string
}

export default function InquiriesTable() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const response = await fetch('/api/inquiries')
        if (response.ok) {
          const data = await response.json()
          setInquiries(data.inquiries || [])
        }
      } catch (error) {
        console.error('Failed to fetch inquiries:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchInquiries()
  }, [])

  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    converted: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700',
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading inquiries...</p>
      </div>
    )
  }

  if (inquiries.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No inquiries found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tour Interest</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{inquiry.name}</div>
                {inquiry.country && <div className="text-xs text-gray-500">{inquiry.country}</div>}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">{inquiry.email}</div>
                {inquiry.phone && <div className="text-xs text-gray-500">{inquiry.phone}</div>}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{inquiry.tourInterest || '-'}</td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600 max-w-xs truncate">{inquiry.message}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[inquiry.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
                  {inquiry.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Link href={`/dashboard/inquiries/${inquiry.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </Link>
                  <a href={`mailto:${inquiry.email}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Send Email">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </a>
                  {inquiry.phone && (
                    <a href={`tel:${inquiry.phone}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Call">
                      <Phone className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                  {inquiry.status === 'new' && (
                    <button className="p-2 hover:bg-green-50 rounded-lg transition-colors" title="Mark as Contacted">
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
