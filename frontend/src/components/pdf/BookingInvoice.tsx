'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import type { Booking } from '@/types'

const COMPANY = {
  name:    'Ghumo Firo Holidays',
  tagline: 'Explore India, One Journey at a Time',
  address: 'Jaipur, Rajasthan — 302001, India',
  gst:     'GSTIN: 08AAXCG1234X1ZX',
  phone:   '+91 98765 43210',
  email:   'support@ghumofiroindia.com',
  web:     'ghumofiroindia.com',
}

const ADDONS: Record<string, { label: string; price: number }> = {
  honeymoon: { label: 'Honeymoon Inclusion', price: 750 },
  rafting:   { label: 'River Rafting',        price: 600 },
}

// ── Palette ───────────────────────────────────────────────────────────────────
const ORANGE = '#f97316'
const ODARK  = '#c2410c'
const NAVY   = '#0f172a'
const NAVY2  = '#1e293b'
const GREEN  = '#16a34a'
const DGREEN = '#166534'
const GRAY   = '#64748b'
const DARK   = '#0f172a'
const MID    = '#334155'
const LIGHT  = '#f8fafc'
const BORDER = '#e2e8f0'
const WHITE  = '#ffffff'

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, color: DARK, backgroundColor: WHITE, paddingBottom: 60 },

  // Left accent stripe down the page
  stripe: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 6, backgroundColor: ORANGE },

  body: { paddingTop: 26, paddingHorizontal: 34 },

  // ── Header ──
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  logo: { width: 132, height: 40, objectFit: 'contain' },
  logoBox: { width: 34, height: 34, borderRadius: 8, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  logoTxt: { color: WHITE, fontSize: 15, fontFamily: 'Helvetica-Bold' },
  brandName: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: NAVY },
  brandSub: { fontSize: 7, color: GRAY, marginTop: 1.5 },

  // Invoice meta panel (dark)
  metaPanel: { backgroundColor: NAVY, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14, minWidth: 168 },
  metaTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: WHITE, letterSpacing: 3 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, gap: 14 },
  metaLabel: { fontSize: 7, color: '#94a3b8' },
  metaVal: { fontSize: 8, color: WHITE, fontFamily: 'Helvetica-Bold' },

  // ── Boarding-pass trip strip ──
  pass: { flexDirection: 'row', borderWidth: 1, borderColor: BORDER, borderRadius: 10, overflow: 'hidden', marginBottom: 16 },
  passMain: { flex: 1, backgroundColor: NAVY, padding: 12 },
  passKicker: { fontSize: 6.5, color: ORANGE, letterSpacing: 2, fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  routeCity: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: WHITE },
  routeArrow: { fontSize: 11, color: ORANGE },
  routeSub: { fontSize: 7, color: '#94a3b8', marginTop: 2 },
  passTourName: { fontSize: 8.5, color: '#cbd5e1', marginTop: 8 },
  passStub: { width: 150, backgroundColor: NAVY2, padding: 12, borderLeftWidth: 1, borderLeftColor: '#334155', borderStyle: 'dashed' },
  stubRow: { marginBottom: 6 },
  stubLabel: { fontSize: 6.5, color: '#94a3b8', letterSpacing: 1 },
  stubVal: { fontSize: 9, color: WHITE, fontFamily: 'Helvetica-Bold', marginTop: 1 },

  // ── Section title ──
  secTitle: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: GRAY, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 },

  row2: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  col: { flex: 1 },

  card: { backgroundColor: LIGHT, borderRadius: 7, padding: 11, borderWidth: 1, borderColor: BORDER },
  cardVal: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: DARK },
  cardSm: { fontSize: 8, color: MID, marginTop: 2.5 },

  // ── Amount hero ──
  amountHero: { flexDirection: 'row', borderRadius: 8, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: BORDER },
  amountLeft: { flex: 1, padding: 12 },
  amountRight: { width: 168, backgroundColor: ORANGE, padding: 12, justifyContent: 'center' },
  amountLabel: { fontSize: 7, color: '#fff', opacity: 0.85, letterSpacing: 1, textTransform: 'uppercase' },
  amountBig: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: WHITE, marginTop: 2 },
  statusPill: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginTop: 4 },
  statusPillTxt: { fontSize: 8.5, fontFamily: 'Helvetica-Bold' },

  // ── Table ──
  table: { borderWidth: 1, borderColor: BORDER, borderRadius: 7, overflow: 'hidden', marginBottom: 12 },
  tHead: { flexDirection: 'row', backgroundColor: NAVY, paddingHorizontal: 11, paddingVertical: 7 },
  tRow: { flexDirection: 'row', paddingHorizontal: 11, paddingVertical: 7, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  tRowAlt: { backgroundColor: '#fafbfc' },
  th: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: WHITE, textTransform: 'uppercase', letterSpacing: 0.5 },
  td: { fontSize: 8.5, color: MID },
  tdB: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: DARK },

  // ── Totals ──
  totalsWrap: { marginLeft: 'auto', width: 230, borderWidth: 1, borderColor: BORDER, borderRadius: 7, overflow: 'hidden', marginBottom: 14 },
  totRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 6 },
  totRowFinal: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 9, backgroundColor: NAVY },
  totLabel: { fontSize: 8, color: GRAY },
  totVal: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: DARK },
  totLabelF: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: WHITE },
  totValF: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: ORANGE },

  noteBox: { borderRadius: 7, padding: 10, borderWidth: 1 },

  pageTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 12 },

  scheduleRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  scheduleBox: { flex: 1, backgroundColor: LIGHT, borderRadius: 7, padding: 9, borderWidth: 1, borderColor: BORDER },
  cardLabel: { fontSize: 6.5, color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase' },

  policyBox: { backgroundColor: LIGHT, borderWidth: 1, borderColor: BORDER, borderRadius: 7, padding: 11, marginBottom: 10 },
  policyTitle: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: MID, marginBottom: 6 },
  policyItem: { fontSize: 7.5, color: GRAY, marginBottom: 3.5, lineHeight: 1.4 },

  // ── Footer ──
  footer: { position: 'absolute', bottom: 22, left: 34, right: 34, paddingTop: 8, borderTopWidth: 1, borderTopColor: BORDER },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerTxt: { fontSize: 7, color: '#94a3b8' },
  footerNote: { fontSize: 6.5, color: '#94a3b8', textAlign: 'center', marginTop: 4 },
})

