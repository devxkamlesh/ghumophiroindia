'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Users, Search, Star, Award, Shield, Loader2 } from 'lucide-react'

export default function Hero() {
  const router = useRouter()
  const [isSearching, setIsSearching] = useState(false)
  const [searchParams, setSearchParams] = useState({
    destination: '',
    duration: '',
    travelers: '',
  })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Build query string
    const params = new URLSearchParams()
    if (searchParams.destination) params.append('destination', searchParams.destination)
    if (searchParams.duration) params.append('duration', searchParams.duration)
    if (searchParams.travelers) params.append('travelers', searchParams.travelers)

    // Navigate to tours page with search params
    router.push(`/tours?${params.toString()}`)
    setIsSearching(false)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60 z-10" />
      
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071')",
        }}
      />

      <div className="container-custom relative z-20 w-full px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white mb-8 md:mb-10"
        >
          <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            Explore <span className="text-primary-400">Incredible India</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-6">
            Jaipur • Udaipur • Jaisalmer • Jodhpur • Golden Triangle & Beyond
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-2">
            <div className="flex items-center space-x-2 text-sm md:text-base">
              <div className="w-10 h-10 bg-primary-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-primary-400" />
              </div>
              <div className="text-left">
                <div className="font-bold">4.9/5 Rating</div>
                <div className="text-xs text-gray-300">2500+ Reviews</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm md:text-base">
              <div className="w-10 h-10 bg-primary-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-primary-400" />
              </div>
              <div className="text-left">
                <div className="font-bold">14+ Years</div>
                <div className="text-xs text-gray-300">Experience</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm md:text-base">
              <div className="w-10 h-10 bg-primary-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-400" />
              </div>
              <div className="text-left">
                <div className="font-bold">Safe & Secure</div>
                <div className="text-xs text-gray-300">24/7 Support</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Search Box - RedBus Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 lg:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900 text-center md:text-left">
              Find Your Perfect Tour
            </h2>
            
            {/* Search Form */}
            <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-12 md:gap-3">
              {/* Destination */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Where to?
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600 z-10 pointer-events-none" />
                  <select 
                    value={searchParams.destination}
                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                    className="w-full pl-10 pr-10 py-4 md:py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 font-medium appearance-none cursor-pointer hover:border-primary-400 hover:shadow-md transition-all duration-200 text-sm touch-manipulation"
                    disabled={isSearching}
                  >
                    <option value="">Select destination</option>
                    <option value="jaipur">Jaipur - Pink City</option>
                    <option value="udaipur">Udaipur - City of Lakes</option>
                    <option value="jodhpur">Jodhpur - Blue City</option>
                    <option value="jaisalmer">Jaisalmer - Golden City</option>
                    <option value="bikaner">Bikaner - Desert Jewel</option>
                    <option value="golden-triangle">Golden Triangle</option>
                    <option value="all-rajasthan">All Rajasthan</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-primary-600 group-hover:text-primary-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Duration
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600 z-10 pointer-events-none" />
                  <select 
                    value={searchParams.duration}
                    onChange={(e) => setSearchParams({ ...searchParams, duration: e.target.value })}
                    className="w-full pl-10 pr-10 py-4 md:py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 font-medium appearance-none cursor-pointer hover:border-primary-400 hover:shadow-md transition-all duration-200 text-sm touch-manipulation"
                    disabled={isSearching}
                  >
                    <option value="">Select duration</option>
                    <option value="1-2">1-2 Days</option>
                    <option value="3-5">3-5 Days</option>
                    <option value="6-9">6-9 Days</option>
                    <option value="10-14">10-14 Days</option>
                    <option value="15+">15+ Days</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-primary-600 group-hover:text-primary-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Travelers */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Travelers
                </label>
                <div className="relative group">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600 z-10 pointer-events-none" />
                  <select 
                    value={searchParams.travelers}
                    onChange={(e) => setSearchParams({ ...searchParams, travelers: e.target.value })}
                    className="w-full pl-10 pr-10 py-4 md:py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 font-medium appearance-none cursor-pointer hover:border-primary-400 hover:shadow-md transition-all duration-200 text-sm touch-manipulation"
                    disabled={isSearching}
                  >
                    <option value="">Select travelers</option>
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3-4">3-4 People</option>
                    <option value="5-8">5-8 People</option>
                    <option value="9+">9+ People</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-primary-600 group-hover:text-primary-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="md:col-span-3 md:flex md:items-end">
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="w-full min-h-[52px] md:min-h-[46px] bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-4 md:py-3.5 rounded-xl font-bold text-base md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Search Tours</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
              <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/tours?destination=golden-triangle" className="text-xs md:text-sm px-3 md:px-4 py-2 md:py-2 bg-gray-100 hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-full transition-colors font-medium touch-manipulation min-h-[36px] flex items-center">
                  Golden Triangle
                </Link>
                <Link href="/tours?destination=jaipur" className="text-xs md:text-sm px-3 md:px-4 py-2 md:py-2 bg-gray-100 hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-full transition-colors font-medium touch-manipulation min-h-[36px] flex items-center">
                  Jaipur City Tour
                </Link>
                <Link href="/tours?destination=jaisalmer" className="text-xs md:text-sm px-3 md:px-4 py-2 md:py-2 bg-gray-100 hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-full transition-colors font-medium touch-manipulation min-h-[36px] flex items-center">
                  Desert Safari
                </Link>
                <Link href="/custom-tour" className="text-xs md:text-sm px-3 md:px-4 py-2 md:py-2 bg-gray-100 hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-full transition-colors font-medium touch-manipulation min-h-[36px] flex items-center">
                  Custom Tour
                </Link>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  )
}
