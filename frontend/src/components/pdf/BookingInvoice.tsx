'use client'

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { Booking } from '@/types'

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
    padding: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#16a34a',
  },
  brand: { flexDirection: 'column', gap: 2 },
  brandName: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#16a34a' },
  brandTagline: { fontSize: 9, color: '#6b7280' },
  invoiceMeta: { alignItems: 'flex-end', gap: 3 },
  invoiceTitle: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#111827' },
  invoiceNum: { fontSize: 10, color: '#6b7280' },
  statusBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },

  // Section
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },

  // Two-column layout
  row2: { flexDirection: 'row', gap: 16 },
  col: { flex: 1 },

  // Info card
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardLabel: { fontSize: 8, color: '#9ca3af', marginBottom: 2 },
  cardValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#111827' },
  cardValueSm: { fontSize: 9, color: '#374151' },

  // Table
  table: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 6, overflow: 'hidden' },
  tableHead: { flexDirection: 'row', backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 8 },
  tableRow: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  tableRowAlt: { backgroundColor: '#fafafa' },
  th: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#6b7280', textTransform: 'uppercase' },
  td: { fontSize: 9, color: '#374151' },
  tdBold: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#111827' },

  // Totals
  totalsBox: {
    marginLeft: 'auto',
    width: 220,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 7 },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#16a34a',
  },
  totalLabel: { fontSize: 9, color: '#6b7280' },
  totalValue: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#111827' },
  totalLabelFinal: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  totalValueFinal: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#ffffff' },

  // Footer
  footer: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerText: { fontSize: 8, color: '#9ca3af' },
  footerBrand: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#16a34a' },

  // Note box
  noteBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
  },
  noteText: { fontSize: 9, color: '#166534' },
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function fmtPrice(p: string | number) {
  return `₹${Number(p).toLocaleString('en-IN')}`
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    confirmed: '#dcfce7',
    pending:   '#fef9c3',
    completed: '#dbeafe',
    cancelled: '#fee2e2',
  }
  return map[status] ?? '#f3f4f6'
}

function statusTextColor(status: string): string {
  const map: Record<string, string> = {
    confirmed: '#166534',
    pending:   '#854d0e',
    completed: '#1e40af',
    cancelled: '#991b1b',
  }
  return map[status] ?? '#374151'
}

// ── Document ──────────────────────────────────────────────────────────────────
interface Props {
  booking: Booking
}

