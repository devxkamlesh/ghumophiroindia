'use client'

import { Star, MessageSquare, MapPin, Loader2 } from 'lucide-react'
import Link from 'next/link'

// Reviews are not yet implemented in the backend — show a clean empty state
export default function MyReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
        <p className="text-gray-500 mt-1 text-sm">Reviews you've left for tours you've taken</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-14 text-center">
        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-yellow-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
          After completing a tour, you'll be able to share your experience here.
        </p>
        <Link
          href="/my-account/bookings"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <MapPin className="w-4 h-4" />
          View My Bookings
        </Link>
      </div>
    </div>
  )
}
