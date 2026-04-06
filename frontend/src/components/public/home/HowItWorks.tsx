'use client'

import { Search, MessageSquare, Calendar, Plane, ArrowRight } from 'lucide-react'
import { motion, type Variants } from 'motion/react'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Browse & Choose',
    description: 'Explore our curated tours or start building a custom itinerary from scratch.',
  },
  {
    icon: MessageSquare,
    step: '02',
    title: 'Get in Touch',
    description: 'Submit your inquiry and our travel experts will reach out within 24 hours.',
  },
  {
    icon: Calendar,
    step: '03',
    title: 'Customize & Book',
    description: 'Finalize your itinerary, pick your dates, and make a secure payment.',
  },
  {
    icon: Plane,
    step: '04',
    title: 'Travel & Enjoy',
    description: 'Relax and enjoy your perfectly planned Rajasthan adventure.',
  },
]

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-16 md:py-24">
      <div
        className="absolute inset-0 -z-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="container-custom relative">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="font-montez text-4xl text-[#f97316] md:text-5xl lg:text-6xl">
            Simple Process
          </p>
          <h2 className="mt-1 font-poppins text-3xl font-bold text-slate-800 md:text-5xl">
            How It <span className="text-blue-600">Works</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-600 md:text-base">
            Book your dream tour in 4 easy steps
          </p>
        </div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4"
        >
          {/* Connector line (desktop) */}
          <div className="absolute left-[12.5%] right-[12.5%] top-12 hidden h-0.5 rounded-full bg-orange-200 lg:block" />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div key={step.step} variants={cardVariants} className="group relative">
                <div className="relative flex h-full flex-col items-center rounded-3xl border border-gray-100 bg-white p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
                  <span className="absolute right-5 top-4 select-none text-5xl font-black text-gray-100 transition-colors group-hover:text-orange-100">
                    {step.step}
                  </span>

                  <div className="relative z-10 mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 text-[#f97316] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#f97316] group-hover:text-white">
                    <Icon className="h-9 w-9" strokeWidth={2} />
                  </div>

                  <h3 className="mb-2 font-poppins text-lg font-bold text-slate-800 transition-colors group-hover:text-[#f97316]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">{step.description}</p>
                </div>

                {i < steps.length - 1 && (
                  <div className="absolute -right-2 top-1/2 z-20 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-300 shadow-md transition-colors group-hover:text-[#f97316] lg:flex">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
