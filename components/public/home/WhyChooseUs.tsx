'use client'

import { Shield, Award, HeadphonesIcon, Sparkles, Users, ThumbsUp, CheckCircle2 } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Licensed guides, insured vehicles, and 24/7 support for worry-free travel',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Award,
    title: 'Expert Guides',
    description: 'Local experts with deep knowledge of history, culture, and hidden gems',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Round-the-clock assistance before, during, and after your journey',
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    icon: Sparkles,
    title: 'Customizable',
    description: 'Tailor every aspect of your tour to match your preferences and budget',
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
  },
  {
    icon: Users,
    title: 'Small Groups',
    description: 'Intimate experiences with small group sizes for personalized attention',
    color: 'bg-pink-500',
    lightColor: 'bg-pink-50',
    iconColor: 'text-pink-600',
  },
  {
    icon: ThumbsUp,
    title: 'Best Price',
    description: 'Competitive pricing with no hidden fees and flexible payment options',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
]

const stats = [
  { number: '2,500+', label: 'Happy Travelers' },
  { number: '14+', label: 'Years Experience' },
  { number: '4.9/5', label: 'Average Rating' },
  { number: '98%', label: 'Satisfaction Rate' },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-semibold">Why Ghumo Phiro India</span>
          </div>
          <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Why Choose Us
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted partner for unforgettable Rajasthan experiences
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 ${feature.lightColor} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Element */}
                <div className={`h-1 w-0 ${feature.color} rounded-full mt-4 group-hover:w-12 transition-all duration-300`} />
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100 text-sm md:text-base font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 md:mt-16">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Verified Tours</div>
                  <div className="text-sm text-gray-600">100% Authentic</div>
                </div>
              </div>

              <div className="hidden md:block w-px h-12 bg-gray-200" />

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Secure Booking</div>
                  <div className="text-sm text-gray-600">SSL Protected</div>
                </div>
              </div>

              <div className="hidden md:block w-px h-12 bg-gray-200" />

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Award Winning</div>
                  <div className="text-sm text-gray-600">Industry Leader</div>
                </div>
              </div>

              <div className="hidden md:block w-px h-12 bg-gray-200" />

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <ThumbsUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Best Value</div>
                  <div className="text-sm text-gray-600">Price Match</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
