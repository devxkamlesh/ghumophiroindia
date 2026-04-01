'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, Mail, Phone, MapPin, Calendar, Users, ArrowRight,
  Loader2, CheckCircle2, ChevronLeft,
} from 'lucide-react'
import { tourService, bookingService } from '@/services/api'
import type { Tour } from '@/types'

function priceNum(p: string | number | null | undefined) {
  if (!p) return 0
  return typeof p === 'string' ? parseFloat(p) || 0 : p
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const GENDERS = ['Male', 'Female', 'Other']
const FOOD = ['Veg', 'Non-Veg', 'Jain', 'Vegan']
const SOURCES = ['Google', 'Instagram', 'Facebook', 'Friend / Family', 'Other']

// Mirror of the server-side add-on catalogue (display only — server recomputes)
const ADDONS_CATALOGUE: Record<string, { label: string; price: number }> = {
  honeymoon: { label: 'Honeymoon Inclusion', price: 750 },
  rafting:   { label: 'River Rafting',        price: 600 },
}

interface PaxRow { name: string; mobile: string; gender: string; age: string }

function BookingContent() {
  const sp = useSearchParams()
  const router = useRouter()

  const tourId   = Number(sp.get('tourId'))
  const dateStr  = sp.get('date') || ''
  const from     = sp.get('from') || 'Delhi'
  const adults   = Math.max(1, Number(sp.get('adults')) || 1)
  const kids     = Math.max(0, Number(sp.get('kids')) || 0)
  const roomsN   = Math.max(1, Number(sp.get('rooms')) || 1)
  const going    = sp.get('going') || 'self'
  const ret      = sp.get('ret') || 'self'

  const addons: Record<string, number> = (() => {
    try { return JSON.parse(sp.get('addons') || '{}') } catch { return {} }
  })()

  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  // Primary passenger
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')
  const [source, setSource] = useState('')
  const [age, setAge] = useState('')
  const [location, setLocation] = useState('')
  const [food, setFood] = useState('')
  const [specialDay, setSpecialDay] = useState('')
  const [requests, setRequests] = useState('')

  // Other passengers + kids
  const [others, setOthers] = useState<PaxRow[]>(
    Array.from({ length: Math.max(0, adults - 1) }, () => ({ name: '', mobile: '', gender: '', age: '' }))
  )
  const [kidRows, setKidRows] = useState<PaxRow[]>(
    Array.from({ length: kids }, () => ({ name: '', mobile: '', gender: '', age: '' }))
  )

  useEffect(() => {
    if (!tourId || Number.isNaN(tourId)) { setLoading(false); setError('No tour selected'); return }
    tourService.getById(tourId)
      .then(setTour)
      .catch(() => setError('Tour not found'))
      .finally(() => setLoading(false))
  }, [tourId])

  const startDate = dateStr ? new Date(dateStr) : null
  const duration = tour?.duration ?? 0
  const nights = duration > 1 ? duration - 1 : 0
  const endDate = startDate ? new Date(startDate.getTime() + nights * 86400000) : null
  const travellers = adults + kids

  // Charges — mirror server formula: per person + 70% kids + add-ons + 5% GST
  const base = tour ? priceNum(tour.price) : 0
  const roomCharge = Math.round(base * adults + base * 0.7 * kids)
  const addonsTotal = Object.entries(addons).reduce(
    (s, [k, q]) => s + (ADDONS_CATALOGUE[k]?.price ?? 0) * (q || 0), 0
  )
  const travelCharge = 0
  const tax = Math.round((roomCharge + addonsTotal + travelCharge) * 0.05)
  const grandTotal = Math.round(roomCharge + addonsTotal + travelCharge + tax)

  const updateOther = (i: number, k: keyof PaxRow, v: string) =>
    setOthers(p => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r))
  const updateKid = (i: number, k: keyof PaxRow, v: string) =>
    setKidRows(p => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r))

  const submit = async () => {
    if (!tour) return
    // ── Client-side validation (important fields) ──
    const errs: string[] = []
    if (name.trim().length < 2) errs.push('a valid full name')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.push('a valid email')
    if (phone.replace(/\D/g, '').length < 10) errs.push('a valid phone number (min 10 digits)')
    if (age && (Number(age) < 1 || Number(age) > 120)) errs.push('a valid age')
    if (errs.length) {
      setError(`Please enter ${errs.join(', ')}.`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setSubmitting(true); setError('')
    try {
      const passengers = [
        { name: name.trim(), mobile: phone.trim(), gender, age, type: 'adult' as const },
        ...others.map(o => ({ name: o.name, mobile: o.mobile, gender: o.gender, age: o.age, type: 'adult' as const })),
        ...kidRows.map(k => ({ name: k.name, mobile: k.mobile, gender: k.gender, age: k.age, type: 'child' as const })),
      ].filter(p => p.name?.trim())

      await bookingService.create({
        tourId: tour.id,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        customerCountry: location.trim() || 'India',
        numberOfTravelers: travellers,
        numberOfAdults: adults,
        numberOfChildren: kids,
        startDate: (startDate ?? new Date()).toISOString(),
        departureCity: from,
        roomsCount: roomsN,
        travelGoing: going,
        travelReturn: ret,
        addons,
        passengers,
        specialRequests: [requests, food && `Food: ${food}`, specialDay && `Occasion: ${specialDay}`]
          .filter(Boolean).join(' · ') || undefined,
      })
      setDone(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e: any) {
      setError(e?.message || 'Could not submit booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-7 h-7 animate-spin text-primary-600" /></div>
  }

  if (error && !tour) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-700 font-semibold mb-3">{error}</p>
          <Link href="/tours" className="text-primary-600 font-medium hover:underline">Browse tours</Link>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking request received!</h1>
          <p className="text-gray-500 mb-6">Thanks {name.split(' ')[0]}. Our team will contact you within 24 hours to confirm your trip to {tour?.title}.</p>
          <Link href="/tours" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-sm font-semibold">
            Explore more tours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-6">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-4">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Person Information ───────────────────────────── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100">Person Information</h2>

            {/* Primary passenger */}
            <h3 className="text-sm font-bold text-gray-800 mt-5 mb-4">Primary Passenger Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" required icon={User}>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" className={inputCls} />
              </Field>
              <Field label="Email" required icon={Mail}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" className={inputCls} />
              </Field>
              <Field label="Phone Number" required icon={Phone}>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter your mobile number" className={inputCls} />
              </Field>
              <Field label="Gender">
                <Select value={gender} onChange={setGender} placeholder="Select" options={GENDERS} />
              </Field>
              <Field label="Source">
                <Select value={source} onChange={setSource} placeholder="Select source" options={SOURCES} />
              </Field>
              <Field label="Age">
                <input value={age} onChange={e => setAge(e.target.value)} placeholder="Enter your age" className={inputCls} />
              </Field>
              <Field label="Location" icon={MapPin}>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter your location" className={inputCls} />
              </Field>
              <Field label="Food Preference">
                <Select value={food} onChange={setFood} placeholder="Select" options={FOOD} />
              </Field>
              <Field label="Special Day During Trip">
                <input value={specialDay} onChange={e => setSpecialDay(e.target.value)} placeholder="Birthday, anniversary…" className={inputCls} />
              </Field>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              <span className="font-semibold text-gray-500">Note:</span> Please enter a correct &amp; valid mobile number as all future communication will be done via the Family Head guest&apos;s mobile number only.
            </p>

            {/* Other passengers */}
            {others.length > 0 && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mt-7 mb-4">Other Passenger Details</h3>
                <div className="space-y-3">
                  {others.map((r, i) => (
                    <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <input value={r.name} onChange={e => updateOther(i, 'name', e.target.value)} placeholder="Enter Name" className={inputCls} />
                      <input value={r.mobile} onChange={e => updateOther(i, 'mobile', e.target.value)} placeholder="Enter Mobile" className={inputCls} />
                      <Select value={r.gender} onChange={v => updateOther(i, 'gender', v)} placeholder="Select" options={GENDERS} />
                      <input value={r.age} onChange={e => updateOther(i, 'age', e.target.value)} placeholder="Enter Age" className={inputCls} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Kids */}
            {kidRows.length > 0 && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mt-7 mb-4">Kids Details</h3>
                <div className="space-y-3">
                  {kidRows.map((r, i) => (
                    <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <input value={r.name} onChange={e => updateKid(i, 'name', e.target.value)} placeholder="Enter Name" className={inputCls} />
                      <input value={r.mobile} onChange={e => updateKid(i, 'mobile', e.target.value)} placeholder="Guardian Mobile" className={inputCls} />
                      <Select value={r.gender} onChange={v => updateKid(i, 'gender', v)} placeholder="Select" options={GENDERS} />
                      <input value={r.age} onChange={e => updateKid(i, 'age', e.target.value)} placeholder="Enter Age" className={inputCls} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Special requests */}
            <h3 className="text-sm font-bold text-gray-800 mt-7 mb-2">Special Requests <span className="text-gray-400 font-normal">(optional)</span></h3>
            <textarea value={requests} onChange={e => setRequests(e.target.value)} rows={3}
              placeholder="Dietary requirements, accessibility needs, etc." className={`${inputCls} resize-none`} />
          </div>

          {/* ── Right: Tour Summary ────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-[150px] space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">Tour Summary</h2>

              <p className="text-xs text-gray-400 mt-3">Tour Type : <span className="font-semibold text-gray-700 capitalize">{tour?.category || 'Group'} Tour</span></p>
              <p className="text-base font-bold text-gray-900 mt-1 leading-snug">{tour?.title}</p>
              <p className="text-xs text-primary-600 font-semibold mt-1">{duration} Days, {nights} Nights</p>

              {/* Dates */}
              <div className="flex items-center justify-between mt-4 text-xs">
                <div>
                  <p className="text-gray-400">Tour Starts</p>
                  <p className="font-bold text-gray-800">{startDate ? fmtDate(startDate) : '—'}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300" />
                <div className="text-right">
                  <p className="text-gray-400">Tour Ends</p>
                  <p className="font-bold text-gray-800">{endDate ? fmtDate(endDate) : '—'}</p>
                </div>
              </div>

              {/* Info rows */}
              <div className="mt-4 rounded-xl bg-gray-50 divide-y divide-gray-100 text-xs">
                <Row label="Persons" value={`${adults} Adult${adults !== 1 ? 's' : ''}${kids ? ` · ${kids} Kid${kids !== 1 ? 's' : ''}` : ''}`} />
                <Row label="Room Info" value={`${roomsN} Room${roomsN !== 1 ? 's' : ''}`} />
                <Row label="From" value={from} />
                <Row label="Travel" value={`${going === 'self' ? 'Self' : going} / ${ret === 'self' ? 'Self' : ret}`} />
              </div>

              <button onClick={submit} disabled={submitting}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-bold transition-colors">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : 'Continue'}
              </button>
            </div>

            {/* Charges */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">Tour Charges Summary</h2>
              <div className="mt-3 space-y-2.5 text-sm">
                <ChargeRow label="Room Charge" value={roomCharge} />
                {addonsTotal > 0 && <ChargeRow label="Add-ons" value={addonsTotal} />}
                <ChargeRow label="Travel Charge" value={travelCharge} />
                <ChargeRow label="Tax (5% GST)" value={tax} />
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="font-bold text-gray-900">Total Charge</span>
                  <span className="text-lg font-extrabold text-primary-600">₹{grandTotal.toLocaleString('en-IN')}/-</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> {travellers} traveller{travellers !== 1 ? 's' : ''} · no payment required now
              </p>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Small presentational helpers ──────────────────────────────────────────────
const inputCls = 'w-full h-11 px-3 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none'

function Field({ label, required, icon: Icon, children }: { label: string; required?: boolean; icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />}
        <div className={Icon ? '[&>input]:pl-9' : ''}>{children}</div>
      </div>
    </div>
  )
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className={`${inputCls} appearance-none bg-white ${value ? 'text-gray-800' : 'text-gray-400'}`}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o} className="text-gray-800">{o}</option>)}
    </select>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold text-gray-700 text-right">{value}</span>
    </div>
  )
}

function ChargeRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">₹{value.toLocaleString('en-IN')}/-</span>
    </div>
  )
}

export default function TourBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-7 h-7 animate-spin text-primary-600" /></div>}>
      <BookingContent />
    </Suspense>
  )
}
