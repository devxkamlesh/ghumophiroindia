import Link from 'next/link'
import { Home, Search, MapPin, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-orange-50 px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
          <div className="text-6xl mb-4">🗺️</div>
        </div>

        {/* Content */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Oops! Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Looks like you&apos;ve wandered off the beaten path. This page doesn&apos;t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/tours"
            className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-primary-600 px-8 py-4 rounded-xl font-semibold border-2 border-primary-600 transition-all duration-200"
          >
            <Search className="w-5 h-5" />
            <span>Browse Tours</span>
          </Link>
        </div>

        {/* Popular Links */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              href="/tours?destination=jaipur"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Jaipur</span>
            </Link>
            <Link
              href="/tours?destination=udaipur"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Udaipur</span>
            </Link>
            <Link
              href="/tours?destination=jaisalmer"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Jaisalmer</span>
            </Link>
            <Link
              href="/tours?destination=jodhpur"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Jodhpur</span>
            </Link>
            <Link
              href="/tours?destination=golden-triangle"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Golden Triangle</span>
            </Link>
            <Link
              href="/custom-tour"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Custom Tour</span>
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-gray-500">
          Need help? <Link href="/contact" className="text-primary-600 hover:underline font-semibold">Contact us</Link> or call{' '}
          <a href="tel:+919876543210" className="text-primary-600 hover:underline font-semibold">
            +91 98765 43210
          </a>
        </p>
      </div>
    </div>
  )
}
