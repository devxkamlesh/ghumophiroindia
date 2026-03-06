import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react'
import StatsCard from '@/components/dashboard/analytics/StatsCard'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { tours, bookings, users } from '@/lib/db/schema'
import { eq, sql, and, gte } from 'drizzle-orm'

export const metadata = {
  title: 'Analytics | Dashboard',
  description: 'View detailed analytics and reports',
}

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const session = await getSession()
  
  if (!session || session.role !== 'admin') {
    redirect('/login?redirect=/dashboard/analytics')
  }

  // Calculate date ranges
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  // Fetch analytics data
  let analytics = {
    revenueThisMonth: 0,
    revenueLastMonth: 0,
    bookingsThisMonth: 0,
    bookingsLastMonth: 0,
    newCustomersThisMonth: 0,
    newCustomersLastMonth: 0,
    conversionRate: 0,
    topTours: [] as any[],
  }

  try {
    // Revenue this month
    const revenueThisMonthResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${bookings.totalPrice}), 0)` })
      .from(bookings)
      .where(and(
        eq(bookings.status, 'confirmed'),
        gte(bookings.createdAt, firstDayOfMonth)
      ))
    analytics.revenueThisMonth = Number(revenueThisMonthResult[0]?.total || 0)

    // Revenue last month
    const revenueLastMonthResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${bookings.totalPrice}), 0)` })
      .from(bookings)
      .where(and(
        eq(bookings.status, 'confirmed'),
        gte(bookings.createdAt, firstDayOfLastMonth),
        sql`${bookings.createdAt} < ${firstDayOfMonth}`
      ))
    analytics.revenueLastMonth = Number(revenueLastMonthResult[0]?.total || 0)

    // Bookings this month
    const bookingsThisMonthResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(gte(bookings.createdAt, firstDayOfMonth))
    analytics.bookingsThisMonth = Number(bookingsThisMonthResult[0]?.count || 0)

    // Bookings last month
    const bookingsLastMonthResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(and(
        gte(bookings.createdAt, firstDayOfLastMonth),
        sql`${bookings.createdAt} < ${firstDayOfMonth}`
      ))
    analytics.bookingsLastMonth = Number(bookingsLastMonthResult[0]?.count || 0)

    // New customers this month
    const newCustomersThisMonthResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.createdAt, firstDayOfMonth))
    analytics.newCustomersThisMonth = Number(newCustomersThisMonthResult[0]?.count || 0)

    // New customers last month
    const newCustomersLastMonthResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(and(
        gte(users.createdAt, firstDayOfLastMonth),
        sql`${users.createdAt} < ${firstDayOfMonth}`
      ))
    analytics.newCustomersLastMonth = Number(newCustomersLastMonthResult[0]?.count || 0)

    // Calculate conversion rate (confirmed bookings / total bookings)
    const totalBookingsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(gte(bookings.createdAt, firstDayOfMonth))
    const totalBookings = Number(totalBookingsResult[0]?.count || 0)
    
    const confirmedBookingsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(and(
        eq(bookings.status, 'confirmed'),
        gte(bookings.createdAt, firstDayOfMonth)
      ))
    const confirmedBookings = Number(confirmedBookingsResult[0]?.count || 0)
    
    analytics.conversionRate = totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0

    // Top performing tours
    analytics.topTours = await db
      .select({
        name: tours.title,
        bookings: sql<number>`count(${bookings.id})`,
        revenue: sql<number>`COALESCE(SUM(${bookings.totalPrice}), 0)`,
      })
      .from(tours)
      .leftJoin(bookings, and(
        eq(bookings.tourId, tours.id),
        eq(bookings.status, 'confirmed')
      ))
      .groupBy(tours.id, tours.title)
      .orderBy(sql`count(${bookings.id}) DESC`)
      .limit(5)
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
  }

  // Calculate percentage changes
  const revenueChange = analytics.revenueLastMonth > 0
    ? ((analytics.revenueThisMonth - analytics.revenueLastMonth) / analytics.revenueLastMonth * 100).toFixed(1)
    : '0.0'
  
  const bookingsChange = analytics.bookingsLastMonth > 0
    ? ((analytics.bookingsThisMonth - analytics.bookingsLastMonth) / analytics.bookingsLastMonth * 100).toFixed(1)
    : '0.0'
  
  const customersChange = analytics.newCustomersLastMonth > 0
    ? ((analytics.newCustomersThisMonth - analytics.newCustomersLastMonth) / analytics.newCustomersLastMonth * 100).toFixed(1)
    : '0.0'
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-1">Detailed insights into your business performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Revenue This Month"
          value={`₹${analytics.revenueThisMonth.toLocaleString()}`}
          change={`${revenueChange}%`}
          trend={Number(revenueChange) >= 0 ? 'up' : 'down'}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Bookings This Month"
          value={analytics.bookingsThisMonth.toString()}
          change={`${bookingsChange}%`}
          trend={Number(bookingsChange) >= 0 ? 'up' : 'down'}
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="New Customers"
          value={analytics.newCustomersThisMonth.toString()}
          change={`${customersChange}%`}
          trend={Number(customersChange) >= 0 ? 'up' : 'down'}
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${analytics.conversionRate.toFixed(1)}%`}
          change="+5.2%"
          trend="up"
          icon={TrendingUp}
          color="teal"
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart will be implemented here</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Bookings by Tour</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart will be implemented here</p>
          </div>
        </div>
      </div>

      {/* More Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Top Performing Tours</h2>
        {analytics.topTours.length > 0 ? (
          <div className="space-y-4">
            {analytics.topTours.map((tour) => (
              <div key={tour.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">{tour.name}</div>
                  <div className="text-sm text-gray-600">{Number(tour.bookings)} bookings</div>
                </div>
                <div className="text-lg font-bold text-green-600">₹{Number(tour.revenue).toLocaleString()}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No booking data available</p>
        )}
      </div>
    </div>
  )
}
