import { Calendar, MapPin, Users, Download } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'My Bookings | Ghumo Phiro India',
  description: 'View and manage your bookings',
}

const bookings = [
  {
    id: 'BK001',
    tour: 'Golden Triangle Tour',
    startDate: '2026-04-15',
    endDate: '2026-04-21',
    travelers: 2,
    amount: 1198,
    status: 'confirmed',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=300',
  },
  {
    id: 'BK002',
    tour: 'Udaipur Lake City',
    startDate: '2026-05-10',
    endDate: '2026-05-13',
    travelers: 2,
    amount: 498,
    status: 'confirmed',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=300',
  },
  {
    id: 'BK003',
    tour: 'Jaisalmer Desert Safari',
    startDate: '2026-02-20',
    endDate: '2026-02-24',
    travelers: 3,
    amount: 987,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=300',
  },
]

const statusColors = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function MyBookingsPage() {
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
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                <Image 
                  src={booking.image} 
                  alt={booking.tour} 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 192px"
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-mono text-gray-500">{booking.id}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[booking.status as keyof typeof statusColors]}`}>
                        {booking.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{booking.tour}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">${booking.amount}</div>
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
                      <div>{new Date(booking.endDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <div>
                      <div className="font-medium">Travelers</div>
                      <div>{booking.travelers} people</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/my-account/bookings/${booking.id}`}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
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
        ))}
      </div>
    </div>
  )
}
