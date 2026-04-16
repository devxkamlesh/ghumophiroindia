'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, Users, Calendar, MapPin, MessageSquare, Wand2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { bookingService, tourService, inquiryService, customTourService } from '@/services/api'

interface BookingStats {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  totalRevenue: number
}

interface TourStats {
  total: number
  active: number
  featured: number
  avgPrice: number
  avgRating: number
}

function StatCard({ title, value, sub, icon: Icon, color }: {
  title: string; value: string; sub?: string; icon: React.ElementType; color: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{title}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-lg mb-3" />
      <div className="h-7 bg-gray-200 rounded w-1/2 mb-1" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  )
}

export default function AnalyticsPage() {
  const [bookingStats, setBookingStats] = useState<BookingStats | null>(null)
  const [tourStats,    setTourStats]    = useState<TourStats | null>(null)
  const [inquiryCount, setInquiryCount] = useState<number | null>(null)
  const [customCount,  setCustomCount]  = useState<number | null>(null)
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    Promise.allSettled([
      bookingService.getStats(),
      tourService.getStats(),
      inquiryService.getAll({ page: 1, limit: 1 }),
      customTourService.getAll({ page: 1, limit: 1 }),
    ]).then(([b, t, i, c]) => {
      if (b.status === 'fulfilled') setBookingStats(b.value)
      if (t.status === 'fulfilled') setTourStats(t.value)
      if (i.status === 'fulfilled') setInquiryCount(i.value?.pagination?.total ?? 0)
      if (c.status === 'fulfilled') setCustomCount(c.value?.pagination?.total ?? 0)
    }).finally(() => setLoading(false))
  }, [])

  const fmt  = (n: number | null | undefined) => n == null ? '—' : String(n)
  const fmtM = (n: number | null | undefined) => n == null ? '—' : `₹${Number(n).toLocaleString('en-IN')}`
  const fmtP = (n: number | null | undefined) => n == null ? '—' : `₹${Math.round(Number(n)).toLocaleString('en-IN')}`

  const bookingCards = [
    { title: 'Total Revenue',    value: fmtM(bookingStats?.totalRevenue), icon: DollarSign, color: 'bg-green-50 text-green-600',   sub: 'From paid bookings' },
    { title: 'Total Bookings',   value: fmt(bookingStats?.total),         icon: Calendar,   color: 'bg-blue-50 text-blue-600',     sub: 'All time' },
    { title: 'Pending',          value: fmt(bookingStats?.pending),       icon: Calendar,   color: 'bg-yellow-50 text-yellow-600', sub: 'Awaiting confirmation' },
    { title: 'Confirmed',        value: fmt(bookingStats?.confirmed),     icon: TrendingUp, color: 'bg-primary-50 text-primary-600', sub: 'Ready to go' },
    { title: 'Completed',        value: fmt(bookingStats?.completed),     icon: Users,      color: 'bg-purple-50 text-purple-600', sub: 'Successfully done' },
    { title: 'Cancelled',        value: fmt(bookingStats?.cancelled),     icon: Calendar,   color: 'bg-red-50 text-red-600',       sub: 'Cancelled bookings' },
  ]

  const tourCards = [
    { title: 'Total Tours',   value: fmt(tourStats?.total),    icon: MapPin,      color: 'bg-gray-50 text-gray-600',     sub: 'In database' },
    { title: 'Active Tours',  value: fmt(tourStats?.active),   icon: TrendingUp,  color: 'bg-green-50 text-green-600',   sub: 'Visible to users' },
    { title: 'Featured',      value: fmt(tourStats?.featured), icon: TrendingUp,  color: 'bg-primary-50 text-primary-600', sub: 'On homepage' },
    { title: 'Avg. Price',    value: fmtP(tourStats?.avgPrice), icon: DollarSign, color: 'bg-blue-50 text-blue-600',     sub: 'Per person' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1 text-sm">Live overview of your business performance</p>
      </div>

      {/* Booking stats */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Bookings</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />) :
            bookingCards.map(c => <StatCard key={c.title} {...c} />)}
        </div>
      </div>

      {/* Tour stats */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Tours</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />) :
            tourCards.map(c => <StatCard key={c.title} {...c} />)}
        </div>
      </div>

      {/* Leads */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Leads</h2>
        <div className="grid grid-cols-2 gap-4">
          {loading ? (
            <><Skeleton /><Skeleton /></>
          ) : (
            <>
              <StatCard title="Total Inquiries"       value={fmt(inquiryCount)} icon={MessageSquare} color="bg-blue-50 text-blue-600"   sub="Contact form submissions" />
              <StatCard title="Custom Tour Requests"  value={fmt(customCount)}  icon={Wand2}         color="bg-purple-50 text-purple-600" sub="Personalised tour requests" />
            </>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/dashboard/bookings',        label: 'Manage Bookings',  icon: Calendar },
            { href: '/dashboard/tours',           label: 'Manage Tours',     icon: MapPin },
            { href: '/dashboard/inquiries',       label: 'View Inquiries',   icon: MessageSquare },
            { href: '/dashboard/custom-requests', label: 'Custom Requests',  icon: Wand2 },
          ].map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-2.5 p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50 transition-all text-sm font-medium text-gray-700 hover:text-primary-700">
              <Icon className="w-4 h-4 text-gray-400" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
