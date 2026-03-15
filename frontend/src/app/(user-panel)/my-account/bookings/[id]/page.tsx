'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Calendar, Users, MapPin, Phone, Mail,
  Loader2, AlertCircle, CheckCircle, Clock, XCircle,
  CreditCard, ChevronRight, Download, Hourglass, Plane,
  Star, Ban, FileText,
} from 'lucide-react'
import { bookingService, tourService } from '@/services/api'
import { cn } from '@/lib/utils'
import { DownloadInvoiceButton } from '@/components/pdf/DownloadInvoiceButton'
import type { Booking, Tour, BookingStatus } from '@/types'

// ── Phase logic (same as bookings list) ──────────────────────────────────────
type TripPhase = 'awaiting' | 'confirmed-upcoming' | 'on-trip' | 'completed' | 'cancelled'

function getTripPhase(booking: Booking): TripPhase {
  if (booking.status === 'cancelled') return 'cancelled'
  const now   = new Date()
  const start = new Date(booking.startDate)
  const end   = new Date(booking.endDate)
  if (booking.status === 'completed' && now >= start) return 'completed'
  if (booking.status === 'pending') return 'awaiting'
  if (now >= start && now <= end) return 'on-trip'
  if (now < start)                return 'confirmed-upcoming'
  return booking.status === 'completed' ? 'completed' : 'confirmed-upcoming'
}

