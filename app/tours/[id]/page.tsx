import { Metadata } from 'next'
import Image from 'next/image'
import { Clock, Users, Star, MapPin, Check, X } from 'lucide-react'
import BookingForm from '@/components/BookingForm'

// This would come from database in production
const tour = {
  id: 1,
  title: 'Golden Triangle Tour',
  description: 'Experience the iconic Delhi-Agra-Jaipur circuit',
  longDescription: 'Embark on an unforgettable journey through India\'s most iconic destinations. The Golden Triangle tour takes you through Delhi\'s historical monuments, Agra\'s magnificent Taj Mahal, and Jaipur\'s royal palaces.',
  duration: 6,
  price: 599,
  maxGroupSize: 15,
  rating: 4.9,
  reviewCount: 234,
  images: [
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071',
  ],
  highlights: [
    'Visit the iconic Taj Mahal at sunrise',
    'Explore Amber Fort and Palace',
    'Discover Delhi\'s historical monuments',
    'Experience local culture and cuisine',
    'Professional English-speaking guide',
  ],
  included: [
    'Accommodation in 4-star hotels',
    'Daily breakfast',
    'Private AC vehicle',
    'Professional guide',
    'All monument entrance fees',
  ],
  excluded: [
    'International flights',
    'Lunch and dinner',
    'Personal expenses',
    'Travel insurance',
    'Tips and gratuities',
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Delhi',
      description: 'Welcome to India! Transfer to hotel and rest.',
      activities: ['Airport pickup', 'Hotel check-in', 'Welcome briefing'],
    },
    {
      day: 2,
      title: 'Delhi Sightseeing',
      description: 'Full day exploring Old and New Delhi.',
      activities: ['Red Fort', 'Jama Masjid', 'India Gate', 'Qutub Minar'],
    },
    {
      day: 3,
      title: 'Delhi to Agra',
      description: 'Drive to Agra and visit Taj Mahal.',
      activities: ['Taj Mahal', 'Agra Fort', 'Mehtab Bagh'],
    },
  ],
}

export const metadata: Metadata = {
  title: `${tour.title} | Rajasthan Tours`,
  description: tour.description,
}

export default function TourDetailPage() {
  return (
    <div className="pt-20">
      <div className="relative h-[60vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${tour.images[0]}')` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container-custom relative h-full flex items-end pb-12 text-white">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{tour.rating}</span>
                <span className="text-gray-200">({tour.reviewCount} reviews)</span>
              </div>
            </div>
            <h1 className="font-display text-5xl font-bold mb-4">{tour.title}</h1>
            <p className="text-xl text-gray-200 mb-6">{tour.description}</p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{tour.duration} Days</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Max {tour.maxGroupSize} people</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Delhi, Agra, Jaipur</span>
              </div>
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

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Tour Highlights</h2>
              <ul className="space-y-3">
                {tour.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Itinerary</h2>
              <div className="space-y-6">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Day {day.day}: {day.title}</h3>
                    <p className="text-gray-700 mb-4">{day.description}</p>
                    <ul className="space-y-2">
                      {day.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-gray-600">
                          <div className="w-2 h-2 bg-primary-500 rounded-full" />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">What's Included</h2>
                  <ul className="space-y-2">
                    {tour.included.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">What's Not Included</h2>
                  <ul className="space-y-2">
                    {tour.excluded.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingForm tourId={tour.id} tourPrice={tour.price} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
