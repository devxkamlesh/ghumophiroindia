'use client'

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Calendar, Phone, Plus, X, ChevronDown, Info } from 'lucide-react'
import type { Tour } from '@/types'

// Portal for modals
function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  React.useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return createPortal(children, document.body)
}

const TOUR_TYPES = [
  { key: 'standard', label: 'Standard', multiplier: 1.0, description: '3★ Hotels' },
  { key: 'value', label: 'Value', multiplier: 1.3, description: '4★ Hotels' },
  { key: 'premium', label: 'Premium', multiplier: 1.6, description: '5★ Hotels' },
]

interface RoomData {
  adults: number
  children: number
}

function generateDepartures(duration: number) {
  const dates: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let d = new Date(today)
  d.setDate(d.getDate() + 7)
  for (let i = 0; i < 30; i++) {
    dates.push(new Date(d))
    d.setDate(d.getDate() + (i % 2 === 0 ? 4 : 3))
  }
  return dates
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function priceNum(p: string | number | null | undefined) {
  if (!p) return 0
  return typeof p === 'string' ? parseFloat(p) || 0 : p
}

interface Props {
  tour: Tour
  onBook: (data: any) => void
}

// Traveler Counter Component
function TravelerCounter({ label, sublabel, value, onChange, min = 0, max = 99, disabled = false }: {
  label: string
  sublabel: string
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
  disabled?: boolean
}) {
  const canDecrease = value > min
  const canIncrease = value < max && !disabled

  return (
    <div>
      <div className="text-[10px] text-gray-600 font-medium mb-1">
        <span className="font-bold">{label}</span>
        <span className="text-gray-400 ml-1">{sublabel}</span>
      </div>
      <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => canDecrease && onChange(value - 1)}
          disabled={!canDecrease}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-gray-700 font-bold">−</span>
        </button>
        <span className="flex-1 text-center text-sm font-bold text-gray-900">
          {value}
        </span>
        <button
          type="button"
          onClick={() => canIncrease && onChange(value + 1)}
          disabled={!canIncrease}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-gray-700 font-bold">+</span>
        </button>
      </div>
    </div>
  )
}