const PHASE_CONFIG = {
  awaiting:            { label: 'Awaiting Confirmation', color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   bar: 'bg-amber-400',   icon: Hourglass },
  'confirmed-upcoming':{ label: 'Confirmed — Upcoming',  color: 'text-green-700',   bg: 'bg-green-50',   border: 'border-green-200',   bar: 'bg-green-500',   icon: Plane },
  'on-trip':           { label: 'Currently On Trip',     color: 'text-primary-700', bg: 'bg-primary-50', border: 'border-primary-200', bar: 'bg-primary-500', icon: Star },
  completed:           { label: 'Trip Completed',        color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    bar: 'bg-blue-500',    icon: CheckCircle },
  cancelled:           { label: 'Booking Cancelled',     color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200',     bar: 'bg-red-400',     icon: Ban },
}

const PAYMENT_STYLE: Record<string, string> = {
  paid:     'bg-emerald-100 text-emerald-700 border-emerald-200',
  refunded: 'bg-purple-100 text-purple-700 border-purple-200',
  pending:  'bg-orange-100 text-orange-700 border-orange-200',
}

// ── Add days to a date ────────────────────────────────────────────────────────
function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
function fmtShort(d: Date) {
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function BookingOrderPage() {
  const { id }   = useParams<{ id: string }>()
  const router   = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [tour,    setTour]    = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    bookingService.getById(Number(id))
      .then(async (b) => {
        setBooking(b)
        // Also fetch full tour data for itinerary
        if (b.tourId) {
          try {
            const t = await tourService.getById(b.tourId)
            setTour(t)
          } catch { /* tour fetch optional */ }
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    </div>
  )

  if (error || !booking) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <AlertCircle className="w-10 h-10 text-red-400" />
      <p className="text-red-600 text-sm">{error || 'Booking not found'}</p>
      <button onClick={() => router.back()} className="text-sm text-primary-600 hover:underline flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Go back
      </button>
    </div>
  )

  const phase   = getTripPhase(booking)
  const cfg     = PHASE_CONFIG[phase]
  const PhaseIcon = cfg.icon
  const start   = new Date(booking.startDate)
  const end     = new Date(booking.endDate)
  const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const now     = new Date()
  const daysToStart = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const itinerary = tour?.itinerary ?? []

  return (
    <div className="space-y-5 max-w-3xl">

      {/* Back */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
          <p className="text-xs text-gray-400 font-mono">Order #{String(booking.id).padStart(6, '0')}</p>
        </div>
      </div>

      {/* Phase banner */}
      <div className={cn('rounded-2xl border-2 overflow-hidden', cfg.border)}>
        <div className={cn('h-1.5', cfg.bar)} />
        <div className={cn('flex items-center justify-between px-4 py-3', cfg.bg)}>
          <div className="flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-full flex items-center justify-center border', cfg.bg, cfg.border)}>
              <PhaseIcon className={cn('w-4 h-4', cfg.color)} />
            </div>
            <div>
              <p className={cn('font-bold text-sm', cfg.color)}>{cfg.label}</p>
              {phase === 'confirmed-upcoming' && daysToStart > 0 && (
                <p className="text-xs text-gray-500">{daysToStart} day{daysToStart !== 1 ? 's' : ''} until your trip</p>
              )}
              {phase === 'on-trip' && (
                <p className="text-xs text-gray-500">Trip ends {fmtShort(end)}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full border', PAYMENT_STYLE[booking.paymentStatus] ?? 'bg-gray-100 text-gray-600 border-gray-200')}>
              <CreditCard className="w-3 h-3 inline mr-1" />
              {booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus === 'refunded' ? 'Refunded' : 'Payment Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Tour + booking summary */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Tour Package</p>
            <h2 className="text-lg font-bold text-gray-900">
              {booking.tour?.title ?? tour?.title ?? `Tour #${booking.tourId}`}
            </h2>
            {(booking.tour?.destination || (tour?.destinations ?? []).length > 0) && (
              <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {booking.tour?.destination ?? (tour?.destinations ?? [])[0]}
              </p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-gray-900">₹{Number(booking.totalPrice).toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-400">Total amount</p>
          </div>
        </div>

        {/* 4-cell grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
          {[
            { icon: Calendar, label: 'Check-in',  value: fmtDate(start) },
            { icon: Calendar, label: 'Check-out', value: fmtDate(end) },
            { icon: Clock,    label: 'Duration',  value: `${duration} day${duration !== 1 ? 's' : ''}` },
            { icon: Users,    label: 'Travelers', value: `${booking.numberOfTravelers} person${booking.numberOfTravelers !== 1 ? 's' : ''}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-400">{label}</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">{value}</p>
            </div>
          ))}
        </div>

        {booking.specialRequests && (
          <div className="px-5 py-3 border-t border-gray-100 bg-amber-50">
            <p className="text-xs text-amber-800">
              <span className="font-semibold">Special request: </span>{booking.specialRequests}
            </p>
          </div>
        )}
      </div>

      {/* ── Day-by-day itinerary with real dates ── */}
      {itinerary.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Your Trip Itinerary</h2>
            <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
              {fmtShort(start)} → {fmtShort(end)}
            </span>
          </div>
          <div className="p-5 space-y-0">
            {itinerary.map((day, i) => {
              const dayDate  = addDays(start, i)
              const isToday  = dayDate.toDateString() === now.toDateString()
              const isPast   = dayDate < now && !isToday
              const isFuture = dayDate > now

              return (
                <div key={i} className="flex gap-4">
                  {/* Spine */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold z-10 border-2',
                      isToday  && 'bg-primary-600 text-white border-primary-600 ring-4 ring-primary-100',
                      isPast   && 'bg-green-500 text-white border-green-500',
                      isFuture && 'bg-white text-gray-400 border-gray-200',
                    )}>
                      {isPast ? <CheckCircle className="w-5 h-5" /> : day.day}
                    </div>
                    {i < itinerary.length - 1 && (
                      <div className={cn('w-0.5 flex-1 my-1', isPast ? 'bg-green-300' : 'bg-gray-100')} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    {/* Date badge */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full',
                        isToday  && 'bg-primary-100 text-primary-700',
                        isPast   && 'bg-green-100 text-green-700',
                        isFuture && 'bg-gray-100 text-gray-500',
                      )}>
                        {isToday ? '📍 Today' : fmtDate(dayDate)}
                      </span>
                      {isToday && (
                        <span className="text-xs font-bold text-primary-600 animate-pulse">● Live</span>
                      )}
                    </div>

                    <h4 className={cn(
                      'font-bold text-sm mb-1',
                      isPast ? 'text-gray-500' : 'text-gray-900'
                    )}>
                      Day {day.day}: {day.title}
                    </h4>
                    <p className="text-gray-500 text-xs mb-2 leading-relaxed">{day.description}</p>

                    {(day.activities ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {(day.activities ?? []).map((a, j) => (
                          <span key={j} className={cn(
                            'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border',
                            isPast   && 'bg-green-50 text-green-700 border-green-200 line-through opacity-60',
                            isToday  && 'bg-primary-50 text-primary-700 border-primary-200 font-medium',
                            isFuture && 'bg-gray-50 text-gray-600 border-gray-200',
                          )}>
                            <ChevronRight className="w-3 h-3" />{a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Customer + actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Traveler Details</h3>
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">{booking.customerName}</p>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-3.5 h-3.5" />{booking.customerEmail}
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Phone className="w-3.5 h-3.5" />{booking.customerPhone}
            </p>
            {booking.customerCountry && (
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-3.5 h-3.5" />{booking.customerCountry}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</h3>
          <DownloadInvoiceButton
            booking={booking}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors"
          />
          {booking.tourId && (
            <Link href={`/tours/${booking.tourId}`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors">
              <MapPin className="w-4 h-4" /> View Tour Page
            </Link>
          )}
          <a href={`mailto:support@ghumophiroindia.com?subject=Booking %23${booking.id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors">
            <Mail className="w-4 h-4" /> Contact Support
          </a>
          <Link href="/my-account/bookings"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Bookings
          </Link>
        </div>
      </div>

      {/* Booked on */}
      <p className="text-xs text-gray-400 text-center pb-4">
        Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        {' · '}Order #{String(booking.id).padStart(6, '0')}
      </p>
    </div>
  )
}
