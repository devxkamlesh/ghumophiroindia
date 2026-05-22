'use client'

import { Shield, Award, HeadphonesIcon, Sparkles, Users, ThumbsUp } from 'lucide-react'

const features = [
  { icon: Shield,          title: 'Safe & Secure',   description: 'Licensed guides, insured vehicles, and 24/7 support for worry-free travel.',  color: 'text-blue-600',   bg: 'bg-blue-50' },
  { icon: Award,           title: 'Expert Guides',   description: 'Local experts with deep knowledge of history, culture, and hidden gems.',       color: 'text-violet-600', bg: 'bg-violet-50' },
  { icon: HeadphonesIcon,  title: '24/7 Support',    description: 'Round-the-clock assistance before, during, and after your journey.',            color: 'text-emerald-600',bg: 'bg-emerald-50' },
  { icon: Sparkles,        title: 'Customizable',    description: 'Tailor every aspect of your tour to match your preferences and budget.',         color: 'text-amber-600',  bg: 'bg-amber-50' },
  { icon: Users,           title: 'Small Groups',    description: 'Intimate experiences with small group sizes for personalized attention.',        color: 'text-pink-600',   bg: 'bg-pink-50' },
  { icon: ThumbsUp,        title: 'Best Price',      description: 'Competitive pricing with no hidden fees and flexible payment options.',          color: 'text-orange-600', bg: 'bg-orange-50' },
]

const stats = [
  { number: '2,500+', label: 'Happy Travelers' },
  { number: '14+',    label: 'Years Experience' },
  { number: '4.9/5',  label: 'Average Rating' },
  { number: '98%',    label: 'Satisfaction Rate' },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-primary-600 text-sm font-semibold mb-3">
            <span className="w-4 h-px bg-primary-400" />
            Why Ghumo Phiro India
            <span className="w-4 h-px bg-primary-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Why Choose Us</h2>
          <p className="text-gray-500 mt-3 text-lg max-w-xl mx-auto">Your trusted partner for unforgettable Rajasthan experiences</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {features.map(f => {
            const Icon = f.icon
            return (
              <div key={f.title}
                className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            )
          })}
        </div>

        {/* Stats bar */}
        <div className="bg-gray-900 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{s.number}</div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
