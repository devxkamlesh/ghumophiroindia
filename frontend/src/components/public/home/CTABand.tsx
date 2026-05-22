'use client'

import Link from 'next/link'
import { ArrowRight, Phone, MessageCircle, Calendar } from 'lucide-react'
import { motion } from 'motion/react'

export default function CTABand() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gray-900">
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h1v1H0zm20 0h1v1h-1zM0 20h1v1H0zm20 20h1v1h-1z'/%3E%3C/g%3E%3C/svg%3E")` }}
      />

      {/* Accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 text-primary-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
              ✦ Limited Time — 15% Off First Tour
            </span>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your Dream Journey
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-orange-400">
                Starts Here
              </span>
            </h2>

            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Expert planning, unforgettable experiences, and memories that last a lifetime.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/custom-tour"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-xl font-bold text-base transition-colors shadow-lg shadow-primary-900/30">
                <Calendar className="w-5 h-5" />
                Plan My Trip
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-8 py-4 rounded-xl font-bold text-base transition-colors">
                <Phone className="w-5 h-5" />
                Speak to an Expert
              </Link>
            </div>

            {/* Contact strip */}
            <div className="inline-flex flex-wrap items-center justify-center gap-6 bg-white/5 border border-white/10 rounded-2xl px-8 py-5">
              <a href="tel:+919876543210"
                className="flex items-center gap-3 text-white hover:text-primary-300 transition-colors group">
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Call Now</div>
                  <div className="font-bold text-sm">+91 98765 43210</div>
                </div>
              </a>

              <div className="w-px h-8 bg-white/10 hidden sm:block" />

              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-white hover:text-primary-300 transition-colors group">
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">WhatsApp</div>
                  <div className="font-bold text-sm">Chat Instantly</div>
                </div>
              </a>

              <div className="w-px h-8 bg-white/10 hidden sm:block" />

              <div className="flex items-center gap-3 text-white">
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-sm">⚡</span>
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Response Time</div>
                  <div className="font-bold text-sm">Under 2 Hours</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
