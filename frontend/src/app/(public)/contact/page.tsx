'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { inquiryService } from '@/services/api'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', country: '', tourInterest: '', message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      await inquiryService.create({
        name:         formData.name,
        email:        formData.email,
        phone:        formData.phone,
        country:      formData.country || undefined,
        tourInterest: formData.tourInterest || undefined,
        message:      formData.message,
      })
      setSuccess(true)
      setFormData({ name: '', email: '', phone: '', country: '', tourInterest: '', message: '' })
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
          <p className="text-gray-500 mb-6">Our team will get back to you within 24 hours.</p>
          <button onClick={() => setSuccess(false)}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors">
            Send another message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-primary-100">We&apos;re here to help plan your perfect journey</p>
        </div>
      </div>

      <div className="container-custom py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-5">Get in Touch</h2>
            <p className="text-gray-600 mb-8 text-sm leading-relaxed">
              Have questions about our tours? Our travel experts are ready to assist you.
            </p>
            <div className="space-y-5">
              {[
                { icon: Phone,  title: 'Phone',          lines: ['+91 98765 43210', 'Mon–Sat, 9 AM – 7 PM IST'] },
                { icon: Mail,   title: 'Email',          lines: ['info@ghumophiroindia.com', 'We respond within 24 hours'] },
                { icon: MapPin, title: 'Office',         lines: ['123 MI Road, Jaipur', 'Rajasthan 302001, India'] },
                { icon: Clock,  title: 'Business Hours', lines: ['Mon–Sat: 9 AM – 7 PM', 'Sunday: 10 AM – 5 PM'] },
              ].map(({ icon: Icon, title, lines }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-0.5">{title}</p>
                    {lines.map(l => <p key={l} className="text-sm text-gray-500">{l}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
            <h2 className="text-xl font-bold mb-5">Send us a Message</h2>
            {error && (
              <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className={cls} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className={cls} placeholder="you@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className={cls} placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input type="text" value={formData.country} onChange={e => setFormData(p => ({ ...p, country: e.target.value }))} className={cls} placeholder="India" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Interest</label>
                <select value={formData.tourInterest} onChange={e => setFormData(p => ({ ...p, tourInterest: e.target.value }))} className={cls}>
                  <option value="">Select a tour</option>
                  <option value="Golden Triangle">Golden Triangle</option>
                  <option value="Rajasthan Heritage">Rajasthan Heritage</option>
                  <option value="Desert Safari">Desert Safari</option>
                  <option value="Custom Tour">Custom Tour</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                <textarea required rows={4} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} className={cls} placeholder="Tell us about your travel plans…" />
              </div>
              <button type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const cls = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all'
