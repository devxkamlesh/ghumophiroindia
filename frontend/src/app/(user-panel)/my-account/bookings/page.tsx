'use client'

import { Calendar, Users, MapPin, Loader2, AlertCircle, Clock, CheckCircle, XCircle, ArrowRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { bookingService } from '@/services/api'
import { cn } from '@/lib/utils'
import type { Booking, BookingStatus } from '@/types'

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS: Record<BookingStatus, { label: string; badge: string; icon: React.ElementType; bar: string }> = {
  confirmed: { label: 'Confirmed',  badge: 'bg-green-100 text-green-700 border-green-200',  icon: CheckCircle, bar: 'bg-green-500' },
  pending:   { label: 'Pending',    badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock,        bar: 'bg-yellow-400' },
  completed: { label: 'Completed',  badge: 'bg-blue-100 text-blue-700 border-blue-200',    icon: CheckCircle, bar: 'bg-blue-500' },
  cancelled: { label: 'Cancelled',  badge: 'bg-red-100 text-red-700 border-red-200',       icon: XCircle,     bar: 'bg-red-400' },
}

const PAYMENT: Record<string, string> = {
  paid:     'bg-emerald-100 text-emerald-700 border-emerald-200',
  refunded: 'bg-purple-100 text-purple-700 border-purple-200',
  pending:  'bg-orange-100 text-orange-700 border-orange-200',
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  )
}

// ── Booking card ──────────────────────────────────────────────────────────────
function BookingCard({ booking }: { booking: Booking }) {
  const status = STATUS[booking.status] ?? STATUS.pending
  const StatusIcon = status.icon

  const start = new Date(booking.startDate)
  const end   = new Date(booking.endDate)
  const now   = new Date()
  const isUpcoming  = start > now && booking.status !== 'cancelled'
  const isPast      = end < now

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className={cn(
      'bg-white rounded-xl border overflow-hidden transition-all hover:shadow-md group',
      booking.status === 'cancelled' ? 'border-gray-200 opacity-75' : 'border-gray-200 hover:border-primary-200'
    )}>
      {/* Coloured top bar */}
      <div className={cn('h-1 w-full', status.bar)} />

      <div className="p-5">
        {/* Top row: title + price */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="text-xs font-mono text-gray-400">#{booking.id}</span>
              <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border', status.badge)}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
              <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full border', PAYMENT[booking.paymentStatus] ?? 'bg-gray-100 text-gray-600 border-gray-200')}>
                {booking.paymentStatus}
              </span>
              {isUpcoming && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                  Upcoming
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-gray-900 truncate">
              {booking.tour?.title ?? `Tour Booking #${booking.id}`}
            </h3>

            {booking.tour?.destination && (
              <p className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                {booking.tour.destination}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-bold text-gray-900">
              ₹{Number(booking.totalPrice).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-400">Total paid</p>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <InfoCell icon={Calendar} label="Check-in"  value={formatDate(start)} />
          <InfoCell icon={Calendar} label="Check-out" value={formatDate(end)} />
          <InfoCell icon={Clock}    label="Duration"  value={`${duration} day${duration !== 1 ? 's' : ''}`} />
          <InfoCell icon={Users}    label="Travelers" value={`${booking.numberOfTravelers} ${booking.numberOfTravelers === 1 ? 'person' : 'people'}`} />
        </div>

        {/* Special requests */}
        {booking.specialRequests && (
          <div className="mb-4 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-600">
            <span className="font-medium text-gray-700">Special request: </span>
            {booking.specialRequests}
          </div>
        )}

        {/* Footer: divider + actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Booked {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-2">
            {booking.tourId && booking.status !== 'cancelled' && (
              <Link
                href={`/tours/${booking.tourId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                View Tour
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCell({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all')

  useEffect(() => {
    bookingService.getMyBookings()
      .then(setBookings)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const stats = {
    total:     bookings.length,
    upcoming:  bookings.filter(b => new Date(b.startDate) > new Date() && b.status !== 'cancelled').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-1 text-sm">Track and manage all your tour bookings</p>
        </div>
        <Link href="/tours"
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0">
          Browse Tours
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => { setError(''); setLoading(true); bookingService.getMyBookings().then(setBookings).catch(e => setError(e.message)).finally(() => setLoading(false)) }}
            className="ml-auto flex items-center gap-1 text-xs hover:underline">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {bookings.length > 0 && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatPill label="Total"     value={stats.total}     color="text-gray-900" />
            <StatPill label="Upcoming"  value={stats.upcoming}  color="text-primary-600" />
            <StatPill label="Completed" value={stats.completed} color="text-blue-600" />
            <StatPill label="Cancelled" value={stats.cancelled} color="text-red-500" />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border',
                  filter === tab
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                )}
              >
                {tab === 'all' ? 'All' : STATUS[tab as BookingStatus]?.label ?? tab}
                {tab !== 'all' && (
                  <span className={cn('ml-1.5 text-xs', filter === tab ? 'text-primary-200' : 'text-gray-400')}>
                    {bookings.filter(b => b.status === tab).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Cards */}
          {filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map(b => <BookingCard key={b.id} booking={b} />)}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 py-12 text-center">
              <p className="text-gray-500 text-sm">No {filter} bookings</p>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!loading && !error && bookings.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
            Your booked tours will appear here. Start exploring and book your first adventure.
          </p>
          <Link href="/tours"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors">
            Browse Tours
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
