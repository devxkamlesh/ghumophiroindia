export default function TourDetailLoading() {
  return (
    <div className="pt-20">
      {/* Hero Skeleton */}
      <div className="relative h-[60vh] min-h-[400px] bg-gray-300 animate-pulse">
        <div className="container-custom relative h-full flex items-end pb-12">
          <div className="w-full">
            <div className="h-6 w-32 bg-white/20 rounded-lg mb-4" />
            <div className="h-12 w-3/4 bg-white/20 rounded-lg mb-4" />
            <div className="h-6 w-1/2 bg-white/20 rounded-lg mb-6" />
            <div className="flex gap-6">
              <div className="h-5 w-24 bg-white/20 rounded-lg" />
              <div className="h-5 w-24 bg-white/20 rounded-lg" />
              <div className="h-5 w-32 bg-white/20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded-lg mb-4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
            </div>

            {/* Highlights */}
            <div>
              <div className="h-8 w-56 bg-gray-200 rounded-lg mb-4 animate-pulse" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div>
              <div className="h-8 w-40 bg-gray-200 rounded-lg mb-4 animate-pulse" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-50 p-6 rounded-lg">
                    <div className="h-6 w-48 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 bg-primary-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
