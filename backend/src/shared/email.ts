/**
 * Email Service — powered by Resend
 *
 * Sends:
 *   - Booking confirmation to customer
 *   - Booking notification to admin
 *   - Inquiry acknowledgement to customer
 *   - Custom tour request acknowledgement
 *   - Password reset link
 */

import { Resend } from 'resend'
import config from '../core/config'
import logger from '../core/logger'

const resend = config.email.resendApiKey
  ? new Resend(config.email.resendApiKey)
  : null

const FROM = config.email.from
const BRAND = 'Ghumo Phiro India'
const ADMIN_EMAIL = 'info@ghumophiroindia.com'

// ── Helpers ───────────────────────────────────────────────────────────────────

function wrap(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#e15515,#f0701f);padding:28px 32px">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700">${BRAND}</h1>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px">${title}</p>
    </div>
    <!-- Body -->
    <div style="padding:32px">${body}</div>
    <!-- Footer -->
    <div style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center">
      <p style="margin:0;color:#9ca3af;font-size:12px">
        © ${new Date().getFullYear()} ${BRAND} · Jaipur, Rajasthan, India<br>
        <a href="tel:+919876543210" style="color:#e15515;text-decoration:none">+91 98765 43210</a> ·
        <a href="mailto:${ADMIN_EMAIL}" style="color:#e15515;text-decoration:none">${ADMIN_EMAIL}</a>
      </p>
    </div>
  </div>
</body>
</html>`
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;color:#6b7280;font-size:14px;width:140px;vertical-align:top">${label}</td>
    <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:500">${value}</td>
  </tr>`
}

