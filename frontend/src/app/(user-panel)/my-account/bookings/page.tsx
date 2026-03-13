'use client'

import {
  Calendar, Users, MapPin, Loader2, AlertCircle, Clock,
  CheckCircle, XCircle, ArrowRight, RefreshCw, Plane,
  CreditCard, Star, Ban, Hourglass,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { bookingService } from '@/services/api'
import { cn } from '@/lib/utils'
import type { Booking, BookingStatus } from '@/types'
import { DownloadInvoiceButton } from '@/components/pdf/DownloadInvoiceButton'

// ── Trip phase: derived from status + dates ───────────────────────────────────
type TripPhase = 'awaiting' | 'confirmed-upcoming' | 'on-trip' | 'completed' | 'cancelled' | 'pending-payment'

function getTripPhase(booking: Booking): TripPhase {
  if (booking.status === 'cancelled') return 'cancelled'
  if (booking.status === 'completed') return 'completed'

  const now   = new Date()
  const start = new Date(booking.startDate)
  const end   = new Date(booking.endDate)

  if (booking.status === 'pending') return 'awaiting'
  if (booking.status === 'confirmed') {
    if (now >= start && now <= end) return 'on-trip'
    if (now > end)                  return 'completed'
    return 'confirmed-upcoming'
  }
  return 'awaiting'
}

const PHASE_CONFIG: Record<TripPhase, {
  label: string
  sublabel: string
  icon: React.ElementType
  bg: string
  text: string
  border: string
  bar: string
  dot: string
}> = {
  'awaiting': {
    label: 'Awaiting Confirmation',
    sublabel: 'We are reviewing your booking',
    icon: Hourglass,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    bar: 'bg-amber-400',
    dot: 'bg-amber-400',
  },
  'confirmed-upcoming': {
    label: 'Confirmed — Get Ready!',
    sublabel: 'Your trip is booked and coming up',
    icon: Plane,
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    bar: 'bg-green-500',
    dot: 'bg-green-500',
  },
  'on-trip': {
    label: 'You\'re on the trip!',
    sublabel: 'Enjoy your adventure right now',
    icon: Star,
    bg: 'bg-primary-50',
    text: 'text-primary-700',
    border: 'border-primary-200',
    bar: 'bg-primary-500',
    dot: 'bg-primary-500',
  },
  'completed': {
    label: 'Trip Completed',
    sublabel: 'Hope you had an amazing time',
    icon: CheckCircle,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    bar: 'bg-blue-500',
    dot: 'bg-blue-500',
  },
  'cancelled': {
    label: 'Booking Cancelled',
    sublabel: 'This booking has been cancelled',
    icon: Ban,
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    bar: 'bg-red-400',
    dot: 'bg-red-400',
  },
  'pending-payment': {
    label: 'Payment Pending',
    sublabel: 'Complete payment to confirm',
    icon: CreditCard,
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    bar: 'bg-orange-400',
    dot: 'bg-orange-400',
  },
}

// ── Journey timeline steps ────────────────────────────────────────────────────
const STEPS: { key: TripPhase[]; label: string }[] = [
  { key: ['awaiting', 'pending-payment'],  label: 'Requested' },
  { key: ['confirmed-upcoming', 'on-trip', 'completed'], label: 'Confirmed' },
  { key: ['on-trip', 'completed'],         label: 'On Trip' },
  { key: ['completed'],                    label: 'Done' },
]

function stepState(phase: TripPhase, stepKeys: TripPhase[]): 'done' | 'active' | 'upcoming' {
  if (phase === 'cancelled') return 'upcoming'
  if (stepKeys.includes(phase)) return 'active'
  // Check if this step is already passed
  const order: TripPhase[] = ['awaiting', 'pending-payment', 'confirmed-upcoming', 'on-trip', 'completed']
  const phaseIdx = order.indexOf(phase)
  const stepIdx  = Math.min(...stepKeys.map(k => order.indexOf(k)))
  return phaseIdx > stepIdx ? 'done' : 'upcoming'
}

// ── Days until / since ────────────────────────────────────────────────────────
function tripCountdown(booking: Booking, phase: TripPhase): string | null {
  const now   = new Date()
  const start = new Date(booking.startDate)
  const end   = new Date(booking.endDate)
  const daysToStart = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const daysToEnd   = Math.ceil((end.getTime()   - now.getTime()) / (1000 * 60 * 60 * 24))

  if (phase === 'confirmed-upcoming') {
    if (daysToStart === 0) return 'Starts today!'
    if (daysToStart === 1) return 'Starts tomorrow!'
    return `${daysToStart} days to go`
  }
  if (phase === 'on-trip') {
    if (daysToEnd <= 0) return 'Ends today'
    return `${daysToEnd} day${daysToEnd !== 1 ? 's' : ''} left`
  }
  return null
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={cn('rounded-xl border px-4 py-3 flex items-center gap-3', bg)}>
      <span className={cn('text-2xl font-bold', color)}>{value}</span>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  )
}

