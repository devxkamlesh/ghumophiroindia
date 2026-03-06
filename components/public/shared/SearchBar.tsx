'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar, Users, Sparkles } from 'lucide-react'

export default function SearchBar() {
  const router = useRouter()
  const [destination, setDestination] = useState('')
  const [duration, setDuration] = useState('')
  const [travelers, setTravelers] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (destination) params.set('destination', destination)
    if (duration) params.set('duration', duration)
    if (travelers) params.set('travelers', travelers)
    
    const queryString = params.toString()
    router.push(`/tours${queryString ? `?${queryString}` : ''}`)
  }

  return (
    <section id="search" className="relative -mt-20 z-30 pb-16">
      <div className="container-custom">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-center text-gray-900">Find Your Perfect Tour</h2>
          </div>
          
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white hover:border-primary-300 transition-colors"
                  >
                    <option value="">All Destinations</option>
                    <option value="jaipur">Jaipur</option>
                    <option value="udaipur">Udaipur</option>
                    <option value="jodhpur">Jodhpur</option>
                    <option value="jaisalmer">Jaisalmer</option>
                    <option value="bikaner">Bikaner</option>
                    <option value="pushkar">Pushkar</option>
                    <option value="delhi">Delhi</option>
                    <option value="agra">Agra</option>
                    <option value="goa">Goa</option>
                    <option value="kerala">Kerala</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white hover:border-primary-300 transition-colors"
                  >
                    <option value="">Any Duration</option>
                    <option value="1-3">1-3 Days</option>
                    <option value="4-7">4-7 Days</option>
                    <option value="8-14">8-14 Days</option>
                    <option value="15+">15+ Days</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travelers
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white hover:border-primary-300 transition-colors"
                  >
                    <option value="">Any Group Size</option>
                    <option value="1">Solo Traveler</option>
                    <option value="2">Couple (2)</option>
                    <option value="3-5">Small Group (3-5)</option>
                    <option value="6-10">Medium Group (6-10)</option>
                    <option value="10+">Large Group (10+)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button 
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Search Tours</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick Filters */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Popular Searches:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Golden Triangle', dest: 'delhi' },
                { label: 'Rajasthan Heritage', dest: 'jaipur' },
                { label: 'Desert Safari', dest: 'jaisalmer' },
                { label: 'Beach Getaway', dest: 'goa' },
                { label: 'Kerala Backwaters', dest: 'kerala' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setDestination(item.dest)
                    router.push(`/tours?destination=${item.dest}`)
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-full text-sm font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
