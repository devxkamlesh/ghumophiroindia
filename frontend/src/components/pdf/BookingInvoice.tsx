'use client'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Booking } from '@/types'

const COMPANY = {
  name:    'Ghumo Phiro India',
  tagline: 'Explore India, One Journey at a Time',
  address: 'Jaipur, Rajasthan — 302001, India',
  gst:     'GSTIN: 08AAXCG1234X1ZX',
  phone:   '+91 98765 43210',
  email:   'support@ghumophiroindia.com',
  web:     'ghumophiroindia.com',
}

// Add-on catalogue (mirror of server pricing) for line-item breakdown
const ADDONS: Record<string, { label: string; price: number }> = {
  honeymoon: { label: 'Honeymoon Inclusion', price: 750 },
  rafting:   { label: 'River Rafting',        price: 600 },
}

const PRIMARY = '#e15515'   // brand orange (primary-600)
const PDARK   = '#943317'
const GREEN   = '#16a34a'
const DGREEN  = '#166534'
const GRAY    = '#6b7280'
const DARK    = '#111827'
const MID     = '#374151'
const LIGHT   = '#f9fafb'
const BORDER  = '#e5e7eb'

const s = StyleSheet.create({
  page:        { fontFamily: 'Helvetica', fontSize: 9, color: DARK, backgroundColor: '#fff', paddingTop: 28, paddingBottom: 56, paddingHorizontal: 32 },

  // Header band
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: PRIMARY },
  brandRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBox:     { width: 30, height: 30, borderRadius: 6, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center' },
  logoTxt:     { color: '#fff', fontSize: 13, fontFamily: 'Helvetica-Bold' },
  brandName:   { fontSize: 15, fontFamily: 'Helvetica-Bold', color: PRIMARY },
  brandSub:    { fontSize: 7.5, color: GRAY, marginTop: 1.5 },
  invoiceTitle:{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: DARK, textAlign: 'right', letterSpacing: 1 },
  invoiceNum:  { fontSize: 8, color: GRAY, textAlign: 'right', marginTop: 2 },

  pageTitle:   { fontSize: 12, fontFamily: 'Helvetica-Bold', color: DARK, marginBottom: 10 },

  bannerLabel: { fontSize: 7.5, color: GRAY },
  bannerValue: { fontSize: 9.5, fontFamily: 'Helvetica-Bold' },
  bannerRight: { alignItems: 'flex-end' },

  row2:        { flexDirection: 'row', gap: 10 },
  col:         { flex: 1 },

  secTitle:    { fontSize: 7, fontFamily: 'Helvetica-Bold', color: GRAY, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 },

  card:        { backgroundColor: LIGHT, borderRadius: 5, padding: 9, borderWidth: 1, borderColor: BORDER, marginBottom: 10 },
  cardLabel:   { fontSize: 7, color: '#9ca3af', marginBottom: 1.5 },
  cardVal:     { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: DARK },
  cardSm:      { fontSize: 8, color: MID, marginTop: 2 },

  scheduleRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  scheduleBox: { flex: 1, backgroundColor: LIGHT, borderRadius: 5, padding: 8, borderWidth: 1, borderColor: BORDER },

  table:       { borderWidth: 1, borderColor: BORDER, borderRadius: 5, overflow: 'hidden', marginBottom: 10 },
  tHead:       { flexDirection: 'row', backgroundColor: '#fdecd7', paddingHorizontal: 9, paddingVertical: 6 },
  tRow:        { flexDirection: 'row', paddingHorizontal: 9, paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  tRowAlt:     { backgroundColor: '#fafafa' },
  th:          { fontSize: 7, fontFamily: 'Helvetica-Bold', color: PDARK, textTransform: 'uppercase' },
  td:          { fontSize: 8, color: MID },
  tdB:         { fontSize: 8, fontFamily: 'Helvetica-Bold', color: DARK },

  totalsWrap:  { marginLeft: 'auto', width: 210, borderWidth: 1, borderColor: BORDER, borderRadius: 5, overflow: 'hidden', marginBottom: 12 },
  totRow:      { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 5 },
  totRowFinal: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: PRIMARY },
  totLabel:    { fontSize: 8, color: GRAY },
  totVal:      { fontSize: 8, fontFamily: 'Helvetica-Bold', color: DARK },
  totLabelF:   { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#fff' },
  totValF:     { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#fff' },

  policyBox:   { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: BORDER, borderRadius: 5, padding: 10, marginBottom: 10 },
  policyTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: MID, marginBottom: 5 },
  policyItem:  { fontSize: 7.5, color: GRAY, marginBottom: 3, lineHeight: 1.4 },

  // Fixed footer (every page)
  footer:      { position: 'absolute', bottom: 22, left: 32, right: 32, paddingTop: 8, borderTopWidth: 1, borderTopColor: BORDER },
  footerRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerNote:  { fontSize: 6.5, color: '#9ca3af', textAlign: 'center', marginTop: 4 },
  pageNo:      { fontSize: 7, color: '#9ca3af' },
})

function fmt(d: string) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) }
function fmtP(p: string | number) { return `INR ${Number(p).toLocaleString('en-IN')}` }
function cap(s?: string | null) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : '—' }