// ── Booking card ──────────────────────────────────────────────────────────────
function BookingCard({ booking }: { booking: Booking }) {
  const phase  = getTripPhase(booking)
  const config = PHASE_CONFIG[phase]
  const PhaseIcon = config.icon

  const start    = new Date(booking.startDate)
  const end      = new Date(booking.endDate)
  const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const countdown = tripCountdown(booking, phase)

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className={cn(
      'bg-white rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg',
      config.border,
      phase === 'cancelled' && 'opacity-70'
    )}>
      {/* Coloured top bar */}
      <div className={cn('h-1.5 w-full', config.bar)} />

      {/* Phase banner */}
      <div className={cn('flex items-center justify-between px-5 py-3 border-b', config.bg, config.border)}>
        <div className="flex items-center gap-2.5">
          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', config.bg, 'border', config.border)}>
            <PhaseIcon className={cn('w-4 h-4', config.text)} />
          </div>
          <div>
            <p className={cn('text-sm font-bold', config.text)}>{config.label}</p>
            <p className="text-xs text-gray-500">{config.sublabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {countdown && (
            <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full', config.bg, config.text, 'border', config.border)}>
              {countdown}
            </span>
          )}
          {booking.paymentStatus === 'paid' && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CreditCard className="w-3 h-3" /> Paid
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        {/* Title + price */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            <p className="text-xs font-mono text-gray-400 mb-1">Booking #{String(booking.id).padStart(4, '0')}</p>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {booking.tour?.title ?? `Tour Booking #${booking.id}`}
            </h3>
            {booking.tour?.destination && (
              <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                {booking.tour.destination}
              </p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-gray-900">
              ₹{Number(booking.totalPrice).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
        </div>

        {/* Journey timeline (hidden for cancelled) */}
        {phase !== 'cancelled' && (
          <div className="mb-4 px-1">
            <div className="flex items-center gap-0">
              {STEPS.map((step, i) => {
                const state = stepState(phase, step.key)
                return (
                  <div key={i} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div className={cn(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                        state === 'done'    && 'bg-green-500 border-green-500',
                        state === 'active'  && cn(config.dot, 'border-transparent ring-2 ring-offset-1', config.dot.replace('bg-', 'ring-')),
                        state === 'upcoming' && 'bg-white border-gray-200',
                      )}>
                        {state === 'done' && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                        {state === 'active' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className={cn(
                        'text-xs whitespace-nowrap',
                        state === 'done'    && 'text-green-600 font-medium',
                        state === 'active'  && cn(config.text, 'font-bold'),
                        state === 'upcoming' && 'text-gray-300',
                      )}>
                        {step.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={cn(
                        'flex-1 h-0.5 mb-4 mx-1',
                        state === 'done' ? 'bg-green-400' : 'bg-gray-100'
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Date + traveler grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <InfoCell icon={Calendar} label="Check-in"  value={fmt(start)} />
          <InfoCell icon={Calendar} label="Check-out" value={fmt(end)} />
          <InfoCell icon={Clock}    label="Duration"  value={`${duration} day${duration !== 1 ? 's' : ''}`} />
          <InfoCell icon={Users}    label="Travelers" value={`${booking.numberOfTravelers} ${booking.numberOfTravelers === 1 ? 'person' : 'people'}`} />
        </div>

        {/* Special requests */}
        {booking.specialRequests && (
          <div className="mb-4 px-3 py-2.5 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-800">
            <span className="font-semibold">Special request: </span>
            {booking.specialRequests}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Booked {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-2">
            <DownloadInvoiceButton booking={booking} />
            {booking.tourId && phase !== 'cancelled' && (
              <Link
                href={`/tours/${booking.tourId}`}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  config.bar.replace('bg-', 'bg-').includes('primary')
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : cn(config.bg, config.text, 'border', config.border, 'hover:opacity-80')
                )}
              >
                View Tour <ArrowRight className="w-3.5 h-3.5" />
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
const FILTER_TABS = [
  { key: 'all',       label: 'All' },
  { key: 'pending',   label: 'Awaiting' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
] as const

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [filter,   setFilter]   = useState<BookingStatus | 'all'>('all')

  const load = () => {
    setLoading(true); setError('')
    bookingService.getMyBookings()
      .then(setBookings)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

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
          <p className="text-gray-500 mt-1 text-sm">Track your trips from booking to completion</p>
        </div>
        <Link href="/tours"
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0">
          Browse Tours <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={load} className="ml-auto flex items-center gap-1 text-xs hover:underline">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {bookings.length > 0 && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatPill label="Total"     value={stats.total}     color="text-gray-900"     bg="bg-white border border-gray-200" />
            <StatPill label="Upcoming"  value={stats.upcoming}  color="text-green-700"    bg="bg-green-50 border border-green-200" />
            <StatPill label="Completed" value={stats.completed} color="text-blue-700"     bg="bg-blue-50 border border-blue-200" />
            <StatPill label="Cancelled" value={stats.cancelled} color="text-red-600"      bg="bg-red-50 border border-red-200" />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as BookingStatus | 'all')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border',
                  filter === tab.key
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                )}
              >
                {tab.label}
                {tab.key !== 'all' && (
                  <span className={cn('ml-1.5 text-xs', filter === tab.key ? 'text-primary-200' : 'text-gray-400')}>
                    {bookings.filter(b => b.status === tab.key).length}
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
            Browse Tours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
