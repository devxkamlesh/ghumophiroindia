'use client'

import { Star, Quote, MapPin, Calendar, MessageCircle } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Sarah Johnson',
    country: 'United States',
    flag: '🇺🇸',
    rating: 5,
    text: 'Absolutely incredible experience! Our guide was knowledgeable and the itinerary was perfectly paced. The Golden Triangle tour exceeded all expectations.',
    tour: 'Golden Triangle Tour',
    image: 'https://i.pravatar.cc/150?img=1',
    date: 'December 2023',
    verified: true,
  },
  {
    name: 'Marco Rossi',
    country: 'Italy',
    flag: '🇮🇹',
    rating: 5,
    text: 'The desert safari in Jaisalmer was magical. Watching the sunset over the dunes and staying in the desert camp was a once-in-a-lifetime experience.',
    tour: 'Jaisalmer Desert Safari',
    image: 'https://i.pravatar.cc/150?img=12',
    date: 'November 2023',
    verified: true,
  },
  {
    name: 'Priya Sharma',
    country: 'India',
    flag: '🇮🇳',
    rating: 5,
    text: 'As a local, I thought I knew Rajasthan well, but this tour showed me hidden gems I never knew existed. Highly professional and well-organized.',
    tour: 'Rajasthan Heritage Tour',
    image: 'https://i.pravatar.cc/150?img=5',
    date: 'October 2023',
    verified: true,
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-4">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">Testimonials</span>
          </div>
          <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            What Travelers Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Real experiences from our happy customers around the world
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 md:mb-16">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="group bg-gradient-to-br from-white to-gray-50 p-6 md:p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 relative overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-20 h-20 text-primary-600" />
              </div>

              {/* Header */}
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="relative w-14 h-14 rounded-full ring-4 ring-white shadow-md overflow-hidden flex-shrink-0">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-lg text-gray-900">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <div className="bg-blue-500 rounded-full p-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <span className="text-lg">{testimonial.flag}</span>
                      <span>{testimonial.country}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                &quot;{testimonial.text}&quot;
              </p>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-primary-600 font-semibold">
                    <MapPin className="w-4 h-4" />
                    <span>{testimonial.tour}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{testimonial.date}</span>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-orange-600 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/3 translate-y-1/3" />
          </div>

          <div className="relative z-10">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Trusted by Thousands
              </h3>
              <p className="text-white/80">Join our community of happy travelers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-xl mb-4">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">4.9/5</div>
                <div className="text-white/90 font-semibold mb-1">Average Rating</div>
                <div className="text-sm text-white/70">Based on 2,500+ reviews</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-xl mb-4">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">2,500+</div>
                <div className="text-white/90 font-semibold mb-1">Happy Travelers</div>
                <div className="text-sm text-white/70">From 50+ countries</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-xl mb-4">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">98%</div>
                <div className="text-white/90 font-semibold mb-1">Satisfaction Rate</div>
                <div className="text-sm text-white/70">Would recommend us</div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Platforms */}
        <div className="mt-12 text-center">
          <p className="text-sm font-semibold text-gray-600 mb-6">As featured on</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="flex items-center space-x-2 px-6 py-3 bg-white rounded-xl shadow-md border border-gray-100">
              <Star className="w-5 h-5 text-green-500" />
              <span className="text-lg font-bold text-gray-700">TripAdvisor</span>
            </div>
            <div className="flex items-center space-x-2 px-6 py-3 bg-white rounded-xl shadow-md border border-gray-100">
              <Star className="w-5 h-5 text-blue-500" />
              <span className="text-lg font-bold text-gray-700">Google Reviews</span>
            </div>
            <div className="flex items-center space-x-2 px-6 py-3 bg-white rounded-xl shadow-md border border-gray-100">
              <Star className="w-5 h-5 text-green-600" />
              <span className="text-lg font-bold text-gray-700">Trustpilot</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