async function send(to: string, subject: string, html: string): Promise<boolean> {
  if (!resend) {
    logger.warn(`[email] Resend not configured — skipping email to ${to}: ${subject}`)
    return false
  }
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html })
    if (error) {
      logger.error(`[email] Failed to send to ${to}: ${JSON.stringify(error)}`)
      return false
    }
    logger.info(`[email] Sent "${subject}" to ${to}`)
    return true
  } catch (err: any) {
    logger.error(`[email] Exception sending to ${to}: ${err.message}`)
    return false
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export const emailService = {

  /**
   * Booking confirmation to customer + notification to admin
   */
  async sendBookingConfirmation(booking: {
    id: number
    customerName: string
    customerEmail: string
    tourTitle: string
    startDate: Date | string
    endDate: Date | string
    numberOfTravelers: number
    totalPrice: string
    status: string
  }) {
    const start = new Date(booking.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    const end   = new Date(booking.endDate).toLocaleDateString('en-IN',   { day: 'numeric', month: 'long', year: 'numeric' })
    const price = `₹${Number(booking.totalPrice).toLocaleString('en-IN')}`

    // ── Customer email ──
    const customerHtml = wrap('Booking Confirmation', `
      <p style="color:#111827;font-size:16px;font-weight:600;margin:0 0 8px">
        Hi ${booking.customerName}, your booking is confirmed! 🎉
      </p>
      <p style="color:#6b7280;font-size:14px;margin:0 0 24px">
        Thank you for booking with ${BRAND}. Here are your booking details:
      </p>
      <div style="background:#f9fafb;border-radius:8px;padding:20px;margin-bottom:24px">
        <table style="width:100%;border-collapse:collapse">
          ${row('Booking ID',  `#${booking.id}`)}
          ${row('Tour',        booking.tourTitle)}
          ${row('Start Date',  start)}
          ${row('End Date',    end)}
          ${row('Travelers',   `${booking.numberOfTravelers} ${booking.numberOfTravelers === 1 ? 'person' : 'people'}`)}
          ${row('Total Price', price)}
          ${row('Status',      booking.status.charAt(0).toUpperCase() + booking.status.slice(1))}
        </table>
      </div>
      <p style="color:#6b7280;font-size:14px;margin:0 0 24px">
        Our team will contact you within 24 hours to confirm your booking and share further details.
      </p>
      <a href="tel:+919876543210" style="display:inline-block;background:#e15515;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
        Call Us: +91 98765 43210
      </a>
    `)

    // ── Admin notification ──
    const adminHtml = wrap('New Booking Received', `
      <p style="color:#111827;font-size:15px;font-weight:600;margin:0 0 16px">New booking #${booking.id}</p>
      <div style="background:#f9fafb;border-radius:8px;padding:20px">
        <table style="width:100%;border-collapse:collapse">
          ${row('Customer',    booking.customerName)}
          ${row('Email',       booking.customerEmail)}
          ${row('Tour',        booking.tourTitle)}
          ${row('Start Date',  start)}
          ${row('Travelers',   String(booking.numberOfTravelers))}
          ${row('Total',       price)}
        </table>
      </div>
    `)

    await Promise.all([
      send(booking.customerEmail, `Booking Confirmed — ${booking.tourTitle}`, customerHtml),
      send(ADMIN_EMAIL, `New Booking #${booking.id} — ${booking.tourTitle}`, adminHtml),
    ])
  },

  /**
   * Inquiry acknowledgement to customer + notification to admin
   */
  async sendInquiryAcknowledgement(inquiry: {
    name: string
    email: string
    phone: string
    tourInterest?: string
    message: string
  }) {
    const customerHtml = wrap('We received your inquiry', `
      <p style="color:#111827;font-size:16px;font-weight:600;margin:0 0 8px">Hi ${inquiry.name}!</p>
      <p style="color:#6b7280;font-size:14px;margin:0 0 24px">
        Thank you for reaching out to ${BRAND}. We've received your inquiry and will get back to you within 24 hours.
      </p>
      <div style="background:#f9fafb;border-radius:8px;padding:20px;margin-bottom:24px">
        <table style="width:100%;border-collapse:collapse">
          ${inquiry.tourInterest ? row('Tour Interest', inquiry.tourInterest) : ''}
          ${row('Your Message', `<em style="color:#6b7280">${inquiry.message}</em>`)}
        </table>
      </div>
      <p style="color:#6b7280;font-size:14px">
        In the meantime, feel free to call us at <strong>+91 98765 43210</strong>.
      </p>
    `)

    const adminHtml = wrap('New Inquiry', `
      <p style="color:#111827;font-size:15px;font-weight:600;margin:0 0 16px">New inquiry from ${inquiry.name}</p>
      <div style="background:#f9fafb;border-radius:8px;padding:20px">
        <table style="width:100%;border-collapse:collapse">
          ${row('Name',    inquiry.name)}
          ${row('Email',   inquiry.email)}
          ${row('Phone',   inquiry.phone)}
          ${inquiry.tourInterest ? row('Tour Interest', inquiry.tourInterest) : ''}
          ${row('Message', inquiry.message)}
        </table>
      </div>
    `)

    await Promise.all([
      send(inquiry.email, `We received your inquiry — ${BRAND}`, customerHtml),
      send(ADMIN_EMAIL, `New Inquiry from ${inquiry.name}`, adminHtml),
    ])
  },

  /**
   * Custom tour request acknowledgement
   */
  async sendCustomTourAcknowledgement(req: {
    name: string
    email: string
    destinations: string[]
    duration: number
    numberOfTravelers: number
    budget: string
  }) {
    const html = wrap('Custom Tour Request Received', `
      <p style="color:#111827;font-size:16px;font-weight:600;margin:0 0 8px">Hi ${req.name}!</p>
      <p style="color:#6b7280;font-size:14px;margin:0 0 24px">
        We've received your custom tour request. Our travel experts will review your preferences and contact you within 24 hours with a personalised itinerary and quote.
      </p>
      <div style="background:#f9fafb;border-radius:8px;padding:20px;margin-bottom:24px">
        <table style="width:100%;border-collapse:collapse">
          ${row('Destinations', req.destinations.join(', '))}
          ${row('Duration',     `${req.duration} days`)}
          ${row('Travelers',    `${req.numberOfTravelers} ${req.numberOfTravelers === 1 ? 'person' : 'people'}`)}
          ${row('Budget',       req.budget)}
        </table>
      </div>
      <a href="tel:+919876543210" style="display:inline-block;background:#e15515;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
        Call Us: +91 98765 43210
      </a>
    `)

    await send(req.email, `Custom Tour Request Received — ${BRAND}`, html)
  },

  /**
   * Password reset email
   */
  async sendPasswordReset(to: string, name: string, resetToken: string, frontendUrl: string) {
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`
    const html = wrap('Reset Your Password', `
      <p style="color:#111827;font-size:16px;font-weight:600;margin:0 0 8px">Hi ${name},</p>
      <p style="color:#6b7280;font-size:14px;margin:0 0 24px">
        We received a request to reset your password. Click the button below to set a new password. This link expires in 1 hour.
      </p>
      <a href="${resetUrl}" style="display:inline-block;background:#e15515;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin-bottom:24px">
        Reset Password
      </a>
      <p style="color:#9ca3af;font-size:12px;margin:0">
        If you didn't request this, you can safely ignore this email.
      </p>
    `)

    await send(to, 'Reset your password', html)
  },
}

export default emailService