function fmt(d: string) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
function fmtP(p: string | number) { return `INR ${Number(p).toLocaleString('en-IN')}` }
function cap(v?: string | null) { return v ? v.charAt(0).toUpperCase() + v.slice(1) : '—' }
function invoiceNo(booking: Booking) {
  const yr = new Date(booking.createdAt).getFullYear()
  return `GPI-${yr}-${String(booking.id).padStart(5, '0')}`
}

function paymentLabel(status: string, paymentStatus: string) {
  if (paymentStatus === 'paid')     return { text: 'PAID',     color: DGREEN,   bg: '#dcfce7', border: '#86efac' }
  if (paymentStatus === 'refunded') return { text: 'REFUNDED', color: '#6d28d9', bg: '#ede9fe', border: '#c4b5fd' }
  if (status === 'confirmed')       return { text: 'ADVANCE PAID', color: ODARK, bg: '#ffedd5', border: '#fdba74' }
  return                                   { text: 'UNPAID',   color: ODARK,    bg: '#ffedd5', border: '#fdba74' }
}

function Header({ booking }: { booking: Booking }) {
  return (
    <View style={s.header}>
      <View style={{ maxWidth: 260 }}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image src="/images/ghumofirologo.png" style={s.logo} />
        <Text style={[s.brandSub, { marginTop: 4 }]}>{COMPANY.tagline}</Text>
        <Text style={[s.brandSub, { marginTop: 2 }]}>{COMPANY.address}</Text>
        <Text style={s.brandSub}>{COMPANY.gst}</Text>
      </View>
      <View style={s.metaPanel}>
        <Text style={s.metaTitle}>INVOICE</Text>
        <View style={s.metaRow}>
          <Text style={s.metaLabel}>Invoice No.</Text>
          <Text style={s.metaVal}>{invoiceNo(booking)}</Text>
        </View>
        <View style={s.metaRow}>
          <Text style={s.metaLabel}>Issued</Text>
          <Text style={s.metaVal}>{fmt(booking.createdAt)}</Text>
        </View>
        <View style={s.metaRow}>
          <Text style={s.metaLabel}>Booking ID</Text>
          <Text style={s.metaVal}>#{String(booking.id).padStart(6, '0')}</Text>
        </View>
      </View>
    </View>
  )
}

