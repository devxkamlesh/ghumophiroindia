import { Package, BookOpen, MessageSquare, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { tours, bookings, inquiries, customTourRequests } from '@/lib/db/schema'
import { eq, sql, and, gte } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const session = await getSession()
  
  if (!session || session.role !== 'admin') {
    redirect('/login?redirect=/admin')
  }

  // Fetch real stats
  let stats = {
    totalTours: 0,
    activeBookings: 0,
    newInquiries: 0,
    totalRevenue: 0,
  }

  try {
    // Get total tours
    const toursCount = await db.select({ count: sql<number>`count(*)` }).from(tours)
    stats.totalTours = Number(toursCount[0]?.count || 0)

    // Get active bookings (confirmed or pending)
    const activeBookingsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(sql`${bookings.status} IN ('confirmed', 'pending')`)
    stats.activeBookings = Number(activeBookingsCount[0]?.count || 0)

    // Get new inquiries (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const newInquiriesCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(inquiries)
      .where(gte(inquiries.createdAt, sevenDaysAgo))
    stats.newInquiries = Number(newInquiriesCount[0]?.count || 0)

    // Get total revenue from confirmed bookings
    const revenueResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${bookings.totalPrice}), 0)` })
      .from(bookings)
      .where(eq(bookings.status, 'confirmed'))
    stats.totalRevenue = Number(revenueResult[0]?.total || 0)
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
  }

  // Fetch recent bookings
  let recentBookings: any[] = []
  try {
    recentBookings = await db
      .select({
        id: bookings.id,
        tourId: bookings.tourId,
        customerName: bookings.customerName,
        numberOfTravelers: bookings.numberOfTravelers,
        status: bookings.status,
        createdAt: bookings.createdAt,
        tourTitle: tours.title,
      })
      .from(bookings)
      .leftJoin(tours, eq(bookings.tourId, tours.id))
      .orderBy(sql`${bookings.createdAt} DESC`)
      .limit(5)
  } catch (error) {
    console.error('Failed to fetch recent bookings:', error)
  }

  // Fetch recent inquiries
  let recentInquiries: any[] = []
  try {
    recentInquiries = await db
      .select()
      .from(inquiries)
      .orderBy(sql`${inquiries.createdAt} DESC`)
      .limit(5)
  } catch (error) {
    console.error('Failed to fetch recent inquiries:', error)
  }

  const statsData = [
    { label: 'Total Tours', value: stats.totalTours.toString(), icon: Package, color: 'bg-blue-500', href: '/dashboard/tours' },
    { label: 'Active Bookings', value: stats.activeBookings.toString(), icon: BookOpen, color: 'bg-green-500', href: '/dashboard/bookings' },
    { label: 'New Inquiries', value: stats.newInquiries.toString(), icon: MessageSquare, color: 'bg-yellow-500', href: '/dashboard/inquiries' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500', href: '/dashboard/analytics' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {session.name}</p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          Go to Full Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Bookings</h2>
            <Link href="/dashboard/bookings" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex justify-between items-center pb-4 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{booking.tourTitle || 'Tour'}</p>
                    <p className="text-sm text-gray-600">{booking.customerName} - {booking.numberOfTravelers} travelers</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent bookings</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Inquiries</h2>
            <Link href="/dashboard/inquiries" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>
          {recentInquiries.length > 0 ? (
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="pb-4 border-b last:border-b-0">
                  <p className="font-medium">{inquiry.subject || 'General Inquiry'}</p>
                  <p className="text-sm text-gray-600">{inquiry.name} - {inquiry.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent inquiries</p>
          )}
        </div>
      </div>
    </div>
  )
}
