'use client'

import { useEffect, useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import type { Booking } from '@/types'

interface Props {
  booking: Booking
  className?: string
}

// Rendered only on client — avoids SSR issues with @react-pdf/renderer
export function DownloadInvoiceButton({ booking, className }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return (
      <button disabled className={className ?? defaultCls}>
        <Download className="w-3.5 h-3.5" />
        Invoice
      </button>
    )
  }

  return <ClientPDFButton booking={booking} className={className} />
}

// Separated so the import of @react-pdf/renderer only runs client-side
function ClientPDFButton({ booking, className }: Props) {
  // Lazy require inside render — safe because this component only mounts client-side
  const { PDFDownloadLink } = require('@react-pdf/renderer')
  const { BookingInvoicePDF } = require('./BookingInvoice')

  const fileName = `invoice-${String(booking.id).padStart(6, '0')}.pdf`

  return (
    <PDFDownloadLink
      document={<BookingInvoicePDF booking={booking} />}
      fileName={fileName}
    >
      {({ loading }: { loading: boolean }) => (
        <button
          className={className ?? defaultCls}
          disabled={loading}
          title="Download Invoice PDF"
        >
          {loading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Download className="w-3.5 h-3.5" />
          }
          {loading ? 'Preparing…' : 'Invoice'}
        </button>
      )}
    </PDFDownloadLink>
  )
}

const defaultCls =
  'inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-medium transition-colors disabled:opacity-50'