function PageFooter() {
  return (
    <View style={s.footer} fixed>
      <View style={s.footerRow}>
        <Text style={s.footerTxt}>{COMPANY.email}  ·  {COMPANY.phone}  ·  {COMPANY.web}</Text>
        <Text style={s.footerTxt} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
      </View>
      <Text style={s.footerNote}>
        Computer-generated invoice — no physical signature required. Thank you for travelling with {COMPANY.name}!
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

  const gstAmt   = Math.round(total * 5 / 105)
  const subtotal = total - gstAmt
  const addonsTotal = Object.entries(booking.addons ?? {})
    .reduce((sum, [k, q]) => sum + (ADDONS[k]?.price ?? 0) * (q || 0), 0)
  const roomCharge = Math.max(0, subtotal - addonsTotal)
  const perPax   = booking.numberOfTravelers > 0 ? Math.round(total / booking.numberOfTravelers) : total
  const payment  = paymentLabel(booking.status, booking.paymentStatus)
  const isPaid   = booking.paymentStatus === 'paid'
  const addonEntries = Object.entries(booking.addons ?? {}).filter(([, q]) => q > 0)

  const fromCity = booking.departureCity || 'India'
  const toCity   = booking.tour?.destination || booking.tour?.title || 'Destination'

  return (
    <Document title={`Invoice ${invoiceNo(booking)} — ${COMPANY.name}`} author={COMPANY.name} subject="Tour Booking Invoice">

      {/* ════════════ PAGE 1 ════════════ */}
      <Page size="A4" style={s.page}>
        <View style={s.stripe} fixed />
        <View style={s.body}>
          <Header booking={booking} />

          {/* Boarding-pass trip strip */}
          <View style={s.pass}>
            <View style={s.passMain}>
              <Text style={s.passKicker}>YOUR JOURNEY</Text>
              <View style={s.routeRow}>
                <Text style={s.routeCity}>{fromCity}</Text>
                <Text style={s.routeArrow}>{'------>'}</Text>
                <Text style={s.routeCity}>{toCity}</Text>
              </View>
              <Text style={s.passTourName}>{booking.tour?.title ?? `Tour Package #${booking.tourId}`}</Text>
            </View>
            <View style={s.passStub}>
              <View style={s.stubRow}>
                <Text style={s.stubLabel}>DEPART</Text>
                <Text style={s.stubVal}>{fmt(booking.startDate)}</Text>
              </View>
              <View style={s.stubRow}>
                <Text style={s.stubLabel}>RETURN</Text>
                <Text style={s.stubVal}>{fmt(booking.endDate)}</Text>
              </View>
              <View style={[s.stubRow, { marginBottom: 0 }]}>
                <Text style={s.stubLabel}>TRAVELLERS · DAYS</Text>
                <Text style={s.stubVal}>{booking.numberOfTravelers} pax · {duration}D</Text>
              </View>
            </View>
          </View>

          {/* Bill To + Tour details */}
          <View style={s.row2}>
            <View style={s.col}>
              <Text style={s.secTitle}>Billed To</Text>
              <View style={s.card}>
                <Text style={s.cardVal}>{booking.customerName}</Text>
                <Text style={s.cardSm}>{booking.customerEmail}</Text>
                <Text style={s.cardSm}>{booking.customerPhone}</Text>
                {booking.customerCountry && <Text style={s.cardSm}>{booking.customerCountry}</Text>}
              </View>
            </View>
            <View style={s.col}>
              <Text style={s.secTitle}>Trip Overview</Text>
              <View style={s.card}>
                <Text style={s.cardVal}>{booking.tour?.title ?? `Tour #${booking.tourId}`}</Text>
                <Text style={s.cardSm}>Duration: {duration} day{duration !== 1 ? 's' : ''}</Text>
                <Text style={s.cardSm}>
                  Travelers: {adults} adult{adults !== 1 ? 's' : ''}{children ? ` · ${children} child${children !== 1 ? 'ren' : ''}` : ''}
                </Text>
                {booking.roomsCount ? <Text style={s.cardSm}>Rooms: {booking.roomsCount}</Text> : null}
              </View>
            </View>
          </View>

          {/* Amount hero */}
          <View style={s.amountHero}>
            <View style={s.amountLeft}>
              <Text style={s.secTitle}>Payment Status</Text>
              <View style={[s.statusPill, { backgroundColor: payment.bg, borderWidth: 1, borderColor: payment.border }]}>
                <Text style={[s.statusPillTxt, { color: payment.color }]}>{payment.text}</Text>
              </View>
              <Text style={[s.cardSm, { marginTop: 8 }]}>
                Booking status: {cap(booking.status)}
              </Text>
            </View>
            <View style={s.amountRight}>
              <Text style={s.amountLabel}>{isPaid ? 'Amount Paid' : 'Amount Due'}</Text>
              <Text style={s.amountBig}>{fmtP(total)}</Text>
            </View>
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
              <Text style={[s.td, { flex: 1, textAlign: 'right' }]}>{booking.numberOfTravelers}</Text>
              <Text style={[s.td, { flex: 1.5, textAlign: 'right' }]}>{fmtP(perPax)}</Text>
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
            {booking.specialRequests ? (
              <View style={[s.tRow, s.tRowAlt]}>
                <Text style={[s.td, { flex: 7, color: GRAY }]}>Note: {booking.specialRequests}</Text>
              </View>
            ) : null}
          </View>

          {/* Totals */}
          <View style={s.totalsWrap}>
            <View style={s.totRow}>
              <Text style={s.totLabel}>Package Charge</Text>
              <Text style={s.totVal}>{fmtP(roomCharge)}</Text>
            </View>
            {addonsTotal > 0 && (
              <View style={[s.totRow, { borderTopWidth: 1, borderTopColor: BORDER }]}>
                <Text style={s.totLabel}>Add-ons</Text>
                <Text style={s.totVal}>{fmtP(addonsTotal)}</Text>
              </View>
            )}
            <View style={[s.totRow, { borderTopWidth: 1, borderTopColor: BORDER }]}>
              <Text style={s.totLabel}>GST @ 5% (incl.)</Text>
              <Text style={s.totVal}>{fmtP(gstAmt)}</Text>
            </View>
            <View style={s.totRowFinal}>
              <Text style={s.totLabelF}>Grand Total</Text>
              <Text style={s.totValF}>{fmtP(total)}</Text>
            </View>
          </View>

          {/* Confirmation / due note */}
          {(booking.status === 'confirmed' || booking.status === 'completed') ? (
            <View style={[s.noteBox, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
              <Text style={{ fontSize: 8, color: DGREEN }}>
                Your booking is confirmed. Please carry this invoice and a valid government-issued photo ID on the day of your tour.
              </Text>
            </View>
          ) : (
            <View style={[s.noteBox, { backgroundColor: '#fff7ed', borderColor: '#fed7aa' }]}>
              <Text style={{ fontSize: 8, color: ODARK }}>
                Please complete the payment to confirm your booking. Our team will reach out with payment details shortly.
              </Text>
            </View>
          )}
        </View>

        <PageFooter />
      </Page>

      {/* ════════════ PAGE 2 ════════════ */}
      <Page size="A4" style={s.page}>
        <View style={s.stripe} fixed />
        <View style={s.body}>
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
                <Text style={[s.cardVal, { marginTop: 2 }]}>{value}</Text>
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
            <Text style={s.policyItem}>• Local safety guidelines must be followed throughout the tour.</Text>
          </View>
        </View>

        <PageFooter />
      </Page>
    </Document>
  )
}