function paymentLabel(status: string, paymentStatus: string) {
  if (paymentStatus === 'paid')     return { text: 'Payment Received — Fully Paid', color: DGREEN, bg: '#f0fdf4', border: '#bbf7d0' }
  if (paymentStatus === 'refunded') return { text: 'Payment Refunded',              color: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe' }
  if (status === 'confirmed')       return { text: 'Advance Confirmed — Balance Due on Arrival', color: '#92400e', bg: '#fefce8', border: '#fde68a' }
  return                                   { text: 'Awaiting Payment Confirmation', color: '#92400e', bg: '#fefce8', border: '#fde68a' }
}

function Header({ booking }: { booking: Booking }) {
  return (
    <View style={s.header}>
      <View style={s.brandRow}>
        <View style={s.logoBox}><Text style={s.logoTxt}>G</Text></View>
        <View>
          <Text style={s.brandName}>{COMPANY.name}</Text>
          <Text style={s.brandSub}>{COMPANY.tagline}</Text>
          <Text style={[s.brandSub, { marginTop: 2 }]}>{COMPANY.address}  ·  {COMPANY.gst}</Text>
        </View>
      </View>
      <View>
        <Text style={s.invoiceTitle}>INVOICE</Text>
        <Text style={s.invoiceNum}>#{String(booking.id).padStart(6, '0')}</Text>
        <Text style={s.invoiceNum}>Issued: {fmt(booking.createdAt)}</Text>
      </View>
    </View>
  )
}

function Footer() {
  return (
    <View style={s.footer} fixed>
      <View style={s.footerRow}>
        <Text style={s.pageNo}>{COMPANY.email}  ·  {COMPANY.phone}</Text>
        <Text style={s.pageNo} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </View>
      <Text style={s.footerNote}>
        Computer-generated invoice — no physical signature required. Thank you for choosing {COMPANY.name}!
      </Text>
    </View>
  )
}

export function BookingInvoicePDF({ booking }: { booking: Booking }) {
  const start    = new Date(booking.startDate)
  const end      = new Date(booking.endDate)
  const duration = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
  const total    = Number(booking.totalPrice)
  const adults   = booking.numberOfAdults ?? booking.numberOfTravelers
  const children = booking.numberOfChildren ?? 0

  // Reconstruct charge breakdown (total already includes 5% GST)
  const gstAmt   = Math.round(total * 5 / 105)
  const subtotal = total - gstAmt
  const addonsTotal = Object.entries(booking.addons ?? {})
    .reduce((sum, [k, q]) => sum + (ADDONS[k]?.price ?? 0) * (q || 0), 0)
  const roomCharge = Math.max(0, subtotal - addonsTotal)
  const perPax   = booking.numberOfTravelers > 0 ? Math.round(total / booking.numberOfTravelers) : total
  const payment  = paymentLabel(booking.status, booking.paymentStatus)
  const addonEntries = Object.entries(booking.addons ?? {}).filter(([, q]) => q > 0)

  return (
    <Document title={`Invoice #${booking.id} — ${COMPANY.name}`} author={COMPANY.name} subject="Tour Booking Invoice">

      {/* ════════════ PAGE 1 — Invoice ════════════ */}
      <Page size="A4" style={s.page}>
        <Header booking={booking} />

        {/* Payment status banner */}
        <View style={{ backgroundColor: payment.bg, borderWidth: 1, borderColor: payment.border, borderRadius: 6, paddingHorizontal: 11, paddingVertical: 8, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={[s.bannerLabel, { marginBottom: 2 }]}>Payment Status</Text>
            <Text style={[s.bannerValue, { color: payment.color }]}>{payment.text}</Text>
          </View>
          <View style={s.bannerRight}>
            <Text style={[s.bannerLabel, { marginBottom: 2 }]}>Booking Status</Text>
            <Text style={[s.bannerValue, { color: booking.status === 'confirmed' || booking.status === 'completed' ? DGREEN : '#92400e' }]}>{cap(booking.status)}</Text>
          </View>
        </View>

        {/* Bill To + Tour */}
        <View style={s.row2}>
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
              {booking.departureCity && <Text style={s.cardSm}>Departure: {booking.departureCity}</Text>}
              <Text style={s.cardSm}>Duration: {duration} day{duration !== 1 ? 's' : ''}</Text>
              <Text style={s.cardSm}>Travelers: {adults} adult{adults !== 1 ? 's' : ''}{children ? ` · ${children} child${children !== 1 ? 'ren' : ''}` : ''}</Text>
            </View>
          </View>
        </View>

        {/* Schedule */}
        <Text style={s.secTitle}>Trip Schedule</Text>
        <View style={s.scheduleRow}>
          {[
            { label: 'Check-in',   value: fmt(booking.startDate) },
            { label: 'Check-out',  value: fmt(booking.endDate) },
            { label: 'Duration',   value: `${duration} days` },
            { label: 'Rooms',      value: booking.roomsCount ? `${booking.roomsCount}` : '—' },
          ].map(({ label, value }) => (
            <View key={label} style={s.scheduleBox}>
              <Text style={s.cardLabel}>{label}</Text>
              <Text style={s.cardVal}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Line items */}
        <Text style={s.secTitle}>Booking Summary</Text>
        <View style={s.table}>
          <View style={s.tHead}>
            <Text style={[s.th, { flex: 3 }]}>Description</Text>
            <Text style={[s.th, { flex: 1, textAlign: 'right' }]}>Qty</Text>
            <Text style={[s.th, { flex: 1.5, textAlign: 'right' }]}>Rate</Text>
            <Text style={[s.th, { flex: 1.5, textAlign: 'right' }]}>Amount</Text>
          </View>
          <View style={s.tRow}>
            <Text style={[s.tdB, { flex: 3 }]}>{booking.tour?.title ?? `Tour Package #${booking.id}`}</Text>
            <Text style={[s.td,  { flex: 1, textAlign: 'right' }]}>{booking.numberOfTravelers}</Text>
            <Text style={[s.td,  { flex: 1.5, textAlign: 'right' }]}>{fmtP(perPax)}</Text>
            <Text style={[s.tdB, { flex: 1.5, textAlign: 'right' }]}>{fmtP(roomCharge)}</Text>
          </View>
          {addonEntries.map(([k, q], i) => (
            <View key={k} style={[s.tRow, i % 2 === 0 ? s.tRowAlt : {}]}>
              <Text style={[s.td, { flex: 3 }]}>{ADDONS[k]?.label ?? k} (add-on)</Text>
              <Text style={[s.td, { flex: 1, textAlign: 'right' }]}>{q}</Text>
              <Text style={[s.td, { flex: 1.5, textAlign: 'right' }]}>{fmtP(ADDONS[k]?.price ?? 0)}</Text>
              <Text style={[s.tdB, { flex: 1.5, textAlign: 'right' }]}>{fmtP((ADDONS[k]?.price ?? 0) * q)}</Text>
            </View>
          ))}
          {booking.specialRequests && (
            <View style={[s.tRow, s.tRowAlt]}>
              <Text style={[s.td, { flex: 7, color: GRAY }]}>Note: {booking.specialRequests}</Text>
            </View>
          )}
        </View>

        {/* Totals */}
        <View style={s.totalsWrap}>
          <View style={s.totRow}>
            <Text style={s.totLabel}>Room / Package Charge</Text>
            <Text style={s.totVal}>{fmtP(roomCharge)}</Text>
          </View>
          {addonsTotal > 0 && (
            <View style={[s.totRow, { borderTopWidth: 1, borderTopColor: BORDER }]}>
              <Text style={s.totLabel}>Add-ons</Text>
              <Text style={s.totVal}>{fmtP(addonsTotal)}</Text>
            </View>
          )}
          <View style={[s.totRow, { borderTopWidth: 1, borderTopColor: BORDER }]}>
            <Text style={s.totLabel}>GST @ 5% (included)</Text>
            <Text style={s.totVal}>{fmtP(gstAmt)}</Text>
          </View>
          <View style={s.totRowFinal}>
            <Text style={s.totLabelF}>Total Amount</Text>
            <Text style={s.totValF}>{fmtP(total)}</Text>
          </View>
        </View>

        {(booking.status === 'confirmed' || booking.status === 'completed') && (
          <View style={{ backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 5, padding: 9 }}>
            <Text style={{ fontSize: 8, color: DGREEN }}>
              Your booking is confirmed. Please carry this invoice and a valid government-issued photo ID on the day of your tour.
            </Text>
          </View>
        )}

        <Footer />
      </Page>

      {/* ════════════ PAGE 2 — Travellers, preferences & terms ════════════ */}
      <Page size="A4" style={s.page}>
        <Header booking={booking} />
        <Text style={s.pageTitle}>Traveller & Trip Details</Text>

        {/* Trip preferences */}
        <Text style={s.secTitle}>Trip Preferences</Text>
        <View style={s.scheduleRow}>
          {[
            { label: 'Departure From', value: booking.departureCity ?? '—' },
            { label: 'Rooms',          value: booking.roomsCount ? `${booking.roomsCount}` : '—' },
            { label: 'Going',          value: cap(booking.travelGoing) },
            { label: 'Return',         value: cap(booking.travelReturn) },
          ].map(({ label, value }) => (
            <View key={label} style={s.scheduleBox}>
              <Text style={s.cardLabel}>{label}</Text>
              <Text style={s.cardVal}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Passengers */}
        <Text style={s.secTitle}>Passengers</Text>
        {booking.passengers && booking.passengers.length > 0 ? (
          <View style={s.table}>
            <View style={s.tHead}>
              <Text style={[s.th, { flex: 0.6 }]}>#</Text>
              <Text style={[s.th, { flex: 3 }]}>Name</Text>
              <Text style={[s.th, { flex: 1.4 }]}>Type</Text>
              <Text style={[s.th, { flex: 1.4 }]}>Gender</Text>
              <Text style={[s.th, { flex: 1 }]}>Age</Text>
              <Text style={[s.th, { flex: 2 }]}>Mobile</Text>
            </View>
            {booking.passengers.map((p, i) => (
              <View key={i} style={[s.tRow, i % 2 === 1 ? s.tRowAlt : {}]}>
                <Text style={[s.td, { flex: 0.6 }]}>{i + 1}</Text>
                <Text style={[s.tdB, { flex: 3 }]}>{p.name || '—'}</Text>
                <Text style={[s.td, { flex: 1.4 }]}>{cap(p.type)}</Text>
                <Text style={[s.td, { flex: 1.4 }]}>{p.gender || '—'}</Text>
                <Text style={[s.td, { flex: 1 }]}>{p.age || '—'}</Text>
                <Text style={[s.td, { flex: 2 }]}>{p.mobile || '—'}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={s.card}><Text style={s.cardSm}>Passenger details not provided.</Text></View>
        )}

        {/* Cancellation policy */}
        <View style={s.policyBox}>
          <Text style={s.policyTitle}>Cancellation & Refund Policy</Text>
          <Text style={s.policyItem}>• Registration charges are non-refundable and non-transferable.</Text>
          <Text style={s.policyItem}>• 30+ days before departure: 25% of package amount charged.</Text>
          <Text style={s.policyItem}>• 15–30 days before departure: 50% of package amount charged.</Text>
          <Text style={s.policyItem}>• Within 7 days of departure: 100% charged (no refund).</Text>
          <Text style={s.policyItem}>• Refunds (where applicable) are processed within 5–7 business days.</Text>
        </View>

        {/* Terms */}
        <View style={s.policyBox}>
          <Text style={s.policyTitle}>Important Terms & Conditions</Text>
          <Text style={s.policyItem}>• Full payment must be completed at least 7 days before the trip begins.</Text>
          <Text style={s.policyItem}>• Standard hotel check-in is 11 AM; early check-in is subject to availability.</Text>
          <Text style={s.policyItem}>• Package rates may change due to Force Majeure, government restrictions, or seasonal surcharges.</Text>
          <Text style={s.policyItem}>• The company may reschedule the itinerary due to unavoidable circumstances.</Text>
          <Text style={s.policyItem}>• Travellers are responsible for their belongings and valid travel documents.</Text>
          <Text style={s.policyItem}>• COVID and local safety guidelines must be followed throughout the tour.</Text>
        </View>

        <Footer />
      </Page>
    </Document>
  )
}
