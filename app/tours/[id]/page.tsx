import { Metadata } from 'next'
import { Clock, Users, Star, MapPin, Check, X } from 'lucide-react'
import { notFound } from 'next/navigation'
import BookingForm from '@/components/public/booking/BookingForm'
import { toursService } from '@/lib/services/tours.service'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  let tour
  try {
    tour = await toursService.getById(id)
  } catch (error) {
    return { title: 'Tour Not Found' }
  }
  
  if (!tour) {
    return {
      title: 'Tour Not Found',
    }
  }

  return {
    title: `${tour.title} | Ghumo Phiro India`,
    description: tour.description,
  }
}

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let tour
  try {
    tour = await toursService.getById(id)
  } catch (error) {
    notFound()
  }

  if (!tour) {
    notFound()
  }

  // Use high-quality Unsplash image as fallback
  const imageUrl = tour.images[0] || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80'

  return (
    <div className="pt-20">
      <div className="relative h-[60vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container-custom relative h-full flex items-end pb-12 text-white">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{tour.rating.toFixed(1)}</span>
                <span className="text-gray-200">({tour.reviewCount} reviews)</span>
              </div>
            </div>
            <h1 className="font-display text-5xl font-bold mb-4">{tour.title}</h1>
            <p className="text-xl text-gray-200 mb-6">{tour.description}</p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Max {tour.maxGroupSize} people</span>
              </div>
              {tour.destinations.length > 0 && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>{tour.destinations.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{tour.longDescription}</p>
            </section>

            {tour.highlights.length > 0 && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Tour Highlights</h2>
                <ul className="space-y-3">
                  {tour.highlights.map((highlight: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 text-lg">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {tour.itinerary.length > 0 && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Itinerary</h2>
                <div className="space-y-6">
                  {tour.itinerary.map((day: any) => (
                    <div key={day.day} className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-2">Day {day.day}: {day.title}</h3>
                      <p className="text-gray-700 mb-4">{day.description}</p>
                      {day.activities && day.activities.length > 0 && (
                        <ul className="space-y-2">
                          {day.activities.map((activity: string, idx: number) => (
                            <li key={idx} className="flex items-center space-x-2 text-gray-600">
                              <div className="w-2 h-2 bg-primary-500 rounded-full" />
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tour.included.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">What&apos;s Included</h2>
                    <ul className="space-y-2">
                      {tour.included.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.excluded.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">What&apos;s Not Included</h2>
                    <ul className="space-y-2">
                      {tour.excluded.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingForm tourId={parseInt(tour.id)} tourPrice={tour.price} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
