'use client'

import { Star, Clock, Users, MapPin, ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const tours = [
  {
    id: 1,
    title: 'Golden Triangle Tour',
    description: 'Delhi, Agra & Jaipur - The Classic India Experience',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071',
    duration: '6 Days',
    groupSize: '2-15',
    price: 599,
    rating: 4.9,
    reviews: 234,
    highlights: ['Taj Mahal', 'Amber Fort', 'Red Fort'],
    badge: 'Most Popular',
    badgeColor: 'bg-red-500',
  },
  {
    id: 2,
    title: 'Jaipur City Tour',
    description: 'Explore the Pink City\'s Royal Heritage',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2070',
    duration: '2 Days',
    groupSize: '2-10',
    price: 149,
    rating: 4.8,
    reviews: 189,
    highlights: ['Hawa Mahal', 'City Palace', 'Jantar Mantar'],
    badge: 'Best Value',
    badgeColor: 'bg-green-500',
  },
  {
    id: 3,
    title: 'Udaipur Lake City',
    description: 'Venice of the East - Romantic Getaway',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=2070',
    duration: '3 Days',
    groupSize: '2-8',
    price: 249,
    rating: 5.0,
    reviews: 156,
    highlights: ['Lake Pichola', 'City Palace', 'Boat Ride'],
    badge: 'Top Rated',
    badgeColor: 'bg-yellow-500',
  },
  {
    id: 4,
    title: 'Jaisalmer Desert Safari',
    description: 'Golden City & Thar Desert Adventure',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070',
    duration: '4 Days',
    groupSize: '2-12',
    price: 329,
    rating: 4.9,
    reviews: 201,
    highlights: ['Camel Safari', 'Desert Camp', 'Fort Visit'],
    badge: 'Adventure',
    badgeColor: 'bg-orange-500',
  },
]

export default function FeaturedTours() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">Trending Now</span>
          </div>
          <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Featured Tours
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked experiences showcasing the best of Rajasthan
          </p>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tours.map((tour) => (
            <Link
              key={tour.id}
              href={`/tours/${tour.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${tour.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Badge */}
                <div className={`absolute top-4 left-4 ${tour.badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                  {tour.badge}
                </div>

                {/* Price */}
                <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full shadow-lg">
                  <span className="text-lg font-bold text-primary-600">${tour.price}</span>
                </div>

                {/* Rating */}
                <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-sm text-gray-900">{tour.rating}</span>
                  <span className="text-xs text-gray-600">({tour.reviews})</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                  {tour.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-primary-600" />
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-primary-600" />
                    <span className="font-medium">{tour.groupSize}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tour.highlights.slice(0, 2).map((highlight, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary-600 group-hover:text-primary-700">
                    View Details
                  </span>
                  <ArrowRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link 
            href="/tours" 
            className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <span>View All Tours</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
