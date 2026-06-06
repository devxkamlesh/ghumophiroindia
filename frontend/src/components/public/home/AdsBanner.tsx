'use client'

import Link from 'next/link'
import { motion, type Variants } from 'motion/react'

interface Category {
  title: string
  image: string
  href: string
}

const CATEGORIES: Category[] = [
  {
    title: 'Treks & Trails',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80',
    href: '/tours?category=treks',
  },
  {
    title: 'Spiti Valley Tour',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80',
    href: '/tours?category=spiti-valley',
  },
  {
    title: 'Weekend trips from Delhi',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
    href: '/tours?category=weekend-trips',
  },
  {
    title: 'Backpacking Trips',
    image: 'https://images.unsplash.com/photo-1533692328991-08159ff19fca?w=600&q=80',
    href: '/tours?category=backpacking',
  },
  {
    title: 'Char Dham Package',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80',
    href: '/tours?category=char-dham',
  },
]

// Vertical offsets (lg+ only) to lay the cards along a gentle curve/arch
const CURVE_OFFSETS = ['lg:mt-14', 'lg:mt-6', 'lg:mt-0', 'lg:mt-6', 'lg:mt-14']

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export default function AdsBanner() {
  return (
    <section className="relative overflow-hidden bg-emerald-50/40 py-16 md:py-20">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 text-center"
        >
          <p className="font-montez text-4xl text-[#f97316] md:text-5xl lg:text-6xl">
            Wonderful Place For You
          </p>
          <h2 className="mt-1 font-merriweather text-3xl font-extrabold text-slate-800 md:text-5xl">
            Tour Categories
          </h2>
        </motion.div>

        {/* Cards laid along a curve. Hover effects are pure CSS (GPU-composited). */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 items-start gap-6 sm:grid-cols-3 lg:grid-cols-5"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.title} variants={cardVariants} className={CURVE_OFFSETS[i] ?? ''}>
              <Link href={cat.href} className="group block text-center">
                <div className="relative aspect-square w-full overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-xl rounded-bl-xl shadow-md transition-[transform,box-shadow] duration-500 ease-out will-change-transform group-hover:-translate-y-1.5 group-hover:shadow-2xl">
                  {/* Image (gentle zoom — transform only) */}
                  <div
                    className="absolute inset-0 transform-gpu bg-cover bg-center transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
                    style={{ backgroundImage: `url('${cat.image}')` }}
                  />

                  {/* Brightness lift via white overlay opacity (GPU-composited, cheap) */}
                  <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-10" />

                  {/* Shine: one-shot on hover-in, no reverse (CSS keyframe, not group-hover transition) */}
                  <div className="card-shine absolute inset-y-0 left-0 z-10" />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-800 transition-colors duration-300 group-hover:text-[#f97316] md:text-lg">
                  {cat.title}
                </h3>
                <span className="mt-1 block text-xs font-medium text-slate-400 transition-colors duration-300 group-hover:text-[#f97316]">
                  See More
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
