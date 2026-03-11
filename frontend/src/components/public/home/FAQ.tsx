'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

const faqs = [
  {
    question: 'How do I book a tour?',
    answer: 'You can book a tour by selecting your preferred tour from our website, filling out the booking form with your details, and submitting it. Our team will contact you within 24 hours to confirm your booking and provide payment details.',
  },
  {
    question: 'What is included in the tour price?',
    answer: 'Tour prices typically include accommodation, transportation, professional guide, entrance fees to monuments, and breakfast. Specific inclusions vary by tour - check the tour details page for complete information.',
  },
  {
    question: 'Can I customize my tour?',
    answer: 'Absolutely! We specialize in custom tours. Use our Custom Tour Builder or contact us directly to create an itinerary that matches your interests, budget, and schedule.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Free cancellation up to 7 days before the tour start date. Cancellations within 7 days are subject to a 50% fee. No refund for cancellations within 48 hours of tour start.',
  },
  {
    question: 'Do you provide airport pickup?',
    answer: 'Yes, complimentary airport pickup and drop-off are included in all multi-day tours. For day tours, airport transfers can be arranged for an additional fee.',
  },
  {
    question: 'What languages do your guides speak?',
    answer: 'All our guides are fluent in English. We can also arrange guides who speak Spanish, French, German, Japanese, and other languages upon request.',
  },
  {
    question: 'Is travel insurance included?',
    answer: 'Travel insurance is not included in the tour price. We strongly recommend purchasing comprehensive travel insurance before your trip.',
  },
  {
    question: 'What is the best time to visit Rajasthan?',
    answer: 'October to March is the best time to visit Rajasthan, with pleasant weather perfect for sightseeing. Avoid summer months (April-June) due to extreme heat.',
  },
  {
    question: 'Are your tours suitable for families with children?',
    answer: 'Yes! Most of our tours are family-friendly. We can adjust itineraries to accommodate children and provide child seats in vehicles upon request.',
  },
  {
    question: 'How do I make payment?',
    answer: 'We accept payments via bank transfer, credit/debit cards, PayPal, and UPI. A 30% deposit is required to confirm booking, with the balance due before tour start.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Everything you need to know about booking your perfect tour
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-primary-600 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <span>Contact Us</span>
          </a>
        </div>
      </div>
    </section>
  )
}
