'use client'

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Calendar, Phone, Plus, X, ChevronDown } from 'lucide-react'
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
  childrenWithBed: number
  childrenWithoutBed: number
  infants: number
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

export default function BookingCalculator({ tour, onBook }: Props) {
  const basePrice = priceNum(tour.price)
  const departures = generateDepartures(tour.duration)

  const [tourType, setTourType] = useState('standard')
  const [selectedDate, setSelectedDate] = useState<Date | null>(departures[0] ?? null)
  const [rooms, setRooms] = useState<RoomData[]>([
    { adults: 2, childrenWithBed: 0, childrenWithoutBed: 0, infants: 0 }
  ])
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Add/remove rooms
  const addRoom = () => {
    if (rooms.length < 3) {
      setRooms([...rooms, { adults: 1, childrenWithBed: 0, childrenWithoutBed: 0, infants: 0 }])
    }
  }

  const removeRoom = (index: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((_, i) => i !== index))
    }
  }

  // Update room data
  const updateRoom = (index: number, field: keyof RoomData, value: number) => {
    const newRooms = [...rooms]
    newRooms[index] = { ...newRooms[index], [field]: Math.max(0, value) }
    setRooms(newRooms)
  }

  // Calculate total price
  const calculatePrice = () => {
    const tourMultiplier = TOUR_TYPES.find(t => t.key === tourType)?.multiplier ?? 1.0
    let total = 0

    rooms.forEach(room => {
      // Adults: full price
      total += room.adults * basePrice * tourMultiplier
      
      // Children with bed: 80% of adult price
      total += room.childrenWithBed * basePrice * tourMultiplier * 0.8
      
      // Children without bed: 50% of adult price
      total += room.childrenWithoutBed * basePrice * tourMultiplier * 0.5
      
      // Infants: free (no charge)
    })

    return Math.round(total)
  }

  const totalPrice = calculatePrice()
  const totalTravelers = rooms.reduce((sum, room) => 
    sum + room.adults + room.childrenWithBed + room.childrenWithoutBed + room.infants, 0
  )

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
    <div className="space-y-4">
      {/* Tour Type Selection */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <label className="block text-sm font-bold text-gray-900 mb-3">Tour Type</label>
        <div className="grid grid-cols-3 gap-2">
          {TOUR_TYPES.map(type => {
            const isSelected = tourType === type.key
            return (
              <button
                key={type.key}
                type="button"
                onClick={() => setTourType(type.key)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50 shadow-sm'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <p className={`text-xs font-bold mb-0.5 ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
                  {type.label}
                </p>
                <p className={`text-[10px] ${isSelected ? 'text-primary-600' : 'text-gray-500'}`}>
                  {type.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Traveller Details - Multiple Rooms */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-gray-900">Traveller Details</label>
          {rooms.length < 3 && (
            <button
              type="button"
              onClick={addRoom}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Room
            </button>
          )}
        </div>

        <div className="space-y-3">
          {rooms.map((room, index) => (
            <div key={index} className="border border-gray-100 rounded-xl p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-700">Room {index + 1}</span>
                {rooms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRoom(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Adults */}
                <div>
                  <label className="text-[10px] text-gray-500 font-medium mb-1 block">
                    Adult (12+ yrs)
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => updateRoom(index, 'adults', room.adults - 1)}
                      disabled={room.adults <= 1}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="text-gray-700 font-bold text-sm">−</span>
                    </button>
                    <span className="flex-1 text-center text-xs font-bold text-gray-900">
                      {room.adults}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateRoom(index, 'adults', room.adults + 1)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-50"
                    >
                      <span className="text-gray-700 font-bold text-sm">+</span>
                    </button>
                  </div>
                </div>

                {/* Children with bed */}
                <div>
                  <label className="text-[10px] text-gray-500 font-medium mb-1 block">
                    Child (With bed)
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => updateRoom(index, 'childrenWithBed', room.childrenWithBed - 1)}
                      disabled={room.childrenWithBed <= 0}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="text-gray-700 font-bold text-sm">−</span>
                    </button>
                    <span className="flex-1 text-center text-xs font-bold text-gray-900">
                      {room.childrenWithBed}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateRoom(index, 'childrenWithBed', room.childrenWithBed + 1)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-50"
                    >
                      <span className="text-gray-700 font-bold text-sm">+</span>
                    </button>
                  </div>
                </div>

                {/* Children without bed */}
                <div>
                  <label className="text-[10px] text-gray-500 font-medium mb-1 block">
                    Child (Without bed)
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => updateRoom(index, 'childrenWithoutBed', room.childrenWithoutBed - 1)}
                      disabled={room.childrenWithoutBed <= 0}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="text-gray-700 font-bold text-sm">−</span>
                    </button>
                    <span className="flex-1 text-center text-xs font-bold text-gray-900">
                      {room.childrenWithoutBed}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateRoom(index, 'childrenWithoutBed', room.childrenWithoutBed + 1)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-50"
                    >
                      <span className="text-gray-700 font-bold text-sm">+</span>
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div>
                  <label className="text-[10px] text-gray-500 font-medium mb-1 block">
                    Infant (0-2 yrs)
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => updateRoom(index, 'infants', room.infants - 1)}
                      disabled={room.infants <= 0}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="text-gray-700 font-bold text-sm">−</span>
                    </button>
                    <span className="flex-1 text-center text-xs font-bold text-gray-900">
                      {room.infants}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateRoom(index, 'infants', room.infants + 1)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-50"
                    >
                      <span className="text-gray-700 font-bold text-sm">+</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date of Travel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <label className="block text-sm font-bold text-gray-900 mb-2">Select Departure Date</label>
        <button
          type="button"
          onClick={() => setShowDatePicker(true)}
          className="w-full flex items-center justify-between px-3 py-2.5 border-2 border-gray-300 rounded-xl hover:border-primary-500 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {selectedDate ? fmtDate(selectedDate) : 'Choose date'}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
        <label className="block text-sm font-bold text-gray-900">Contact Details</label>
        
        <div>
          <label className="text-[10px] text-gray-500 font-medium mb-1 block">Mobile No.</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter mobile number"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] text-gray-500 font-medium mb-1 block">Email ID</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>

        <p className="text-[10px] text-gray-400 leading-relaxed">
          Your booking details will be sent on these contact details.
        </p>
      </div>

      {/* Terms & Price */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-4">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="terms" className="text-[10px] text-gray-600 leading-relaxed">
            I accept the{' '}
            <Link href="/privacy-policy" className="text-primary-600 hover:underline">
              Privacy Policy
            </Link>{' '}
            &{' '}
            <Link href="/terms" className="text-primary-600 hover:underline">
              Terms & Conditions
            </Link>
          </label>
        </div>

        {/* Total Price Display */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs text-gray-500">Total Travelers:</span>
            <span className="text-sm font-bold text-gray-900">{totalTravelers}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-gray-900">Package Price:</span>
            <span className="text-2xl font-bold text-primary-600">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCalculatePrice}
          disabled={!acceptedTerms || !selectedDate || !mobile || !email}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-bold transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4" />
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
