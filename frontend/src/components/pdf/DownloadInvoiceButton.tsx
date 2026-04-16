'use client'

import dynamic from 'next/dynamic'
import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { Booking } from '@/types'

// Lazy-load PDFDownloadLink — it uses browser APIs, can't SSR
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((m) => m.PDFDownloadLink),
  { ssr: false, loading: () => null }
)

const BookingInvoicePDF = dynamic(
  () => import('./BookingInvoice').then((m) => m.BookingInvoicePDF),
  { ssr: false, loading: () => null }
)

interface Props {
  booking: Booking
  className?: string
}

export function DownloadInvoiceButton({ booking, className }: Props) {
  const [ready, setReady] = useState(false)
  const fileName = `invoice-booking-${String(booking.id).padStart(6, '0')}.pdf`

  return (
    <PDFDownloadLink
      document={<BookingInvoicePDF booking={booking} />}
      fileName={fileName}
      onLoadingComplete={() => setReady(true)}
    >
      {({ loading }) => (
        <button
          className={
            className ??
            'inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-medium transition-colors'
          }
          disabled={loading}
          title="Download Invoice PDF"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          {loading ? 'Preparing…' : 'Invoice'}
        </button>
      )}
    </PDFDownloadLink>
  )
}
