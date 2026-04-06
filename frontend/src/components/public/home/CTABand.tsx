'use client'

import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { motion } from 'motion/react'

export default function CTABand() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-16 md:py-20">
      {/* Accent glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-[#f97316]/20 blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          {/* Simple offer badge */}
          <span className="mb-6 inline-block rounded-full bg-[#f97316] px-4 py-1.5 text-xs font-semibold text-white">
            Limited Time — 15% Off First Tour
          </span>

          {/* Headline */}
          <h2 className="font-poppins text-3xl font-bold leading-tight text-white md:text-5xl">
            Your Dream Journey <span className="text-[#f97316]">Starts Here</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base text-gray-400">
            Expert planning, unforgettable experiences, and memories that last a lifetime.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/custom-tour"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f97316] px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#ea670c] sm:w-auto">
              Plan My Trip
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="tel:+919876543210"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto">
              <Phone className="h-5 w-5" />
              Call Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
