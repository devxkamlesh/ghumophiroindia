'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'

const faqs = [
  { q: 'How do I book a tour?', a: 'Select your preferred tour, fill out the booking form, and submit. Our team will contact you within 24 hours to confirm and provide payment details.' },
  { q: 'What is included in the tour price?', a: 'Prices typically include accommodation, transportation, a professional guide, entrance fees, and breakfast. Check each tour\'s detail page for the full inclusions list.' },
  { q: 'Can I customize my tour?', a: 'Absolutely. Use our Custom Tour Builder or contact us directly to create an itinerary that matches your interests, budget, and schedule.' },
  { q: 'What is your cancellation policy?', a: 'Free cancellation up to 7 days before the tour. Cancellations within 7 days incur a 50% fee. No refund within 48 hours of tour start.' },
  { q: 'Do you provide airport pickup?', a: 'Yes — complimentary airport pickup and drop-off are included in all multi-day tours. Day-tour transfers can be arranged for an additional fee.' },
  { q: 'What languages do your guides speak?', a: 'All guides are fluent in English. Spanish, French, German, Japanese, and other languages can be arranged on request.' },
  { q: 'What is the best time to visit Rajasthan?', a: 'October to March offers the most pleasant weather for sightseeing. Avoid April–June due to extreme heat.' },
  { q: 'Are tours suitable for families with children?', a: 'Yes! Most tours are family-friendly. We can adjust itineraries for children and provide child seats upon request.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary-600 text-sm font-semibold mb-3">
              <span className="w-4 h-px bg-primary-400" />
              Got Questions?
              <span className="w-4 h-px bg-primary-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">FAQ</h2>
            <p className="text-gray-500 mt-3 text-lg">Everything you need to know before booking</p>
          </div>

          {/* Accordion */}
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                  <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                    {open === i
                      ? <Minus className="w-3.5 h-3.5 text-primary-600" />
                      : <Plus className="w-3.5 h-3.5 text-gray-500" />
                    }
                  </span>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm mb-4">Still have questions?</p>
            <Link href="/contact"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-md">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
