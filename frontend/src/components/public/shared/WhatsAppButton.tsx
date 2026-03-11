'use client'

import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  const phoneNumber = '919876543210'
  const message = 'Hi! I am interested in booking a tour to Rajasthan.'

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  )
}
