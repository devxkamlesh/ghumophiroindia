'use client'

import { useState } from 'react'
import {
  X, Calendar, Users, Phone, Mail, User, Globe,
  Loader2, CheckCircle, AlertCircle, ChevronRight,
} from 'lucide-react'
import { bookingService } from '@/services/api'
import { getUser, isAuthenticated } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import type { Tour, CreateBookingInput } from '@/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function priceNum(p: string | number | null | undefined) {
  if (!p) return 0
  return typeof p === 'string' ? parseFloat(p) || 0 : p
}

// Minimum date = tomorrow
function minDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

// ── Input field ───────────────────────────────────────────────────────────────

function Field({
  label, htmlFor, required, hint, children,
}: {
  label: string; htmlFor: string; required?: boolean; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

const inputCls = 'w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-400'
const iconCls  = 'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none'

// ── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen({ bookingId, tourTitle, onClose }: {
  bookingId: number; tourTitle: string; onClose: () => void
}) {
  const router = useRouter()
  return (
    <div className="text-center py-6 px-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
      <p className="text-gray-500 text-sm mb-1">
        Your booking for <span className="font-semibold text-gray-700">{tourTitle}</span> has been submitted.
      </p>
      <p className="text-gray-400 text-xs mb-6">
        Booking reference: <span className="font-mono font-semibold text-gray-600">#{bookingId}</span>
      </p>
      <p className="text-gray-500 text-sm mb-6">
        Our team will confirm your booking within 24 hours. You'll receive details at your email.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => { onClose(); router.push('/my-account/bookings') }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          View My Bookings
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors"
        >
          Continue Browsing
        </button>
      </div>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────

interface Props {
  tour: Tour
  onClose: () => void
}

export default function BookingModal({ tour, onClose }: Props) {
  const router = useRouter()
  const user   = getUser()
  const price  = priceNum(tour.price)

  const [form, setForm] = useState({
    customerName:      user?.name    ?? '',
    customerEmail:     user?.email   ?? '',
    customerPhone:     user?.phone   ?? '',
    customerCountry:   user?.country ?? '',
    numberOfTravelers: 1,
    startDate:         '',
    specialRequests:   '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [booking,    setBooking]    = useState<{ id: number } | null>(null)

  const totalPrice = price * form.numberOfTravelers

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: k === 'numberOfTravelers' ? Number(e.target.value) : e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (!form.startDate) { setError('Please select a start date'); return }
    if (form.numberOfTravelers < 1) { setError('At least 1 traveler required'); return }
    if (form.numberOfTravelers > tour.maxGroupSize) {
      setError(`Maximum group size for this tour is ${tour.maxGroupSize}`); return
    }

    // If not logged in, redirect to login with return URL
    if (!isAuthenticated()) {
      router.push(`/login?redirect=/tours/${tour.id}`)
      return
    }

    setSubmitting(true)
    try {
      // Backend expects ISO datetime string
      const startDateISO = new Date(form.startDate + 'T00:00:00.000Z').toISOString()

      const input: CreateBookingInput = {
        tourId:            tour.id,
        customerName:      form.customerName.trim(),
        customerEmail:     form.customerEmail.trim(),
        customerPhone:     form.customerPhone.trim(),
        customerCountry:   form.customerCountry.trim(),
        numberOfTravelers: form.numberOfTravelers,
        startDate:         startDateISO,
        specialRequests:   form.specialRequests.trim() || undefined,
      }

      const created = await bookingService.create(input)
      setBooking({ id: created.id })
    } catch (err: any) {
      setError(err.message || 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Book This Tour</h2>
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{tour.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0 ml-3"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success state */}
        {booking ? (
          <SuccessScreen bookingId={booking.id} tourTitle={tour.title} onClose={onClose} />
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">

            {/* Price summary */}
            <div className="bg-primary-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-primary-600 font-medium">Price per person</p>
                <p className="text-xl font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total ({form.numberOfTravelers} pax)</p>
                <p className="text-xl font-bold text-primary-600">₹{totalPrice.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Row 1: Name + Email */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full name" htmlFor="customerName" required>
                <div className="relative">
                  <User className={iconCls} />
                  <input id="customerName" type="text" required value={form.customerName}
                    onChange={set('customerName')} disabled={submitting}
                    className={inputCls} placeholder="Your name" />
                </div>
              </Field>
              <Field label="Email" htmlFor="customerEmail" required>
                <div className="relative">
                  <Mail className={iconCls} />
                  <input id="customerEmail" type="email" required value={form.customerEmail}
                    onChange={set('customerEmail')} disabled={submitting}
                    className={inputCls} placeholder="you@example.com" />
                </div>
              </Field>
            </div>

            {/* Row 2: Phone + Country */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone" htmlFor="customerPhone" required>
                <div className="relative">
                  <Phone className={iconCls} />
                  <input id="customerPhone" type="tel" required value={form.customerPhone}
                    onChange={set('customerPhone')} disabled={submitting}
                    className={inputCls} placeholder="+91 98765 43210" />
                </div>
              </Field>
              <Field label="Country" htmlFor="customerCountry" required>
                <div className="relative">
                  <Globe className={iconCls} />
                  <input id="customerCountry" type="text" required value={form.customerCountry}
                    onChange={set('customerCountry')} disabled={submitting}
                    className={inputCls} placeholder="India" />
                </div>
              </Field>
            </div>

            {/* Row 3: Date + Travelers */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start date" htmlFor="startDate" required>
                <div className="relative">
                  <Calendar className={iconCls} />
                  <input id="startDate" type="date" required value={form.startDate}
                    min={minDate()} onChange={set('startDate')} disabled={submitting}
                    className={inputCls} />
                </div>
              </Field>
              <Field label="Travelers" htmlFor="numberOfTravelers" required hint={`Max ${tour.maxGroupSize}`}>
                <div className="relative">
                  <Users className={iconCls} />
                  <input id="numberOfTravelers" type="number" required
                    min={1} max={tour.maxGroupSize}
                    value={form.numberOfTravelers} onChange={set('numberOfTravelers')}
                    disabled={submitting} className={inputCls} />
                </div>
              </Field>
            </div>

            {/* Special requests */}
            <Field label="Special requests" htmlFor="specialRequests" hint="Optional">
              <textarea
                id="specialRequests" rows={2} value={form.specialRequests}
                onChange={set('specialRequests')} disabled={submitting}
                placeholder="Dietary requirements, accessibility needs, etc."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-50 resize-none"
              />
            </Field>

            {/* Not logged in notice */}
            {!isAuthenticated() && (
              <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                You&apos;ll be asked to sign in before completing your booking.
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Processing…</>
              ) : (
                <>Confirm Booking — ₹{totalPrice.toLocaleString('en-IN')}</>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              No payment required now · Our team will contact you to confirm
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
