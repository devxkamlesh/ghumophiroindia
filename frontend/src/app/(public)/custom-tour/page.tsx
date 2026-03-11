'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Heart, Camera, Utensils, Mountain, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { customTourService } from '@/services/api'

const DESTINATIONS = [
  'Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Bikaner',
  'Pushkar', 'Mount Abu', 'Ranthambore', 'Delhi', 'Agra',
]

const INTERESTS = [
  { id: 'heritage',     label: 'Heritage & Culture', icon: Mountain },
  { id: 'photography',  label: 'Photography',         icon: Camera   },
  { id: 'food',         label: 'Food & Cuisine',      icon: Utensils },
  { id: 'adventure',    label: 'Adventure',           icon: Mountain },
  { id: 'romance',      label: 'Romantic',            icon: Heart    },
]

const STEPS = ['Destinations', 'Trip Details', 'Interests', 'Contact']

export default function CustomTourPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', country: '',
    numberOfTravelers: 2, duration: 7, budget: 'moderate',
    destinations: [] as string[], interests: [] as string[],
    startDate: '', additionalInfo: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const toggle = (key: 'destinations' | 'interests', val: string) =>
    setForm(p => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val],
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      await customTourService.create({
        name:              form.name,
        email:             form.email,
        phone:             form.phone,
        country:           form.country,
        numberOfTravelers: form.numberOfTravelers,
        duration:          form.duration,
        budget:            form.budget,
        destinations:      form.destinations,
        interests:         form.interests.length > 0 ? form.interests : undefined,
        startDate:         form.startDate || undefined,
        additionalInfo:    form.additionalInfo || undefined,
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.')
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Our travel experts will review your preferences and contact you within 24 hours with a customized itinerary and quote.
          </p>
          <Link href="/" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-14">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-3">Build Your Dream Tour</h1>
          <p className="text-primary-100">Customize every detail for your perfect Rajasthan experience</p>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="max-w-3xl mx-auto">

          {/* Step indicator */}
          <div className="flex items-center justify-between mb-10">
            {STEPS.map((label, i) => {
              const s = i + 1
              return (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      step > s ? 'bg-green-500 text-white' : step === s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > s ? '✓' : s}
                    </div>
                    <span className="text-xs text-gray-500 mt-1 hidden sm:block">{label}</span>
                  </div>
                  {s < 4 && <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-green-400' : 'bg-gray-200'}`} />}
                </div>
              )
            })}
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">

            {/* Step 1 — Destinations */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold">Select Destinations</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DESTINATIONS.map(dest => (
                    <button key={dest} type="button" onClick={() => toggle('destinations', dest)}
                      className={`p-3.5 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-2 ${
                        form.destinations.includes(dest)
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-300 text-gray-700'
                      }`}>
                      <MapPin className="w-4 h-4 flex-shrink-0" />{dest}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setStep(2)} disabled={form.destinations.length === 0}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Next: Trip Details →
                </button>
              </div>
            )}

            {/* Step 2 — Trip Details */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold">Trip Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Travelers</label>
                    <input type="number" min="1" value={form.numberOfTravelers}
                      onChange={e => setForm(p => ({ ...p, numberOfTravelers: parseInt(e.target.value) || 1 }))}
                      className={cls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (days)</label>
                    <input type="number" min="1" value={form.duration}
                      onChange={e => setForm(p => ({ ...p, duration: parseInt(e.target.value) || 1 }))}
                      className={cls} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget Range</label>
                  <select value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} className={cls}>
                    <option value="budget">Budget (₹3,000–6,000/day)</option>
                    <option value="moderate">Moderate (₹6,000–12,000/day)</option>
                    <option value="luxury">Luxury (₹12,000+/day)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Start Date</label>
                  <input type="date" value={form.startDate}
                    onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className={cls} />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors">← Back</button>
                  <button type="button" onClick={() => setStep(3)} className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors">Next: Interests →</button>
                </div>
              </div>
            )}

            {/* Step 3 — Interests */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold">Your Interests</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {INTERESTS.map(({ id, label, icon: Icon }) => (
                    <button key={id} type="button" onClick={() => toggle('interests', id)}
                      className={`p-4 rounded-xl border-2 text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                        form.interests.includes(id)
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-300 text-gray-700'
                      }`}>
                      <Icon className="w-5 h-5" />{label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors">← Back</button>
                  <button type="button" onClick={() => setStep(4)} className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors">Next: Contact →</button>
                </div>
              </div>
            )}

            {/* Step 4 — Contact */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Contact Information</h2>
                {error && (
                  <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={cls} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                    <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={cls} placeholder="you@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone <span className="text-red-500">*</span></label>
                    <input type="tel" required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={cls} placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country <span className="text-red-500">*</span></label>
                    <input type="text" required value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} className={cls} placeholder="India" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Information</label>
                  <textarea rows={3} value={form.additionalInfo} onChange={e => setForm(p => ({ ...p, additionalInfo: e.target.value }))} className={cls} placeholder="Any special requirements or preferences…" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(3)} className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors">← Back</button>
                  <button type="submit" disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</> : 'Submit Request'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

const cls = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all'
