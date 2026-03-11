import { Award, Users, Globe, Heart, MapPin, Star, Shield } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'About Us | Ghumo Phiro India',
  description: 'Learn about our story, values and why thousands of travelers trust us for their Rajasthan journey.',
}

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div className="container-custom text-center">
          <p className="text-xs font-semibold text-primary-300 uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Ghumo Phiro India</h1>
          <p className="text-primary-100 max-w-xl mx-auto">
            Crafting unforgettable journeys through Rajasthan since 2010
          </p>
        </div>
      </div>

      <div className="container-custom py-14 max-w-5xl">

        {/* Story */}
        <section className="mb-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>
                Founded in 2010 by passionate travel enthusiasts, Ghumo Phiro India has grown from a small local operator to one of the most trusted names in Rajasthan tourism.
              </p>
              <p>
                Over the years, we&apos;ve helped thousands of travelers discover the royal heritage, vibrant culture, and breathtaking landscapes of Rajasthan — from the pink palaces of Jaipur to the golden dunes of Jaisalmer.
              </p>
              <p>
                Today, we&apos;re a team of local experts, professional guides, and travel specialists dedicated to creating personalized journeys that exceed expectations.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Award,  value: '14+',   label: 'Years Experience' },
              { icon: Users,  value: '2,500+', label: 'Happy Travelers' },
              { icon: Globe,  value: '50+',   label: 'Countries Served' },
              { icon: Star,   value: '4.9★',  label: 'Average Rating' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-primary-50 rounded-2xl p-5 text-center">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: MapPin,  title: 'Authenticity',    desc: 'We showcase the real Rajasthan, connecting you with local culture and traditions.' },
              { icon: Heart,   title: 'Personalization', desc: 'Every traveler is unique. We customize experiences to match your interests and pace.' },
              { icon: Globe,   title: 'Sustainability',  desc: 'Committed to responsible tourism that benefits local communities.' },
              { icon: Shield,  title: 'Excellence',      desc: 'From planning to execution, we maintain the highest standards of service.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Explore Rajasthan?</h2>
          <p className="text-primary-100 text-sm mb-6 max-w-md mx-auto">
            Browse our curated tours or build a custom itinerary tailored to your preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tours"
              className="px-6 py-2.5 bg-white text-primary-700 rounded-xl text-sm font-semibold hover:bg-primary-50 transition-colors">
              Browse Tours
            </Link>
            <Link href="/custom-tour"
              className="px-6 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-sm font-semibold transition-colors border border-white/20">
              Build Custom Tour
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
