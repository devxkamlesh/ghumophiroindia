'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Calendar, X, Check, ChevronDown, ChevronLeft, ChevronRight, Plus, Minus, MessageCircle } from 'lucide-react'
import type { Tour } from '@/types'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || '919876543210'

// Portal for the date popover
function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return createPortal(children, document.body)
}

const DEPARTURE_CITIES = ['Delhi', 'Mumbai', 'Jaipur', 'Bengaluru', 'Kolkata', 'Chennai', 'Ahmedabad', 'Pune']

const MAX_PER_ROOM = 2   // max members per hotel room
const MAX_ROOMS = 8

const TRAVEL_OPTIONS = [
  { key: 'self',   label: 'Self Travel' },
  { key: 'train',  label: 'Train' },
  { key: 'flight', label: 'Flight' },
  { key: 'volvo',  label: 'Volvo Bus' },
]

const ADDONS = [
  { key: 'honeymoon', label: 'Honeymoon Inclusion', price: 750 },
  { key: 'rafting',   label: 'River Rafting',        price: 600 },
]

function addDays(d: Date, n: number) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function startOfDay(d: Date) { const r = new Date(d); r.setHours(0, 0, 0, 0); return r }

// Build a full month grid (leading blanks for weekday alignment)
function buildMonthGrid(month: Date): (Date | null)[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const firstWeekday = first.getDay() // 0 = Sun
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d))
  return cells
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function fmtDateShort(d: Date) {
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

// ── Styled native select ──────────────────────────────────────────────────────
function FieldSelect({ value, onChange, children }: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none w-full h-11 pl-3 pr-8 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 hover:border-primary-300 focus:border-primary-500 outline-none cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  )
}

// ── Tiny +/- counter for add-ons ──────────────────────────────────────────────
function MiniStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <button type="button" onClick={() => value > 0 && onChange(value - 1)}
        className="w-7 h-7 rounded-md bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center disabled:opacity-40"
        disabled={value <= 0}>
        <Minus className="w-3 h-3" />
      </button>
      <span className="w-8 h-7 border border-gray-200 rounded-md flex items-center justify-center text-sm font-bold text-gray-800 tabular-nums">{value}</span>
      <button type="button" onClick={() => value < 9 && onChange(value + 1)}
        className="w-7 h-7 rounded-md bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center">
        <Plus className="w-3 h-3" />
      </button>
    </div>
  )
}

// ── Round pink counter for travellers (Adult / Child) ─────────────────────────
function RoomCounter({ label, sub, value, onChange, min, max }: {
  label: string; sub: string; value: number; onChange: (v: number) => void; min: number; max: number
}) {
  return (
    <div className="text-center">
      <p className="text-[11px] font-medium text-gray-600 mb-1 whitespace-nowrap">{label}</p>
      <div className="flex items-center gap-1.5 justify-center">
        <button type="button" onClick={() => value > min && onChange(value - 1)} disabled={value <= min}
          className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 disabled:opacity-30 disabled:hover:bg-red-50 transition-colors">
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-5 text-center text-sm font-bold text-gray-900 tabular-nums">{value}</span>
        <button type="button" onClick={() => value < max && onChange(value + 1)} disabled={value >= max}
          className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 disabled:opacity-30 disabled:hover:bg-red-50 transition-colors">
          <Plus className="w-3 h-3" />
        </button>
      </div>
      <p className="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap">{sub}</p>
    </div>
  )
}

