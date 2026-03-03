import { Calendar, Heart, Star, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'My Account | Ghumo Phiro India',
  description: 'Manage your bookings and profile',
}

export default function MyAccountPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
        <p className="text-primary-100">Ready for your next adventure?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm text-gray-600">Upcoming Trips</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-gray-600">Wishlist</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Upcoming Trips</h2>
          <Link href="/my-account/bookings" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all
          </Link>
        </div>
        <div className="space-y-4">
          {[
            {
              id: 1,
              tour: 'Golden Triangle Tour',
              date: 'April 15, 2026',
              travelers: 2,
              status: 'Confirmed',
              image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=200',
            },
            {
              id: 2,
              tour: 'Udaipur Lake City',
              date: 'May 10, 2026',
              travelers: 2,
              status: 'Confirmed',
              image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=200',
            },
          ].map((booking) => (
            <div key={booking.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image 
                  src={booking.image} 
                  alt={booking.tour} 
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{booking.tour}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{booking.date}</span>
                  </span>
                  <span>{booking.travelers} travelers</span>
                </div>
              </div>
              <div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/tours" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-primary-300 transition-colors">
          <MapPin className="w-8 h-8 text-primary-600 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Browse Tours</h3>
          <p className="text-sm text-gray-600">Discover amazing destinations</p>
        </Link>
        <Link href="/custom-tour" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-primary-300 transition-colors">
          <Star className="w-8 h-8 text-primary-600 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Custom Tour</h3>
          <p className="text-sm text-gray-600">Build your perfect itinerary</p>
        </Link>
        <Link href="/contact" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-primary-300 transition-colors">
          <Calendar className="w-8 h-8 text-primary-600 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Contact Us</h3>
          <p className="text-sm text-gray-600">Get help from our team</p>
        </Link>
      </div>
    </div>
  )
}
