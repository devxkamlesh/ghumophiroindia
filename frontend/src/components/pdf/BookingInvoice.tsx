'use client'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Booking } from '@/types'

const COMPANY = {
  name:    'Ghumo Phiro India',
  tagline: 'Explore India, One Journey at a Time',
  address: 'Jaipur, Rajasthan — 302001, India',
  gst:     'GST: 08XXXXX1234X1ZX',
  phone:   '+91 98765 43210',
  email:   'support@ghumophiroindia.com',
  web:     'ghumophiroindia.com',
}

const GREEN  = '#16a34a'
const DGREEN = '#166534'
const GRAY   = '#6b7280'
const DARK   = '#111827'
const MID    = '#374151'
const LIGHT  = '#f9fafb'
const BORDER = '#e5e7eb'

const s = StyleSheet.create({
  page:        { fontFamily: 'Helvetica', fontSize: 9, color: DARK, backgroundColor: '#fff', padding: 30 },

  // Header
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: GREEN },
  brandName:   { fontSize: 16, fontFamily: 'Helvetica-Bold', color: GREEN },
  brandSub:    { fontSize: 7.5, color: GRAY, marginTop: 1.5 },
  invoiceTitle:{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: DARK, textAlign: 'right' },
  invoiceNum:  { fontSize: 8, color: GRAY, textAlign: 'right', marginTop: 1.5 },

  // Payment status banner
  paidBanner:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 7, marginBottom: 12 },
  pendingBanner:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fefce8', borderWidth: 1, borderColor: '#fde68a', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 7, marginBottom: 12 },
  bannerLabel: { fontSize: 7.5, color: GRAY },
  bannerValue: { fontSize: 9.5, fontFamily: 'Helvetica-Bold' },
  bannerRight: { alignItems: 'flex-end' },

  // 2-col
  row2:        { flexDirection: 'row', gap: 10 },
  col:         { flex: 1 },

  // Section
  secTitle:    { fontSize: 7, fontFamily: 'Helvetica-Bold', color: GRAY, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 },

  // Card
  card:        { backgroundColor: LIGHT, borderRadius: 4, padding: 8, borderWidth: 1, borderColor: BORDER, marginBottom: 10 },
  cardLabel:   { fontSize: 7, color: '#9ca3af', marginBottom: 1.5 },
  cardVal:     { fontSize: 9, fontFamily: 'Helvetica-Bold', color: DARK },
  cardSm:      { fontSize: 8, color: MID, marginTop: 1.5 },

  // 4-col schedule
  scheduleRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  scheduleBox: { flex: 1, backgroundColor: LIGHT, borderRadius: 4, padding: 7, borderWidth: 1, borderColor: BORDER },

  // Table
  table:       { borderWidth: 1, borderColor: BORDER, borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  tHead:       { flexDirection: 'row', backgroundColor: '#f3f4f6', paddingHorizontal: 9, paddingVertical: 5 },
  tRow:        { flexDirection: 'row', paddingHorizontal: 9, paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  tRowAlt:     { backgroundColor: '#fafafa' },
  th:          { fontSize: 7, fontFamily: 'Helvetica-Bold', color: GRAY, textTransform: 'uppercase' },
  td:          { fontSize: 8, color: MID },
  tdB:         { fontSize: 8, fontFamily: 'Helvetica-Bold', color: DARK },

  // Totals
  totalsWrap:  { marginLeft: 'auto', width: 190, borderWidth: 1, borderColor: BORDER, borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  totRow:      { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 9, paddingVertical: 5 },
  totRowFinal: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 9, paddingVertical: 7, backgroundColor: GREEN },
  totLabel:    { fontSize: 8, color: GRAY },
  totVal:      { fontSize: 8, fontFamily: 'Helvetica-Bold', color: DARK },
  totLabelF:   { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#fff' },
  totValF:     { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#fff' },

  // Policy box
  policyBox:   { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: BORDER, borderRadius: 4, padding: 8, marginBottom: 10 },
  policyTitle: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: MID, marginBottom: 4 },
  policyItem:  { fontSize: 7, color: GRAY, marginBottom: 2 },

  // Footer
  footer:      { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: BORDER },
  footerRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  footerLabel: { fontSize: 7, color: GRAY },
  footerBrand: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: GREEN },
  footerNote:  { fontSize: 6.5, color: '#9ca3af', marginTop: 6, textAlign: 'center' },
})

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}
function fmtP(p: string | number) {
  return `INR ${Number(p).toLocaleString('en-IN')}`
}

