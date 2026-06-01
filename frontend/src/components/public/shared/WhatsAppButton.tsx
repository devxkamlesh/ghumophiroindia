'use client'

import Link from 'next/link'
import { Briefcase } from 'lucide-react'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+919876543210'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=Hi%2C%20I%20want%20to%20know%20more%20about%20your%20tours`

export default function WhatsAppButton() {
  return (
    <>
      {/* Fixed ASK ME + BUSINESS — right side, always visible */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1.5">
        {/* ASK ME */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white pl-3 pr-4 py-3 font-bold text-sm uppercase tracking-wider rounded-l-xl shadow-xl transition-all hover:pr-5 group"
          aria-label="Ask Me on WhatsApp"
        >
          <WhatsAppIcon size={20} className="text-white flex-shrink-0" />
          <span className="hidden sm:inline">Ask Me</span>
        </a>

        {/* BUSINESS */}
        <Link
          href="/business"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white pl-3 pr-4 py-3 font-bold text-sm uppercase tracking-wider rounded-l-xl shadow-xl transition-all hover:pr-5 group"
          aria-label="Business"
        >
          <Briefcase className="w-5 h-5 flex-shrink-0" />
          <span className="hidden sm:inline">Business</span>
        </Link>
      </div>
    </>
  )
}