export default function BookingCalculator({ tour, onBook }: Props) {
  const basePrice = priceNum(tour.price)
  const departures = generateDepartures(tour.duration)

  const [tourType, setTourType] = useState('standard')
  const [selectedDate, setSelectedDate] = useState<Date | null>(departures[0] ?? null)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const MAX_TRAVELERS = 4

  // Calculate total travelers
  const totalTravelers = adults + children

  // Validate max travelers
  const canAddAdult = totalTravelers < MAX_TRAVELERS
  const canAddChild = totalTravelers < MAX_TRAVELERS

  // Calculate total price
  const calculatePrice = () => {
    const tourMultiplier = TOUR_TYPES.find(t => t.key === tourType)?.multiplier ?? 1.0

    // Adults: full price
    const adultTotal = adults * basePrice * tourMultiplier
    
    // Children: 70% of adult price
    const childTotal = children * basePrice * tourMultiplier * 0.7

    return Math.round(adultTotal + childTotal)
  }

  const totalPrice = calculatePrice()

  // Group departures by month
  const byMonth: Record<string, Date[]> = {}
  departures.forEach(d => {
    const key = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    if (!byMonth[key]) byMonth[key] = []
    byMonth[key].push(d)
  })

  const handleCalculatePrice = () => {
    if (!selectedDate) {
      alert('Please select a departure date')
      return
    }
    if (!mobile.trim()) {
      alert('Please enter your mobile number')
      return
    }
    if (!email.trim()) {
      alert('Please enter your email')
      return
    }
    if (!acceptedTerms) {
      alert('Please accept the terms and conditions')
      return
    }

    onBook({
      selectedDate,
      adults: totalTravelers,
      children: 0,
      selectedHotel: tourType,
      roomSelections: {},
    })
  }

  return (
    <div className="space-y-3">
      {/* Tour Type Selection - Compact Pills */}
      <div className="bg-gradient-to-br from-primary-50 to-orange-50 rounded-2xl border border-primary-100 p-4 shadow-sm">
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Tour Type</label>
        <div className="flex gap-2">
          {TOUR_TYPES.map(type => {
            const isSelected = tourType === type.key
            return (
              <button
                key={type.key}
                type="button"
                onClick={() => setTourType(type.key)}
                className={`flex-1 p-2.5 rounded-xl border-2 transition-all text-center ${
                  isSelected
                    ? 'border-primary-600 bg-white shadow-md scale-105'
                    : 'border-transparent bg-white/60 hover:bg-white/80'
                }`}
              >
                <p className={`text-xs font-bold ${isSelected ? 'text-primary-700' : 'text-gray-600'}`}>
                  {type.label}
                </p>
                <p className={`text-[9px] mt-0.5 ${isSelected ? 'text-primary-600' : 'text-gray-500'}`}>
                  {type.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Traveller Details - Simplified */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="mb-3">
          <label className="text-sm font-bold text-gray-900">Traveller Details</label>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {totalTravelers} of {MAX_TRAVELERS} travelers
            {totalTravelers >= MAX_TRAVELERS && (
              <span className="text-orange-600 font-semibold ml-1">(Max reached)</span>
            )}
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Adults */}
            <TravelerCounter
              label="Adult"
              sublabel="12+ yrs"
              value={adults}
              onChange={(val) => setAdults(val)}
              min={1}
              max={MAX_TRAVELERS}
              disabled={!canAddAdult && adults < MAX_TRAVELERS}
            />

            {/* Children */}
            <TravelerCounter
              label="Child"
              sublabel="Below 12 yrs"
              value={children}
              onChange={(val) => setChildren(val)}
              min={0}
              max={MAX_TRAVELERS - 1}
              disabled={!canAddChild && children < MAX_TRAVELERS}
            />
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Pricing:</span>
              <div className="text-right">
                <p className="text-gray-700">
                  <span className="font-semibold">Adult:</span> 100% • 
                  <span className="font-semibold ml-1">Child:</span> 70%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date of Travel - Prominent */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-4 shadow-sm">
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
          <Calendar className="w-3 h-3 inline mr-1" />
          Departure Date
        </label>
        <button
          type="button"
          onClick={() => setShowDatePicker(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-orange-300 rounded-xl hover:border-orange-400 transition-all group"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-sm font-bold text-gray-900">
              {selectedDate ? fmtDate(selectedDate) : 'Select date'}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
        </button>
      </div>

      {/* Contact Details - Clean Input */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
          <Phone className="w-3 h-3 inline mr-1" />
          Contact Details
        </label>
        
        <div className="space-y-2">
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile number"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <p className="text-[9px] text-gray-400 leading-relaxed mt-2 flex items-start gap-1">
          <Info className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
          <span>Booking details will be sent to these contacts</span>
        </p>
      </div>

      {/* Price Summary & CTA - Sticky Bottom */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-4 shadow-lg">
        {/* Price Display */}
        <div className="mb-3">
          <div className="flex items-baseline justify-between text-white mb-1">
            <span className="text-xs font-medium opacity-90">Total Price</span>
            <span className="text-xs opacity-75">{totalTravelers} travelers</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-white/70 font-medium">per group</span>
          </div>
        </div>

        {/* Terms Checkbox */}
        <label className="flex items-start gap-2 mb-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 text-white border-white/30 rounded bg-white/10 focus:ring-white focus:ring-offset-0"
          />
          <span className="text-[10px] text-white/90 leading-relaxed">
            I accept the{' '}
            <Link href="/privacy-policy" className="underline hover:text-white font-medium">
              Privacy Policy
            </Link>{' '}
            &{' '}
            <Link href="/terms" className="underline hover:text-white font-medium">
              Terms
            </Link>
          </span>
        </label>

        {/* CTA Button */}
        <button
          type="button"
          onClick={handleCalculatePrice}
          disabled={!acceptedTerms || !selectedDate || !mobile || !email}
          className="w-full bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-primary-700 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
        >
          <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          Request CallBack
        </button>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Portal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDatePicker(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col animate-modal-pop">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  Select Departure Date
                </h3>
                <button onClick={() => setShowDatePicker(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Scrollable month sections */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                {Object.entries(byMonth).map(([month, dates]) => (
                  <div key={month}>
                    <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      {month}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {dates.map((d, i) => {
                        const isSelected = selectedDate?.getTime() === d.getTime()
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setSelectedDate(d)
                              setShowDatePicker(false)
                            }}
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                              isSelected
                                ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                                : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                            }`}
                          >
                            <p className={`text-sm font-bold ${isSelected ? 'text-primary-700' : 'text-gray-800'}`}>
                              {d.getDate()}
                            </p>
                            <p className={`text-[10px] ${isSelected ? 'text-primary-600' : 'text-gray-500'}`}>
                              {d.toLocaleDateString('en-IN', { month: 'short' })}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Portal>
      )}

      <style jsx global>{`
        @keyframes modal-pop {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-modal-pop {
          animation: modal-pop 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}
