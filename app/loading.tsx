import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-orange-50">
      <div className="text-center">
        <div className="relative mb-8">
          <Loader2 className="w-16 h-16 animate-spin text-primary-600 mx-auto" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary-200 rounded-full mx-auto animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
        <p className="text-gray-600">Please wait while we prepare your experience</p>
      </div>
    </div>
  )
}
