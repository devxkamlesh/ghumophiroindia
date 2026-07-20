'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Briefcase, Users, Globe, TrendingUp, CheckCircle,
  Mail, MapPin, ArrowRight, Star, Building2, Handshake,
  Send, ChevronDown
} from 'lucide-react'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+919876543210'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=Hi%2C%20I%20am%20interested%20in%20a%20business%20partnership%20with%20Ghumo%20Phiro%20India`

const businessTypes = [
  'Travel Agent / Agency',
  'Corporate Company',
  'School / College / Institution',
  'Hotel / Resort',
  'Franchise Inquiry',
  'DMC / International Operator',
  'Other',
]

const services = [
  { icon: Building2, title: 'Corporate Travel', desc: 'Tailored packages for corporate teams, offsites & incentive trips.', color: 'bg-blue-50 text-blue-600' },
  { icon: Users, title: 'Group Tours', desc: 'Special rates for schools, colleges and large group bookings.', color: 'bg-green-50 text-green-600' },
  { icon: Handshake, title: 'Agent Partnership', desc: 'Earn attractive commissions on every booking you refer.', color: 'bg-orange-50 text-orange-600' },
  { icon: Globe, title: 'Franchise', desc: 'Open your own Ghumo Firo Holidays franchise outlet.', color: 'bg-purple-50 text-purple-600' },
  { icon: TrendingUp, title: 'DMC Services', desc: 'Destination management for international travel operators.', color: 'bg-red-50 text-red-600' },
  { icon: Star, title: 'White Label', desc: 'Custom-branded travel solutions for hospitality businesses.', color: 'bg-yellow-50 text-yellow-600' },
]

const benefits = [
  'Competitive commission structure',
  'Dedicated relationship manager',
  'Real-time booking dashboard',
  'Marketing & promotional support',
  'Priority customer service',
  'Flexible payment terms',
]

export default function BusinessPage() {
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    businessType: '', city: '', message: '', employees: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Send via WhatsApp for now
    const msg = `*Business Inquiry*\n\nName: ${form.name}\nCompany: ${form.company}\nEmail: ${form.email}\nPhone: ${form.phone}\nBusiness Type: ${form.businessType}\nCity: ${form.city}\nEmployees: ${form.employees}\n\nMessage: ${form.message}`
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Simple Page Header */}
      <div className="bg-white border-b border-gray-100 pt-24 pb-8">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Business</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-primary-600 text-sm font-semibold mb-2">
                <Briefcase className="w-4 h-4" />
                <span>Business & Partnerships</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Partner With Us</h1>
              <p className="text-gray-500 mt-1.5 text-sm md:text-base max-w-xl">
                Fill the form below and our business team will get back to you within 24 hours.
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shrink-0"
            >
              <WhatsAppIcon size={18} className="text-white" />
              Quick Chat
            </a>
          </div>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Business Inquiry Form ─────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Business Inquiry Form</h2>
              <p className="text-gray-400 text-sm mb-6">All fields marked with * are required</p>

              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Inquiry Sent!</h3>
                  <p className="text-gray-500 text-sm mb-6">Our business team will contact you within 24 hours.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary-600 font-semibold text-sm hover:underline"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row 1 */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                      <input
                        name="name" value={form.name} onChange={handleChange} required
                        placeholder="Your full name"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company / Organization *</label>
                      <input
                        name="company" value={form.company} onChange={handleChange} required
                        placeholder="Company name"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                      <input
                        name="email" type="email" value={form.email} onChange={handleChange} required
                        placeholder="you@company.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                      <input
                        name="phone" type="tel" value={form.phone} onChange={handleChange} required
                        placeholder="+91 98765 43210"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Type *</label>
                      <div className="relative">
                        <select
                          name="businessType" value={form.businessType} onChange={handleChange} required
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition appearance-none bg-white"
                        >
                          <option value="">Select business type</option>
                          {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                      <input
                        name="city" value={form.city} onChange={handleChange} required
                        placeholder="Your city"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Number of Employees / Group Size</label>
                    <input
                      name="employees" value={form.employees} onChange={handleChange}
                      placeholder="e.g. 50 employees or 100 students"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tell Us About Your Requirements *</label>
                    <textarea
                      name="message" value={form.message} onChange={handleChange} required rows={4}
                      placeholder="Describe your travel requirements, destinations of interest, budget range, preferred dates..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="submit" disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-md"
                    >
                      <Send className="w-4 h-4" />
                      {loading ? 'Sending...' : 'Submit Inquiry'}
                    </button>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-md"
                    >
                      <WhatsAppIcon size={18} className="text-white" />
                      WhatsApp Instead
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Contact Business Team</h3>
              <div className="space-y-3">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group">
                  <div className="w-9 h-9 bg-[#25D366] rounded-lg flex items-center justify-center flex-shrink-0">
                    <WhatsAppIcon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">WhatsApp</p>
                    <p className="text-sm font-semibold text-gray-800">{WHATSAPP_NUMBER}</p>
                  </div>
                </a>
                <a href="mailto:business@ghumofiroindia.com"
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-semibold text-gray-800">business@ghumofiroindia.com</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 bg-gray-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Office</p>
                    <p className="text-sm font-semibold text-gray-800">Jaipur, Rajasthan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Why Partner With Us</h3>
              <div className="space-y-2.5">
                {benefits.map(b => (
                  <div key={b} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Our Services</h3>
              <div className="space-y-3">
                {services.map(({ icon: Icon, title, color }) => (
                  <div key={title} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
