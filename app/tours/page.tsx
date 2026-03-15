'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Star, Clock, Users, MapPin, Loader2, Filter } from 'lucide-react'
import Link from 'next/link'

const allTours = [
  {
    id: 1,
    title: 'Golden Triangle Tour',
    description: 'Delhi, Agra & Jaipur - The Classic India Experience',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071',
    duration: '6 Days',
    durationDays: 6,
    groupSize: '2-15',
    price: 599,
    rating: 4.9,
    reviews: 234,
    destination: 'golden-triangle',
    highlights: ['Taj Mahal', 'Amber Fort', 'Red Fort'],
  },
  {
    id: 2,
    title: 'Jaipur City Tour',
    description: 'Explore the Pink City\'s Royal Heritage',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2070',
    duration: '2 Days',
    durationDays: 2,
    groupSize: '2-10',
    price: 149,
    rating: 4.8,
    reviews: 189,
    destination: 'jaipur',
    highlights: ['Hawa Mahal', 'City Palace', 'Jantar Mantar'],
  },
  {
    id: 3,
    title: 'Udaipur Lake City',
    description: 'Venice of the East - Romantic Getaway',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=2070',
    duration: '3 Days',
    durationDays: 3,
    groupSize: '2-8',
    price: 249,
    rating: 5.0,
    reviews: 156,
    destination: 'udaipur',
    highlights: ['Lake Pichola', 'City Palace', 'Boat Ride'],
  },
  {
    id: 4,
    title: 'Jaisalmer Desert Safari',
    description: 'Golden City & Thar Desert Adventure',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070',
    duration: '4 Days',
    durationDays: 4,
    groupSize: '2-12',
    price: 329,
    rating: 4.9,
    reviews: 201,
    destination: 'jaisalmer',
    highlights: ['Camel Safari', 'Desert Camp', 'Fort Visit'],
  },
  {
    id: 5,
    title: 'Jodhpur Blue City Tour',
    description: 'Explore the Majestic Blue City',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=2070',
    duration: '2 Days',
    durationDays: 2,
    groupSize: '2-10',
    price: 179,
    rating: 4.7,
    reviews: 145,
    destination: 'jodhpur',
    highlights: ['Mehrangarh Fort', 'Blue Houses', 'Clock Tower'],
  },
  {
    id: 6,
    title: 'Complete Rajasthan Tour',
    description: 'Experience All of Rajasthan',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071',
    duration: '14 Days',
    durationDays: 14,
    groupSize: '2-20',
    price: 1299,
    rating: 4.9,
    reviews: 312,
    destination: 'all-rajasthan',
    highlights: ['All Major Cities', 'Desert Safari', 'Palace Tours'],
  },
]

function ToursContent() {
  const searchParams = useSearchParams()
  const [filteredTours, setFilteredTours] = useState(allTours)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const destination = searchParams.get('destination')
      const duration = searchParams.get('duration')
      
      let filtered = [...allTours]

      if (destination) {
        filtered = filtered.filter(tour => tour.destination === destination)
      }

      if (duration) {
        const [min, max] = duration.includes('+') 
          ? [parseInt(duration), Infinity]
          : duration.split('-').map(Number)
        
        filtered = filtered.filter(tour => {
          return tour.durationDays >= min && tour.durationDays <= (max || min)
        })
      }

      setFilteredTours(filtered)
      setIsLoading(false)
    }, 600)
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Finding perfect tours for you...</p>
        </div>
      </div>
    )
  }

  if (filteredTours.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold mb-2">No tours found</h3>
        <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
        <Link href="/" className="btn-primary inline-block">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTours.map((tour) => (
        <Link
          key={tour.id}
          href={`/tours/${tour.id}`}
          className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
        >
          <div className="relative h-56 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url('${tour.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full shadow-lg">
              <span className="text-lg font-bold text-primary-600">${tour.price}</span>
            </div>

            <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-sm text-gray-900">{tour.rating}</span>
              <span className="text-xs text-gray-600">({tour.reviews})</span>
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
              {tour.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-primary-600" />
                <span className="font-medium">{tour.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-primary-600" />
                <span className="font-medium">{tour.groupSize}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function ToursPage() {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-2">Search Results</h1>
          <p className="text-primary-100">Find your perfect tour</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
          </div>
        }>
          <ToursContent />
        </Suspense>
      </div>
    </div>
  )
}
