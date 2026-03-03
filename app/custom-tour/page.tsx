'use client'

import { useState } from 'react'
import { MapPin, Heart, Camera, Utensils, Mountain, Loader2 } from 'lucide-react'
import SuccessModal from '@/components/public/shared/SuccessModal'

const destinations = [
  'Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Bikaner', 'Pushkar', 
  'Mount Abu', 'Ranthambore', 'Delhi', 'Agra'
]

const interests = [
  { id: 'heritage', label: 'Heritage & Culture', icon: Mountain },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'food', label: 'Food & Cuisine', icon: Utensils },
  { id: 'adventure', label: 'Adventure', icon: Mountain },
  { id: 'romance', label: 'Romantic', icon: Heart },
]

export default function CustomTourPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    numberOfTravelers: 2,
    duration: 7,
    budget: 'moderate',
    destinations: [] as string[],
    interests: [] as string[],
    startDate: '',
    additionalInfo: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const toggleDestination = (dest: string) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.includes(dest)
        ? prev.destinations.filter(d => d !== dest)
        : [...prev.destinations, dest]
    }))
  }

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/custom-tour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowSuccess(true)
        setStep(5)
      } else {
        setErrorMessage('Failed to submit request. Please try again.')
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="font-display text-5xl font-bold mb-4">Build Your Dream Tour</h1>
          <p className="text-xl text-primary-100">Customize every detail to create your perfect Rajasthan experience</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between mb-12">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 4 && <div className={`w-24 h-1 ${step > s ? 'bg-primary-600' : 'bg-gray-300'}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6">Select Destinations</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {destinations.map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => toggleDestination(dest)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.destinations.includes(dest)
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-300 hover:border-primary-300'
                      }`}
                    >
                      <MapPin className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                      <span className="font-medium">{dest}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={formData.destinations.length === 0}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  Next: Trip Details
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6">Trip Details</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.numberOfTravelers}
                    onChange={(e) => setFormData({ ...formData, numberOfTravelers: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="budget">Budget ($50-100/day)</option>
                    <option value="moderate">Moderate ($100-200/day)</option>
                    <option value="luxury">Luxury ($200+/day)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex space-x-4">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                    Back
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1">
                    Next: Interests
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6">Your Interests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interests.map((interest) => {
                    const Icon = interest.icon
                    return (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => toggleInterest(interest.id)}
                        className={`p-6 rounded-lg border-2 transition-all ${
                          formData.interests.includes(interest.id)
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        <Icon className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                        <span className="font-medium">{interest.label}</span>
                      </button>
                    )
                  })}
                </div>
                <div className="flex space-x-4">
                  <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">
                    Back
                  </button>
                  <button type="button" onClick={() => setStep(4)} className="btn-primary flex-1">
                    Next: Contact Info
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    rows={4}
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    placeholder="Any special requirements or preferences..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex space-x-4">
                  <button type="button" onClick={() => setStep(3)} className="btn-secondary flex-1">
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
                  </button>
                </div>

                {errorMessage && (
                  <p className="text-center text-red-600">
                    {errorMessage}
                  </p>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4">Request Submitted!</h2>
                <p className="text-gray-600 mb-8">
                  Thank you for your interest. Our travel experts will review your request and contact you within 24 hours with a customized itinerary and quote.
                </p>
                <a href="/" className="btn-primary inline-block">
                  Return to Home
                </a>
              </div>
            )}
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false)
          window.location.href = '/'
        }}
        title="Custom Tour Request Submitted!"
        message="Thank you for your interest! Our travel experts will review your preferences and contact you within 24 hours with a customized itinerary and quote."
        type="custom"
      />
    </div>
  )
}
