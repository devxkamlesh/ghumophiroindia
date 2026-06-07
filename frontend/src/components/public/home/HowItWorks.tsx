'use client'

import { Search, MessageSquare, Calendar, Plane, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Browse & Choose',
    description: 'Explore our curated tours or start building a custom itinerary from scratch.',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/25',
  },
  {
    icon: MessageSquare,
    step: '02',
    title: 'Get in Touch',
    description: 'Submit your inquiry and our travel experts will reach out within 24 hours.',
    gradient: 'from-violet-500 to-purple-500',
    glow: 'shadow-violet-500/25',
  },
  {
    icon: Calendar,
    step: '03',
    title: 'Customize & Book',
    description: 'Finalize your itinerary, pick your dates, and make a secure payment.',
    gradient: 'from-orange-500 to-amber-500',
    glow: 'shadow-orange-500/25',
  },
  {
    icon: Plane,
    step: '04',
    title: 'Travel & Enjoy',
    description: 'Relax and enjoy your perfectly planned Rajasthan adventure.',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/25',
  },
]

export default function HowItWorks() {
  return (
    <section className="relative py-20 md:py-28 bg-gray-50 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="container-custom relative">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary-600 text-sm font-semibold mb-3">
            <span className="w-4 h-px bg-primary-400" />
            Simple Process
            <span className="w-4 h-px bg-primary-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">How It Works</h2>
          <p className="text-gray-500 mt-3 text-lg max-w-xl mx-auto">Book your dream tour in 4 easy steps</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-300 via-violet-300 via-orange-300 to-emerald-300 rounded-full" />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group relative"
              >
                <div className="relative bg-white rounded-3xl p-7 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center text-center">
                  {/* Big watermark number */}
                  <span className="absolute top-4 right-5 text-5xl font-black text-gray-100 group-hover:text-gray-200/80 transition-colors select-none">
                    {step.step}
                  </span>

                  {/* Icon */}
                  <div className={`relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-5 shadow-lg ${step.glow} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                    <Icon className="w-9 h-9 text-white" strokeWidth={2} />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow between steps (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-2 -translate-y-1/2 z-20 w-6 h-6 bg-white rounded-full shadow-md items-center justify-center text-gray-300 group-hover:text-primary-500 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
