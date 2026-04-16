'use client'

import { Calendar, User, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { bookingService } from '@/services/api'
import { cn } from '@/lib/utils'
import type { Booking, BookingStatus } from '@/types'

const STATUS_STYLES: Record<BookingStatus, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
}

export default function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookingService.getAll({ page: 1, limit: 5 })
      .then(r => setBookings(r.bookings ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
      ))}
    </div>
  )

  if (bookings.length === 0) return (
    <div className="text-center py-10 text-gray-400">
      <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
      <p className="text-sm">No recent bookings</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {bookings.map(b => (
        <Link key={b.id} href={`/dashboard/bookings/${b.id}`}
          className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-primary-200 hover:bg-primary-50/30 transition-all group">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{b.customerName}</p>
              <p className="text-xs text-gray-500 truncate">{b.tour?.title ?? `Tour #${b.tourId}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-3">
            <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', STATUS_STYLES[b.status] ?? 'bg-gray-100 text-gray-700')}>
              {b.status}
            </span>
            <span className="text-sm font-bold text-gray-900">₹{Number(b.totalPrice).toLocaleString('en-IN')}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
