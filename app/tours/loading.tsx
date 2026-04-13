import { Loader2 } from 'lucide-react'

export default function ToursLoading() {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-custom">
          <div className="h-10 w-48 bg-white/20 rounded-lg animate-pulse mb-2" />
          <div className="h-6 w-64 bg-white/10 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md">
              <div className="h-56 bg-gray-200 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="flex justify-between pt-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