export default function BookingCalculator({ tour, onBook }: Props) {
  const basePrice = priceNum(tour.price)
  const today = startOfDay(new Date())
  const nights = tour.duration > 1 ? tour.duration - 1 : 0

  const [selectedDate, setSelectedDate] = useState<Date>(addDays(today, 1))
  const [viewMonth, setViewMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1))
  const [departureCity, setDepartureCity] = useState(DEPARTURE_CITIES[0])
  const [expanded, setExpanded] = useState(false)        // + Add Details
  const [rooms, setRooms] = useState<{ adults: number; children: number }[]>([{ adults: 2, children: 0 }])
  const [going, setGoing] = useState('self')
  const [ret, setRet] = useState('self')
  const [addons, setAddons] = useState<Record<string, number>>({})

  const addRoom = () => setRooms(r => r.length < MAX_ROOMS ? [...r, { adults: 1, children: 0 }] : r)
  const removeRoom = (i: number) => setRooms(r => r.length > 1 ? r.filter((_, idx) => idx !== i) : r)
  const setRoomAdults = (i: number, v: number) => setRooms(r => r.map((room, idx) =>
    idx === i && v >= 1 && v + room.children <= MAX_PER_ROOM ? { ...room, adults: v } : room))
  const setRoomChildren = (i: number, v: number) => setRooms(r => r.map((room, idx) =>
    idx === i && v >= 0 && room.adults + v <= MAX_PER_ROOM ? { ...room, children: v } : room))

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showCityPicker, setShowCityPicker] = useState(false)
  const [datePos, setDatePos] = useState<{ top: number; left: number; width: number } | null>(null)
  const cityRef = useRef<HTMLDivElement>(null)
  const dateBtnRef = useRef<HTMLButtonElement>(null)

  // Outside-click for city dropdown
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setShowCityPicker(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // Open date popover aligned to the LEFT of the booking card, level with its top
  const positionPopover = useCallback(() => {
    const card = dateBtnRef.current?.closest('[data-booking-card]') as HTMLElement | null
    const anchor = (card ?? dateBtnRef.current)?.getBoundingClientRect()
    const btn = dateBtnRef.current?.getBoundingClientRect()
    if (!anchor) return
    const width = 380
    const gap = 14
    const maxH = Math.min(460, window.innerHeight - 24)
    let left = anchor.left - width - gap
    let top = anchor.top
    if (left < 8) {                          // not enough room on the left → drop below the field
      left = Math.max(8, Math.min(anchor.left, window.innerWidth - width - 8))
      top = (btn?.bottom ?? anchor.top) + 6
    }
    top = Math.max(8, Math.min(top, window.innerHeight - maxH - 8))
    setDatePos({ top, left, width })
  }, [])

  const openDatePicker = () => { positionPopover(); setShowDatePicker(true) }

  // Reposition (not close) on scroll/resize so the popover stays glued to the card
  useEffect(() => {
    if (!showDatePicker) return
    positionPopover()
    window.addEventListener('resize', positionPopover)
    window.addEventListener('scroll', positionPopover, true)
    return () => {
      window.removeEventListener('resize', positionPopover)
      window.removeEventListener('scroll', positionPopover, true)
    }
  }, [showDatePicker, positionPopover])

  const endDate = addDays(selectedDate, nights)
  const totalAdults = rooms.reduce((s, r) => s + r.adults, 0)
  const totalChildren = rooms.reduce((s, r) => s + r.children, 0)
  const travellers = totalAdults + totalChildren
  const roomsNeeded = rooms.length
  const perPerson = Math.round(basePrice)
  const addonsTotal = ADDONS.reduce((s, a) => s + (addons[a.key] ?? 0) * a.price, 0)
  const total = Math.round(perPerson * totalAdults + perPerson * 0.7 * totalChildren + addonsTotal)

  const payload = () => ({
    selectedDate,
    departureCity,
    adults: totalAdults,
    children: totalChildren,
    rooms,
    roomsNeeded,
    goingTravel: going,
    returnTravel: ret,
    addons,
    total,
    roomSelections: {},
  })

  const checkout = () => onBook(payload())
  const enquire = () => {
    const msg = `Hi, I'm interested in "${tour.title}" departing ${fmtDateShort(selectedDate)} from ${departureCity} for ${totalAdults} adult(s)${totalChildren ? ` & ${totalChildren} child(ren)` : ''} (${roomsNeeded} room${roomsNeeded !== 1 ? 's' : ''}).`
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="space-y-3">

      {/* ── Select Departure Date (dashed trigger) ─────────────────── */}
      <button
        ref={dateBtnRef}
        type="button"
        onClick={openDatePicker}
        className="w-full border-2 border-dashed border-primary-300 rounded-xl py-2.5 flex items-center justify-center gap-2 text-primary-600 font-bold text-sm hover:bg-primary-50/40 transition-colors"
      >
        Select Departure Date <Calendar className="w-4 h-4" />
      </button>

      {/* ── Route summary ──────────────────────────────────────────── */}
      <div className="bg-gray-50 rounded-xl px-3 py-3 flex items-center gap-2">
        {/* From */}
        <div ref={cityRef} className="relative text-center min-w-0">
          <button type="button" onClick={() => setShowCityPicker(o => !o)}
            className="inline-flex items-center gap-0.5 text-[11px] text-gray-500 hover:text-primary-600">
            {departureCity} <ChevronDown className="w-3 h-3" />
          </button>
          <p className="text-sm font-bold text-gray-900 leading-tight">{fmtDateShort(selectedDate)}</p>

          {showCityPicker && (
            <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-36 bg-white rounded-xl border border-gray-100 shadow-xl py-1 max-h-52 overflow-y-auto text-left">
              {DEPARTURE_CITIES.map(city => (
                <button key={city} type="button"
                  onClick={() => { setDepartureCity(city); setShowCityPicker(false) }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-sm ${city === departureCity ? 'text-primary-600 font-semibold bg-primary-50/60' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {city}{city === departureCity && <Check className="w-3.5 h-3.5 text-primary-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Connector */}
        <div className="flex-1 flex flex-col items-center px-1">
          <span className="text-[10px] text-gray-400 whitespace-nowrap mb-1">{tour.duration} Days, {nights} Nights</span>
          <div className="w-full flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            <span className="flex-1 border-t border-dashed border-gray-300" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
          </div>
        </div>

        {/* To */}
        <div className="text-center min-w-0">
          <p className="text-[11px] text-gray-500">{departureCity}</p>
          <p className="text-sm font-bold text-gray-900 leading-tight">{fmtDateShort(endDate)}</p>
        </div>
      </div>

      {/* ── Traveller Details (always visible) ─────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <p className="text-sm font-bold text-gray-900 flex-shrink-0">Traveller Details</p>
          <span className="flex-1 border-t border-dashed border-gray-200" />
        </div>

        <div className="divide-y divide-gray-100">
          {rooms.map((room, i) => (
            <div key={i} className="flex items-center justify-between gap-2 py-3">
              <div className="flex-shrink-0 w-[78px]">
                <p className="text-sm font-bold text-gray-800">Room {i + 1}</p>
                {i === rooms.length - 1 && rooms.length < MAX_ROOMS ? (
                  <button type="button" onClick={addRoom}
                    className="text-xs font-semibold text-red-500 border-b border-dashed border-red-300 hover:text-red-600">
                    Add Room
                  </button>
                ) : rooms.length > 1 ? (
                  <button type="button" onClick={() => removeRoom(i)}
                    className="text-xs font-medium text-gray-400 hover:text-red-500">Remove</button>
                ) : null}
              </div>

              <div className="flex items-start gap-3">
                <RoomCounter label="Adult" sub="12+ yrs" value={room.adults} min={1}
                  max={MAX_PER_ROOM - room.children} onChange={v => setRoomAdults(i, v)} />
                <RoomCounter label="Child" sub="below 12" value={room.children} min={0}
                  max={MAX_PER_ROOM - room.adults} onChange={v => setRoomChildren(i, v)} />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-1.5 text-[11px] text-gray-500">
          <span className="font-semibold text-primary-600">{roomsNeeded} room{roomsNeeded !== 1 ? 's' : ''}</span> · {travellers} traveller{travellers !== 1 ? 's' : ''} (max {MAX_PER_ROOM}/room) · charged per person
        </p>

        <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('I want a seat for an infant')}`}
          target="_blank" rel="noopener noreferrer"
          className="block text-right text-xs font-medium text-primary-600 hover:underline mt-1">Want seat for infant?</a>
      </div>

      {/* ── Add Details: travel options + add-ons ──────────────────── */}
      {!expanded ? (
        <button type="button" onClick={() => setExpanded(true)}
          className="w-full flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl py-2.5 text-sm font-semibold text-primary-600 transition-colors">
          + Add Details
        </button>
      ) : (
        <div className="space-y-4">
          {/* Travel options */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Going Travel Option</label>
              <FieldSelect value={going} onChange={setGoing}>
                {TRAVEL_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
              </FieldSelect>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Return Travel Option</label>
              <FieldSelect value={ret} onChange={setRet}>
                {TRAVEL_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
              </FieldSelect>
            </div>
          </div>

          {/* Special add-ons */}
          <div>
            <p className="text-sm font-bold text-gray-900 mb-2.5">Special Addons</p>
            <div className="space-y-2.5">
              {ADDONS.map(a => (
                <div key={a.key} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-700 flex-1 min-w-0">
                    <span className="text-primary-500 font-bold">»</span> {a.label}{' '}
                    <span className="text-gray-400">(₹{a.price.toLocaleString('en-IN')})</span>
                  </span>
                  <MiniStepper value={addons[a.key] ?? 0} onChange={v => setAddons(p => ({ ...p, [a.key]: v }))} />
                </div>
              ))}
            </div>
          </div>

          <button type="button" onClick={() => setExpanded(false)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:underline">
            <Check className="w-4 h-4" /> Done
          </button>
        </div>
      )}

      {/* ── Price + CTAs ───────────────────────────────────────────── */}
      <div className="border-t border-gray-100 pt-2.5">
        {travellers > 0 && (
          <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
            <span>{roomsNeeded} room{roomsNeeded !== 1 ? 's' : ''} · {travellers} traveller{travellers !== 1 ? 's' : ''}</span>
            <span>₹{perPerson.toLocaleString('en-IN')}/person</span>
          </div>
        )}
        <div className="flex items-end justify-between mb-2.5">
          <span className="text-sm font-semibold text-gray-700">Super Deal Price</span>
          <span className="text-xl font-extrabold text-gray-900">₹{total.toLocaleString('en-IN')}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={enquire}
            className="flex items-center justify-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white py-2.5 rounded-lg text-sm font-bold transition-colors">
            <MessageCircle className="w-4 h-4" /> Enquire
          </button>
          <button type="button" onClick={checkout}
            className="flex items-center justify-center gap-1.5 bg-primary-700 hover:bg-primary-800 text-white py-2.5 rounded-lg text-sm font-bold transition-colors">
            Checkout
          </button>
        </div>
        <p className="text-center text-[11px] text-gray-400 mt-1.5">No payment now · Pay on confirmation</p>
      </div>

      {/* ── Date popover (left side) ───────────────────────────────── */}
      {showDatePicker && datePos && (
        <Portal>
          <div className="fixed inset-0 z-[9998]" onClick={() => setShowDatePicker(false)} />
          <div
            style={{ position: 'fixed', top: datePos.top, left: datePos.left, width: datePos.width }}
            className="z-[9999] bg-white rounded-2xl border border-gray-100 shadow-2xl flex flex-col max-h-[460px] animate-modal-pop overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-600" /> Choose your travel date
              </span>
              <button onClick={() => setShowDatePicker(false)} className="p-0.5 hover:bg-gray-100 rounded transition-colors">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Month calendar */}
            <div className="p-4 flex-1 overflow-y-auto" data-lenis-prevent>
              {/* Month nav */}
              <div className="flex items-center justify-between mb-3">
                <button type="button"
                  onClick={() => setViewMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                  disabled={viewMonth.getFullYear() === today.getFullYear() && viewMonth.getMonth() === today.getMonth()}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-gray-900">
                  {viewMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </span>
                <button type="button"
                  onClick={() => setViewMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Weekday header */}
              <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map(w => (
                  <span key={w} className="text-center text-[11px] font-semibold text-gray-400 py-1">{w}</span>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {buildMonthGrid(viewMonth).map((d, i) => {
                  if (!d) return <span key={i} />
                  const isPast = d < today
                  const isSelected = startOfDay(d).getTime() === startOfDay(selectedDate).getTime()
                  const isToday = d.getTime() === today.getTime()
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isPast}
                      onClick={() => { setSelectedDate(d); setShowDatePicker(false) }}
                      className={`h-9 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-primary-600 text-white font-bold'
                          : isPast
                            ? 'text-gray-300 cursor-not-allowed'
                            : `text-gray-700 hover:bg-primary-50 ${isToday ? 'ring-1 ring-primary-300' : ''}`
                      }`}
                    >
                      {d.getDate()}
                    </button>
                  )
                })}
              </div>

              <p className="text-[11px] text-gray-400 mt-3 text-center">
                Selected: <span className="font-semibold text-gray-600">{fmtDateShort(selectedDate)}</span>
              </p>
            </div>
          </div>
        </Portal>
      )}

      <style jsx global>{`
        @keyframes modal-pop {
          from { transform: scale(0.97); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-modal-pop { animation: modal-pop 0.18s ease-out; }
      `}</style>
    </div>
  )
}
