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

const stats = [
  { value: '4.9/5', label: 'Average Rating', sub: 'Based on 2,500+ reviews' },
  { value: '12,000+', label: 'Happy Travellers', sub: 'From 50+ countries' },
  { value: '98%', label: 'Satisfaction Rate', sub: 'Would recommend us' },
]

export default function Testimonials() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-custom">

        {/* Header */}
        <div className="mb-14 text-center">
          <p className="font-montez text-4xl text-[#f97316] md:text-5xl lg:text-6xl">
            What Travelers Say
          </p>
          <h2 className="mt-1 font-poppins text-3xl font-bold text-slate-800 md:text-5xl">
            Loved by <span className="text-blue-600">Travellers</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-600 md:text-base">
            Real experiences from happy customers around the world
          </p>
        </div>

        {/* Cards */}
        <div className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map(t => (
            <div key={t.name}
              className="group relative rounded-2xl border border-gray-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">

              <Quote className="absolute right-5 top-5 h-12 w-12 text-gray-100 transition-colors group-hover:text-orange-50" />

              <div className="mb-5 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="relative z-10 mb-6 text-sm leading-relaxed text-gray-700">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full shadow-sm ring-2 ring-white">
                  <Image src={t.image} alt={t.name} fill className="object-cover" sizes="44px" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-poppins text-sm font-bold text-slate-800">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.flag} {t.country}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="line-clamp-1 text-xs font-medium text-[#f97316]">{t.tour}</div>
                  <div className="text-xs text-gray-400">{t.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map(s => (
            <div key={s.value} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center">
              <div className="mb-1 font-poppins text-3xl font-extrabold text-[#f97316]">{s.value}</div>
              <div className="text-sm font-semibold text-slate-700">{s.label}</div>
              <div className="mt-0.5 text-xs text-gray-400">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
