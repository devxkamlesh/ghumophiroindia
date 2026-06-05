'use client'

import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Clock, Users, MapPin, Star, Check, X, Calendar,
  ArrowLeft, ChevronRight, AlertCircle, Loader2,
  Shield, Phone, Award, ThumbsUp, HeartHandshake,
  Hotel, Bus, UtensilsCrossed, Camera, Binoculars,
  ChevronDown, ChevronUp, Info,
} from 'lucide-react'
import { tourService, locationAdminService } from '@/services/api'
import BookingModal from '@/components/public/shared/BookingModal'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import type { Tour, LocationNode } from '@/types'
import { toWebP } from '@/lib/image'
import dynamic from 'next/dynamic'

// Portal renders children directly into document.body, escaping any parent
// stacking context so modals always appear above the fixed header.
function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return createPortal(children, document.body)
}

const TourRouteMap = dynamic(() => import('@/components/public/map/TourRouteMap'), {
  ssr: false,
  loading: () => <div className="h-[380px] bg-gray-100 rounded-2xl animate-pulse" />,
})

function priceNum(p: string | number | null | undefined) {
  if (!p) return 0
  return typeof p === 'string' ? parseFloat(p) || 0 : p
}

const FALLBACK = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80'
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || '919876543210'

const DIFF: Record<string, string> = {
  easy:        'bg-green-100 text-green-700',
  moderate:    'bg-amber-100 text-amber-700',
  challenging: 'bg-red-100 text-red-700',
}

const CANCELLATION_POLICY = [
  { days: 'Registration charges', rule: 'Non-refundable and non-transferable.' },
  { days: 'Within 7 days', rule: '100% of tour package amount charged as cancellation fees.' },
  { days: '15 days before', rule: '50% of tour package amount charged as cancellation fees.' },
  { days: '30 days before', rule: '25% of tour package amount charged as cancellation fees.' },
  { days: 'Weather / Govt restrictions', rule: 'Certain activities may be cancelled. No refund provided. Alternate activity will be arranged.' },
  { days: 'Lockdown at destination', rule: 'Credit shell released, valid for 365 days for same number of persons after deduction of IRCTC/Airline charges.' },
]