function paymentLabel(status: string, paymentStatus: string): { text: string; color: string; bg: string; border: string } {
  if (paymentStatus === 'paid')     return { text: '✓ Payment Received — Fully Paid', color: DGREEN, bg: '#f0fdf4', border: '#bbf7d0' }
  if (paymentStatus === 'refunded') return { text: '↩ Payment Refunded',              color: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe' }
  if (status === 'confirmed')       return { text: '⏳ Advance Confirmed — Balance Due on Arrival', color: '#92400e', bg: '#fefce8', border: '#fde68a' }
  return                                   { text: '⏳ Awaiting Payment Confirmation', color: '#92400e', bg: '#fefce8', border: '#fde68a' }
}

export function BookingInvoicePDF({ booking }: { booking: Booking }) {
  const start    = new Date(booking.startDate)
  const end      = new Date(booking.endDate)
  const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const total    = Number(booking.totalPrice)
  const perPax   = booking.numberOfTravelers > 0 ? Math.round(total / booking.numberOfTravelers) : total
  const gstAmt   = Math.round(total * 5 / 105) // 5% GST included
  const base     = total - gstAmt
  const payment  = paymentLabel(booking.status, booking.paymentStatus)

  return (
    <Document title={`Invoice #${booking.id} — ${COMPANY.name}`} author={COMPANY.name} subject="Tour Booking Invoice">
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={s.brandName}>{COMPANY.name}</Text>
            <Text style={s.brandSub}>{COMPANY.tagline}</Text>
            <Text style={[s.brandSub, { marginTop: 3 }]}>{COMPANY.address}</Text>
            <Text style={[s.brandSub, { marginTop: 1 }]}>{COMPANY.gst}</Text>
            <Text style={[s.brandSub, { marginTop: 1 }]}>{COMPANY.phone}  |  {COMPANY.email}</Text>
          </View>
          <View>
            <Text style={s.invoiceTitle}>INVOICE</Text>
            <Text style={s.invoiceNum}>#{String(booking.id).padStart(6, '0')}</Text>
            <Text style={s.invoiceNum}>Issued: {fmt(booking.createdAt)}</Text>
            <Text style={[s.invoiceNum, { marginTop: 4, fontFamily: 'Helvetica-Bold', color: booking.status === 'confirmed' ? DGREEN : '#92400e' }]}>
              Booking: {booking.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* ── Payment status banner ── */}
        <View style={{ backgroundColor: payment.bg, borderWidth: 1, borderColor: payment.border, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 7, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={[s.bannerLabel, { marginBottom: 2 }]}>Payment Status</Text>
            <Text style={[s.bannerValue, { color: payment.color }]}>{payment.text}</Text>
          </View>
          <View style={s.bannerRight}>
            <Text style={[s.bannerLabel, { marginBottom: 2 }]}>Booking ID</Text>
            <Text style={[s.bannerValue, { color: DARK }]}>#{String(booking.id).padStart(6, '0')} ✓ Verified</Text>
          </View>
        </View>

        {/* ── Bill To + Tour ── */}
        <View style={[s.row2, { marginBottom: 0 }]}>
          <View style={s.col}>
            <Text style={s.secTitle}>Bill To</Text>
            <View style={s.card}>
              <Text style={s.cardVal}>{booking.customerName}</Text>
              <Text style={s.cardSm}>{booking.customerEmail}</Text>
              <Text style={s.cardSm}>{booking.customerPhone}</Text>
              {booking.customerCountry && <Text style={s.cardSm}>{booking.customerCountry}</Text>}
            </View>
          </View>
          <View style={s.col}>
            <Text style={s.secTitle}>Tour Package</Text>
            <View style={s.card}>
              <Text style={s.cardVal}>{booking.tour?.title ?? `Tour #${booking.tourId}`}</Text>
              {booking.tour?.destination && <Text style={s.cardSm}>Location: {booking.tour.destination}</Text>}
              <Text style={s.cardSm}>Duration: {duration} day{duration !== 1 ? 's' : ''}</Text>
              <Text style={s.cardSm}>Travelers: {booking.numberOfTravelers} person{booking.numberOfTravelers !== 1 ? 's' : ''}</Text>
            </View>
          </View>
        </View>

        {/* ── Schedule ── */}
        <Text style={s.secTitle}>Trip Schedule</Text>
        <View style={s.scheduleRow}>
          {[
            { label: 'Check-in',       value: fmt(booking.startDate) },
            { label: 'Check-out',      value: fmt(booking.endDate) },
            { label: 'Duration',       value: `${duration} days` },
            { label: 'Group Size',     value: `${booking.numberOfTravelers} person${booking.numberOfTravelers !== 1 ? 's' : ''}` },
          ].map(({ label, value }) => (
            <View key={label} style={s.scheduleBox}>
              <Text style={s.cardLabel}>{label}</Text>
              <Text style={s.cardVal}>{value}</Text>
            </View>
          ))}
        </View>

        {/* ── Line items ── */}
        <Text style={s.secTitle}>Booking Summary</Text>
        <View style={s.table}>
          <View style={s.tHead}>
            <Text style={[s.th, { flex: 3 }]}>Description</Text>
            <Text style={[s.th, { flex: 1, textAlign: 'right' }]}>Qty</Text>
            <Text style={[s.th, { flex: 1.5, textAlign: 'right' }]}>Unit Price</Text>
            <Text style={[s.th, { flex: 1.5, textAlign: 'right' }]}>Amount</Text>
          </View>
          <View style={s.tRow}>
            <Text style={[s.tdB, { flex: 3 }]}>{booking.tour?.title ?? `Tour Package #${booking.id}`}</Text>
            <Text style={[s.td,  { flex: 1, textAlign: 'right' }]}>{booking.numberOfTravelers}</Text>
            <Text style={[s.td,  { flex: 1.5, textAlign: 'right' }]}>{fmtP(perPax)}</Text>
            <Text style={[s.tdB, { flex: 1.5, textAlign: 'right' }]}>{fmtP(total)}</Text>
          </View>
          {booking.specialRequests && (
            <View style={[s.tRow, s.tRowAlt]}>
              <Text style={[s.td, { flex: 7, color: GRAY }]}>Note: {booking.specialRequests}</Text>
            </View>
          )}
        </View>

        {/* ── Totals ── */}
        <View style={s.totalsWrap}>
          <View style={s.totRow}>
            <Text style={s.totLabel}>Base Fare</Text>
            <Text style={s.totVal}>{fmtP(base)}</Text>
          </View>
          <View style={[s.totRow, { borderTopWidth: 1, borderTopColor: BORDER }]}>
            <Text style={s.totLabel}>GST @ 5% (included)</Text>
            <Text style={s.totVal}>{fmtP(gstAmt)}</Text>
          </View>
          <View style={s.totRowFinal}>
            <Text style={s.totLabelF}>Total Amount</Text>
            <Text style={s.totValF}>{fmtP(total)}</Text>
          </View>
        </View>

        {/* ── Cancellation policy ── */}
        <View style={s.policyBox}>
          <Text style={s.policyTitle}>Cancellation & Refund Policy</Text>
          <Text style={s.policyItem}>• Free cancellation up to 48 hours before the tour start date.</Text>
          <Text style={s.policyItem}>• 50% refund for cancellations between 24–48 hours before start.</Text>
          <Text style={s.policyItem}>• No refund for cancellations within 24 hours of start.</Text>
          <Text style={s.policyItem}>• Refunds processed within 5–7 business days.</Text>
        </View>

        {/* ── Confirmation note ── */}
        {(booking.status === 'confirmed' || booking.status === 'completed') && (
          <View style={{ backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 4, padding: 8, marginBottom: 10 }}>
            <Text style={{ fontSize: 8, color: DGREEN }}>
              ✓ Your booking is confirmed. Please carry this invoice and a valid government-issued photo ID on the day of your tour.
            </Text>
          </View>
        )}

        {/* ── Footer ── */}
        <View style={s.footer}>
          <View style={s.footerRow}>
            <View>
              <Text style={s.footerBrand}>{COMPANY.name}</Text>
              <Text style={s.footerLabel}>{COMPANY.address}</Text>
              <Text style={s.footerLabel}>{COMPANY.gst}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.footerLabel}>Support: {COMPANY.phone}</Text>
              <Text style={s.footerLabel}>{COMPANY.email}</Text>
              <Text style={s.footerLabel}>{COMPANY.web}</Text>
            </View>
          </View>
          <Text style={s.footerNote}>
            This is a computer-generated invoice and does not require a physical signature. Thank you for choosing {COMPANY.name}!
          </Text>
        </View>

      </Page>
    </Document>
  )
}
