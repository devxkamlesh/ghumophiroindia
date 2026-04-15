'use client'

import Link from 'next/link'
import { Search, MessageSquare, Calendar, Plane } from 'lucide-react'
import { motion } from 'motion/react'

const steps = [
  {
    icon: Search,
    title: 'Browse & Choose',
    description: 'Explore our curated tours or build your custom itinerary',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: MessageSquare,
    title: 'Get in Touch',
    description: 'Submit your inquiry and our experts will contact you within 24 hours',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Calendar,
    title: 'Customize & Book',
    description: 'Finalize your itinerary, dates, and make secure payment',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Plane,
    title: 'Travel & Enjoy',
    description: 'Relax and enjoy your perfectly planned Indian adventure',
    color: 'from-green-500 to-green-600',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span>Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Book your dream tour in 4 easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 via-orange-200 to-green-200 -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="text-center">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 z-10">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-orange-50 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-3">Ready to start your journey?</h3>
            <p className="text-gray-600 mb-6">
              Join 2,500+ happy travelers who trusted us with their Indian adventure
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tours"
                className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Tours
              </Link>
              <Link
                href="/custom-tour"
                className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-primary-600 px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 transition-colors"
              >
                Build Custom Tour
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
