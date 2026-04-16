'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Calendar, Users, MapPin, Mail, Phone, Globe,
  Loader2, AlertCircle, Clock, CheckCircle, XCircle, CreditCard,
} from 'lucide-react'
import Link from 'next/link'
import { bookingService } from '@/services/api'
import { cn } from '@/lib/utils'
import { DownloadInvoiceButton } from '@/components/pdf/DownloadInvoiceButton'
import type { Booking, BookingStatus } from '@/types'

const STATUS: Record<BookingStatus, { label: string; badge: string; icon: React.ElementType }> = {
  confirmed: { label: 'Confirmed', badge: 'bg-green-100 text-green-700 border-green-200',   icon: CheckCircle },
  pending:   { label: 'Pending',   badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  completed: { label: 'Completed', badge: 'bg-blue-100 text-blue-700 border-blue-200',       icon: CheckCircle },
  cancelled: { label: 'Cancelled', badge: 'bg-red-100 text-red-700 border-red-200',          icon: XCircle },
}

const PAYMENT: Record<string, string> = {
  paid:     'bg-emerald-100 text-emerald-700 border-emerald-200',
  refunded: 'bg-purple-100 text-purple-700 border-purple-200',
  pending:  'bg-orange-100 text-orange-700 border-orange-200',
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 flex-shrink-0 w-40">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
    </div>
  )
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')

  useEffect(() => {
    bookingService.getById(Number(id))
      .then(setBooking)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (status: string) => {
    if (!booking) return
    setUpdating(true)
    setUpdateError('')
    try {
      const updated = await bookingService.updateStatus(booking.id, status)
      setBooking(updated)
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handlePaymentChange = async (paymentStatus: string) => {
    if (!booking) return
    setUpdating(true)
    setUpdateError('')
    try {
      const updated = await bookingService.updatePaymentStatus(booking.id, paymentStatus)
      setBooking(updated)
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update payment status')
    } finally {
      setUpdating(false)
    }
  }

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

  const status = STATUS[booking.status] ?? STATUS.pending
  const StatusIcon = status.icon
  const start    = new Date(booking.startDate)
  const end      = new Date(booking.endDate)
  const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Back + header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Booking #{String(booking.id).padStart(6, '0')}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Created {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <DownloadInvoiceButton booking={booking} className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium transition-colors" />
          <a href={`mailto:${booking.customerEmail}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Mail className="w-4 h-4" />
            Email Customer
          </a>
        </div>
      </div>

      {updateError && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {updateError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: main info */}
        <div className="lg:col-span-2 space-y-5">

          {/* Tour card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Tour</h2>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {booking.tour?.title ?? `Tour #${booking.tourId}`}
                </p>
                {booking.tour?.destination && (
                  <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {booking.tour.destination}
                  </p>
                )}
              </div>
              <Link href={`/dashboard/tours/${booking.tourId}`}
                className="text-xs text-primary-600 hover:underline flex-shrink-0">
                View Tour →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { icon: Calendar, label: 'Check-in',  value: fmt(start) },
                { icon: Calendar, label: 'Check-out', value: fmt(end) },
                { icon: Clock,    label: 'Duration',  value: `${duration} days` },
                { icon: Users,    label: 'Travelers', value: `${booking.numberOfTravelers} person${booking.numberOfTravelers !== 1 ? 's' : ''}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-400">{label}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>

            {booking.specialRequests && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-xs font-medium text-amber-700 mb-1">Special Requests</p>
                <p className="text-sm text-amber-800">{booking.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Customer card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Customer</h2>
            <div className="space-y-0">
              <InfoRow label="Full Name"  value={booking.customerName} />
              <InfoRow label="Email"      value={booking.customerEmail} />
              <InfoRow label="Phone"      value={booking.customerPhone} />
              <InfoRow label="Country"    value={booking.customerCountry} />
            </div>
            <div className="flex gap-2 mt-4">
              <a href={`mailto:${booking.customerEmail}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors">
                <Mail className="w-3.5 h-3.5" /> Email
              </a>
              <a href={`tel:${booking.customerPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors">
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
            </div>
          </div>
        </div>

        {/* Right: status + payment */}
        <div className="space-y-5">

          {/* Status card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Booking Status</h2>
            <div className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium mb-4', status.badge)}>
              <StatusIcon className="w-4 h-4" />
              {status.label}
            </div>
            <select
              value={booking.status}
              onChange={e => handleStatusChange(e.target.value)}
              disabled={updating}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-50"
            >
              {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Payment card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Payment</h2>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              ₹{Number(booking.totalPrice).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-400 mb-4">
              ₹{Math.round(Number(booking.totalPrice) / booking.numberOfTravelers).toLocaleString('en-IN')} per person
            </p>
            <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium mb-4', PAYMENT[booking.paymentStatus] ?? 'bg-gray-100 text-gray-600 border-gray-200')}>
              <CreditCard className="w-3 h-3" />
              {booking.paymentStatus}
            </div>
            <select
              value={booking.paymentStatus}
              onChange={e => handlePaymentChange(e.target.value)}
              disabled={updating}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-50"
            >
              {['pending', 'paid', 'refunded'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Invoice */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Invoice</h2>
            <p className="text-xs text-gray-500 mb-3">Download a PDF invoice for this booking.</p>
            <DownloadInvoiceButton
              booking={booking}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
