import { Suspense } from 'react'
import { Star, Clock, Users, Loader2, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

// Placeholder until backend is connected
const mockTours: any[] = []

async function ToursContent({ searchParams }: { searchParams: { destination?: string; duration?: string; category?: string; sort?: string } }) {
  let tours = mockTours

  if (tours.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold mb-2">No tours found</h3>
        <p className="text-gray-600 mb-6">Tours will appear here once connected to the backend</p>
        <Link href="/custom-tour" className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
          Build Custom Tour
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-4">
        <div>
          <p className="text-gray-600">
            <span className="font-bold text-gray-900">{tours.length}</span> tours found
            {searchParams.destination && (
              <span className="ml-2">
                in <span className="font-semibold text-primary-600 capitalize">{searchParams.destination}</span>
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <select
            defaultValue={searchParams.sort || ''}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="">Sort by</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="duration">Duration</option>
          </select>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => {
          const fallbackImages = [
            'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
            'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
            'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
          ]
          const imageUrl = tour.images[0] || fallbackImages[parseInt(tour.id) % fallbackImages.length]

          return (
            <Link
              key={tour.id}
              href={`/tours/${tour.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-56 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${imageUrl}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-600 capitalize">
                  {tour.category}
                </div>

                <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full shadow-lg">
                  <span className="text-lg font-bold text-primary-600">₹{tour.price?.toLocaleString()}</span>
                </div>

                <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-sm text-gray-900">{tour.rating?.toFixed(1)}</span>
                  <span className="text-xs text-gray-600">({tour.reviewCount})</span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                  {tour.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-primary-600" />
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-primary-600" />
                    <span className="font-medium">Max {tour.maxGroupSize}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    tour.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    tour.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {tour.difficulty}
                  </span>
                  <span className="text-sm font-semibold text-primary-600 group-hover:text-primary-700">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string; duration?: string; category?: string; sort?: string }>
}) {
  const params = await searchParams

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-2">All Tours</h1>
          <p className="text-primary-100">Discover amazing experiences across India</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading tours...</p>
            </div>
          </div>
        }>
          <ToursContent searchParams={params} />
        </Suspense>
      </div>
    </div>
  )
}
