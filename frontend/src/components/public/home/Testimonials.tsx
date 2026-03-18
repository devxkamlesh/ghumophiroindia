'use client'

import { Star, Quote } from 'lucide-react'
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
    date: 'Dec 2023',
  },
  {
    name: 'Marco Rossi',
    country: 'Italy',
    flag: '🇮🇹',
    rating: 5,
    text: 'The desert safari in Jaisalmer was magical. Watching the sunset over the dunes and staying in the desert camp was a once-in-a-lifetime experience.',
    tour: 'Jaisalmer Desert Safari',
    image: 'https://i.pravatar.cc/150?img=12',
    date: 'Nov 2023',
  },
  {
    name: 'Priya Sharma',
    country: 'India',
    flag: '🇮🇳',
    rating: 5,
    text: 'As a local, I thought I knew Rajasthan well, but this tour showed me hidden gems I never knew existed. Highly professional and well-organized.',
    tour: 'Rajasthan Heritage Tour',
    image: 'https://i.pravatar.cc/150?img=5',
    date: 'Oct 2023',
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-primary-600 text-sm font-semibold mb-3">
            <span className="w-4 h-px bg-primary-400" />
            Testimonials
            <span className="w-4 h-px bg-primary-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">What Travelers Say</h2>
          <p className="text-gray-500 mt-3 text-lg max-w-xl mx-auto">Real experiences from happy customers around the world</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {testimonials.map(t => (
            <div key={t.name}
              className="group relative bg-white border border-gray-100 hover:border-primary-200 rounded-2xl p-7 hover:shadow-xl transition-all duration-300">

              {/* Quote watermark */}
              <Quote className="absolute top-5 right-5 w-12 h-12 text-gray-100 group-hover:text-primary-50 transition-colors" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 text-sm leading-relaxed mb-6 relative z-10">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-white shadow-sm shrink-0">
                  <Image src={t.image} alt={t.name} fill className="object-cover" sizes="44px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.flag} {t.country}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-primary-600 font-medium line-clamp-1">{t.tour}</div>
                  <div className="text-xs text-gray-400">{t.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { value: '4.9/5', label: 'Average Rating', sub: 'Based on 2,500+ reviews' },
            { value: '2,500+', label: 'Happy Travelers', sub: 'From 50+ countries' },
            { value: '98%', label: 'Satisfaction Rate', sub: 'Would recommend us' },
          ].map(s => (
            <div key={s.value} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{s.value}</div>
              <div className="font-semibold text-gray-700 text-sm">{s.label}</div>
              <div className="text-gray-400 text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
