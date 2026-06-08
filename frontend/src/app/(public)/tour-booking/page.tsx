'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, Mail, Phone, MapPin, Users, ArrowRight, AlertCircle,
  Loader2, CheckCircle2, ChevronLeft, UserPlus, Baby, MessageSquare, ReceiptText, Shield,
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
type Errors = Record<string, string>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_RE = /^[\p{L}\p{M}.'\- ]+$/u

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
  const [errors, setErrors] = useState<Errors>({})

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

  const clearErr = (key: string) =>
    setErrors(prev => (prev[key] ? { ...prev, [key]: '' } : prev))

  const updateOther = (i: number, k: keyof PaxRow, v: string) => {
    setOthers(p => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r))
    clearErr(`other-${i}-${k}`)
  }
  const updateKid = (i: number, k: keyof PaxRow, v: string) => {
    setKidRows(p => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r))
    clearErr(`kid-${i}-${k}`)
  }

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): Errors => {
    const e: Errors = {}

    // Primary passenger (mandatory)
    if (!name.trim()) e.name = 'Full name is required'
    else if (name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    else if (!NAME_RE.test(name.trim())) e.name = 'Name can only contain letters and spaces'

    if (!email.trim()) e.email = 'Email is required'
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address'

    const digits = phone.replace(/\D/g, '')
    if (!digits) e.phone = 'Phone number is required'
    else if (digits.length < 10 || digits.length > 15) e.phone = 'Enter a valid 10-digit mobile number'

    if (!gender) e.gender = 'Please select a gender'

    if (age) {
      const n = Number(age)
      if (!/^\d{1,3}$/.test(age) || n < 1 || n > 120) e.age = 'Enter a valid age (1–120)'
    }

    // Other passengers — required because the booking is for this many people
    others.forEach((o, i) => {
      if (!o.name.trim()) e[`other-${i}-name`] = 'Required'
      else if (o.name.trim().length < 2) e[`other-${i}-name`] = 'Too short'
      if (o.age) {
        const n = Number(o.age)
        if (!/^\d{1,3}$/.test(o.age) || n < 1 || n > 120) e[`other-${i}-age`] = 'Invalid'
      }
    })

    // Kids
    kidRows.forEach((k, i) => {
      if (!k.name.trim()) e[`kid-${i}-name`] = 'Required'
      if (k.age) {
        const n = Number(k.age)
        if (!/^\d{1,3}$/.test(k.age) || n < 1 || n > 18) e[`kid-${i}-age`] = 'Invalid'
      }
    })

    return e
  }

  const scrollToError = () => {
    const el = document.querySelector('[data-error="true"]')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = async () => {
    if (!tour) return
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      setError('Please fix the highlighted fields before continuing.')
      setTimeout(scrollToError, 50)
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
    } catch (err: any) {
      // Map server-side field errors back onto the form
      const fieldErrors = err?.fieldErrors as Record<string, string[]> | undefined
      if (fieldErrors) {
        const map: Record<string, string> = {
          customerName: 'name', customerEmail: 'email',
          customerPhone: 'phone', customerCountry: 'location',
        }
        const mapped: Errors = {}
        Object.entries(fieldErrors).forEach(([k, msgs]) => {
          const localKey = map[k] ?? k
          mapped[localKey] = msgs?.[0] ?? 'Invalid value'
        })
        setErrors(prev => ({ ...prev, ...mapped }))
        setTimeout(scrollToError, 50)
      }
      setError(err?.message || 'Could not submit booking. Please try again.')
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
      <div className="min-h-[60vh] flex items-center justify-center px-4 font-poppins">
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

  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <div className="bg-gray-50 min-h-screen font-poppins">
      <div className="container-custom py-6">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Person Information ───────────────────────────── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header band */}
            <div className="px-6 py-5 bg-gradient-to-r from-primary-600 to-orange-500 text-white">
              <h2 className="text-lg font-bold tracking-tight">Traveller Details</h2>
              <p className="text-xs text-white/80 mt-0.5">Fill in the lead traveller&apos;s details. Fields marked <span className="font-semibold">*</span> are required.</p>
            </div>

            <div className="p-6">
              {/* Top-level error banner */}
              {errorCount > 0 && (
                <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-600 font-medium">
                    {errorCount} field{errorCount !== 1 ? 's' : ''} need{errorCount === 1 ? 's' : ''} your attention. Please review the highlighted inputs below.
                  </p>
                </div>
              )}

              {/* Primary passenger */}
              <SectionHeading icon={User} title="Primary Passenger Details" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                <Field label="Full Name" required icon={User} error={errors.name}>
                  <input value={name} onChange={e => { setName(e.target.value); clearErr('name') }}
                    placeholder="Enter your name" className={inputCls(!!errors.name)} />
                </Field>
                <Field label="Email" required icon={Mail} error={errors.email}>
                  <input type="email" value={email} onChange={e => { setEmail(e.target.value); clearErr('email') }}
                    placeholder="Enter your email address" className={inputCls(!!errors.email)} />
                </Field>
                <Field label="Phone Number" required icon={Phone} error={errors.phone}>
                  <input inputMode="tel" value={phone} onChange={e => { setPhone(e.target.value); clearErr('phone') }}
                    placeholder="Enter your mobile number" className={inputCls(!!errors.phone)} />
                </Field>
                <Field label="Gender" required error={errors.gender}>
                  <Select value={gender} onChange={v => { setGender(v); clearErr('gender') }} placeholder="Select" options={GENDERS} error={!!errors.gender} />
                </Field>
                <Field label="Source">
                  <Select value={source} onChange={setSource} placeholder="Select source" options={SOURCES} />
                </Field>
                <Field label="Age" error={errors.age}>
                  <input inputMode="numeric" value={age} onChange={e => { setAge(e.target.value); clearErr('age') }}
                    placeholder="Enter your age" className={inputCls(!!errors.age)} />
                </Field>
                <Field label="Location" icon={MapPin} error={errors.location}>
                  <input value={location} onChange={e => { setLocation(e.target.value); clearErr('location') }}
                    placeholder="Enter your location" className={inputCls(!!errors.location)} />
                </Field>
                <Field label="Food Preference">
                  <Select value={food} onChange={setFood} placeholder="Select" options={FOOD} />
                </Field>
                <Field label="Special Day During Trip">
                  <input value={specialDay} onChange={e => setSpecialDay(e.target.value)} placeholder="Birthday, anniversary…" className={inputCls(false)} />
                </Field>
              </div>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                <span className="font-semibold text-gray-500">Note:</span> Please enter a correct &amp; valid mobile number as all future communication will be done via the Family Head guest&apos;s mobile number only.
              </p>

              {/* Other passengers */}
              {others.length > 0 && (
                <>
                  <SectionHeading icon={UserPlus} title="Other Passenger Details" className="mt-7" />
                  <div className="space-y-4">
                    {others.map((r, i) => (
                      <PaxGroup key={i} index={i} label={`Adult ${i + 2}`}>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <CellInput value={r.name} onChange={v => updateOther(i, 'name', v)} placeholder="Full name *" error={errors[`other-${i}-name`]} />
                          <CellInput value={r.mobile} onChange={v => updateOther(i, 'mobile', v)} placeholder="Mobile" inputMode="tel" />
                          <Select value={r.gender} onChange={v => updateOther(i, 'gender', v)} placeholder="Gender" options={GENDERS} />
                          <CellInput value={r.age} onChange={v => updateOther(i, 'age', v)} placeholder="Age" inputMode="numeric" error={errors[`other-${i}-age`]} />
                        </div>
                      </PaxGroup>
                    ))}
                  </div>
                </>
              )}

              {/* Kids */}
              {kidRows.length > 0 && (
                <>
                  <SectionHeading icon={Baby} title="Kids Details" className="mt-7" />
                  <div className="space-y-4">
                    {kidRows.map((r, i) => (
                      <PaxGroup key={i} index={i} label={`Child ${i + 1}`}>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <CellInput value={r.name} onChange={v => updateKid(i, 'name', v)} placeholder="Full name *" error={errors[`kid-${i}-name`]} />
                          <CellInput value={r.mobile} onChange={v => updateKid(i, 'mobile', v)} placeholder="Guardian mobile" inputMode="tel" />
                          <Select value={r.gender} onChange={v => updateKid(i, 'gender', v)} placeholder="Gender" options={GENDERS} />
                          <CellInput value={r.age} onChange={v => updateKid(i, 'age', v)} placeholder="Age" inputMode="numeric" error={errors[`kid-${i}-age`]} />
                        </div>
                      </PaxGroup>
                    ))}
                  </div>
                </>
              )}

              {/* Special requests */}
              <SectionHeading icon={MessageSquare} title="Special Requests" optional className="mt-7" />
              <textarea value={requests} onChange={e => setRequests(e.target.value)} rows={3}
                placeholder="Dietary requirements, accessibility needs, etc." className={`${inputCls(false)} h-auto py-2.5 resize-none`} />
            </div>
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
                className="mt-4 w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-bold transition-colors shadow-md shadow-primary-600/20">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <>Continue <ArrowRight className="w-4 h-4" /></>}
              </button>

              <p className="text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> Your details are safe & secure
              </p>
            </div>

            {/* Charges */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                <ReceiptText className="w-4 h-4 text-primary-600" /> Tour Charges Summary
              </h2>
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

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2.5">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Small presentational helpers ──────────────────────────────────────────────
const inputCls = (hasError: boolean) =>
  `w-full h-11 px-3 rounded-lg border text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-colors ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/40'
      : 'border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
  }`

function SectionHeading({ icon: Icon, title, optional, className = '' }: { icon: React.ElementType; title: string; optional?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2 mb-4 ${className}`}>
      <span className="w-7 h-7 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </span>
      <h3 className="text-sm font-bold text-gray-800">
        {title} {optional && <span className="text-gray-400 font-normal">(optional)</span>}
      </h3>
    </div>
  )
}

function Field({ label, required, icon: Icon, error, children }: { label: string; required?: boolean; icon?: React.ElementType; error?: string; children: React.ReactNode }) {
  return (
    <div data-error={error ? 'true' : undefined}>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 ${error ? 'text-red-400' : 'text-gray-300'}`} />}
        <div className={Icon ? '[&>input]:pl-9' : ''}>{children}</div>
      </div>
      {error && <p className="mt-1 text-[11px] text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  )
}

function CellInput({ value, onChange, placeholder, error, inputMode }: { value: string; onChange: (v: string) => void; placeholder: string; error?: string; inputMode?: 'tel' | 'numeric' | 'text' }) {
  return (
    <div data-error={error ? 'true' : undefined}>
      <input value={value} inputMode={inputMode} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputCls(!!error)} />
      {error && <p className="mt-1 text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  )
}

function PaxGroup({ index, label, children }: { index: number; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
      <p className="text-[11px] font-semibold text-gray-500 mb-2">{label}</p>
      {children}
    </div>
  )
}

function Select({ value, onChange, options, placeholder, error }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string; error?: boolean }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className={`${inputCls(!!error)} appearance-none bg-white ${value ? 'text-gray-800' : 'text-gray-400'}`}>
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
