import { Calendar, MapPin, Users, Download } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { bookings, tours } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export const metadata = {
  title: 'My Bookings | Ghumo Phiro India',
  description: 'View and manage your bookings',
}

export const dynamic = 'force-dynamic'

const statusColors = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default async function MyBookingsPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login?redirect=/my-account/bookings')
  }

  // Fetch user bookings
  let userBookings: any[] = []
  try {
    userBookings = await db
      .select({
        id: bookings.id,
        tourId: bookings.tourId,
        startDate: bookings.startDate,
        numberOfTravelers: bookings.numberOfTravelers,
        totalPrice: bookings.totalPrice,
        status: bookings.status,
        createdAt: bookings.createdAt,
        tourTitle: tours.title,
        tourImages: tours.images,
      })
      .from(bookings)
      .leftJoin(tours, eq(bookings.tourId, tours.id))
      .where(eq(bookings.userId, parseInt(session.userId)))
      .orderBy(sql`${bookings.createdAt} DESC`)
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
  }

  // Fallback images
  const fallbackImages = [
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=300',
    'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=300',
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=300',
  ]
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">View and manage your tour bookings</p>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {userBookings.length > 0 ? (
          userBookings.map((booking, index) => {
            const imageUrl = (booking.tourImages && booking.tourImages[0]) || fallbackImages[index % fallbackImages.length]
            const endDate = new Date(booking.startDate)
            endDate.setDate(endDate.getDate() + 3) // Estimate 3 days, adjust based on tour duration
            
            return (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                    <Image 
                      src={imageUrl} 
                      alt={booking.tourTitle || 'Tour'} 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 192px"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs font-mono text-gray-500">#{booking.id}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[booking.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
                            {booking.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{booking.tourTitle || 'Tour'}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">₹{Number(booking.totalPrice).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <div>
                          <div className="font-medium">Start Date</div>
                          <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <div>
                          <div className="font-medium">End Date</div>
                          <div>{endDate.toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <div>
                          <div className="font-medium">Travelers</div>
                          <div>{booking.numberOfTravelers} people</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/tours/${booking.tourId}`}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        View Tour
                      </Link>
                      <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Download Invoice</span>
                      </button>
                      {booking.status === 'completed' && (
                        <Link
                          href={`/my-account/reviews/new?booking=${booking.id}`}
                          className="px-4 py-2 border border-primary-600 hover:bg-primary-50 text-primary-600 rounded-lg text-sm font-medium transition-colors"
                        >
                          Write Review
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start your adventure by booking a tour</p>
            <Link
              href="/tours"
              className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              Browse Tours
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
