'use client'

import { Shield, Award, HeadphonesIcon, Sparkles, Users, ThumbsUp } from 'lucide-react'
import { motion } from 'motion/react'

const features = [
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Licensed guides, insured vehicles, and 24/7 support for worry-free travel.',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/25',
  },
  {
    icon: Award,
    title: 'Expert Guides',
    description: 'Local experts with deep knowledge of history, culture, and hidden gems.',
    gradient: 'from-violet-500 to-purple-500',
    glow: 'shadow-violet-500/25',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Round-the-clock assistance before, during, and after your journey.',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/25',
  },
  {
    icon: Sparkles,
    title: 'Customizable',
    description: 'Tailor every aspect of your tour to match your preferences and budget.',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/25',
  },
  {
    icon: Users,
    title: 'Small Groups',
    description: 'Intimate experiences with small group sizes for personalized attention.',
    gradient: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/25',
  },
  {
    icon: ThumbsUp,
    title: 'Best Price',
    description: 'Competitive pricing with no hidden fees and flexible payment options.',
    gradient: 'from-orange-500 to-red-500',
    glow: 'shadow-orange-500/25',
  },
]

const stats = [
  { number: '1,200+', label: 'Happy Travelers' },
  { number: '4+',     label: 'Years Experience' },
  { number: '4.8/5',  label: 'Average Rating' },
  { number: '50+',    label: 'Destinations Covered' },
]

export default function WhyChooseUs() {
  return (
    <section className="relative py-20 md:py-28 bg-white overflow-hidden">
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
            Why Ghumo Phiro India
            <span className="w-4 h-px bg-primary-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Why Choose Us</h2>
          <p className="text-gray-500 mt-3 text-lg max-w-xl mx-auto">Your trusted partner for unforgettable Rajasthan experiences</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative bg-white rounded-3xl p-7 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg ${f.glow} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Stats bar */}
        <div className="relative overflow-hidden bg-gray-900 rounded-3xl p-8 md:p-12">
          {/* glow accents */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" />

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
                  {s.number}
                </div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