export function BookingInvoicePDF({ booking }: Props) {
  const start    = new Date(booking.startDate)
  const end      = new Date(booking.endDate)
  const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const priceNum = Number(booking.totalPrice)
  const perPerson = booking.numberOfTravelers > 0
    ? Math.round(priceNum / booking.numberOfTravelers)
    : priceNum

  return (
    <Document
      title={`Invoice #${booking.id} — Ghumo Phiro India`}
      author="Ghumo Phiro India"
      subject="Tour Booking Invoice"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.brand}>
            <Text style={s.brandName}>Ghumo Phiro India</Text>
            <Text style={s.brandTagline}>Explore India, One Journey at a Time</Text>
            <Text style={[s.brandTagline, { marginTop: 4 }]}>ghumophiroindia.com</Text>
          </View>
          <View style={s.invoiceMeta}>
            <Text style={s.invoiceTitle}>INVOICE</Text>
            <Text style={s.invoiceNum}>#{String(booking.id).padStart(6, '0')}</Text>
            <Text style={s.invoiceNum}>Issued: {fmt(booking.createdAt)}</Text>
            <View style={[s.statusBadge, { backgroundColor: statusColor(booking.status) }]}>
              <Text style={{ color: statusTextColor(booking.status) }}>
                {booking.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Bill To + Tour Info ── */}
        <View style={[s.row2, s.section]}>
          <View style={s.col}>
            <Text style={s.sectionTitle}>Bill To</Text>
            <View style={s.card}>
              <Text style={s.cardValue}>{booking.customerName}</Text>
              <Text style={[s.cardValueSm, { marginTop: 4 }]}>{booking.customerEmail}</Text>
              <Text style={s.cardValueSm}>{booking.customerPhone}</Text>
              {booking.customerCountry && (
                <Text style={s.cardValueSm}>{booking.customerCountry}</Text>
              )}
            </View>
          </View>
          <View style={s.col}>
            <Text style={s.sectionTitle}>Tour Details</Text>
            <View style={s.card}>
              <Text style={s.cardValue}>
                {booking.tour?.title ?? `Tour Booking #${booking.id}`}
              </Text>
              {booking.tour?.destination && (
                <Text style={[s.cardValueSm, { marginTop: 4 }]}>
                  📍 {booking.tour.destination}
                </Text>
              )}
              <Text style={[s.cardValueSm, { marginTop: 2 }]}>
                ⏱ {duration} day{duration !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Trip Dates ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Trip Schedule</Text>
          <View style={s.row2}>
            <View style={[s.card, s.col]}>
              <Text style={s.cardLabel}>Check-in Date</Text>
              <Text style={s.cardValue}>{fmt(booking.startDate)}</Text>
            </View>
            <View style={[s.card, s.col]}>
              <Text style={s.cardLabel}>Check-out Date</Text>
              <Text style={s.cardValue}>{fmt(booking.endDate)}</Text>
            </View>
            <View style={[s.card, s.col]}>
              <Text style={s.cardLabel}>Travelers</Text>
              <Text style={s.cardValue}>{booking.numberOfTravelers} person{booking.numberOfTravelers !== 1 ? 's' : ''}</Text>
            </View>
            <View style={[s.card, s.col]}>
              <Text style={s.cardLabel}>Payment Status</Text>
              <Text style={s.cardValue}>{booking.paymentStatus.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* ── Line Items ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Booking Summary</Text>
          <View style={s.table}>
            <View style={s.tableHead}>
              <Text style={[s.th, { flex: 3 }]}>Description</Text>
              <Text style={[s.th, { flex: 1, textAlign: 'right' }]}>Qty</Text>
              <Text style={[s.th, { flex: 1.5, textAlign: 'right' }]}>Unit Price</Text>
              <Text style={[s.th, { flex: 1.5, textAlign: 'right' }]}>Amount</Text>
            </View>
            <View style={s.tableRow}>
              <Text style={[s.tdBold, { flex: 3 }]}>
                {booking.tour?.title ?? `Tour Package #${booking.id}`}
              </Text>
              <Text style={[s.td, { flex: 1, textAlign: 'right' }]}>{booking.numberOfTravelers}</Text>
              <Text style={[s.td, { flex: 1.5, textAlign: 'right' }]}>{fmtPrice(perPerson)}</Text>
              <Text style={[s.tdBold, { flex: 1.5, textAlign: 'right' }]}>{fmtPrice(priceNum)}</Text>
            </View>
            {booking.specialRequests && (
              <View style={[s.tableRow, s.tableRowAlt]}>
                <Text style={[s.td, { flex: 3, color: '#6b7280', fontStyle: 'italic' }]}>
                  Note: {booking.specialRequests}
                </Text>
                <Text style={[s.td, { flex: 1 }]} />
                <Text style={[s.td, { flex: 1.5 }]} />
                <Text style={[s.td, { flex: 1.5 }]} />
              </View>
            )}
          </View>
        </View>

        {/* ── Totals ── */}
        <View style={s.totalsBox}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Subtotal</Text>
            <Text style={s.totalValue}>{fmtPrice(priceNum)}</Text>
          </View>
          <View style={[s.totalRow, { borderTopWidth: 1, borderTopColor: '#e5e7eb' }]}>
            <Text style={s.totalLabel}>Tax / GST</Text>
            <Text style={s.totalValue}>Included</Text>
          </View>
          <View style={s.totalRowFinal}>
            <Text style={s.totalLabelFinal}>Total Amount</Text>
            <Text style={s.totalValueFinal}>{fmtPrice(priceNum)}</Text>
          </View>
        </View>

        {/* ── Note ── */}
        {booking.status === 'confirmed' && (
          <View style={[s.noteBox, { marginTop: 20 }]}>
            <Text style={s.noteText}>
              ✓ Your booking is confirmed. Please carry this invoice and a valid photo ID on the day of your tour.
              For any queries, contact us at support@ghumophiroindia.com
            </Text>
          </View>
        )}

        {/* ── Footer ── */}
        <View style={s.footer}>
          <View>
            <Text style={s.footerText}>Thank you for choosing Ghumo Phiro India!</Text>
            <Text style={s.footerText}>This is a computer-generated invoice and does not require a signature.</Text>
          </View>
          <Text style={s.footerBrand}>ghumophiroindia.com</Text>
        </View>

      </Page>
    </Document>
  )
}
