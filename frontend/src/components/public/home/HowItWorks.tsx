'use client'

import Link from 'next/link'
import { Search, MessageSquare, Calendar, Plane } from 'lucide-react'
import { motion } from 'motion/react'

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Browse & Choose',
    description: 'Explore our curated tours or start building a custom itinerary from scratch.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: MessageSquare,
    step: '02',
    title: 'Get in Touch',
    description: 'Submit your inquiry and our travel experts will reach out within 24 hours.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    icon: Calendar,
    step: '03',
    title: 'Customize & Book',
    description: 'Finalize your itinerary, pick your dates, and make a secure payment.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
  {
    icon: Plane,
    step: '04',
    title: 'Travel & Enjoy',
    description: 'Relax and enjoy your perfectly planned Rajasthan adventure.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-primary-600 text-sm font-semibold mb-3">
            <span className="w-4 h-px bg-primary-400" />
            Simple Process
            <span className="w-4 h-px bg-primary-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">How It Works</h2>
          <p className="text-gray-500 mt-3 text-lg max-w-xl mx-auto">Book your dream tour in 4 easy steps</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-200 via-violet-200 via-orange-200 to-emerald-200" />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className={`relative w-20 h-20 ${step.bg} border-2 ${step.border} rounded-2xl flex items-center justify-center mb-5 z-10`}>
                  <Icon className={`w-9 h-9 ${step.color}`} />
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 flex items-center justify-center shadow-sm">
                    {i + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Ready to start your journey?</h3>
            <p className="text-gray-500 mt-1">Join 2,500+ happy travelers who trusted us with their adventure.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/tours"
              className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-7 py-3 rounded-xl font-semibold text-sm transition-colors shadow-md">
              Browse Tours
            </Link>
            <Link href="/custom-tour"
              className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-7 py-3 rounded-xl font-semibold text-sm transition-colors">
              Build Custom Tour
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