const TERMS = [
  'Full payment must be made before 7 days of trip begins. Pending payments may lead to cancellation.',
  'Standard check-in time is 11 AM. Early check-in is subject to availability.',
  'Transportation is as per itinerary and not at disposal. AC will not work on hills.',
  'Package rates are subject to change without prior notice due to Force Majeure events, strikes, fairs, festivals, weather conditions, traffic problems, overbooking of hotels/flights.',
  'Company reserves the right to cancel bookings even after payment acceptance without assigning any reason. Full refund will be provided in such cases.',
  'Company may dismiss any guest for misbehavior, especially if it affects the group or involves physical/verbal assault to the Tour Manager, without any refunds.',
  'Hotel and/or tour programme may change due to unavoidable circumstances.',
  'Registration once booked cannot be cancelled, transferred or exchanged.',
  'Travellers are solely responsible for any mishappening, theft, loss, injuries, or illegal activities (including carrying banned drugs) during the tour.',
  'No act of misconduct or indiscipline shall be tolerated on the tours.',
  'In case of vehicle breakdown, travellers must wait for repair or alternate option arranged by the company. If 4x4 pickup is required due to heavy snow or road jam, client should pay extra.',
  'Travellers must take care of their luggage and belongings. Management shall not be accountable for missing items.',
  'COVID guidelines must be followed by all travellers.',
  'Departure time is fixed. Anyone missing the bus shall not be eligible for any refunds. We shall call you twice before scheduled departure.',
  'Travellers cannot drink or smoke in the vehicle during the trip.',
  'Company reserves the right to take photographs of participants for promotional purposes. Participants who prefer their image not be used must inform the tour leader at commencement.',
  'Company has rights to terminate any person during the trip due to misconduct, anti-social activities, or illegal activities. Remaining trip amount will be refunded.',
]

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="h-[420px] bg-gray-200 w-full" />
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="bg-white rounded-2xl p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 h-64" />
        </div>
      </div>
    </div>
  )
}

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2.5">
        {icon ?? <span className="w-1 h-5 bg-primary-600 rounded-full" />}{title}
      </h2>
      {children}
    </div>
  )
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left">
        <span className="font-bold text-gray-900 text-sm">{title}</span>
        <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${open ? 'bg-primary-50' : 'bg-gray-100'}`}>
          {open ? <ChevronUp className="w-4 h-4 text-primary-600" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </span>
      </button>
      {open && <div className="px-5 pb-5 bg-white border-t border-gray-100">{children}</div>}
    </div>
  )
}

// ── Booking Sidebar ───────────────────────────────────────────────────────────
const HOTEL_CATEGORIES = [
  { key: '3star', label: '3 Star', stars: 3, multiplier: 1.0 },
  { key: '4star', label: '4 Star', stars: 4, multiplier: 1.25 },
  { key: '5star', label: '5 Star', stars: 5, multiplier: 1.6 },
]

const ROOM_TYPES = [
  { key: 'triple',  label: 'Triple',  capacity: '3 pax', multiplier: 1.05 },
  { key: 'double',  label: 'Double',  capacity: '2 pax', multiplier: 1.18 },
  { key: 'single',  label: 'Single',  capacity: '1 pax', multiplier: 1.55 },
]

function generateDepartures(duration: number) {
  const dates: Date[] = []
  const today = new Date()
  today.setHours(0,0,0,0)
  // Generate next 12 weekly departures starting from next Saturday
  let d = new Date(today)
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7))
  for (let i = 0; i < 12; i++) {
    dates.push(new Date(d))
    d.setDate(d.getDate() + 7)
  }
  return dates
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

function fmtMonth(d: Date) {
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

interface BookingData {
  selectedDate: Date | null
  adults: number
  children: number
  selectedHotel: string | null
  roomSelections: Record<string, number>
}

function BookingSidebar({ tour, onBook }: { tour: Tour; onBook: (data: BookingData) => void }) {
  const p = priceNum(tour.price)
  const departures = generateDepartures(tour.duration)

  // Group by month
  const byMonth: Record<string, Date[]> = {}
  departures.forEach(d => {
    const key = fmtMonth(d)
    if (!byMonth[key]) byMonth[key] = []
    byMonth[key].push(d)
  })

  const [selectedDate, setSelectedDate] = useState<Date | null>(departures[0] ?? null)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showRoomPicker, setShowRoomPicker] = useState(false)
  
  // Hotel category selection (locked for all rooms once first room is selected)
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null)
  
  // Room selections: { roomKey: count }
  const [roomSelections, setRoomSelections] = useState<Record<string, number>>({
    triple: 0,
    double: 0,
    single: 0,
  })

  // Update room selection
  const updateRoomCount = (key: string, delta: number) => {
    setRoomSelections(prev => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }))
  }

  // Calculate total travelers and price
  const totalTravelers = adults + children
  const totalRooms = Object.values(roomSelections).reduce((sum, count) => sum + count, 0)
  
  // Get selected hotel multiplier
  const hotelMultiplier = HOTEL_CATEGORIES.find(h => h.key === selectedHotel)?.multiplier ?? 1.0
  
  // Calculate price based on room selections and hotel category
  let totalPrice = 0
  ROOM_TYPES.forEach(room => {
    const count = roomSelections[room.key]
    if (count > 0) {
      const roomPrice = Math.round(p * room.multiplier * hotelMultiplier)
      totalPrice += roomPrice * count
    }
  })

  // If no rooms selected, show base price per person
  const displayPrice = totalRooms > 0 ? totalPrice : p * totalTravelers

  // Fake seats available (based on date index)
  const seatsFor = (d: Date) => {
    const idx = departures.findIndex(dep => dep.getTime() === d.getTime())
    const seeds = [24, 12, 17, 8, 22, 40, 15, 30, 6, 19, 24, 11]
    return seeds[idx % seeds.length]
  }

  const seats = selectedDate ? seatsFor(selectedDate) : tour.maxGroupSize
  const selectedHotelData = HOTEL_CATEGORIES.find(h => h.key === selectedHotel)

  return (
    <div className="space-y-3">

      {/* Select Departure Date */}
      <div>
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Departure Date</p>
        <button type="button" onClick={() => setShowDatePicker(true)}
          className="w-full flex items-center justify-between px-3 py-2.5 border-2 border-primary-500 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-bold text-primary-700">
              {selectedDate ? fmtDate(selectedDate) : 'Choose date'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {selectedDate && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${seats <= 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                {seats} left
              </span>
            )}
            <ChevronDown className="w-4 h-4 text-primary-600" />
          </div>
        </button>
      </div>

      {/* Rooms & Hotel Selection */}
      <div>
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Rooms & Hotel</p>
        <button type="button" onClick={() => setShowRoomPicker(true)}
          className="w-full flex items-center justify-between px-3 py-2.5 border-2 border-gray-300 rounded-xl hover:border-primary-500 transition-colors">
          <div className="flex items-center gap-2">
            <Hotel className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-bold text-gray-700">
              {selectedHotel && totalRooms > 0
                ? `${selectedHotelData?.label} · ${totalRooms} room${totalRooms > 1 ? 's' : ''}`
                : selectedHotel
                ? `${selectedHotelData?.label} · Add rooms`
                : 'Select rooms'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {selectedHotelData && (
              <div className="flex gap-0.5">
                {Array.from({ length: selectedHotelData.stars }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            )}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </button>
      </div>

      {/* ═══════════ Date Picker Modal ═══════════ */}
      {showDatePicker && (
        <Portal>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDatePicker(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-modal-pop">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                Select Departure Date
              </h3>
              <button onClick={() => setShowDatePicker(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {/* Price alert */}
            <div className="bg-amber-50 border-b border-amber-100 px-5 py-2.5">
              <p className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                If seats drop below 5, price may increase by up to 25%.
              </p>
            </div>
            {/* Scrollable dates */}
            <div className="flex-1 overflow-y-auto p-5">
              {Object.entries(byMonth).map(([month, dates]) => (
                <div key={month} className="mb-5 last:mb-0">
                  <p className="text-xs font-bold text-gray-500 mb-3">{month}</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {dates.map((d, i) => {
                      const s = seatsFor(d)
                      const isSelected = selectedDate?.getTime() === d.getTime()
                      const isLow = s <= 5
                      return (
                        <button key={i} type="button"
                          onClick={() => { setSelectedDate(d); setShowDatePicker(false) }}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                              : isLow
                              ? 'border-red-200 bg-red-50 hover:border-red-400'
                              : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                          }`}>
                          <p className={`text-sm font-bold ${isSelected ? 'text-primary-700' : isLow ? 'text-red-600' : 'text-gray-800'}`}>
                            {fmtDate(d)}
                          </p>
                          <p className={`text-[10px] mt-1 ${isLow ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                            {s} seats
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

      {/* ═══════════ Rooms + Hotel Modal ═══════════ */}
      {showRoomPicker && (
        <Portal>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowRoomPicker(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col animate-modal-pop">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Hotel className="w-5 h-5 text-primary-600" />
                Choose Rooms
              </h3>
              <button onClick={() => setShowRoomPicker(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Step 1: Hotel category */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">1</span>
                  <p className="text-sm font-bold text-gray-900">Hotel Category</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {HOTEL_CATEGORIES.map(hotel => {
                    const isSelected = selectedHotel === hotel.key
                    return (
                      <button key={hotel.key}
                        onClick={() => {
                          if (selectedHotel !== hotel.key) {
                            setSelectedHotel(hotel.key)
                            setRoomSelections({ triple: 0, double: 0, single: 0 })
                          }
                        }}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                        }`}>
                        <Hotel className={`w-5 h-5 mx-auto mb-1.5 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
                        <p className={`text-xs font-bold ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>{hotel.label}</p>
                        <div className="flex justify-center gap-0.5 mt-1">
                          {Array.from({ length: hotel.stars }).map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 2: Room types */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${selectedHotel ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}>2</span>
                  <p className={`text-sm font-bold ${selectedHotel ? 'text-gray-900' : 'text-gray-400'}`}>Select Room Types</p>
                </div>

                {!selectedHotel ? (
                  <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-xl">
                    <Hotel className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Choose a hotel category above first</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {ROOM_TYPES.map(rt => {
                      const rtPrice = Math.round(p * rt.multiplier * hotelMultiplier)
                      const count = roomSelections[rt.key]
                      return (
                        <div key={rt.key}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                            count > 0 ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                          }`}>
                          <div className="flex-1">
                            <p className={`text-sm font-bold ${count > 0 ? 'text-primary-700' : 'text-gray-700'}`}>
                              {rt.label}
                              <span className="ml-1.5 text-[10px] font-normal text-gray-400">{rt.capacity}</span>
                            </p>
                            <p className={`text-xs ${count > 0 ? 'text-primary-600' : 'text-gray-500'}`}>
                              ₹{rtPrice.toLocaleString('en-IN')}/room
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => updateRoomCount(rt.key, -1)} disabled={count === 0}
                              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 font-bold transition-colors">−</button>
                            <span className="w-5 text-center text-sm font-bold text-gray-900">{count}</span>
                            <button type="button" onClick={() => updateRoomCount(rt.key, 1)}
                              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold transition-colors">+</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer with Done button */}
            <div className="border-t border-gray-100 p-4">
              <button onClick={() => setShowRoomPicker(false)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors">
                {totalRooms > 0 ? `Done · ${totalRooms} room${totalRooms > 1 ? 's' : ''}` : 'Done'}
              </button>
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

      {/* Travelers - Compact Adults & Children */}
      <div>
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Travelers</p>
        
        <div className="grid grid-cols-2 gap-2">
          {/* Adults */}
          <div>
            <div className="text-[10px] text-gray-500 mb-1 flex items-center justify-between">
              <span className="font-semibold">Adults</span>
              <span>12+</span>
            </div>
            <div className="flex items-center border border-gray-200 rounded-lg px-2 py-1.5">
              <button type="button" onClick={() => setAdults(a => Math.max(1, a - 1))}
                className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-bold">−</button>
              <span className="flex-1 text-center text-xs font-bold text-gray-900">{adults}</span>
              <button type="button" onClick={() => setAdults(a => Math.min(tour.maxGroupSize - children, a + 1))}
                className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-bold">+</button>
            </div>
          </div>
          
          {/* Children */}
          <div>
            <div className="text-[10px] text-gray-500 mb-1 flex items-center justify-between">
              <span className="font-semibold">Children</span>
              <span>2-11</span>
            </div>
            <div className="flex items-center border border-gray-200 rounded-lg px-2 py-1.5">
              <button type="button" onClick={() => setChildren(c => Math.max(0, c - 1))}
                className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-bold">−</button>
              <span className="flex-1 text-center text-xs font-bold text-gray-900">{children}</span>
              <button type="button" onClick={() => setChildren(c => Math.min(tour.maxGroupSize - adults, c + 1))}
                className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-bold">+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Price summary */}
      <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-xs">
        {totalRooms > 0 ? (
          <>
            {ROOM_TYPES.map(room => {
              const count = roomSelections[room.key]
              if (count === 0) return null
              const roomPrice = Math.round(p * room.multiplier)
              return (
                <div key={room.key} className="flex justify-between text-gray-500">
                  <span>{room.label} × {count}</span>
                  <span className="font-medium text-gray-700">₹{(roomPrice * count).toLocaleString('en-IN')}</span>
                </div>
              )
            })}
          </>
        ) : (
          <div className="flex justify-between text-gray-500">
            <span>Base price × {totalTravelers} traveler{totalTravelers > 1 ? 's' : ''}</span>
            <span className="font-medium text-gray-700">₹{displayPrice.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-400">
          <span>GST included</span>
          <span className="text-green-600 font-medium">✓</span>
        </div>
        <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-gray-900 text-sm">
          <span>Total</span>
          <span>₹{displayPrice.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* CTA buttons */}
      <button type="button" onClick={() => onBook({ selectedDate, adults, children, selectedHotel, roomSelections })}
        className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md">
        <Calendar className="w-4 h-4" /> Book Now
      </button>

      <a href={`https://wa.me/${WHATSAPP}?text=Hi%2C%20I%20want%20to%20enquire%20about%20${encodeURIComponent(tour.title)}%20for%20${adults}%20adult${adults > 1 ? 's' : ''}${children > 0 ? `%20and%20${children}%20child${children > 1 ? 'ren' : ''}` : ''}%20on%20${selectedDate ? fmtDate(selectedDate) : 'a%20date%20TBD'}`}
        target="_blank" rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
        <WhatsAppIcon size={16} className="text-white" /> Enquire on WhatsApp
      </a>

      <a href={`tel:+${WHATSAPP}`}
        className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors">
        <Phone className="w-4 h-4 text-primary-600" /> Call Us
      </a>

      <p className="text-center text-xs text-gray-400">No payment now · Pay on confirmation</p>
    </div>
  )
}

// ── Activity pill with image tooltip ─────────────────────────────────────────
function ActivityPill({ name, locationMap }: { name: string; locationMap: Record<string, LocationNode> }) {
  const [show, setShow] = useState(false)
  const loc = locationMap[name.toLowerCase()]
  const img = loc?.image

  return (
    <div className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full border border-primary-100 cursor-default">
        <ChevronRight className="w-3 h-3" />{name}
      </span>
      {show && img && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden w-40">
            <img src={toWebP(img, 300)} alt={name} className="w-full h-24 object-cover" />
            <p className="text-xs font-semibold text-gray-800 px-2 py-1.5 text-center">{name}</p>
          </div>
          <div className="w-2 h-2 bg-white border-r border-b border-gray-100 rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  )
}

export default function TourDetailPage() {
  const { id }  = useParams<{ id: string }>()
  const router  = useRouter()

  const [tour,          setTour]          = useState<Tour | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [showBooking,   setShowBooking]   = useState(false)
  const [bookingData,   setBookingData]   = useState<BookingData | null>(null)
  const [locationMap,   setLocationMap]   = useState<Record<string, LocationNode>>({})

  const fetchTour = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const numId = Number(id)
      const data = isNaN(numId) ? await tourService.getBySlug(id) : await tourService.getById(numId)
      setTour(data)
    } catch (e: any) {
      setError(e.message || 'Tour not found')
    } finally { setLoading(false) }
  }, [id])

  useEffect(() => { fetchTour() }, [fetchTour])

  // Load all locations to get images for activity pills
  useEffect(() => {
    locationAdminService.getAll().then(locs => {
      const map: Record<string, LocationNode> = {}
      locs.forEach(l => { map[l.name.toLowerCase()] = l })
      setLocationMap(map)
    }).catch(() => {})
  }, [])

  useEffect(() => { fetchTour() }, [fetchTour])

  if (loading) return <DetailSkeleton />

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center max-w-sm px-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Tour not found</h2>
          <p className="text-gray-500 text-sm mb-5">{error || 'This tour does not exist or has been removed.'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={fetchTour} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              <Loader2 className="w-4 h-4" /> Retry
            </button>
            <Link href="/tours" className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors">
              Browse Tours
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const p      = priceNum(tour.price)
  const rating = tour.rating ? Number(tour.rating) : null
  const images = tour.images?.length ? tour.images : [FALLBACK]
  const main   = toWebP(images[selectedImage] ?? FALLBACK, 1200)

  // Detect package includes from included array
  const pkgIcons = [
    { key: 'hotel',      icon: Hotel,          label: 'Hotel',       match: /hotel|accommodat/i },
    { key: 'transport',  icon: Bus,            label: 'Transport',   match: /transport|vehicle|cab|bus|transfer/i },
    { key: 'meals',      icon: UtensilsCrossed,label: 'Meals',       match: /meal|breakfast|lunch|dinner|food/i },
    { key: 'sightseeing',icon: Binoculars,     label: 'Sightseeing', match: /sightseeing|visit|tour guide|guide/i },
    { key: 'camera',     icon: Camera,         label: 'Photography', match: /photo|camera|photography/i },
  ]
  const detectedPkg = pkgIcons.filter(p => (tour.included ?? []).some(inc => p.match.test(inc)))

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative h-[380px] md:h-[460px] bg-gray-900 overflow-hidden">
        <Image src={main} alt={tour.title} fill className="object-cover opacity-90" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <button onClick={() => router.back()}
          className="absolute top-5 left-5 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors border border-white/20">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {images.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
            {images.slice(0, 6).map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)}
                className={`relative w-12 h-9 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-white scale-110' : 'border-white/40 hover:border-white/70'}`}>
                <Image src={toWebP(img, 100)} alt="" fill className="object-cover" sizes="48px" />
              </button>
            ))}
          </div>
        )}

        <div className="absolute bottom-5 left-0 right-0 px-5">
          <div className="container-custom">
            <div className="flex flex-wrap gap-2 mb-2.5">
              <span className="bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize shadow-sm">{tour.category}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${DIFF[tour.difficulty] ?? 'bg-gray-100 text-gray-700'}`}>{tour.difficulty}</span>
              {tour.isFeatured && <span className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-900" /> Featured</span>}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg tracking-tight">{tour.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="flex items-center gap-1.5 text-white text-xs font-medium bg-white/15 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/20"><Clock className="w-3.5 h-3.5" />{tour.duration} Days</span>
              <span className="flex items-center gap-1.5 text-white text-xs font-medium bg-white/15 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/20"><Users className="w-3.5 h-3.5" />Max {tour.maxGroupSize} pax</span>
              {(tour.destinations ?? []).length > 0 && (
                <span className="flex items-center gap-1.5 text-white text-xs font-medium bg-white/15 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/20"><MapPin className="w-3.5 h-3.5" />{(tour.destinations ?? []).join(' · ')}</span>
              )}
              {rating && (
                <span className="flex items-center gap-1 text-yellow-900 text-xs font-bold bg-yellow-300 px-2.5 py-1.5 rounded-lg shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-yellow-900" />{rating.toFixed(1)}
                  {(tour.reviewCount ?? 0) > 0 && <span className="font-medium opacity-70">({tour.reviewCount})</span>}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left column ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* About */}
            <Section title="About This Tour">
              <p className="text-gray-600 text-sm leading-relaxed">{tour.description}</p>
              {tour.longDescription && <p className="text-gray-600 text-sm leading-relaxed mt-3">{tour.longDescription}</p>}
            </Section>

            {/* Package Includes icons */}
            {detectedPkg.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5">Package Includes</h2>
                <div className="flex flex-wrap gap-4">
                  {detectedPkg.map(({ key, icon: Icon, label }) => (
                    <div key={key} className="flex flex-col items-center gap-2 bg-gradient-to-b from-gray-50 to-white rounded-2xl px-6 py-4 min-w-[90px] border border-gray-100 hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-300">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {(tour.highlights ?? []).length > 0 && (
              <Section title="Tour Highlights">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(tour.highlights ?? []).map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{h}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Itinerary — MOVED BEFORE included/excluded */}
            {(tour.itinerary ?? []).length > 0 && (
              <Section title={`Itinerary — ${(tour.itinerary ?? []).length} Days`}>
                <div className="space-y-0">
                  {(tour.itinerary ?? []).map((day, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-sm font-bold z-10 shadow-md ring-4 ring-primary-50 group-hover:scale-110 transition-transform">{day.day}</div>
                        {i < (tour.itinerary ?? []).length - 1 && <div className="w-0.5 flex-1 bg-gradient-to-b from-primary-200 to-primary-50 my-1" />}
                      </div>
                      <div className="flex-1 pb-5">
                        <div className="rounded-xl p-3 -mt-1 group-hover:bg-gray-50 transition-colors">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-wider">Day {day.day}</span>
                            {day.title}
                          </h4>
                          <p className="text-gray-500 text-sm mb-2">{day.description}</p>
                          {(day.activities ?? []).length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {(day.activities ?? []).map((a, j) => (
                                <ActivityPill key={j} name={a} locationMap={locationMap} />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Tour Route Map — Highway route with real roads */}
            {(() => {
              const routeLocations = (tour.itinerary ?? [])
                .map(day => day.locationId
                  ? Object.values(locationMap).find(l => l.id === day.locationId)
                  : Object.values(locationMap).find(l => l.name.toLowerCase() === day.title.toLowerCase())
                )
                .filter((l): l is LocationNode => !!l && !!l.lat && !!l.lng)
              // Deduplicate consecutive same locations
              const unique = routeLocations.filter((l, i) => i === 0 || l.id !== routeLocations[i - 1].id)
              return unique.length >= 2 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    Tour Route Map
                  </h2>
                  <TourRouteMap locations={unique} height="460px" />
                </div>
              ) : null
            })()}

            {/* Included / Excluded */}
            {((tour.included ?? []).length > 0 || (tour.excluded ?? []).length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(tour.included ?? []).length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-green-700 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>
                      What's Included
                    </h3>
                    <ul className="space-y-2">
                      {(tour.included ?? []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(tour.excluded ?? []).length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-red-600 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center"><X className="w-3.5 h-3.5" /></span>
                      Not Included
                    </h3>
                    <ul className="space-y-2">
                      {(tour.excluded ?? []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Cancellation Policy */}
            <Accordion title="🚫 Cancellation Policy" defaultOpen>
              <div className="pt-4 space-y-3">
                {CANCELLATION_POLICY.map((item, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                    <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                    <div>
                      <p className="text-xs font-bold text-red-700">{item.days}</p>
                      <p className="text-xs text-red-600 mt-0.5">{item.rule}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Accordion>

            {/* Terms & Conditions */}
            <Accordion title="📋 Terms & Conditions">
              <div className="pt-4 space-y-2">
                {TERMS.map((term, i) => (
                  <div key={i} className="flex gap-2.5 text-sm text-gray-600">
                    <span className="text-primary-500 font-bold flex-shrink-0 text-xs mt-0.5">{i + 1}.</span>
                    <p className="leading-relaxed">{term}</p>
                  </div>
                ))}
              </div>
            </Accordion>

            {/* Why choose */}
            <div className="bg-gradient-to-br from-primary-50 to-green-50 rounded-2xl border border-primary-100 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary-600" /> Why Choose This Tour?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: '🏆', title: 'Expert Local Guides', desc: 'Certified guides with 10+ years experience' },
                  { icon: '💰', title: 'Best Price Guarantee', desc: 'We match any lower price you find' },
                  { icon: '🔒', title: 'Secure Booking', desc: 'Your data and payment are fully protected' },
                  { icon: '📞', title: '24/7 Support', desc: "We're available before, during & after your trip" },
                  { icon: '🚌', title: 'All Transfers Included', desc: 'Airport pickup, hotel drops, sightseeing' },
                  { icon: '⭐', title: 'Trusted by 1000+ Travelers', desc: 'Verified reviews from real customers' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 bg-white/70 rounded-xl p-3 border border-white">
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-1">Traveler Reviews</h2>
              {(tour.reviewCount ?? 0) > 0 && rating ? (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}</div>
                  <span className="text-sm font-bold text-gray-900">{Number(rating).toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({tour.reviewCount} reviews)</span>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-2">{[1,2,3,4,5].map(s => <Star key={s} className="w-6 h-6 text-gray-200" />)}</div>
                  <p className="text-sm text-gray-500">No reviews yet — be the first to review!</p>
                </div>
              )}
            </div>

          </div>

          {/* ── Sidebar ─────────────────────────────────────────────── */}
          <div>
            <div className="sticky top-24 space-y-4">

              {/* Booking card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Price header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-4">
                  <p className="text-primary-100 text-xs mb-0.5">Price per person</p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-extrabold text-white">₹{p.toLocaleString('en-IN')}</p>
                    <p className="text-primary-200 text-sm mb-1">/ person</p>
                  </div>
                  {rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                      <span className="text-sm font-semibold text-white">{rating.toFixed(1)}</span>
                      {(tour.reviewCount ?? 0) > 0 && <span className="text-xs text-primary-200">({tour.reviewCount} reviews)</span>}
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <BookingSidebar tour={tour} onBook={(data) => { setBookingData(data); setShowBooking(true) }} />
                </div>
              </div>

              {/* Trust badges */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-primary-600" />
                  <span className="text-xs font-semibold text-gray-700">Why book with us?</span>
                </div>
                <ul className="space-y-2.5">
                  {[
                    { icon: ThumbsUp,       text: 'Best price guarantee' },
                    { icon: Check,          text: 'Transparent pricing' },
                    { icon: Award,          text: 'Expert local guides' },
                    { icon: HeartHandshake, text: '24/7 customer support' },
                    { icon: Shield,         text: 'Verified & trusted operator' },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3 h-3 text-green-600" />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick cancellation summary */}
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
                <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Cancellation Summary
                </p>
                <ul className="space-y-1.5 text-xs text-amber-700">
                  <li>• 30+ days before: 25% charges</li>
                  <li>• 15–30 days before: 50% charges</li>
                  <li>• Within 7 days: 100% charges</li>
                  <li>• Registration: Non-refundable</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal 
          tour={tour} 
          onClose={() => setShowBooking(false)}
          selectedDate={bookingData?.selectedDate}
          adults={bookingData?.adults}
          children={bookingData?.children}
          selectedHotel={bookingData?.selectedHotel}
          roomSelections={bookingData?.roomSelections}
        />
      )}
    </div>
  )
}

function Stat({ icon: Icon, label, value, highlight }: { icon: React.ElementType; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${highlight ? 'bg-yellow-50' : 'bg-primary-50'}`}>
        <Icon className={`w-4 h-4 ${highlight ? 'text-yellow-500' : 'text-primary-600'}`} />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

function Row({ label, value, cap }: { label: string; value: string; cap?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium text-gray-900 ${cap ? 'capitalize' : ''}`}>{value}</span>
    </div>
  )
}
