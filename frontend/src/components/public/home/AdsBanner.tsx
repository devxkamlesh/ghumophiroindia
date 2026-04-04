'use client'

import Link from 'next/link'
import { motion, type Variants } from 'motion/react'
import type { Banner } from '@/types'

interface CategoryCard {
  title: string
  image: string
  href: string
  subtitle?: string
}

// Used only when the backend returns nothing (e.g. API unreachable or not seeded).
const FALLBACK_CARDS: CategoryCard[] = [
  { title: 'City Tours',    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80', href: '/tours?category=city' },
  { title: 'Heritage Tours', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', href: '/tours?category=heritage' },
  { title: 'Desert Safari', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80', href: '/tours?category=desert' },
  { title: 'Backpacking Trips', image: 'https://images.unsplash.com/photo-1533692328991-08159ff19fca?w=600&q=80', href: '/tours' },
  { title: 'Custom Tours',  image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', href: '/custom-tour' },
]

interface Props {
  banners?: Banner[]
}

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

export default function AdsBanner({ banners = [] }: Props) {
  // Map backend category banners → display cards, falling back to defaults when empty.
  const cards: CategoryCard[] =
    banners.length > 0
      ? banners.map(b => ({
          title: b.title,
          image: b.image,
          href: b.linkUrl || '/tours',
          subtitle: b.subtitle || b.linkText || 'See More',
        }))
      : FALLBACK_CARDS

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
          <h2 className="mt-1 font-poppins text-3xl font-bold text-slate-800 md:text-5xl">
            Tour Categories
          </h2>
        </motion.div>

        {/* Cards laid along a curve. Hover effects are pure CSS (GPU-composited). */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className={`grid grid-cols-2 items-start gap-6 sm:grid-cols-3 ${
            cards.length >= 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
          }`}
        >
          {cards.map((cat, i) => (
            <motion.div key={`${cat.title}-${i}`} variants={cardVariants} className={CURVE_OFFSETS[i] ?? ''}>
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
                  {cat.subtitle}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
