'use client'

import Link from 'next/link'
import { CheckCircle, X, Mail, Phone, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  type?: 'booking' | 'inquiry' | 'custom'
}

export default function SuccessModal({
  isOpen,
  onClose,
  title = 'Booking Submitted Successfully!',
  message = 'Thank you for your booking request. Our team will contact you within 24 hours to confirm your tour details.',
  type = 'booking'
}: SuccessModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-3 text-gray-900">
                  {title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Contact Options */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
                  Need immediate assistance?
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:+919876543210"
                    className="flex items-center justify-center space-x-3 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">+91 98765 43210</span>
                  </a>
                  <a
                    href="mailto:info@ghumophiroindia.com"
                    className="flex items-center justify-center space-x-3 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-medium">info@ghumophiroindia.com</span>
                  </a>
                  <button
                    onClick={() => {
                      window.open('https://wa.me/919876543210?text=Hi! I just submitted a booking request.', '_blank')
                    }}
                    className="flex items-center justify-center space-x-3 text-gray-700 hover:text-green-600 transition-colors w-full"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">Chat on WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Got it!
                </button>
                <Link
                  href="/tours"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors text-center"
                >
                  Browse More Tours
                </Link>
              </div>

              {/* Reference Number */}
              {type === 'booking' && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  Reference: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
