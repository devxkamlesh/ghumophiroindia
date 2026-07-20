'use client'

import { Shield, Award, Headphones, Sparkles, Users, ThumbsUp } from 'lucide-react'
import { motion, type Variants } from 'motion/react'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const features = [
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Licensed guides, insured vehicles, and round-the-clock support for worry-free travel.',
  },
  {
    icon: Award,
    title: 'Expert Local Guides',
    description: 'Handpicked local experts with deep knowledge of history, culture, and hidden gems.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Real humans available before, during, and after your journey — anytime you need us.',
  },
  {
    icon: Sparkles,
    title: 'Fully Customizable',
    description: 'Tailor every detail of your tour to match your interests, pace, and budget.',
  },
  {
    icon: Users,
    title: 'Small Group Sizes',
    description: 'Intimate, personalised experiences instead of crowded, rushed bus tours.',
  },
  {
    icon: ThumbsUp,
    title: 'Best Price Promise',
    description: 'Transparent pricing with no hidden fees and flexible, secure payment options.',
  },
]

const stats = [
  { number: '5+',     label: 'Years of Experience' },
  { number: '2,000+', label: 'Happy Travellers' },
  { number: '4.9/5',  label: 'Average Rating' },
  { number: '25+',    label: 'Destinations Covered' },
]

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      {/* Subtle dotted background */}
      <div
        className="absolute inset-0 -z-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="container-custom relative">
        {/* Header — matches the rest of the homepage */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14 text-center"
        >
          <p className="font-montez text-4xl text-[#f97316] md:text-5xl lg:text-6xl">
            Why Ghumo Firo Holidays
          </p>
          <h2 className="mt-1 font-poppins text-3xl font-bold text-slate-800 md:text-5xl">
            Why <span className="text-blue-600">Choose</span> Us
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-600 md:text-base">
            For over 5 years we&apos;ve been crafting unforgettable journeys across Rajasthan and incredible
            India — trusted by thousands of travellers for honest service and memories that last a lifetime.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                variants={cardVariants}
                className="group relative rounded-3xl border border-gray-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-[#f97316] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#f97316] group-hover:text-white">
                  <Icon className="h-8 w-8" strokeWidth={2} />
                </div>
                <h3 className="mb-2 font-poppins text-lg font-bold text-slate-800 transition-colors group-hover:text-[#f97316]">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">{f.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats bar */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 md:p-12">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#f97316]/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />

          <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-poppins text-3xl font-extrabold text-[#f97316] md:text-4xl">
                  {s.number}
                </div>
                <div className="mt-1 text-sm text-gray-300">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
